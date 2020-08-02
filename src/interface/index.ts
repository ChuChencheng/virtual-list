export interface IVirtualListBaseParameters<Data> {
  data: Data[]
  scrolledDistance: number
  visibleSize: number
  bufferAmount: number
}

export interface IVirtualListBaseReturnValue<Data> {
  visibleData: Data[]
  totalSize: number
  offset: number
}

export interface IVirtualListBaseClass<Data> {
  getVisibleData: () => Data[]
  getTotalSize: () => number
  getOffset: () => number
}
