import * as React from 'react'
import Keyboard from './components/Keyboard/Keyboard'
import PedalBoard from './components/PedalBoard/PedalBoard'

const search = new URLSearchParams(window.location.search)

const App = () => {
  const [startKey, setStartKey, ] = React.useState<number>(Number(search.get('startKey')))
  const [endKey, setEndKey, ] = React.useState<number>(Number(search.get('endKey')))

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data.event !== 'spanchange') {
        return
      }

      const [startKey, endKey, ] = e.data.message.split(':')
      setStartKey(Number(startKey))
      setEndKey(Number(endKey))
    }

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])

  return (
    <React.Fragment>
      <Keyboard
        startKey={startKey}
        endKey={endKey}
      />
      <PedalBoard />
    </React.Fragment>
  )
}

export default App;
