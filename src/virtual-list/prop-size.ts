import { IVirtualListBaseParameters, IVirtualListBaseClass } from '../interface'

interface IPropSizeParameters<Data> extends IVirtualListBaseParameters<Data> {
  itemMinSize: number
  getItemSize: (index: number, data: Data) => number
}

export default class <Data> implements IVirtualListBaseClass<Data> {
  private sizes: number[] = []

  constructor (private props: IPropSizeParameters<Data>) {
  }

  getVisibleData (): Data[] {
    const { data, visibleSize, itemMinSize, bufferAmount } = this.props
    const { dataLength } = this
    const visibleAmount = Math.ceil((visibleSize + 2 * itemMinSize) / itemMinSize) + bufferAmount
    if (dataLength <= visibleAmount) {
      return data
    }
    const { startIndex } = this
    const endIndex = startIndex + visibleAmount
    return data.slice(startIndex, endIndex + 1)
  }

  getTotalSize (): number {
    const { data, itemMinSize } = this.props
    return data.length * itemMinSize
  }

  getOffset (): number {
    const { data, scrolledDistance, itemMinSize, getItemSize } = this.props
    const { halfBufferAmount, dataLength, startIndex, sizes } = this
    let bufferSize = 0
    let i
    for (i = 0; i < halfBufferAmount; i++) {
      const index = i + startIndex
      if (index >= dataLength) break
      let realSize = sizes[index]
      if (!realSize) {
        realSize = getItemSize(index, data[index])
        sizes[index] = realSize
      }
      bufferSize += realSize
    }
    const fixedDistance = startIndex * itemMinSize
    const restDistance = scrolledDistance - fixedDistance
    return bufferSize * (restDistance / (i * itemMinSize)) + fixedDistance
  }

  private get dataLength (): number {
    return this.props.data.length
  }

  private get halfBufferAmount (): number {
    const { bufferAmount } = this.props
    return bufferAmount < 1 ? 1 : Math.ceil(bufferAmount / 2)
  }

  private get startIndex (): number {
    const { scrolledDistance, itemMinSize } = this.props
    const { halfBufferAmount } = this
    const scrolledAmount = Math.floor(scrolledDistance / itemMinSize)
    return Math.floor(scrolledAmount / halfBufferAmount) * halfBufferAmount
  }
}
