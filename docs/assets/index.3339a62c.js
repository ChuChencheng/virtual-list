const k=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(e){if(e.ep)return;e.ep=!0;const o=r(e);fetch(e.href,o)}};k();const N="[Virtual List]",U=20,w=(i,t,r)=>i.slice(t,r).reduce((n,e)=>n+e,0),I=(i,t,r)=>Math.max(t,Math.min(r,i));var z=(i=>(i.TOP="TOP",i.MIDDLE="MIDDLE",i.BOTTOM="BOTTOM",i))(z||{});class Y{constructor(t){var n;this.bufferCount=(n=t.bufferCount)!=null?n:U,t.viewportSize<0&&this.throwError("viewportSize"),t.itemMinSize<=0&&this.throwError("itemMinSize"),t.dataLength<0&&this.throwError("dataLength"),this.bufferCount<=0&&this.throwError("bufferCount");const r=Math.ceil(t.viewportSize/t.itemMinSize);this.estimatedRenderCount=r+this.bufferCount,this.options={viewportSize:t.viewportSize,dataLength:t.dataLength,itemMinSize:t.itemMinSize}}throwError(t){throw new Error(`${N} ${t} invalid`)}getRatio({startIndex:t,endIndex:r,visibleItemRealSizeList:n}){const{bufferCount:e,estimatedRenderCount:o}=this,{itemMinSize:s,viewportSize:a}=this.options,m=r-t,v=m!==o;let c=1,u=1;return v?(c=m*s-a,u=(w(n,0,n.length)||c)-a):(c=e*s,u=w(n,0,e)||c),u>0&&c>0?u/c:1}getRange(t){const{bufferCount:r,estimatedRenderCount:n}=this,{itemMinSize:e,dataLength:o}=this.options,s=Math.floor(Math.floor(t/e)/r)*r,a=Math.min(n+s,o);return{startIndex:s,endIndex:a}}getOffset({scrolledSize:t,startIndex:r,endIndex:n,visibleItemRealSizeList:e}){const{itemMinSize:o}=this.options,s=this.getRatio({startIndex:r,endIndex:n,visibleItemRealSizeList:e}),a=t-(t-r*o)*s;return{ratio:s,offset:a}}getSizeFromViewportStart({position:t,itemSize:r}){const{viewportSize:n}=this.options;let e=0;return typeof t=="number"?e=I(t,0,1):t==="MIDDLE"?e=.5:t==="BOTTOM"&&(e=1),(n-r)*e}getEstimatedRange({dataIndex:t,sizeFromViewportStart:r}){const{estimatedRenderCount:n,bufferCount:e}=this,{itemMinSize:o,dataLength:s}=this.options,a=I(t-Math.ceil(r/o),0,s-1),m=Math.floor(a/e)*e,v=Math.min(n+t,s);return{estimatedStartIndex:m,estimatedEndIndex:v}}getScrolledSizeByEstimatedRange({dataIndex:t,sizeFromViewportStart:r,estimatedStartIndex:n,estimatedEndIndex:e,visibleItemRealSizeList:o}){const{estimatedRenderCount:s,bufferCount:a}=this,{itemMinSize:m,dataLength:v}=this.options;let c=t,u=0;for(;u<r||c<n;)u+=o[--c-n];const f=Math.floor(c/a)*a,T=Math.min(s+f,v),E=o.slice(f-n,T-n),j=this.getRatio({startIndex:f,endIndex:T,visibleItemRealSizeList:E});return(w(E,0,t-f)-r)/j+f*m}}const R=[];for(let i=0;i<1e5;i++)R.push({index:i,height:30+i%10*10});const O=document.getElementById("app");O&&(O.innerHTML=`
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
  `);const l=document.querySelector(".virtual-list-viewport"),d=document.querySelector(".virtual-list-viewport-comparison"),g=document.querySelector(".virtual-list-item-container"),b=document.querySelector(".virtual-list-item-container-comparison"),S=document.querySelector(".virtual-list-whole"),y=document.querySelector(".virtual-list-whole-comparison"),h=document.querySelector(".scroll-to-input"),M=document.querySelector(".scroll-to-button"),q=document.querySelector(".scroll-to-position"),$=(l==null?void 0:l.clientHeight)||0,x=R.length,L=30;let F=-1,B=-1;(S==null?void 0:S.style)&&(y==null?void 0:y.style)&&(S.style.height=`${x*L}px`,y.style.height=`${x*L}px`);const p=new Y({viewportSize:$,dataLength:x,itemMinSize:L}),C=(i,t)=>{const r=R.slice(i,t),n=[];return g&&b&&((i!==F||t!==B)&&(g.innerHTML=r.map(o=>`
          <div
            class="virtual-list-item"
            style="min-height:${o.height}px;"
          >${o.index}</div>
        `).join(""),b.innerHTML=r.map(o=>`
          <div
            class="virtual-list-item"
            style="min-height:${30}px;"
          >${o.index}</div>
        `).join(""),F=i,B=t),g.querySelectorAll(".virtual-list-item").forEach(o=>{n.push(o.offsetHeight)})),n};let D=0;const V=[z.TOP,z.MIDDLE,z.BOTTOM];M==null||M.addEventListener("click",()=>{const i=h!=null&&h.value?Number(h==null?void 0:h.value):30042,t=V[D%V.length],[r]=C(i,i+1),n=p.getSizeFromViewportStart({position:t,itemSize:r}),{estimatedStartIndex:e,estimatedEndIndex:o}=p.getEstimatedRange({dataIndex:i,sizeFromViewportStart:n}),s=C(e,o),a=p.getScrolledSizeByEstimatedRange({dataIndex:i,sizeFromViewportStart:n,estimatedStartIndex:e,estimatedEndIndex:o,visibleItemRealSizeList:s});l&&(l.scrollTop=a),q&&(q.innerText=t),D++});const H=i=>{const{startIndex:t,endIndex:r}=p.getRange(i),n=C(t,r),{offset:e}=p.getOffset({scrolledSize:i,startIndex:t,endIndex:r,visibleItemRealSizeList:n}),{offset:o}=p.getOffset({scrolledSize:i,startIndex:t,endIndex:r,visibleItemRealSizeList:[]});g&&b&&(g.style.transform=`translateY(${e}px)`,b.style.transform=`translateY(${o}px)`)},P=()=>{const i=(l==null?void 0:l.scrollTop)||0;H(i),d&&i!==d.scrollTop&&(d.scrollTop=i)},A=()=>{const i=(d==null?void 0:d.scrollTop)||0;H(i),l&&i!==l.scrollTop&&(l.scrollTop=i)};l==null||l.addEventListener("scroll",P);d==null||d.addEventListener("scroll",A);P();A();
