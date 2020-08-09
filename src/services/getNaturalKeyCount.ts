import isNaturalKey from './isNaturalKey'

interface GetNaturalKeyCount {
  (startKey: number, endKey: number): number,
}

const getNaturalKeyCount: GetNaturalKeyCount = (startKey, endKey) => (
  Array(endKey - startKey + 1)
    .fill(startKey)
    .map((s, i) => s + i)
    .filter(k => isNaturalKey(k))
    .length
)

export default getNaturalKeyCount
