interface IVirtualListBaseParameters<Data> {
  data: Data[]
  scrolledDistance: number
  visibleSize: number
  bufferAmount?: number
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
  correctedScrolledDistance: number
}

function fixedSizeVirtualList <Data>({
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
  let correctedScrolledDistance = scrolledDistance

  if (itemSize > 0) {
    // Expand visible size with 1 buffer item at the top, 1 at the bottom.
    const visibleAmount = Math.ceil((visibleSize + 2 * itemSize) / itemSize) + Math.max(bufferAmount, 1)
    if (visibleAmount < totalAmount) {
      // Correct scrolled distance
      correctedScrolledDistance = Math.min(Math.max(scrolledDistance, 0), totalSize - visibleSize)
  
      const scrolledAmount = Math.floor(correctedScrolledDistance / itemSize)
      startIndex = Math.floor(scrolledAmount / halfBufferAmount) * halfBufferAmount
      endIndex = startIndex + visibleAmount
      endIndex = Math.min(endIndex, totalAmount)
  
      visibleData = data.slice(startIndex, endIndex)
      offset = startIndex * itemSize
    }
  }

  return {
    startIndex,
    endIndex,
    halfBufferAmount,
    visibleData,
    totalSize,
    offset,
    correctedScrolledDistance,
  }
}

function isFixedParameters <Data>(params: IFixedSizeParameters<Data> | IDynamicSizeParameters<Data>): params is IFixedSizeParameters<Data> {
  return typeof (params as IDynamicSizeParameters<Data>).itemMinSize !== 'number'
}

export default function virtualList <Data>(params: IFixedSizeParameters<Data> | IDynamicSizeParameters<Data>): IVirtualListReturnValue<Data> {
  if (isFixedParameters(params)) {
    return fixedSizeVirtualList(params as IFixedSizeParameters<Data>)
  } else {
    const fixedSizeReturnValue = fixedSizeVirtualList({
      ...params,
      itemSize: params.itemMinSize,
    })

    if (params.itemMinSize <= 0) return fixedSizeReturnValue

    const { itemMinSize, sizes } = params
    const { startIndex, correctedScrolledDistance } = fixedSizeReturnValue
    const visibleScrolledAmount = Math.floor(correctedScrolledDistance / itemMinSize) - startIndex

    let i
    for (i = 0; i < visibleScrolledAmount; i++) {
      fixedSizeReturnValue.offset -= (sizes[i + startIndex] || itemMinSize) - itemMinSize
    }
    
    if (correctedScrolledDistance % itemMinSize) {
      const scrolledRate = (correctedScrolledDistance / itemMinSize - startIndex) - visibleScrolledAmount
      fixedSizeReturnValue.offset -= ((sizes[i + startIndex] || itemMinSize) - itemMinSize) * scrolledRate
    }

    return fixedSizeReturnValue
  }
}
