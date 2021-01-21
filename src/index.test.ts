import virtualList from './index'

const getData = (length: number) => Array.from({ length }).fill(0)

describe('Fixed height', () => {
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

  it('wrong scrolled distance', () => {
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

  it('small visible size', () => {})

  it('large buffer amount', () => {})

  it('small buffer amount', () => {})

  it('small item size', () => {})
})
