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

const virtualListInstance = new VirtualList({
  viewportSize: clientHeight,
  dataLength,
  itemMinSize,
})

let i = 0
const positionArray = [
  GET_SCROLLED_SIZE_POSITION_ENUM.TOP,
  GET_SCROLLED_SIZE_POSITION_ENUM.MIDDLE,
  GET_SCROLLED_SIZE_POSITION_ENUM.BOTTOM,
]

$scrollToButton?.addEventListener('click', () => {
  const nextPosition = positionArray[i % positionArray.length]
  const scrollTop = virtualListInstance.getScrolledSizeByIndex(30000, nextPosition)
  if ($viewport) {
    $viewport.scrollTop = scrollTop
  }
  i++
})

const handleScroll = () => {
  const scrollTop = $viewport?.scrollTop || 0
  const { startIndex, endIndex } = virtualListInstance.getRange(scrollTop)
  const visibleData = data.slice(startIndex, endIndex)

  if ($whole?.style) {
    $whole.style.height = `${dataLength * itemMinSize}px`
  }

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
    const visibleItemRealSizeList: number[] = []
    $items.forEach(($item) => {
      visibleItemRealSizeList.push($item.offsetHeight)
    })

    const offset = virtualListInstance.getOffset({
      scrolledSize: scrollTop,
      startIndex,
      endIndex,
      visibleItemRealSizeList,
    })

    $itemContainer.style.transform = `translateY(${offset}px)`
  }
}

$viewport?.addEventListener('scroll', handleScroll)

handleScroll()
