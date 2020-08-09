import getKeyOctave from './getKeyOctave'
import keyNames from './keyNames.json'

interface GetKeyName {
  (key: number): string,
}

const getKeyName: GetKeyName = (key) => {
  const octave = getKeyOctave(key)
  const pitch = (Math.floor(key) % 12) as keyof typeof keyNames
  const keyName: string = keyNames[pitch] as unknown as string
  return `${keyName}${octave}`
}

export default getKeyName
