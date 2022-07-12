const VIRTUAL_LIST_LOG_PREFIX = '[Virtual List]'
const DEFAULT_BUFFER_COUNT = 20

const getSum = (array: number[], startIndex: number, endIndex: number): number => {
  return array.slice(startIndex, endIndex).reduce((sum, current) => sum + current, 0)
}

const getNumberInRange = (num: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, num))
}

export enum GET_SCROLLED_SIZE_POSITION_ENUM {
  TOP = 'TOP',
  MIDDLE = 'MIDDLE',
  BOTTOM = 'BOTTOM',
}

interface IGetRatioParameters {
  startIndex: number
  endIndex: number
  visibleItemRealSizeList: number[]
}

interface IGetScrollToRangeReturnValue {
  startIndex: number
  endIndex: number
  sizeFromViewportStartToIndex: number
}

export interface IVirtualListOptions {
  viewportSize: number
  dataLength: number
  itemMinSize: number
  bufferCount?: number
}

export interface IVirtualListGetOffsetParameters extends IGetRatioParameters {
  scrolledSize: number
}

export interface IVirtualListGetScrollToRangeParameters {
  index: number
  position: GET_SCROLLED_SIZE_POSITION_ENUM | number
  itemSize: number
}

export interface IVirtualListGetScrollToScrolledSizeParameters extends IGetRatioParameters, IGetScrollToRangeReturnValue {
  dataIndex: number
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

  private getRatio ({
    startIndex,
    endIndex,
    visibleItemRealSizeList,
  }: IGetRatioParameters): number {
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

    return ratio
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
    const { itemMinSize } = this.options

    const ratio = this.getRatio({
      startIndex,
      endIndex,
      visibleItemRealSizeList,
    })
    
    const offset = scrolledSize - (scrolledSize - startIndex * itemMinSize) * ratio

    return {
      ratio,
      offset,
    }
  }

  getScrollToRange ({
    index,
    position,
    itemSize,
  }: IVirtualListGetScrollToRangeParameters): IGetScrollToRangeReturnValue {
    const { bufferCount, estimatedRenderCount } = this
    const { itemMinSize, viewportSize, dataLength } = this.options

    let percentage = 0
    if (typeof position === 'number') {
      percentage = getNumberInRange(position, 0, 1)
    } else if (position === GET_SCROLLED_SIZE_POSITION_ENUM.MIDDLE) {
      percentage = 0.5
    } else if (position === GET_SCROLLED_SIZE_POSITION_ENUM.BOTTOM) {
      percentage = 1
    }

    const sizeFromViewportStartToIndex = (viewportSize - itemSize) * percentage
    const viewportStartIndex = getNumberInRange(index - Math.ceil(sizeFromViewportStartToIndex / itemMinSize), 0, dataLength - 1)
    const startIndex = Math.floor(viewportStartIndex / bufferCount) * bufferCount
    const endIndex = Math.min(estimatedRenderCount + startIndex, dataLength)

    return {
      startIndex,
      endIndex,
      sizeFromViewportStartToIndex,
    }
  }

  getScrollToScrolledSize ({
    dataIndex,
    startIndex,
    endIndex,
    visibleItemRealSizeList,
    sizeFromViewportStartToIndex,
  }: IVirtualListGetScrollToScrolledSizeParameters): number {
    const { itemMinSize } = this.options

    const ratio = this.getRatio({
      startIndex,
      endIndex,
      visibleItemRealSizeList,
    })

    const realScrolledSize = getSum(visibleItemRealSizeList, 0, dataIndex - startIndex) - sizeFromViewportStartToIndex
    return realScrolledSize / ratio + startIndex * itemMinSize
  }
}

export default VirtualList
