export default {
  modules: [
    'DisplaySize',
    'Toolbar',
    'Resize'
  ],
  overlayStyles: {
    position: 'absolute',
    boxSizing: 'border-box',
    border: '1px dashed #444',
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  handleStyles: {
    position: 'absolute',
    height: '12px',
    width: '12px',
    backgroundColor: 'white',
    border: '1px solid #777',
    boxSizing: 'border-box',
    opacity: '0.80'
  },
  cropBtnStyles: {
    backgroundColor: '#cccccc',
    border: '1px solid #999',
    width: '80px',
    height: '30px',
    position: 'absolute',
    lineHeight: '30px',
    cursor: 'pointer'
  }
}
