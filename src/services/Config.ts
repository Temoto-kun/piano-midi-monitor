export default interface Config extends Record<string, string | number>{
  startKey: number,
  endKey: number,
  scaleFactor: number,
}
