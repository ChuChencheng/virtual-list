interface IVirtualListBaseParameters<Data> {
  data: Data[]
  scrolledDistance: number
  visibleSize: number
  bufferAmount: number
}

export interface IFixedSizeParameters<Data> extends IVirtualListBaseParameters<Data> {
  itemSize: number
}

export interface IDynamicSizeParameters<Data> extends IVirtualListBaseParameters<Data> {
  itemMinSize: number
  sizes: number[]
}

export interface IVirtualListReturnValue<Data> {
  startIndex: number
  endIndex: number
  halfBufferAmount: number
  visibleData: Data[]
  totalSize: number
  offset: number
}

function fixedSizeVirtualList<Data>({
  data,
  itemSize,
  scrolledDistance,
  visibleSize,
  bufferAmount = 20,
}: IFixedSizeParameters<Data>): IVirtualListReturnValue<Data> {
  const halfBufferAmount = bufferAmount < 1 ? 1 : Math.ceil(bufferAmount / 2)
  const totalAmount = data.length
  const totalSize = totalAmount * itemSize
  let startIndex = 0
  let endIndex = totalAmount
  let visibleData = data
  let offset = 0

  // Expand visible size with 1 buffer item at the top, 1 at the bottom.
  const visibleAmount = Math.ceil((visibleSize + 2 * itemSize) / itemSize) + bufferAmount
  if (visibleAmount < totalAmount) {
    // Fix scrolled distance
    scrolledDistance = Math.min(scrolledDistance, totalSize - visibleSize)
    const scrolledAmount = Math.floor(scrolledDistance / itemSize)
    startIndex = Math.floor(scrolledAmount / halfBufferAmount) * halfBufferAmount
    endIndex = startIndex + visibleAmount
    endIndex = Math.min(endIndex, totalAmount)

    visibleData = data.slice(startIndex, endIndex)
    offset = startIndex * itemSize
  }

  return {
    startIndex,
    endIndex,
    halfBufferAmount,
    visibleData,
    totalSize,
    offset,
  }
}


export default function virtualList<Data> (params: IFixedSizeParameters<Data>): IVirtualListReturnValue<Data>
export default function virtualList<Data> (params: IDynamicSizeParameters<Data>): IVirtualListReturnValue<Data>
export default function virtualList<Data> (params: any): IVirtualListReturnValue<Data> {
  const isFixedSize = typeof params.itemMinSize !== 'number'

  if (isFixedSize) {
    return fixedSizeVirtualList(params as IFixedSizeParameters<Data>)
  } else {
    const dynamicSizeParams: IDynamicSizeParameters<Data> = params
    const fixedSizeReturnValue = fixedSizeVirtualList({
      ...dynamicSizeParams,
      itemSize: dynamicSizeParams.itemMinSize,
    })

    const { data, itemMinSize, scrolledDistance, sizes } = dynamicSizeParams
    const { startIndex, halfBufferAmount } = fixedSizeReturnValue
    const dataLength = data.length

    let bufferSize = 0
    let i
    for (i = 0; i < halfBufferAmount; i++) {
      const index = i + startIndex
      if (index >= dataLength) break
      bufferSize += sizes[index] || itemMinSize
    }
    const restDistance = scrolledDistance - fixedSizeReturnValue.offset
    fixedSizeReturnValue.offset -= restDistance * (bufferSize / (i * itemMinSize) - 1)

    return fixedSizeReturnValue
  }
}
