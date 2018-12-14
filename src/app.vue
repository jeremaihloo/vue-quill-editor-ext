<template>
  <div id="app">
    <editor :options="options"></editor>
  </div>
</template>

<script>
import Editor from './components/editor.vue'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import axios from 'axios'

const options = {
  modules: {
    imageResize: {
      modules: ['Resize'],
      upload: function (blob, cb) {
        const url = window.URL.createObjectURL(blob)
        cb(url)
      }
    }
  }
}
export default {
  name: 'app',
  components: {
    Editor
  },
  data () {
    return {
      options: options
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
