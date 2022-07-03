interface IVirtualListParameters {
  dataLength: number

  itemMinSize: number

  viewportSize: number

  bufferCount?: number
}

interface IViewportRange {
  totalSize: number

  startIndex: number

  endIndex: number

  offset: number
}

class VirtualList {
  private dataLength!: number

  private totalSize!: number

  private itemMinSize!: number

  private viewportSize!: number

  private bufferCount!: number

  constructor (parameters: IVirtualListParameters) {
    this.itemMinSize = parameters.itemMinSize
    this.bufferCount = parameters.bufferCount || 20
    this.setViewportSize(parameters.viewportSize)
    this.setDataLength(parameters.dataLength)
  }

  setDataLength (dataLength: number): void {
    const { itemMinSize } = this
    this.dataLength = dataLength
    this.totalSize = itemMinSize * this.dataLength
  }

  setViewportSize (viewportSize: number): void {
    this.viewportSize = viewportSize
  }

  getViewportRange (scrolledSize: number, visibleItemRealSizeList: number[]  = []): IViewportRange {
    const { viewportSize, itemMinSize, dataLength, totalSize, bufferCount } = this
    const viewportCount = Math.ceil(viewportSize / itemMinSize)
    const visibleCount = viewportCount + bufferCount
    const startIndex = Math.floor(Math.floor(scrolledSize / itemMinSize) / bufferCount) * bufferCount
    const endIndex = Math.min(visibleCount + startIndex, dataLength)

    const realVisibleCount = endIndex - startIndex
    const isLastScroll = visibleCount !== realVisibleCount
    let scrollableSize = 1
    let realScrollableSize = 1

    if (isLastScroll) {
      scrollableSize = realVisibleCount * itemMinSize - viewportSize
      realScrollableSize = (visibleItemRealSizeList.reduce((sum, current) => sum + current, 0) || scrollableSize) - viewportSize
    } else {
      scrollableSize = bufferCount * itemMinSize
      realScrollableSize = visibleItemRealSizeList.slice(0, bufferCount).reduce((sum, current) => sum + current, 0) || scrollableSize
    }
    
    const offset = scrolledSize - (scrolledSize - startIndex * itemMinSize) * realScrollableSize / scrollableSize

    return {
      totalSize,
      startIndex,
      endIndex,
      offset,
    }
  }
}

export default VirtualList
