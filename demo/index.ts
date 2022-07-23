import VirtualList, { VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM } from '../src'
import './style.css'

await new Promise((resolve) => {
  window.onload = resolve
})

const data: Array<{ index: number; height: number}> = []

for (let i = 0; i < 100000; i++) {
  data.push({
    index: i,
    height: 30 + (i % 10) * 10,
  })
}

const $app = document.getElementById('app')

if ($app) {
  $app.innerHTML = `
    <div class="list-container">
      <div class="top-bar">
        <div>
          <span>Scroll to index: </span>
          <input class="scroll-to-input" type="number" value=30042 />
        </div>
        <button class="scroll-to-button">Scroll to</button>
        <span>Current scrollTo position: </span>
        <span class="scroll-to-position"></span>
      </div>
      <div class="virtual-list-viewport">
        <div class="virtual-list-whole">
          <div class="virtual-list-item-container"></div>
        </div>
      </div>
    </div>
    <div class="list-container">
      <div class="top-bar">
        Corresponding fixed size list
      </div>
      <div class="virtual-list-viewport-comparison">
        <div class="virtual-list-whole-comparison">
          <div class="virtual-list-item-container-comparison"></div>
        </div>
      </div>
    </div>
  `
}

const $viewport: HTMLDivElement | null = document.querySelector('.virtual-list-viewport')
const $comparisonViewport: HTMLDivElement | null = document.querySelector('.virtual-list-viewport-comparison')
const $itemContainer: HTMLDivElement | null = document.querySelector('.virtual-list-item-container')
const $comparisonItemContainer: HTMLDivElement | null = document.querySelector('.virtual-list-item-container-comparison')
const $whole: HTMLDivElement | null = document.querySelector('.virtual-list-whole')
const $comparisonWhole: HTMLDivElement | null = document.querySelector('.virtual-list-whole-comparison')
const $scrollToInput: HTMLInputElement | null = document.querySelector('.scroll-to-input')
const $scrollToButton: HTMLButtonElement | null = document.querySelector('.scroll-to-button')
const $scrollToPosition: HTMLSpanElement | null = document.querySelector('.scroll-to-position')

const clientHeight = $viewport?.clientHeight || 0
const dataLength = data.length
const itemMinSize = 30
let previousStartIndex = -1
let previousEndIndex = -1

if ($whole?.style && $comparisonWhole?.style) {
  $whole.style.height = `${dataLength * itemMinSize}px`
  $comparisonWhole.style.height = `${dataLength * itemMinSize}px`
}

const virtualListInstance = new VirtualList({
  viewportSize: clientHeight,
  dataLength,
  itemMinSize,
})

const setItem = (startIndex: number, endIndex: number) => {
  const visibleData = data.slice(startIndex, endIndex)
  const visibleItemRealSizeList: number[] = []

  if ($itemContainer && $comparisonItemContainer) {
    if (startIndex !== previousStartIndex || endIndex !== previousEndIndex) {
      $itemContainer.innerHTML = visibleData.map((d) => {
        return `
          <div
            class="virtual-list-item"
            style="min-height:${d.height}px;"
          >${d.index}</div>
        `
      }).join('')
      $comparisonItemContainer.innerHTML = visibleData.map((d) => {
        return `
          <div
            class="virtual-list-item"
            style="min-height:${30}px;"
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

let i = 0
const positionArray = [
  VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM.TOP,
  VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM.MIDDLE,
  VIRTUAL_LIST_SCROLLED_SIZE_POSITION_ENUM.BOTTOM,
]

$scrollToButton?.addEventListener('click', () => {
  const dataIndex: number = $scrollToInput?.value ? Number($scrollToInput?.value) : 30042
  const nextPosition = positionArray[i % positionArray.length]
  const [dataIndexItemSize] = setItem(dataIndex, dataIndex + 1)
  const sizeFromViewportStart = virtualListInstance.getSizeFromViewportStart({
    position: nextPosition,
    itemSize: dataIndexItemSize,
  })
  const { estimatedStartIndex, estimatedEndIndex } = virtualListInstance.getEstimatedRange({
    dataIndex,
    sizeFromViewportStart,
  })
  // Set items DOM to get real size
  const visibleItemRealSizeList = setItem(estimatedStartIndex, estimatedEndIndex)
  const adjustedScrolledSize = virtualListInstance.getScrolledSizeByEstimatedRange({
    dataIndex,
    sizeFromViewportStart,
    estimatedStartIndex,
    estimatedEndIndex,
    visibleItemRealSizeList,
  })
  if ($viewport) {
    $viewport.scrollTop = adjustedScrolledSize
  }
  if ($scrollToPosition) $scrollToPosition.innerText = nextPosition
  i++
})

const handleScroll = (scrollTop: number) => {
  const { startIndex, endIndex } = virtualListInstance.getRange(scrollTop)

  const visibleItemRealSizeList = setItem(startIndex, endIndex)
  const offset = virtualListInstance.getOffset({
    scrolledSize: scrollTop,
    startIndex,
    endIndex,
    visibleItemRealSizeList,
  })
  const comparisonOffset = virtualListInstance.getOffset({
    scrolledSize: scrollTop,
    startIndex,
    endIndex,
    visibleItemRealSizeList: [],
  })
  if ($itemContainer && $comparisonItemContainer) {
    $itemContainer.style.transform = `translateY(${offset}px)`
    $comparisonItemContainer.style.transform = `translateY(${comparisonOffset}px)`
  }
}

const handleViewportScroll = () => {
  const scrollTop = $viewport?.scrollTop || 0
  handleScroll(scrollTop)
  if ($comparisonViewport && scrollTop !== $comparisonViewport.scrollTop) {
    $comparisonViewport.scrollTop = scrollTop
  }
}

const handleComparisonViewportScroll = () => {
  const scrollTop = $comparisonViewport?.scrollTop || 0
  handleScroll(scrollTop)
  if ($viewport && scrollTop !== $viewport.scrollTop) {
    $viewport.scrollTop = scrollTop
  }
}

$viewport?.addEventListener('scroll', handleViewportScroll)
$comparisonViewport?.addEventListener('scroll', handleComparisonViewportScroll)

handleViewportScroll()
handleComparisonViewportScroll()
