import * as React from 'react'
import KeyboardBase, { StyledAccidentalKey, StyledNaturalKey, } from '@theoryofnekomata/react-musical-keyboard'

const NaturalKey = React.memo(StyledNaturalKey)
const AccidentalKey = React.memo(StyledAccidentalKey)

const Keyboard = ({
  startKey = 21,
  endKey = 108,
}) => {
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

  return (
    <KeyboardBase
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
