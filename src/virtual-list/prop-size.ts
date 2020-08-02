import { IVirtualListBaseParameters, IVirtualListBaseClass } from '../interface'

interface IPropSizeParameters<Data> extends IVirtualListBaseParameters<Data> {
  itemMinSize: number
  getItemSize: (index: number, data: Data) => number
}

export default class <Data> implements IVirtualListBaseClass<Data> {
  private sizes: number[] = []

  private startIndex = 0

  constructor (private props: IPropSizeParameters<Data>) {
  }

  getVisibleData (): Data[] {
  }

  getTotalSize (): number {
    const { data, itemMinSize } = this.props
    return data.length * itemMinSize
  }

  getOffset (): number {
  }
}
