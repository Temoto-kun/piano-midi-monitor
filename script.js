((window, electron) => {
  const X_OFFSET = 0
  const NATURAL_KEY_WIDTH = 16;
  const ACCIDENTAL_KEY_WIDTH = 11;
  const accidental_key_x_offsets = [
    10.0 / 112.0,
    28.0 / 112.0,
    57.0 / 112.0,
    75.0 / 112.0,
    93.0 / 112.0,
  ]

  const { ipcRenderer, } = electron


  const renderKeys = () => {
    let midi_note = 12
    const elements = {}
    let element
    const keyboard = window.document.getElementById('keyboard')
    for (let octave = 0; octave < 9; octave += 1) {
      for (let natural_key = 0; natural_key < 7; natural_key += 1) {
        element = window.document.createElement('div')
        element.classList.add('natural')
        element.classList.add('key')
        element.style.position = 'absolute'
        element.style.top = 0
        element.style.left = X_OFFSET + (octave * NATURAL_KEY_WIDTH * 7) + (natural_key * NATURAL_KEY_WIDTH) +
          'px'
        element.style.width = NATURAL_KEY_WIDTH + 'px'
        element.appendChild(window.document.createElement('div'))
        elements[midi_note] = element
        keyboard.appendChild(element)

        switch (natural_key) {
          case 0:
          case 1:
          case 3:
          case 4:
          case 5:
            midi_note += 2;
            break;
          case 2:
          case 6:
            midi_note += 1;
            break;
          default:
            break;
        }
      }

      midi_note -= 11;

      for (let accidental_key = 0; accidental_key < 5; accidental_key += 1) {
        element = window.document.createElement('div')
        element.classList.add('accidental')
        element.classList.add('key')
        element.style.position = 'absolute'
        element.style.top = 0
        element.style.left = X_OFFSET + (octave * NATURAL_KEY_WIDTH * 7) + (NATURAL_KEY_WIDTH * 7 *
          accidental_key_x_offsets[accidental_key]) + 'px'
        element.style.width = ACCIDENTAL_KEY_WIDTH + 'px'
        element.appendChild(window.document.createElement('div'))
        elements[midi_note] = element
        keyboard.appendChild(element)

        switch (accidental_key) {
          case 0:
          case 2:
          case 3:
            midi_note += 2;
            break;
          case 1:
          case 4:
            midi_note += 3;
            break;
          default:
            break;
        }
      }

      midi_note -= 1;
    }

    return elements
  }

  const elements = renderKeys(null, null)

  ipcRenderer.on('note', (event, message) => {
    const [key, value, ] = message.split(':')
    if (value > 0) {
      elements[key].classList.add('pressed')
    } else {
      elements[key].classList.remove('pressed')
    }
  })

  ipcRenderer.on('pedal', (event, message) => {
    const [which, value, ] = message.split(':')
    const pedalIds = {
      64: 'sustain',
      66: 'sostenuto',
      67: 'unacorda',
    }

    window.document.getElementById(pedalIds[which]).style.opacity = value / 127 * 0.75 + 0.25
  })
})(window, require('electron'))
