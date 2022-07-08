import VirtualList, { GET_SCROLLED_SIZE_POSITION_ENUM } from '../src'
import './style.css'

const data: Array<{ index: number; height: number}> = []

for (let i = 0; i < 100000; i++) {
  data.push({
    index: i,
    height: 30,
  })
}

const $app = document.getElementById('app')

if ($app) {
  $app.innerHTML = `
    <div>
      <button class="scroll-to-button">Scroll to</button>
      <div class="virtual-list-viewport">
        <div class="virtual-list-whole">
          <div class="virtual-list-item-container"></div>
        </div>
      </div>
    </div>
  `
}

const $viewport: HTMLDivElement | null = document.querySelector('.virtual-list-viewport')
const $whole: HTMLDivElement | null = document.querySelector('.virtual-list-whole')
const $itemContainer: HTMLDivElement | null = document.querySelector('.virtual-list-item-container')
const $scrollToButton: HTMLButtonElement | null = document.querySelector('.scroll-to-button')

const clientHeight = $viewport?.clientHeight || 0
const dataLength = data.length
const itemMinSize = 30
let previousStartIndex = -1
let previousEndIndex = -1

if ($whole?.style) {
  $whole.style.height = `${dataLength * itemMinSize}px`
}

const virtualListInstance = new VirtualList({
  viewportSize: clientHeight,
  dataLength,
  itemMinSize,
})

const setItem = (startIndex: number, endIndex: number) => {
  const visibleData = data.slice(startIndex, endIndex)
  const visibleItemRealSizeList: number[] = []

  if ($itemContainer) {
    if (startIndex !== previousStartIndex || endIndex !== previousEndIndex) {
      $itemContainer.innerHTML = visibleData.map((d, i) => {
        return `
          <div
            class="virtual-list-item"
            style="min-height:${30 + (i % 10) * 10}px;"
          >${d.index}</div>
        `
      }).join('')
      previousStartIndex = startIndex
      previousEndIndex = endIndex
    }

    const $items: NodeListOf<HTMLDivElement> = $itemContainer.querySelectorAll('.virtual-list-item')
    $items.forEach(($item) => {
      visibleItemRealSizeList.push($item.offsetHeight)
    })
  }

  return visibleItemRealSizeList
}

const setItemContainerOffset = (offset: number) => {
  if ($itemContainer) {
    $itemContainer.style.transform = `translateY(${offset}px)`
  }
}

let i = 0
const positionArray = [
  GET_SCROLLED_SIZE_POSITION_ENUM.TOP,
  GET_SCROLLED_SIZE_POSITION_ENUM.MIDDLE,
  GET_SCROLLED_SIZE_POSITION_ENUM.BOTTOM,
]

$scrollToButton?.addEventListener('click', () => {
  const dataIndex = 30009
  const nextPosition = positionArray[i % positionArray.length]
  const scrollTop = virtualListInstance.getScrolledSizeByIndex(dataIndex, nextPosition)
  const { startIndex, endIndex } = virtualListInstance.getRange(scrollTop)
  // Set items DOM to get real size
  const visibleItemRealSizeList = setItem(startIndex, endIndex)
  const { ratio, offset } = virtualListInstance.getOffset({
    scrolledSize: scrollTop,
    startIndex,
    endIndex,
    visibleItemRealSizeList,
  })
  const adjustedScrolledSize = virtualListInstance.getAdjustedScrolledSize({
    scrolledSize: scrollTop,
    offset,
    startIndex,
    dataIndex,
    ratio,
    visibleItemRealSizeList,
  })
  if ($viewport) {
    $viewport.scrollTop = adjustedScrolledSize
  }
  i++
})

const handleScroll = () => {
  const scrollTop = $viewport?.scrollTop || 0
  const { startIndex, endIndex } = virtualListInstance.getRange(scrollTop)

  const visibleItemRealSizeList = setItem(startIndex, endIndex)
  const { offset } = virtualListInstance.getOffset({
    scrolledSize: scrollTop,
    startIndex,
    endIndex,
    visibleItemRealSizeList,
  })
  setItemContainerOffset(offset)
}

$viewport?.addEventListener('scroll', handleScroll)

handleScroll()
