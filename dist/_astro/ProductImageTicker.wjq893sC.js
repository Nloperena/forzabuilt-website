import{j as l}from"./jsx-runtime.ClP7wGfN.js";import{r as u}from"./index.DK-fsZOb.js";import{c as k}from"./clsx.B-dksMZM.js";function R({items:o,speed:x=72,direction:w="left",className:j,gapClass:T="gap-4 md:gap-6 lg:gap-8"}){const v=u.useRef(null),y=u.useRef(null),q=u.useMemo(()=>[...o,...o,...o],[o]);return u.useEffect(()=>{const e=y.current,a=v.current;if(!e||!a)return;let i=null,n=null,s=!1,m=!1,t=null,f=!1,c=null;a.style.setProperty("--marquee-duration","20s"),a.style.setProperty("--marquee-distance","0px"),e.style.animationPlayState="paused";const d=()=>{e.style.animationPlayState="running",e.classList.add("will-change-transform")},h=()=>{if(s&&m&&c!==null){const r=Date.now()-c,p=200;if(r>=p)d();else{const g=p-r;t&&clearTimeout(t),t=setTimeout(()=>{s&&m&&d()},g)}}},b=()=>{n&&cancelAnimationFrame(n),n=requestAnimationFrame(()=>{const r=e.scrollWidth/3;if(r>0){const g=Math.max(6,r/x);a.style.setProperty("--marquee-duration",`${g}s`),a.style.setProperty("--marquee-distance",`${r}px`),s||(s=!0,h())}n=null})},P=new IntersectionObserver(([r])=>{m=r.isIntersecting,r.isIntersecting?(i||(i=new ResizeObserver(b),i.observe(e),b()),f?s&&h():(f=!0,c=Date.now(),t&&clearTimeout(t),t=setTimeout(()=>{s&&m&&d()},200))):(e.style.animationPlayState="paused",t&&(clearTimeout(t),t=null),f=!1,c=null)},{threshold:.01});return P.observe(a),()=>{n&&cancelAnimationFrame(n),t&&clearTimeout(t),i&&i.disconnect(),P.disconnect()}},[x,w]),l.jsxs("section",{"aria-label":"Product image ticker",className:k("relative w-full -mt-16 md:-mt-20 lg:-mt-24 xl:-mt-32 2xl:-mt-36 pb-0 z-20","bg-white",j),style:{background:"linear-gradient(to bottom, transparent 0%, transparent 50%, #fff 50%, #fff 100%)",paddingBottom:0},children:[l.jsxs("div",{ref:v,className:"relative overflow-hidden mt-6 md:mt-8 lg:mt-9 xl:mt-10 2xl:-mt-16",children:[l.jsx("div",{className:"pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 lg:w-32 xl:w-40 z-10 [mask-image:linear-gradient(to_right,rgba(0,0,0,0),#000_40%)]"}),l.jsx("div",{className:"pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 lg:w-32 xl:w-40 z-10 [mask-image:linear-gradient(to_left,rgba(0,0,0,0),#000_40%)]"}),l.jsx("div",{ref:y,className:k("flex items-center whitespace-nowrap gap-0","hover:[animation-play-state:paused]"),style:{animation:`marquee-pixel-${w} var(--marquee-duration, 20s) linear infinite`,animationPlayState:"paused"},children:q.map((e,a)=>l.jsx("figure",{className:"shrink-0",children:l.jsx("div",{className:"relative w-[clamp(8rem,20vw,12rem)] h-[clamp(8rem,20vw,12rem)] md:w-[clamp(10rem,22vw,14rem)] md:h-[clamp(10rem,22vw,14rem)] lg:w-[clamp(6.5rem,16vw,22rem)] lg:h-[clamp(6.5rem,20vw,22rem)] xl:w-[clamp(4.5rem,14vw,18rem)] xl:h-[clamp(4.5rem,18vw,18rem)]",style:{aspectRatio:"1 / 1"},children:l.jsx("img",{src:e.src,alt:e.alt,className:"w-full h-full object-contain transition-transform duration-300 hover:scale-105",loading:a<6?"eager":"lazy",style:{transform:e.src.includes("/t")?"translateY(10%)":"none"}})})},`${e.src}-${a}`))})]}),l.jsx("style",{children:`
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
      `})]})}export{R as default};
