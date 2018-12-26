# vue-quill-editor-ext

> A vue quill editor forked from vue-quill-editor package for my person project requirements.
> 
修改`vue-quill-editor`，实现更多内置功能

## Features 

1. 编辑器内的图片裁剪功能，类似于微信公众号编辑器的裁剪方式
2. 以px为单位的字体大小设置
3. 字间距设置
4. 行高设置

## Usage

使用上完全与原`vue-quill-editor`一样

```console
yarn add vue-quill-editor
```

### 原`vue-quill-editor`替换为`vue-quill-editor-ext`:

```js
// 原来的使用方式
import VueQuillEditor from 'vue-quill-editor';
// 替换为下面即可，不用做其他任何改动
import VueQuillEditor from 'vue-quill-editor-ext';
```

### 上传配置

```js
const options = {
  modules: {
    imageResize: {
      modules: ['Resize'],
      upload: function (blob, cb) {
        const data = new FormData()
        data.append('smfile', blob)
        axios.post('https://sm.ms/api/upload', data, {
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
```

```html
<quill-editor :options="options"></quill-editor>
```