<template>
  <div id="app">
    <div class="container">
      <div class="markdown-body">
        <read-me></read-me>
      </div>

      <h2>简单例子</h2>
      <editor style="height:200px" :options="simpleOptions"></editor>
      <h2>上传例子：</h2>
      <editor :options="options"></editor>
    </div>

  </div>
</template>

<script>
import Editor from './components/editor.vue'
import ReadMe from '../README.md'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import 'github-markdown-css'

import axios from 'axios'

const simpleOptions = {
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

const options = {
  modules: {
    imageResize: {
      modules: ['Resize'],
      upload: function (blob, cb) {
        const data = new FormData()
        data.append('smfile', blob)
        axios
          .post('https://sm.ms/api/upload', data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            cb(res.data.data.url)
          })
          .catch(res => {
            console.log(res)
          })
      }
    }
  }
}
export default {
  name: 'app',
  components: {
    Editor,
    ReadMe
  },
  data () {
    return {
      simpleOptions: simpleOptions,
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
.container {
  width: 960px;
  margin-left: auto;
  margin-right: auto;
}
.markdown-body{
  text-align: left;
}
</style>
