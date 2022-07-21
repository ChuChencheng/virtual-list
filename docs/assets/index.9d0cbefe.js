const Y=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(e){if(e.ep)return;e.ep=!0;const o=r(e);fetch(e.href,o)}};Y();const $="[Virtual List]",G=20,x=(i,t,r)=>i.slice(t,r).reduce((n,e)=>n+e,0),M=(i,t,r)=>Math.max(t,Math.min(r,i));var y=(i=>(i.TOP="TOP",i.MIDDLE="MIDDLE",i.BOTTOM="BOTTOM",i))(y||{});class K{constructor(t){var n;this.bufferCount=(n=t.bufferCount)!=null?n:G,t.viewportSize<0&&this.throwError("viewportSize"),t.itemMinSize<=0&&this.throwError("itemMinSize"),t.dataLength<0&&this.throwError("dataLength"),this.bufferCount<=0&&this.throwError("bufferCount");const r=Math.ceil(t.viewportSize/t.itemMinSize);this.estimatedRenderCount=r+this.bufferCount,this.maxScrollableSize=t.dataLength*t.itemMinSize-t.viewportSize,this.options={viewportSize:t.viewportSize,dataLength:t.dataLength,itemMinSize:t.itemMinSize}}throwError(t){throw new Error(`${$} ${t} invalid`)}getRatio({startIndex:t,endIndex:r,visibleItemRealSizeList:n}){const{bufferCount:e,estimatedRenderCount:o}=this,{itemMinSize:s,viewportSize:a}=this.options,m=r-t,p=m!==o;let u=1,c=1;return p?(u=m*s-a,c=x(n,0,n.length)-a,c<=0&&(c=u)):(u=e*s,c=x(n,0,e)||u),c>0&&u>0?c/u:1}getRange(t){const{bufferCount:r,estimatedRenderCount:n}=this,{itemMinSize:e,dataLength:o}=this.options,s=Math.floor(Math.floor(t/e)/r)*r,a=Math.min(n+s,o);return{startIndex:s,endIndex:a}}getOffset({scrolledSize:t,startIndex:r,endIndex:n,visibleItemRealSizeList:e}){const{itemMinSize:o}=this.options,s=this.getRatio({startIndex:r,endIndex:n,visibleItemRealSizeList:e});return t-(t-r*o)*s}getSizeFromViewportStart({position:t,itemSize:r}){const{viewportSize:n}=this.options;let e=0;return typeof t=="number"?e=M(t,0,1):t==="MIDDLE"?e=.5:t==="BOTTOM"&&(e=1),(n-r)*e}getEstimatedRange({dataIndex:t,sizeFromViewportStart:r}){const{estimatedRenderCount:n,bufferCount:e}=this,{itemMinSize:o,dataLength:s}=this.options,a=M(t-Math.ceil(r/o),0,s-1),m=Math.floor(a/e)*e,p=Math.min(n+t,s);return{estimatedStartIndex:m,estimatedEndIndex:p}}getScrolledSizeByEstimatedRange({dataIndex:t,sizeFromViewportStart:r,estimatedStartIndex:n,estimatedEndIndex:e,visibleItemRealSizeList:o}){const{estimatedRenderCount:s,bufferCount:a,maxScrollableSize:m}=this,{itemMinSize:p,dataLength:u}=this.options;let c=t,w=0;for(;w<r&&c>n;)w+=o[--c-n];const v=Math.floor(c/a)*a,O=Math.min(s+v,u),q=o.slice(v-n,O-n),A=this.getRatio({startIndex:v,endIndex:O,visibleItemRealSizeList:q}),N=x(q,0,t-v)-r;return M(N/A+v*p,0,m)}}const T=[];for(let i=0;i<1e5;i++)T.push({index:i,height:30+i%10*10});const I=document.getElementById("app");I&&(I.innerHTML=`
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
  `);const l=document.querySelector(".virtual-list-viewport"),d=document.querySelector(".virtual-list-viewport-comparison"),g=document.querySelector(".virtual-list-item-container"),b=document.querySelector(".virtual-list-item-container-comparison"),S=document.querySelector(".virtual-list-whole"),z=document.querySelector(".virtual-list-whole-comparison"),f=document.querySelector(".scroll-to-input"),L=document.querySelector(".scroll-to-button"),F=document.querySelector(".scroll-to-position"),X=(l==null?void 0:l.clientHeight)||0,E=T.length,C=30;let B=-1,D=-1;(S==null?void 0:S.style)&&(z==null?void 0:z.style)&&(S.style.height=`${E*C}px`,z.style.height=`${E*C}px`);const h=new K({viewportSize:X,dataLength:E,itemMinSize:C}),R=(i,t)=>{const r=T.slice(i,t),n=[];return g&&b&&((i!==B||t!==D)&&(g.innerHTML=r.map(o=>`
          <div
            class="virtual-list-item"
            style="min-height:${o.height}px;"
          >${o.index}</div>
        `).join(""),b.innerHTML=r.map(o=>`
          <div
            class="virtual-list-item"
            style="min-height:${30}px;"
          >${o.index}</div>
        `).join(""),B=i,D=t),g.querySelectorAll(".virtual-list-item").forEach(o=>{n.push(o.offsetHeight)})),n};let H=0;const P=[y.TOP,y.MIDDLE,y.BOTTOM];L==null||L.addEventListener("click",()=>{const i=f!=null&&f.value?Number(f==null?void 0:f.value):30042,t=P[H%P.length],[r]=R(i,i+1),n=h.getSizeFromViewportStart({position:t,itemSize:r}),{estimatedStartIndex:e,estimatedEndIndex:o}=h.getEstimatedRange({dataIndex:i,sizeFromViewportStart:n}),s=R(e,o),a=h.getScrolledSizeByEstimatedRange({dataIndex:i,sizeFromViewportStart:n,estimatedStartIndex:e,estimatedEndIndex:o,visibleItemRealSizeList:s});l&&(l.scrollTop=a),F&&(F.innerText=t),H++});const V=i=>{const{startIndex:t,endIndex:r}=h.getRange(i),n=R(t,r),e=h.getOffset({scrolledSize:i,startIndex:t,endIndex:r,visibleItemRealSizeList:n}),o=h.getOffset({scrolledSize:i,startIndex:t,endIndex:r,visibleItemRealSizeList:[]});g&&b&&(g.style.transform=`translateY(${e}px)`,b.style.transform=`translateY(${o}px)`)},j=()=>{const i=(l==null?void 0:l.scrollTop)||0;V(i),d&&i!==d.scrollTop&&(d.scrollTop=i)},k=()=>{const i=(d==null?void 0:d.scrollTop)||0;V(i),l&&i!==l.scrollTop&&(l.scrollTop=i)};l==null||l.addEventListener("scroll",j);d==null||d.addEventListener("scroll",k);j();k();
