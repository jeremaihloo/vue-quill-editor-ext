<template>
  <div class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script>
// require sources
import defaultsdeep from 'lodash.defaultsdeep'
import _Quill from 'quill'
import defaultOptions from './options'
const Quill = window.Quill || _Quill
import ImageResize from '../third/ImageResize'

Quill.register('modules/imageResize', ImageResize, true)

import extension from './extensions'
extension.register()

// export
export default {
  name: 'quill-editor',
  data () {
    return {
      _options: {},
      _content: '',
      defaultOptions
    }
  },
  props: {
    content: String,
    value: String,
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      required: false,
      default: () => ({})
    },
    globalOptions: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  mounted () {
    this.initialize()
  },
  beforeDestroy () {
    this.quill = null
    delete this.quill
  },
  methods: {
    toJSON (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    // Init Quill instance
    initialize () {
      if (this.$el) {
        // Options
        this._options = defaultsdeep({}, this.defaultOptions, this.globalOptions, this.options)
        // Instance
        this.quill = new Quill(this.$refs.editor, this._options)

        this.quill.enable(false)

        // Set editor content
        if (this.value || this.content) {
          this.quill.pasteHTML(this.value || this.content)
        }

        // Disabled editor
        if (!this.disabled) {
          this.quill.enable(true)
        }

        // Mark model as touched if editor lost focus
        this.quill.on('selection-change', range => {
          if (!range) {
            this.$emit('blur', this.quill)
          } else {
            this.$emit('focus', this.quill)
          }
        })

        // Update model if text changes
        this.quill.on('text-change', (delta, oldDelta, source) => {
          if (delta.ops[delta.ops.length - 1].insert && delta.ops[delta.ops.length - 1].insert.image) {
            this.quill.format('align', 'center')
          }
          if (this.$refs.editor.children) {
            let html = this.$refs.editor.children[0].innerHTML
            const quill = this.quill
            const text = this.quill.getText()
            if (html === '<p><br></p>') html = ''
            this._content = html
            this.$emit('input', this._content)
            this.$emit('change', { html, text, quill })
          }
        })

        // Emit ready event
        this.$emit('ready', this.quill)
      }
    }
  },
  watch: {
    // Watch content change
    content (newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    // Watch content change
    value (newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    // Watch disabled change
    disabled (newVal, oldVal) {
      if (this.quill) {
        this.quill.enable(!newVal)
      }
    }
  }
}
</script>

<style>
.ql-snow .ql-editor img {
  vertical-align: top !important;
}
</style>
