interface GetKeyOctave {
  (key: number): number,
}

const getOctave: GetKeyOctave = (key) => Math.floor(key / 12) - 1

export default getOctave
