import VirtualList from '../src'
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
    <div class="virtual-list-viewport">
      <div class="virtual-list-whole">
        <div class="virtual-list-item-container"></div>
      </div>
    </div>
  `
}

const $viewport: HTMLDivElement | null = document.querySelector('.virtual-list-viewport')
const $whole: HTMLDivElement | null = document.querySelector('.virtual-list-whole')
const $itemContainer: HTMLDivElement | null = document.querySelector('.virtual-list-item-container')

const clientHeight = $viewport?.clientHeight || 0
const dataLength = data.length
const itemMinSize = 30
let previousStartIndex = -1
let previousEndIndex = -1

const handleScroll = () => {
  const scrollTop = $viewport?.scrollTop || 0
  const { startIndex, endIndex, estimatedRenderCount } = VirtualList.getRange({
    scrolledSize: scrollTop,
    viewportSize: clientHeight,
    dataLength,
    itemMinSize,
  })
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
            style="box-sizing:border-box;border:1px solid black;min-height:${30 + (i % 10) * 10}px;width:100%;"
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

    const offset = VirtualList.getOffset({
      scrolledSize: scrollTop,
      startIndex,
      endIndex,
      estimatedRenderCount,
      viewportSize: clientHeight,
      itemMinSize,
      visibleItemRealSizeList,
    })

    $itemContainer.style.transform = `translateY(${offset}px)`
  }
}

$viewport?.addEventListener('scroll', handleScroll)

handleScroll()
