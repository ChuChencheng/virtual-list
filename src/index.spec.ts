import VirtualList, { VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM, IVirtualListOptions } from '.'

describe('Fixed size', () => {
  const options: IVirtualListOptions = {
    viewportSize: 200,
    itemMinSize: 20,
    dataLength: 20000,
    bufferCount: 20,
  }
  const instance = new VirtualList(options)

  it('Returns correct range', () => {
    const { startIndex, endIndex } = instance.getRange(450)

    expect(startIndex).toBe(20)
    expect(endIndex).toBe(50)
  })

  it('Returns correct offset', () => {
    const scrolledSize = 450
    const { startIndex, endIndex } = instance.getRange(scrolledSize)

    const offset = instance.getOffset({
      scrolledSize,
      startIndex,
      endIndex,
      visibleItemRealSizeList: Array(endIndex - startIndex).fill(options.itemMinSize),
    })

    expect(offset).toBe(400)
  })

  it('Returns correct scrolled size when invoking scrollTo', () => {
    const dataIndex = 35

    const sizeFromViewportStart = instance.getSizeFromViewportStart({
      position: VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM.MIDDLE,
      itemSize: options.itemMinSize,
    })
    const { estimatedStartIndex, estimatedEndIndex } = instance.getEstimatedRange({
      dataIndex,
      sizeFromViewportStart,
    })
    const scrolledSize = instance.getScrolledSizeByEstimatedRange({
      dataIndex,
      sizeFromViewportStart,
      estimatedStartIndex,
      estimatedEndIndex,
      visibleItemRealSizeList: Array(estimatedEndIndex - estimatedStartIndex).fill(options.itemMinSize),
    })

    expect(sizeFromViewportStart).toBe(90)
    expect(estimatedStartIndex).toBe(20)
    expect(estimatedEndIndex).toBe(65)
    expect(scrolledSize).toBe(610)
  })
})

describe('Variable size', () => {
  const options: IVirtualListOptions = {
    viewportSize: 400,
    itemMinSize: 30,
    dataLength: 100000,
    bufferCount: 20,
  }
  const instance = new VirtualList(options)

  it('Returns correct range', () => {
    const { startIndex, endIndex } = instance.getRange(650)

    expect(startIndex).toBe(20)
    expect(endIndex).toBe(54)
  })

  it('Returns correct offset', () => {
    const scrolledSize = 650
    const { startIndex, endIndex } = instance.getRange(scrolledSize)
    const visibleItemRealSizeList = []

    for (let i = 0; i < endIndex - startIndex; i++) {
      visibleItemRealSizeList[i] = 30 + ((i + startIndex) % 10) * 10
    }

    const offset = instance.getOffset({
      scrolledSize,
      startIndex,
      endIndex,
      visibleItemRealSizeList,
    })

    expect(offset).toBe(525)
  })

  it('Returns correct scrolled size when invoking scrollTo', () => {
    const dataIndex = 30042
    const visibleItemRealSizeList = []

    const sizeFromViewportStart = instance.getSizeFromViewportStart({
      position: VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM.MIDDLE,
      itemSize: 30 + (dataIndex % 10) * 10,
    })
    const { estimatedStartIndex, estimatedEndIndex } = instance.getEstimatedRange({
      dataIndex,
      sizeFromViewportStart,
    })

    for (let i = 0; i < estimatedEndIndex - estimatedStartIndex; i++) {
      visibleItemRealSizeList[i] = 30 + ((i + estimatedStartIndex) % 10) * 10
    }

    const scrolledSize = instance.getScrolledSizeByEstimatedRange({
      dataIndex,
      sizeFromViewportStart,
      estimatedStartIndex,
      estimatedEndIndex,
      visibleItemRealSizeList,
    })

    expect(sizeFromViewportStart).toBe(175)
    expect(estimatedStartIndex).toBe(30020)
    expect(estimatedEndIndex).toBe(30076)
    expect(scrolledSize).toBe(901158)
  })
})
