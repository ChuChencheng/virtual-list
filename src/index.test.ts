import virtualList from './index'

const sharedData = Array.from({ length: 1000 }).fill(0)

describe('Fixed height', () => {
  it('normal parameters', () => {
    const result = virtualList({
      data: sharedData,
      scrolledDistance: 1600,
      visibleSize: 320,
      bufferAmount: 20,
      itemSize: 50,
    })

    expect(result.startIndex).toBe(30)
    expect(result.endIndex).toBe(60)
    expect(result.halfBufferAmount).toBe(10)
    expect(result.visibleData.length).toBe(30)
    expect(result.totalSize).toBe(sharedData.length * 50)
    expect(result.offset).toBe(1500)
  })
})
