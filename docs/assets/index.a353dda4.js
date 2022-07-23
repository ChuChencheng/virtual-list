const A=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(e){if(e.ep)return;e.ep=!0;const o=r(e);fetch(e.href,o)}};A();const N="[Virtual List]",Y=20,z=(i,t,r)=>i.slice(t,r).reduce((n,e)=>n+e,0),y=(i,t,r)=>Math.max(t,Math.min(r,i));var g=(i=>(i.TOP="TOP",i.MIDDLE="MIDDLE",i.BOTTOM="BOTTOM",i))(g||{});class G{constructor(t){this.bufferCount=t.bufferCount??Y,t.viewportSize<0&&this.throwError("viewportSize"),t.itemMinSize<=0&&this.throwError("itemMinSize"),t.dataLength<0&&this.throwError("dataLength"),this.bufferCount<=0&&this.throwError("bufferCount");const r=Math.ceil(t.viewportSize/t.itemMinSize);this.estimatedRenderCount=r+this.bufferCount,this.maxScrollableSize=t.dataLength*t.itemMinSize-t.viewportSize,this.options={viewportSize:t.viewportSize,dataLength:t.dataLength,itemMinSize:t.itemMinSize}}throwError(t){throw new Error(`${N} ${t} invalid`)}getRatio({startIndex:t,endIndex:r,visibleItemRealSizeList:n}){const{bufferCount:e,estimatedRenderCount:o}=this,{itemMinSize:s,viewportSize:l}=this.options,u=r-t,p=u!==o;let c=1,a=1;return p?(c=u*s-l,a=z(n,0,n.length)-l,a<=0&&(a=c)):(c=e*s,a=z(n,0,e)||c),a>0&&c>0?a/c:1}getRange(t){const{bufferCount:r,estimatedRenderCount:n}=this,{itemMinSize:e,dataLength:o}=this.options,s=Math.floor(Math.floor(t/e)/r)*r,l=Math.min(n+s,o);return{startIndex:s,endIndex:l}}getOffset({scrolledSize:t,startIndex:r,endIndex:n,visibleItemRealSizeList:e}){const{itemMinSize:o}=this.options,s=this.getRatio({startIndex:r,endIndex:n,visibleItemRealSizeList:e});return t-(t-r*o)*s}getSizeFromViewportStart({position:t,itemSize:r}){const{viewportSize:n}=this.options;let e=0;return typeof t=="number"?e=y(t,0,1):t==="MIDDLE"?e=.5:t==="BOTTOM"&&(e=1),(n-r)*e}getEstimatedRange({dataIndex:t,sizeFromViewportStart:r}){const{estimatedRenderCount:n,bufferCount:e}=this,{itemMinSize:o,dataLength:s}=this.options,l=y(t-Math.ceil(r/o),0,s-1),u=Math.floor(l/e)*e,p=Math.min(n+t,s);return{estimatedStartIndex:u,estimatedEndIndex:p}}getScrolledSizeByEstimatedRange({dataIndex:t,sizeFromViewportStart:r,estimatedStartIndex:n,estimatedEndIndex:e,visibleItemRealSizeList:o}){const{estimatedRenderCount:s,bufferCount:l,maxScrollableSize:u}=this,{itemMinSize:p,dataLength:c}=this.options;let a=t,w=0;for(;w<r&&a>n;)w+=o[--a-n];const h=Math.floor(a/l)*l,T=Math.min(s+h,c),$=o.slice(h-n,T-n),j=this.getRatio({startIndex:h,endIndex:T,visibleItemRealSizeList:$}),k=z($,0,t-h)-r;return y(k/j+h*p,0,u)}}await new Promise(i=>{window.onload=i});const L=[];for(let i=0;i<1e5;i++)L.push({index:i,height:30+i%10*10});const E=document.getElementById("app");E&&(E.innerHTML=`
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
  `);const d=document.querySelector(".virtual-list-viewport"),f=document.querySelector(".virtual-list-viewport-comparison"),v=document.querySelector(".virtual-list-item-container"),S=document.querySelector(".virtual-list-item-container-comparison"),C=document.querySelector(".virtual-list-whole"),R=document.querySelector(".virtual-list-whole-comparison"),I=document.querySelector(".scroll-to-input"),K=document.querySelector(".scroll-to-button"),O=document.querySelector(".scroll-to-position"),W=d?.clientHeight||0,b=L.length,x=30;let q=-1,B=-1;C?.style&&R?.style&&(C.style.height=`${b*x}px`,R.style.height=`${b*x}px`);const m=new G({viewportSize:W,dataLength:b,itemMinSize:x}),M=(i,t)=>{const r=L.slice(i,t),n=[];return v&&S&&((i!==q||t!==B)&&(v.innerHTML=r.map(o=>`
          <div
            class="virtual-list-item"
            style="min-height:${o.height}px;"
          >${o.index}</div>
        `).join(""),S.innerHTML=r.map(o=>`
          <div
            class="virtual-list-item"
            style="min-height:${30}px;"
          >${o.index}</div>
        `).join(""),q=i,B=t),v.querySelectorAll(".virtual-list-item").forEach(o=>{n.push(o.offsetHeight)})),n};let F=0;const V=[g.TOP,g.MIDDLE,g.BOTTOM];K?.addEventListener("click",()=>{const i=I?.value?Number(I?.value):30042,t=V[F%V.length],[r]=M(i,i+1),n=m.getSizeFromViewportStart({position:t,itemSize:r}),{estimatedStartIndex:e,estimatedEndIndex:o}=m.getEstimatedRange({dataIndex:i,sizeFromViewportStart:n}),s=M(e,o),l=m.getScrolledSizeByEstimatedRange({dataIndex:i,sizeFromViewportStart:n,estimatedStartIndex:e,estimatedEndIndex:o,visibleItemRealSizeList:s});d&&(d.scrollTop=l),O&&(O.innerText=t),F++});const D=i=>{const{startIndex:t,endIndex:r}=m.getRange(i),n=M(t,r),e=m.getOffset({scrolledSize:i,startIndex:t,endIndex:r,visibleItemRealSizeList:n}),o=m.getOffset({scrolledSize:i,startIndex:t,endIndex:r,visibleItemRealSizeList:[]});v&&S&&(v.style.transform=`translateY(${e}px)`,S.style.transform=`translateY(${o}px)`)},P=()=>{const i=d?.scrollTop||0;D(i),f&&i!==f.scrollTop&&(f.scrollTop=i)},H=()=>{const i=f?.scrollTop||0;D(i),d&&i!==d.scrollTop&&(d.scrollTop=i)};d?.addEventListener("scroll",P);f?.addEventListener("scroll",H);P();H();
