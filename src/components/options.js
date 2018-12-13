export default {
  theme: 'snow',
  boundary: document.body,
  modules: {
    imageResize: {
      modules: ['Resize', 'DisplaySize']
    },
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [
        {
          size: [
            false,
            '10px',
            '12px',
            '14px',
            '16px',
            '18px',
            '20px',
            '22px',
            '24px',
            '26px',
            '28px',
            '30px',
            '32px',
            '34px',
            '36px'
          ]
        }
      ],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video'],
      [
        {
          lineheight: ['1.0', '1.2', '1.5', '1.6', '1.8', '2.0', '2.4', '2.8', '3.0', '4.0', '5.0']
        }
      ],
      [
        {
          letterspacing: [
            '0px',
            '1px',
            '2px',
            '3px',
            '4px',
            '5px',
            '6px',
            '7px',
            '8px',
            '9px',
            '10px'
          ]
        }
      ]
    ]
  },
  placeholder: 'Insert text here ...',
  readOnly: false
}
