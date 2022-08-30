export default function chunkArray<T extends Array<any> | ReadonlyArray<any>>(arr: T, chunkSize: number): T {
  return Array(Math.ceil(arr.length / chunkSize))
    .map((_, index) => index * chunkSize)
    .map(begin => arr.slice(begin, begin + chunkSize)) as any;
}
