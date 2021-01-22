import virtualList from './index'

const getData = (length: number) => Array.from({ length }).fill(0)

describe('Normal', () => {
  it('normal parameters', () => {
    const dataLength = 1000
    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: 1600,
      visibleSize: 320,
      bufferAmount: 20,
      itemSize: 50,
    })

    expect(result.startIndex).toBe(30)
    expect(result.endIndex).toBe(59)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(29)
    expect(result.totalSize).toBe(dataLength * 50)
    expect(result.offset).toBe(1500)
  })
})

describe('Data', () => {
  it('no data', () => {
    const result = virtualList({
      data: [],
      scrolledDistance: 1600,
      visibleSize: 320,
      bufferAmount: 20,
      itemSize: 50,
    })

    expect(result.startIndex).toBe(0)
    expect(result.endIndex).toBe(0)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(0)
    expect(result.totalSize).toBe(0)
    expect(result.offset).toBe(0)
  })

  it('no virtual list', () => {
    const dataLength = 29
    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: 1600,
      visibleSize: 320,
      bufferAmount: 20,
      itemSize: 50,
    })

    expect(result.startIndex).toBe(0)
    expect(result.endIndex).toBe(29)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(29)
    expect(result.totalSize).toBe(1450)
    expect(result.offset).toBe(0)
  })
})

describe('Item size', () => {
  it('negative item size', () => {
    const dataLength = 1000
    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: 1600,
      visibleSize: 320,
      bufferAmount: 20,
      itemSize: -1,
    })

    expect(result.startIndex).toBe(0)
    expect(result.endIndex).toBe(1000)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(1000)
    expect(result.totalSize).toBe(-dataLength)
    expect(result.offset).toBe(0)
  })

  it('negative item min size', () => {
    const dataLength = 1000
    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: 1600,
      visibleSize: 320,
      bufferAmount: 20,
      itemMinSize: -1,
      sizes: [],
    })

    expect(result.startIndex).toBe(0)
    expect(result.endIndex).toBe(1000)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(1000)
    expect(result.totalSize).toBe(-dataLength)
    expect(result.offset).toBe(0)
  })
})

describe('Scrolled distance', () => {
  it('long scrolled distance', () => {
    const dataLength = 1000
    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: dataLength * 50,
      visibleSize: 320,
      bufferAmount: 20,
      itemSize: 50,
    })

    expect(result.startIndex).toBe(990)
    expect(result.endIndex).toBe(1000)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(10)
    expect(result.totalSize).toBe(dataLength * 50)
    expect(result.offset).toBe(49500)
  })

  it('negative scrolled distance', () => {
    const dataLength = 1000
    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: -100,
      visibleSize: 320,
      bufferAmount: 20,
      itemSize: 50,
    })

    expect(result.startIndex).toBe(0)
    expect(result.endIndex).toBe(29)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(29)
    expect(result.totalSize).toBe(dataLength * 50)
    expect(result.offset).toBe(0)
  })
})

describe('Buffer amount', () => {
  it('default buffer amount', () => {
    const dataLength = 1000
    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: 1600,
      visibleSize: 320,
      itemSize: 50,
    })

    expect(result.startIndex).toBe(30)
    expect(result.endIndex).toBe(59)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(29)
    expect(result.totalSize).toBe(dataLength * 50)
    expect(result.offset).toBe(1500)
  })

  it('negative buffer amount', () => {
    const dataLength = 1000
    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: 1600,
      visibleSize: 320,
      bufferAmount: -1,
      itemSize: 50,
    })

    expect(result.startIndex).toBe(32)
    expect(result.endIndex).toBe(42)
    expect(result.halfBufferAmount).toBe(1)
    expect(result.visibleData.length).toBe(10)
    expect(result.totalSize).toBe(dataLength * 50)
    expect(result.offset).toBe(1600)
  })
})

describe('Dynamic virtual list', () => {
  it('normal parameters', () => {
    // Only offset is different from fixed virtual list offset
    const dataLength = 1000
    const sizes: number[] = []
    for (let i = 30; i < 59; i++) {
      sizes[i] = 50 + i
    }

    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: 1600,
      visibleSize: 320,
      bufferAmount: 20,
      itemMinSize: 50,
      sizes,
    })

    expect(result.startIndex).toBe(30)
    expect(result.endIndex).toBe(59)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(29)
    expect(result.totalSize).toBe(dataLength * 50)
    expect(result.offset).toBe(1439)
  })

  it('normal parameters with half scrolled item', () => {
    const dataLength = 1000
    const sizes: number[] = []
    for (let i = 30; i < 59; i++) {
      sizes[i] = 50 + i
    }

    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: 1620,
      visibleSize: 320,
      bufferAmount: 20,
      itemMinSize: 50,
      sizes,
    })

    expect(result.startIndex).toBe(30)
    expect(result.endIndex).toBe(59)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(29)
    expect(result.totalSize).toBe(dataLength * 50)
    expect(result.offset).toBe(1426.2)
  })

  it('no sizes', () => {
    // Should be the same result as fixed virtual list
    const dataLength = 1000
    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: 1600,
      visibleSize: 320,
      bufferAmount: 20,
      itemMinSize: 50,
      sizes: [],
    })

    expect(result.startIndex).toBe(30)
    expect(result.endIndex).toBe(59)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(29)
    expect(result.totalSize).toBe(dataLength * 50)
    expect(result.offset).toBe(1500)
  })

  it('no size of half scrolled item', () => {
    const dataLength = 1000
    const sizes: number[] = []
    sizes[30] = 50 + 30
    sizes[31] = 50 + 31

    const result = virtualList({
      data: getData(dataLength),
      scrolledDistance: 1620,
      visibleSize: 320,
      bufferAmount: 20,
      itemMinSize: 50,
      sizes,
    })

    expect(result.startIndex).toBe(30)
    expect(result.endIndex).toBe(59)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(29)
    expect(result.totalSize).toBe(dataLength * 50)
    expect(result.offset).toBe(1439)
  })
})
