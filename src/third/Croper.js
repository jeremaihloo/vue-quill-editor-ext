export class Croper {
  constructor (ir) {
    this.boxes = []
    this.ir = ir
    this.position = {}
  }

  showClip = () => {
    this.addShadow()

    // add 4 resize handles
    this.addBox('nwse-resize') // top left
    this.addBox('nesw-resize') // top right
    this.addBox('nwse-resize') // bottom right
    this.addBox('nesw-resize') // bottom left

    window.onresize = () => {
      if (this.shadow) {
        this.onDestroy()
      }
    }

    this.rePosition()
  }

  rePosition = () => {
    if (!this.shadow) {
      return
    }
    this.positionBoxes()
    this.positionCropArea()
  }

  onDestroy = () => {
    // reset drag handle cursors
    this.setCursor('')
    this.removeShadow()

    this.boxes.forEach(element => {
      element = undefined
    })
    this.boxes = []

    this.ir.onClipDone()
  }

  addCropButton = () => {
    const imgRect = this.copied.getBoundingClientRect()
    this.btnCrop = document.createElement('div')
    this.btnCrop.innerHTML = '确认裁剪'
    Object.assign(this.btnCrop.style, this.ir.options.cropBtnStyles, {
      left: `${imgRect.left + imgRect.width + 5}px`,
      top: `${imgRect.top + 5}px`,
      zIndex: '9002',
      position: 'fixed'
    })
    this.btnCrop.addEventListener('click', this.onCropClick)
    this.shadow.appendChild(this.btnCrop)
  }

  removeCropButton=() => {
    this.btnCrop.removeEventListener('click', this.onCropClick)
    this.shadow.removeChild(this.btnCrop)
    this.btnCrop = undefined
  }

  onCropClick = e => {
    this.doCrop()
  }

  doCrop = () => {
    this.btnCrop.innerText = '裁剪中'
    const img = new Image()
    img.setAttribute('crossOrigin', 'Anonymous')
    img.crossOrigin = 'Anonymous'
    img.src = this.copied.src
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const overlayRect = this.cropArea.getBoundingClientRect()
      const imgRect = this.copied.getBoundingClientRect()
      const scale = imgRect.width / this.copied.naturalWidth
      canvas.width = overlayRect.width / scale
      canvas.height = overlayRect.height / scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        img,
        (overlayRect.left - imgRect.left) / scale,
        (overlayRect.top - imgRect.top) / scale,
        overlayRect.width / scale,
        overlayRect.height / scale,
        0,
        0,
        canvas.width,
        canvas.height
      )
      if (this.ir.options.upload) {
        canvas.toBlob(blob => {
          this.ir.options.upload(blob, url => {
            this.ir.img.src = url
            this.onDestroy()
          })
        })
      }
    }
  }

  addShadow = () => {
    this.shadow = document.createElement('div')
    Object.assign(this.shadow.style, {
      width: '100vw',
      height: '100vh',
      background: 'rgba(255,255,255,1)',
      position: 'fixed',
      zIndex: '9000',
      left: '0',
      top: '0',
      textAlign: 'center'
    })
    this.copied = this.ir.img.cloneNode()
    Object.assign(this.copied.style, {
      width: 'auto',
      maxHeight: '80%',
      maxWidth: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '5%'
    })
    this.shadow.appendChild(this.copied)
    document.body.appendChild(this.shadow)

    const imgRect = this.copied.getBoundingClientRect()
    this.position = {
      left: imgRect.left,
      top: imgRect.top,
      width: imgRect.width,
      height: imgRect.height
    }
    this.cropArea = document.createElement('div')
    document.body.appendChild(this.cropArea)

    this.addCropButton()
  }

  removeShadow = () => {
    this.removeCropButton()
    this.shadow.removeChild(this.copied)
    this.copied = undefined

    document.body.removeChild(this.cropArea)
    this.cropArea = undefined

    document.body.removeChild(this.shadow)
    this.shadow = undefined
  }

  positionCropArea = () => {
    Object.assign(this.cropArea.style, {
      width: `${this.position.width}px`,
      height: `${this.position.height}px`,
      background: 'rgba(0,0,0,0.5)',
      position: 'fixed',
      zIndex: '9001',
      left: `${this.position.left}px`,
      top: `${this.position.top}px`,
      textAlign: 'center'
    })
  }

  positionBoxes = () => {
    const handleXOffset = -parseFloat(this.ir.options.handleStyles.width) / 2
    const handleYOffset = -parseFloat(this.ir.options.handleStyles.height) / 2
    const imgRect = this.position
    // set the top and left for each drag handle
    ;[
      { left: `${imgRect.left + handleXOffset}px`, top: `${imgRect.top + handleYOffset}px` }, // top left
      {
        left: `${imgRect.left + imgRect.width + handleXOffset}px`,
        top: `${imgRect.top + handleYOffset}px`
      }, // top right
      {
        left: `${imgRect.left + imgRect.width + handleXOffset}px`,
        top: `${imgRect.top + imgRect.height + handleYOffset}px`
      }, // bottom right
      {
        left: `${imgRect.left + handleXOffset}px`,
        top: `${imgRect.top + imgRect.height + handleYOffset}px`
      } // bottom left
    ].forEach((pos, idx) => {
      Object.assign(this.boxes[idx].style, pos)
    })
  }

  addBox = cursor => {
    // create div element for resize handle
    const box = document.createElement('div')

    // Star with the specified styles
    Object.assign(box.style, this.ir.options.handleStyles)
    box.style.cursor = cursor

    // Set the width/height to use 'px'
    box.style.width = `${this.ir.options.handleStyles.width}px`
    box.style.height = `${this.ir.options.handleStyles.height}px`

    // listen for mousedown on each box
    box.addEventListener('mousedown', this.handleMousedown, false)
    // add drag handle to document
    this.shadow.appendChild(box)
    // keep track of drag handle
    this.boxes.push(box)
  }

  handleMousedown = evt => {
    // note which box
    this.dragBox = evt.target
    // note starting mousedown position
    this.dragStartX = evt.clientX
    this.dragStartY = evt.clientY
    // store the width before the drag
    this.preDrag = Object.assign({}, this.position)
    // set the proper cursor everywhere
    this.setCursor(this.dragBox.style.cursor)
    // listen for movement and mouseup
    document.addEventListener('mousemove', this.handleDrag, false)
    document.addEventListener('mouseup', this.handleMouseup, false)
  }

  handleMouseup = () => {
    // reset cursor everywhere
    this.setCursor('')
    // stop listening for movement and mouseup
    document.removeEventListener('mousemove', this.handleDrag)
    document.removeEventListener('mouseup', this.handleMouseup)
  }

  handleDrag = evt => {
    if (!this.copied) {
      // image not set yet
      return
    }
    this.handleModeCrop(evt)
    this.rePosition()
  }

  handleModeCrop = evt => {
    // update image size
    const deltaX = evt.clientX - this.dragStartX
    const deltaY = evt.clientY - this.dragStartY
    let width = this.position.width
    let height = this.position.height
    let top = this.position.top
    let left = this.position.left
    const rect = this.copied.getBoundingClientRect()
    if (this.dragBox === this.boxes[0]) {
      width = Math.round(this.preDrag.width - deltaX)
      height = Math.round(this.preDrag.height - deltaY)
      left = Math.round(this.preDrag.left + deltaX)
      top = Math.round(this.preDrag.top + deltaY)
      if (left < rect.left) {
        left = rect.left
      }
      if (top < rect.top) {
        top = rect.top
      }
      if (top > rect.top + rect.height - 20) {
        top = rect.top + rect.height - 20
      }
      if (left > rect.left + rect.width - 20) {
        left = rect.left + rect.width - 20
      }
    }

    if (this.dragBox === this.boxes[1]) {
      width = Math.round(this.preDrag.width + deltaX)
      height = Math.round(this.preDrag.height - deltaY)
      top = Math.round(this.preDrag.top + deltaY)
      if (top < rect.top) {
        top = rect.top
      }
      if (left + width > rect.width + rect.left) {
        width = rect.width + rect.left - left
      }
      if (top > rect.top + rect.height - 20) {
        top = rect.top + rect.height - 20
      }
    }

    if (this.dragBox === this.boxes[2]) {
      width = Math.round(this.preDrag.width + deltaX)
      height = Math.round(this.preDrag.height + deltaY)
      if (left + width > rect.width + rect.left) {
        width = rect.width + rect.left - left
      }
      // if (top + height > rect.top + rect.height) {
      //   height = rect.height + rect.top - top
      // }
    }

    if (this.dragBox === this.boxes[3]) {
      width = Math.round(this.preDrag.width - deltaX)
      height = Math.round(this.preDrag.height + deltaY)
      left = Math.round(this.preDrag.left + deltaX)
      if (left < rect.left) {
        left = rect.left
      }
      // if (top + height > rect.top + rect.height) {
      //   height = rect.height + rect.top - top
      // }
      if (left > rect.left + rect.width - 20) {
        left = rect.left + rect.width - 20
      }
    }

    if (width < 20) {
      width = 20
    }
    if (height < 20) {
      height = 20
    }
    if (width > rect.width) {
      width = rect.width
    }
    if (height > rect.height) {
      height = rect.height
    }
    if (left < rect.left) {
      left = rect.left
    }
    if (top < rect.top) {
      top = rect.top
    }
    this.position.width = width
    this.position.height = height
    this.position.top = top
    this.position.left = left
  }

  setCursor = value => {
    ;[document.body, this.copied].forEach(el => {
      el.style.cursor = value // eslint-disable-line no-param-reassign
    })
  }
}
