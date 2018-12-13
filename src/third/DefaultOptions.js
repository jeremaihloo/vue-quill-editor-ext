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
  displayStyles: {
    position: 'absolute',
    font: '12px/1.0 Arial, Helvetica, sans-serif',
    padding: '4px 8px',
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #777',
    boxSizing: 'border-box',
    opacity: '0.80',
    cursor: 'default'
  },
  toolbarStyles: {
    position: 'absolute',
    top: '-12px',
    right: '0',
    left: '0',
    height: '0',
    minWidth: '100px',
    font: '12px/1.0 Arial, Helvetica, sans-serif',
    textAlign: 'center',
    color: '#333',
    boxSizing: 'border-box',
    cursor: 'default'
  },
  toolbarButtonStyles: {
    display: 'inline-block',
    width: '24px',
    height: '24px',
    background: 'white',
    border: '1px solid #999',
    verticalAlign: 'middle'
  },
  toolbarCropButtonStyles: {
    display: 'inline-block',
    width: '40px',
    height: '24px',
    lineHeight: '24px',
    background: 'white',
    border: '1px solid #999',
    verticalAlign: 'middle'
  },
  toolbarButtonSvgStyles: {
    fill: '#444',
    stroke: '#444',
    strokeWidth: '2'
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
