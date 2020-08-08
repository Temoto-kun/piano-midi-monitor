import * as React from 'react'
import KeyboardBase, { StyledAccidentalKey, StyledNaturalKey, } from '@theoryofnekomata/react-musical-keyboard'

const NaturalKey = React.memo(StyledNaturalKey)
const AccidentalKey = React.memo(StyledAccidentalKey)

const Keyboard = () => {
  const [startKey, setStartKey, ] = React.useState(21)
  const [endKey, setEndKey, ] = React.useState(108)
  const [width, setWidth, ] = React.useState(52)
  const [keyChannels, setKeyChannels, ] = React.useState<any[]>([])

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data.event !== 'note') {
        return
      }

      const [key, velocity, ] = e.data.message.split(':')
      setKeyChannels(theKeyChannels => {
        if (velocity > 0) {
          return [
            ...theKeyChannels,
            {
              channel: 0,
              key: Number(key),
              velocity: Number(velocity),
            },
          ]
        }

        return theKeyChannels.filter(k => k.key !== Number(key))
      })
    }

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data.event !== 'spanchange') {
        return
      }

      const [startKey, endKey, naturalKeys, ] = e.data.message.split(':')
      setStartKey(Number(startKey))
      setEndKey(Number(endKey))
      setWidth(Number(naturalKeys))
    }

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])

  return (
    <KeyboardBase
      width={width * 20}
      height="100%"
      startKey={startKey}
      endKey={endKey}
      keyChannels={keyChannels}
      keyComponents={{
        natural: NaturalKey,
        accidental: AccidentalKey,
      }}
    />
  )
}

export default Keyboard
