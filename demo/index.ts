import VirtualList, { GET_SCROLLED_SIZE_POSITION_ENUM } from '../src'
import './style.css'

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
        <button class="scroll-to-button">Scroll to</button>
      </div>
      <div class="virtual-list-viewport">
        <div class="virtual-list-whole">
          <div class="virtual-list-item-container"></div>
        </div>
      </div>
    </div>
    <div class="list-container">
      <div class="top-bar">
        Comparison
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
const $scrollToButton: HTMLButtonElement | null = document.querySelector('.scroll-to-button')

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
  GET_SCROLLED_SIZE_POSITION_ENUM.TOP,
  GET_SCROLLED_SIZE_POSITION_ENUM.MIDDLE,
  GET_SCROLLED_SIZE_POSITION_ENUM.BOTTOM,
]

$scrollToButton?.addEventListener('click', () => {
  const dataIndex = 30041
  const nextPosition = positionArray[i % positionArray.length]
  const [dataIndexItemSize] = setItem(dataIndex, dataIndex + 1)
  const { startIndex, endIndex, sizeFromViewportStartToIndex } = virtualListInstance.getScrollToRange({
    index: dataIndex,
    position: nextPosition,
    itemSize: dataIndexItemSize,
  })
  // Set items DOM to get real size
  const visibleItemRealSizeList = setItem(startIndex, endIndex)
  const adjustedScrolledSize = virtualListInstance.getScrollToScrolledSize({
    dataIndex,
    startIndex,
    endIndex,
    visibleItemRealSizeList,
    sizeFromViewportStartToIndex,
  }) 
  if ($viewport) {
    $viewport.scrollTop = adjustedScrolledSize
    // $viewport.scrollTop = scrollTop
  }
  i++
})

const handleScroll = (scrollTop: number) => {
  const { startIndex, endIndex } = virtualListInstance.getRange(scrollTop)

  const visibleItemRealSizeList = setItem(startIndex, endIndex)
  const { offset } = virtualListInstance.getOffset({
    scrolledSize: scrollTop,
    startIndex,
    endIndex,
    visibleItemRealSizeList,
  })
  const { offset: comparisonOffset } = virtualListInstance.getOffset({
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
