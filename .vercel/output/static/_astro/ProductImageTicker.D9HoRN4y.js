import{j as e}from"./jsx-runtime.CFwp3VtB.js";import{r as c}from"./index.BZ7XLWeh.js";import{c as I}from"./clsx.B-dksMZM.js";import{I as T}from"./ImageSkeleton.spSjCl9Z.js";import{O as N}from"./OptimizedImage.D9LCnBRZ.js";const S=({item:s,index:p,priority:o})=>{const[d,x]=c.useState(!1);return e.jsx("figure",{className:"shrink-0",children:e.jsxs("div",{className:"relative w-[clamp(8rem,20vw,12rem)] h-[clamp(8rem,20vw,12rem)] md:w-[clamp(10rem,22vw,14rem)] md:h-[clamp(10rem,22vw,14rem)] lg:w-[clamp(6.5rem,16vw,22rem)] lg:h-[clamp(6.5rem,20vw,22rem)] xl:w-[clamp(4.5rem,14vw,18rem)] xl:h-[clamp(4.5rem,18vw,18rem)]",style:{aspectRatio:"1 / 1"},children:[!d&&e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx(T,{className:"w-3/4 h-3/4 opacity-50"})}),e.jsx(N,{src:s.src,alt:s.alt,width:384,height:384,mobileWidth:256,sizes:"(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px",className:`w-full h-full object-contain transition-all duration-500 hover:scale-105 ${d?"opacity-100":"opacity-0"}`,loading:o?"eager":"lazy",fetchPriority:o?"high":void 0,onLoad:()=>x(!0),onError:()=>x(!0),style:{transform:s.src.includes("/t")?"translateY(10%)":"none"}})]})})};function O({items:s,speed:p=72,direction:o="left",className:d,gapClass:x="gap-4 md:gap-6 lg:gap-8"}){const v=c.useRef(null),b=c.useRef(null),q=c.useMemo(()=>[...s,...s,...s],[s]);return c.useEffect(()=>{const a=b.current,r=v.current;if(!a||!r)return;let m=null,n=null,l=!1,u=!1,t=null,g=!1,f=null;r.style.setProperty("--marquee-duration","20s"),r.style.setProperty("--marquee-distance","0px"),a.style.animationPlayState="paused";const h=()=>{a.style.animationPlayState="running",a.style.willChange="transform"},j=()=>{if(l&&u&&f!==null){const i=Date.now()-f,w=50;if(i>=w)h();else{const y=w-i;t&&clearTimeout(t),t=setTimeout(()=>{l&&u&&h()},y)}}},P=()=>{n&&cancelAnimationFrame(n),n=requestAnimationFrame(()=>{const i=a.scrollWidth/3;if(i>0){const y=Math.max(6,i/p);r.style.setProperty("--marquee-duration",`${y}s`),r.style.setProperty("--marquee-distance",`${i}px`),l||(l=!0,j())}n=null})},k=new IntersectionObserver(([i])=>{u=i.isIntersecting,i.isIntersecting?(m||(m=new ResizeObserver(P),m.observe(a),P()),g?l&&j():(g=!0,f=Date.now(),t&&clearTimeout(t),t=setTimeout(()=>{l&&u&&h()},200))):(a.style.animationPlayState="paused",t&&(clearTimeout(t),t=null),g=!1,f=null)},{threshold:.01});return k.observe(r),()=>{n&&cancelAnimationFrame(n),t&&clearTimeout(t),m&&m.disconnect(),k.disconnect()}},[p,o]),e.jsxs("section",{"aria-label":"Product image ticker",className:I("relative w-full -mt-16 md:-mt-20 lg:-mt-24 xl:-mt-32 2xl:-mt-36 pb-0 z-20","bg-white",d),style:{background:"linear-gradient(to bottom, transparent 0%, transparent 50%, #fff 50%, #fff 100%)",paddingBottom:0},children:[e.jsxs("div",{ref:v,className:"relative overflow-hidden mt-6 md:mt-8 lg:mt-9 xl:mt-10 2xl:-mt-16",children:[e.jsx("div",{className:"pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 lg:w-32 xl:w-40 z-10 [mask-image:linear-gradient(to_right,rgba(0,0,0,0),#000_40%)]"}),e.jsx("div",{className:"pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 lg:w-32 xl:w-40 z-10 [mask-image:linear-gradient(to_left,rgba(0,0,0,0),#000_40%)]"}),e.jsx("div",{ref:b,className:I("flex items-center whitespace-nowrap gap-0","hover:[animation-play-state:paused]"),style:{animation:`marquee-pixel-${o} var(--marquee-duration, 20s) linear infinite`,animationPlayState:"paused"},children:q.map((a,r)=>e.jsx(S,{item:a,index:r,priority:r<6},`${a.src}-${r}`))})]}),e.jsx("style",{children:`
        @keyframes marquee-pixel-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-1 * var(--marquee-distance, 0px)));
          }
        }
        
        @keyframes marquee-pixel-right {
          0% {
            transform: translateX(calc(-1 * var(--marquee-distance, 0px)));
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          [aria-label='Product image ticker'] div[class*='animate-'] {
            animation: none !important;
          }
          [aria-label='Product image ticker'] > div {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          }
          [aria-label='Product image ticker'] figure {
            scroll-snap-align: center;
          }
        }
      `})]})}export{O as default};
