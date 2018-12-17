export default {
  modules: [
    'DisplaySize',
    'Toolbar',
    'Resize'
  ],
  overlayStyles: {
    position: 'absolute',
    boxSizing: 'border-box',
    border: '1px solid red',
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  handleStyles: {
    position: 'absolute',
    height: '12px',
    width: '12px',
    backgroundColor: 'red',
    border: '1px solid red',
    boxSizing: 'border-box',
    opacity: '0.80'
  },
  cropBtnStyles: {
    backgroundColor: '#cccccc',
    width: '80px',
    height: '30px',
    position: 'absolute',
    lineHeight: '30px',
    cursor: 'pointer',
    textAlign: 'center',
    borderRadius: '5px'
  },
  btnResizeStyles: {
    backgroundColor: '#cccccc',
    width: '80px',
    height: '30px',
    position: 'absolute',
    lineHeight: '30px',
    cursor: 'pointer',
    textAlign: 'center',
    borderRadius: '5px'
  }
}
