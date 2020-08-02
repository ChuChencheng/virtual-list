import { IVirtualListBaseParameters, IVirtualListBaseReturnValue } from '../interface'

interface IFixedSizeParameters<Data> extends IVirtualListBaseParameters<Data> {
  itemSize: number
}

export default function <Data> ({
  data,
  itemSize,
  scrolledDistance,
  visibleSize,
  bufferAmount = 20,
}: IFixedSizeParameters<Data>): IVirtualListBaseReturnValue<Data> {
  const dataLength = data.length
  const totalSize = dataLength * itemSize
  const visibleAmount = Math.ceil(visibleSize / itemSize) + bufferAmount
  if (dataLength <= visibleAmount) {
    return {
      visibleData: data,
      totalSize,
      offset: 0,
    }
  }
  const scrolledAmount = Math.floor(scrolledDistance / itemSize)
  const halfBufferAmount = bufferAmount < 1 ? 1 : Math.ceil(bufferAmount / 2)
  const startIndex = Math.floor(scrolledAmount / halfBufferAmount) * halfBufferAmount
  const endIndex = startIndex + visibleAmount
  return {
    visibleData: data.slice(startIndex, endIndex + 1),
    totalSize,
    offset: startIndex * itemSize,
  }
}
