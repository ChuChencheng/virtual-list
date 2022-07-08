const VIRTUAL_LIST_LOG_PREFIX = '[Virtual List]'
const DEFAULT_BUFFER_COUNT = 20

const getSum = (array: number[], startIndex: number, endIndex: number): number => {
  return array.slice(startIndex, endIndex).reduce((sum, current) => sum + current, 0)
}

export enum GET_SCROLLED_SIZE_POSITION_ENUM {
  TOP = 'TOP',
  MIDDLE = 'MIDDLE',
  BOTTOM = 'BOTTOM',
}

export interface IVirtualListOptions {
  viewportSize: number
  dataLength: number
  itemMinSize: number
  bufferCount?: number
}

export interface IVirtualListGetOffsetParameters {
  scrolledSize: number
  startIndex: number
  endIndex: number
  visibleItemRealSizeList: number[]
}

export interface IVirtualListGetAdjustedOffsetParameters {
  scrolledSize: number
  offset: number
  startIndex: number
  dataIndex: number
  ratio: number
  visibleItemRealSizeList: number[]
}

class VirtualList {
  private estimatedRenderCount!: number
  
  private bufferCount!: number

  constructor (private readonly options: IVirtualListOptions) {
    this.bufferCount = options.bufferCount ?? DEFAULT_BUFFER_COUNT

    if (options.viewportSize < 0) this.throwError('viewportSize')
    if (options.itemMinSize <= 0) this.throwError('itemMinSize')
    if (options.dataLength < 0) this.throwError('dataLength')
    if (this.bufferCount <= 0) this.throwError('bufferCount')

    const viewportCount = Math.ceil(options.viewportSize / options.itemMinSize)
    this.estimatedRenderCount = viewportCount + this.bufferCount
  }

  private throwError (field: string) {
    throw new Error(`${VIRTUAL_LIST_LOG_PREFIX} ${field} invalid`)
  }

  getRange (scrolledSize: number): { startIndex: number; endIndex: number } {
    const { bufferCount, estimatedRenderCount } = this
    const { itemMinSize, dataLength } = this.options

    const startIndex = Math.floor(Math.floor(scrolledSize / itemMinSize) / bufferCount) * bufferCount
    const endIndex = Math.min(estimatedRenderCount + startIndex, dataLength)

    return {
      startIndex,
      endIndex,
    }
  }

  getOffset ({
    scrolledSize,
    startIndex,
    endIndex,
    visibleItemRealSizeList,
  }: IVirtualListGetOffsetParameters): { ratio: number; offset: number } {
    const { bufferCount, estimatedRenderCount } = this
    const { itemMinSize, viewportSize } = this.options

    const renderCount = endIndex - startIndex
    const isLastScroll = renderCount !== estimatedRenderCount
    let scrollableSize = 1
    let realScrollableSize = 1

    if (isLastScroll) {
      scrollableSize = renderCount * itemMinSize - viewportSize
      realScrollableSize = (getSum(visibleItemRealSizeList, 0, visibleItemRealSizeList.length) || scrollableSize) - viewportSize
    } else {
      scrollableSize = bufferCount * itemMinSize
      realScrollableSize = getSum(visibleItemRealSizeList, 0, bufferCount) || scrollableSize
    }

    const ratio = realScrollableSize > 0 && scrollableSize > 0 ? realScrollableSize / scrollableSize : 1
    const offset = scrolledSize - (scrolledSize - startIndex * itemMinSize) * ratio

    return {
      ratio,
      offset,
    }
  }

  getScrolledSizeByIndex (dataIndex: number, position: GET_SCROLLED_SIZE_POSITION_ENUM | number): number {
    const { itemMinSize, viewportSize, dataLength } = this.options

    let percentage = 0
    if (typeof position === 'number') {
      percentage = position
    } else if (position === GET_SCROLLED_SIZE_POSITION_ENUM.MIDDLE) {
      percentage = 0.5
    } else if (position === GET_SCROLLED_SIZE_POSITION_ENUM.BOTTOM) {
      percentage = 1
    }

    const scrolledSize = dataIndex * itemMinSize - (viewportSize - itemMinSize) * percentage
    const maxScrolledSize = dataLength * itemMinSize - viewportSize
    return Math.max(0, Math.min(maxScrolledSize, scrolledSize))
  }

  getAdjustedScrolledSize ({
    scrolledSize,
    offset,
    startIndex,
    dataIndex,
    ratio,
    visibleItemRealSizeList,
  }: IVirtualListGetAdjustedOffsetParameters): number {
    const { itemMinSize } = this.options

    const sizeToAdjust = offset + getSum(visibleItemRealSizeList, 0, dataIndex - startIndex) - dataIndex * itemMinSize
    const adjustedScrolledSize = scrolledSize + sizeToAdjust / ratio

    return adjustedScrolledSize
  }
}

export default VirtualList
