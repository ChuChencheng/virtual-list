const DEFAULT_BUFFER_COUNT = 20

export interface IVirtualListGetRangeParameters {
  scrolledSize: number
  viewportSize: number
  dataLength: number
  itemMinSize: number
  bufferCount?: number
}

export interface IVirtualListGetOffsetParameters extends Omit<IVirtualListGetRangeParameters, 'dataLength'> {
  startIndex: number
  endIndex: number
  estimatedRenderCount: number
  visibleItemRealSizeList: number[]
}

const VirtualList = {
  getRange ({
    scrolledSize,
    viewportSize,
    dataLength,
    itemMinSize,
    bufferCount = DEFAULT_BUFFER_COUNT,
  }: IVirtualListGetRangeParameters): { startIndex: number; endIndex: number; estimatedRenderCount: number } {
    const viewportCount = Math.ceil(viewportSize / itemMinSize)
    const estimatedRenderCount = viewportCount + bufferCount
    const startIndex = Math.floor(Math.floor(scrolledSize / itemMinSize) / bufferCount) * bufferCount
    const endIndex = Math.min(estimatedRenderCount + startIndex, dataLength)

    return {
      startIndex,
      endIndex,
      estimatedRenderCount,
    }
  },

  getOffset ({
    scrolledSize,
    startIndex,
    endIndex,
    estimatedRenderCount,
    viewportSize,
    itemMinSize,
    visibleItemRealSizeList,
    bufferCount = DEFAULT_BUFFER_COUNT,
  }: IVirtualListGetOffsetParameters): number {
    const renderCount = endIndex - startIndex
    const isLastScroll = renderCount !== estimatedRenderCount
    let scrollableSize = 1
    let realScrollableSize = 1

    if (isLastScroll) {
      scrollableSize = renderCount * itemMinSize - viewportSize
      realScrollableSize = (visibleItemRealSizeList.reduce((sum, current) => sum + current, 0) || scrollableSize) - viewportSize
    } else {
      scrollableSize = bufferCount * itemMinSize
      realScrollableSize = visibleItemRealSizeList.slice(0, bufferCount).reduce((sum, current) => sum + current, 0) || scrollableSize
    }

    const offset = scrolledSize - (scrolledSize - startIndex * itemMinSize) * realScrollableSize / scrollableSize

    return offset
  },
}

export default VirtualList
