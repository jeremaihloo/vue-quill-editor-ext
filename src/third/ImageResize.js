import defaultsDeep from 'lodash/defaultsDeep'
import DefaultOptions from './DefaultOptions'
import { DisplaySize } from './modules/DisplaySize'
import { Toolbar } from './modules/Toolbar'
import { Resize } from './modules/Resize'

const knownModules = { DisplaySize, Toolbar, Resize }

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

  data2blob (base64Data) {
    const byteString = atob(base64Data.split(',')[1]) // base64 解码
    const mimeString = base64Data
      .split(',')[0]
      .split(':')[1]
      .split(';')[0] // mime类型
    const arrayBuffer = new ArrayBuffer(byteString.length) // 创建缓冲数组
    const intArray = new Uint8Array(arrayBuffer) // 创建视图
    for (var i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i)
    }
    return new Blob([intArray], { type: mimeString }) // 转成blob
  }

  onCropBtnClick = () => {
    if (this.options.mode === 'crop') {
      this.doCrop()
    } else {
      this.options.mode = 'crop'
      this.cropBtn.innerText = '确认裁剪'
      this.btnResize.style.display = 'none'
    }
  }

  doCrop = () => {
    this.cropBtn.innerText = '裁剪中'
    const img = new Image()
    img.setAttribute('crossOrigin', 'Anonymous')
    img.crossOrigin = 'Anonymous'
    img.src = this.img.src
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const overlayRect = this.overlay.getBoundingClientRect()
      const imgRect = this.img.getBoundingClientRect()
      const scale = imgRect.width / this.img.naturalWidth
      canvas.width = overlayRect.width
      canvas.height = overlayRect.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        img,
        overlayRect.left - imgRect.left,
        overlayRect.top - imgRect.top,
        overlayRect.width / scale,
        overlayRect.height / scale,
        0,
        0,
        canvas.width,
        canvas.height
      )
      if (this.options.upload) {
        canvas.toBlob(blob => {
          this.options.upload(blob, url => {
            this.img.src = url
            this.hide()
          })
        })
      }
    }
  }

  onScroll = (e) => {
    this.scrollTop = e.target.scrollTop
    this.repositionElements()
  }

  repositionBtnCrop = (containerRect, imgRect, parent) => {
    const cropStyle = {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft + imgRect.width - 5 - 80}px`,
      top: `${imgRect.top - containerRect.top + parent.scrollTop + 10}px`
    }
    Object.assign(this.cropBtn.style, cropStyle)
  }

  repositionBtnResize = (containerRect, imgRect, parent) => {
    const resizeStyle = {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft + imgRect.width - 5 - 80}px`,
      top: `${imgRect.top - containerRect.top + parent.scrollTop + 10 + 40}px`
    }
    Object.assign(this.btnResize.style, resizeStyle)
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
    this.btnResize = document.createElement('div')
    this.btnResize.innerHTML = '调整大小'

    Object.assign(this.cropBtn.style, this.options.cropBtnStyles)
    Object.assign(this.btnResize.style, this.options.btnResizeStyles)

    this.quill.root.parentNode.appendChild(this.cropBtn)
    this.quill.root.parentNode.appendChild(this.btnResize)

    this.repositionElements()

    this.cropBtn.addEventListener('click', this.onCropBtnClick)
    this.btnResize.addEventListener('click', this.onBtnResizeClick)
  }

  onBtnResizeClick = (e) => {
    if (this.options.mode === 'resize') {
      // this.doCrop()
      this.hide()
    } else {
      this.options.mode = 'resize'
      this.btnResize.innerText = '确认大小'
      this.cropBtn.style.display = 'none'
    }
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
    this.quill.root.parentNode.removeChild(this.btnResize)
    this.btnResize = undefined
    this.options.mode = undefined

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

    if (this.options.mode === 'crop') {
      this.repositionCrop()
    } else if (this.options.mode === 'resize') {
      this.repositionResize()
    } else {
      this.repositionResize()
    }
  }

  repositionResize = () => {
// position the overlay over the image
    const parent = this.quill.root.parentNode
    console.log(parent)
    const imgRect = this.img.getBoundingClientRect()
    const containerRect = parent.getBoundingClientRect()
    Object.assign(this.overlay.style, {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`
    })
    this.repositionBtnCrop(containerRect, imgRect, parent)
    this.repositionBtnResize(containerRect, imgRect, parent)
  }

  repositionCrop = () => {
    // position the overlay over the image
    const parent = this.quill.root.parentNode
    const imgRealRect = this.img.getBoundingClientRect()
    const imgRect = this.position
    imgRect.top = this.position.top ? this.position.top : imgRealRect.top
    imgRect.left = this.position.left ? this.position.left : imgRealRect.left
    const containerRect = parent.getBoundingClientRect()
    const newPosition = {
      left: imgRect.left - containerRect.left - 1 + parent.scrollLeft,
      top: imgRect.top - containerRect.top + parent.scrollTop,
      width: imgRect.width,
      height: imgRect.height
    }
    console.log('top', this.position.top)
    console.log(newPosition)
    const overStyle = {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top + parent.scrollTop - (this.scrollTop || 0)}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`
    }
    Object.assign(this.overlay.style, overStyle)

    this.repositionBtnCrop(containerRect, imgRect, parent)
    this.repositionBtnResize(containerRect, imgRect, parent)
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
