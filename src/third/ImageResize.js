import defaultsDeep from 'lodash/defaultsDeep'
import DefaultOptions from './DefaultOptions'
import { DisplaySize } from './modules/DisplaySize'
import { Toolbar } from './modules/Toolbar'
import { Resize } from './modules/Resize'
import { Croper } from './Croper'

const knownModules = { DisplaySize, Toolbar, Resize, Croper }
/**
 * Custom module for quilljs to allow user to resize <img> elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
export default class ImageResize {
  constructor (quill, options = {}) {
    // save the quill reference and options
    this.quill = quill

    // Apply the options to our defaults, and stash them for later
    // defaultsDeep doesn't do arrays as you'd expect, so we'll need to apply the classes array from options separately
    let moduleClasses = false
    if (options.modules) {
      moduleClasses = options.modules.slice()
    }

    // Apply options to default options
    this.options = defaultsDeep({}, options, DefaultOptions)

    // (see above about moduleClasses)
    if (moduleClasses !== false) {
      this.options.modules = moduleClasses
    }

    // disable native image resizing on firefox
    document.execCommand('enableObjectResizing', false, 'false')

    // respond to clicks inside the editor
    this.quill.root.addEventListener('click', this.handleClick, false)

    this.quill.root.parentNode.style.position =
      this.quill.root.parentNode.style.position || 'relative'

    // setup modules
    this.moduleClasses = this.options.modules

    this.modules = []

    this.croper = new Croper(this)
  }

  initializeModules = () => {
    this.removeModules()

    this.modules = this.moduleClasses.map(
      ModuleClass => new (knownModules[ModuleClass] || ModuleClass)(this)
    )

    this.modules.forEach(module => {
      module.onCreate()
    })

    this.onUpdate()
  }

  onUpdate = () => {
    this.repositionElements()
    this.modules.forEach(module => {
      module.onUpdate()
    })
  }

  removeModules = () => {
    this.modules.forEach(module => {
      module.onDestroy()
    })

    this.modules = []
  }

  onClipDone = () => {
    this.hide()
  }

  handleClick = evt => {
    if (evt.target && evt.target.tagName && evt.target.tagName.toUpperCase() === 'IMG') {
      if (this.img === evt.target) {
        // we are already focused on this image
        return
      }
      if (this.img) {
        // we were just focused on another image
        this.hide()
      }
      // clicked on an image inside the editor
      this.show(evt.target)
    } else if (this.img) {
      // clicked on a non image
      this.hide()
    }
  }

  show = img => {
    // keep track of this img element
    this.img = img

    this.showOverlay()

    this.initializeModules()
  }

  onCropBtnClick = () => {
    if (this.options.mode === 'crop') {
      this.doCrop()
    } else {
      this.croper.showClip()
    }
  }

  repositionBtnCrop = (containerRect, imgRect, parent) => {
    const cropStyle = {
      left: `${imgRect.left -
        containerRect.left -
        1 +
        parent.scrollLeft +
        imgRect.width -
        5 -
        80}px`,
      top: `${imgRect.top - containerRect.top - parent.scrollTop + 10}px`
    }
    Object.assign(this.cropBtn.style, cropStyle)
  }

  showOverlay = () => {
    if (this.overlay) {
      this.hideOverlay()
    }

    const rect = this.img.getBoundingClientRect()
    this.position = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    }

    this.quill.setSelection(null)

    // prevent spurious text selection
    this.setUserSelect('none')

    // listen for the image being deleted or moved
    document.addEventListener('keyup', this.checkImage, true)
    this.quill.root.addEventListener('input', this.checkImage, true)
    this.quill.root.addEventListener('scroll', this.onScroll, false)

    // Create and add the overlay
    this.overlay = document.createElement('div')
    Object.assign(this.overlay.style, this.options.overlayStyles)
    this.quill.root.parentNode.appendChild(this.overlay)

    this.cropBtn = document.createElement('div')
    this.cropBtn.innerText = '裁剪图片'

    Object.assign(this.cropBtn.style, this.options.cropBtnStyles)

    this.quill.root.parentNode.appendChild(this.cropBtn)

    this.repositionElements()

    this.cropBtn.addEventListener('click', this.onCropBtnClick)
  }

  hideOverlay = () => {
    if (!this.overlay) {
      return
    }

    // Remove the overlay
    this.quill.root.parentNode.removeChild(this.overlay)
    this.overlay = undefined
    this.quill.root.parentNode.removeChild(this.cropBtn)
    this.cropBtn = undefined
    this.options.mode = 'resize'

    // stop listening for image deletion or movement
    document.removeEventListener('keyup', this.checkImage)
    this.quill.root.removeEventListener('input', this.checkImage)
    this.quill.root.removeEventListener('scroll', this.onScroll)

    // reset user-select
    this.setUserSelect('')
  }

  repositionElements = () => {
    if (!this.overlay || !this.img) {
      return
    }

    this.repositionResize()
  }

  repositionResize = () => {
    // position the overlay over the image
    const parent = this.quill.root.parentNode
    const imgRect = this.img.getBoundingClientRect()
    const containerRect = parent.getBoundingClientRect()
    Object.assign(this.overlay.style, {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top - parent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`
    })
    this.repositionBtnCrop(containerRect, imgRect, parent)
  }

  repositionCrop = () => {
    // position the overlay over the image
    const parent = this.quill.root
    // const imgRealRect = this.img.getBoundingClientRect()
    const imgRect = this.position
    // imgRect.top = this.position.top ? this.position.top : imgRealRect.top
    // imgRect.left = this.position.left ? this.position.left : imgRealRect.left
    const containerRect = parent.getBoundingClientRect()
    const overStyle = {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top - parent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`
    }
    Object.assign(this.overlay.style, overStyle)

    this.repositionBtnCrop(containerRect, imgRect, parent)
  }

  hide = () => {
    this.hideOverlay()
    this.removeModules()
    this.img = undefined
  }

  setUserSelect = value => {
    ;['userSelect', 'mozUserSelect', 'webkitUserSelect', 'msUserSelect'].forEach(prop => {
      // set on contenteditable element and <html>
      this.quill.root.style[prop] = value
      document.documentElement.style[prop] = value
    })
  }

  checkImage = evt => {
    if (this.img) {
      if (evt.keyCode === 46 || evt.keyCode === 8) {
        window.Quill.find(this.img).deleteAt(0)
      }
      this.hide()
    }
  }
}

if (window.Quill) {
  window.Quill.register('modules/imageResize', ImageResize)
}
