const VIRTUAL_LIST_LOG_PREFIX = '[Virtual List]'
const DEFAULT_BUFFER_COUNT = 20

const getSum = (array: number[], startIndex: number, endIndex: number): number => {
  return array.slice(startIndex, endIndex).reduce((sum, current) => sum + current, 0)
}

const getNumberInRange = (num: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, num))
}

/**
 * @public
 */
export enum VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM {
  TOP = 'TOP',
  MIDDLE = 'MIDDLE',
  BOTTOM = 'BOTTOM',
}

interface IGetRatioParameters {
  startIndex: number
  endIndex: number
  visibleItemRealSizeList: number[]
}

/**
 * @public
 */
export interface IVirtualListOptions {
  viewportSize: number
  dataLength: number
  itemMinSize: number
  bufferCount?: number
}

/**
 * @public
 */
export interface IVirtualListGetOffsetParameters {
  startIndex: number
  endIndex: number
  visibleItemRealSizeList: number[]
  scrolledSize: number
}

/**
 * @public
 */
export interface IVirtualListGetSizeFromViewportStartParameters {
  position: VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM | number
  itemSize: number
}

/**
 * @public
 */
export interface IVirtualListGetEstimatedRangeParameters {
  dataIndex: number
  sizeFromViewportStart: number
}

/**
 * @public
 */
export interface IVirtualListGetScrolledSizeByEstimatedRangeParameters {
  dataIndex: number
  sizeFromViewportStart: number
  estimatedStartIndex: number
  estimatedEndIndex: number
  visibleItemRealSizeList: number[]
}

/**
 * @public
 */
class VirtualList {
  private estimatedRenderCount!: number

  private maxScrollableSize!: number
  
  private bufferCount!: number

  private readonly options!: Omit<IVirtualListOptions, 'bufferCount'>

  constructor (options: IVirtualListOptions) {
    this.bufferCount = options.bufferCount ?? DEFAULT_BUFFER_COUNT

    if (options.viewportSize < 0) this.throwError('viewportSize')
    if (options.itemMinSize <= 0) this.throwError('itemMinSize')
    if (options.dataLength < 0) this.throwError('dataLength')
    if (this.bufferCount <= 0) this.throwError('bufferCount')

    const viewportCount = Math.ceil(options.viewportSize / options.itemMinSize)
    this.estimatedRenderCount = viewportCount + this.bufferCount
    this.maxScrollableSize = options.dataLength * options.itemMinSize - options.viewportSize

    this.options = {
      viewportSize: options.viewportSize,
      dataLength: options.dataLength,
      itemMinSize: options.itemMinSize,
    }
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
      realScrollableSize = getSum(visibleItemRealSizeList, 0, visibleItemRealSizeList.length) - viewportSize
      if (realScrollableSize <= 0) realScrollableSize = scrollableSize
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
  }: IVirtualListGetOffsetParameters): number {
    const { itemMinSize } = this.options

    const ratio = this.getRatio({
      startIndex,
      endIndex,
      visibleItemRealSizeList,
    })
    
    const offset = scrolledSize - (scrolledSize - startIndex * itemMinSize) * ratio

    return offset
  }

  // #region Scroll To functions

  getSizeFromViewportStart ({
    position,
    itemSize,
  }: IVirtualListGetSizeFromViewportStartParameters): number {
    const { viewportSize } = this.options

    let percentage = 0
    if (typeof position === 'number') {
      percentage = getNumberInRange(position, 0, 1)
    } else if (position === VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM.MIDDLE) {
      percentage = 0.5
    } else if (position === VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM.BOTTOM) {
      percentage = 1
    }

    const sizeFromViewportStart = (viewportSize - itemSize) * percentage

    return sizeFromViewportStart
  }

  getEstimatedRange ({
    dataIndex,
    sizeFromViewportStart,
  }: IVirtualListGetEstimatedRangeParameters): { estimatedStartIndex: number; estimatedEndIndex: number } {
    const { estimatedRenderCount, bufferCount } = this
    const { itemMinSize, dataLength } = this.options

    const estimatedViewportStartIndex = getNumberInRange(dataIndex - Math.ceil(sizeFromViewportStart / itemMinSize), 0, dataLength - 1)
    const estimatedStartIndex = Math.floor(estimatedViewportStartIndex / bufferCount) * bufferCount
    const estimatedEndIndex = Math.min(estimatedRenderCount + dataIndex, dataLength)

    return {
      estimatedStartIndex,
      estimatedEndIndex,
    }
  }

  getScrolledSizeByEstimatedRange ({
    dataIndex,
    sizeFromViewportStart,
    estimatedStartIndex,
    estimatedEndIndex,
    visibleItemRealSizeList,
  }: IVirtualListGetScrolledSizeByEstimatedRangeParameters): number {
    const { estimatedRenderCount, bufferCount, maxScrollableSize } = this
    const { itemMinSize, dataLength } = this.options

    let viewportStartIndex = dataIndex
    let size = 0
    while (size < sizeFromViewportStart && viewportStartIndex > estimatedStartIndex) {
      size += visibleItemRealSizeList[(--viewportStartIndex) - estimatedStartIndex]
    }

    const startIndex = Math.floor(viewportStartIndex / bufferCount) * bufferCount
    const endIndex = Math.min(estimatedRenderCount + startIndex, dataLength)
    const visibleItemRealSizeListByRange = visibleItemRealSizeList.slice(startIndex - estimatedStartIndex, endIndex - estimatedStartIndex)

    const ratio = this.getRatio({
      startIndex,
      endIndex,
      visibleItemRealSizeList: visibleItemRealSizeListByRange,
    })

    const realScrolledSize = getSum(visibleItemRealSizeListByRange, 0, dataIndex - startIndex) - sizeFromViewportStart
    return getNumberInRange(realScrolledSize / ratio + startIndex * itemMinSize, 0, maxScrollableSize)
  }

  // #endregion
}

export default VirtualList
