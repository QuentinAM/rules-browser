import"./index-7b34e3b2.js";function b(a){const n=a-1;return n*n*n+1}function _(a,{delay:n=0,duration:e=400,easing:i=b}={}){const t=getComputedStyle(a),d=+t.opacity,r=parseFloat(t.height),s=parseFloat(t.paddingTop),c=parseFloat(t.paddingBottom),m=parseFloat(t.marginTop),g=parseFloat(t.marginBottom),l=parseFloat(t.borderTopWidth),p=parseFloat(t.borderBottomWidth);return{delay:n,duration:e,easing:i,css:o=>`overflow: hidden;opacity: ${Math.min(o*20,1)*d};height: ${o*r}px;padding-top: ${o*s}px;padding-bottom: ${o*c}px;margin-top: ${o*m}px;margin-bottom: ${o*g}px;border-top-width: ${o*l}px;border-bottom-width: ${o*p}px;`}}function $(a,{delay:n=0,duration:e=400,easing:i=b,start:t=0,opacity:d=0}={}){const r=getComputedStyle(a),s=+r.opacity,c=r.transform==="none"?"":r.transform,m=1-t,g=s*(1-d);return{delay:n,duration:e,easing:i,css:(l,p)=>`
			transform: ${c} scale(${1-m*p});
			opacity: ${s-g*p}
		`}}const u="/_app/immutable/assets/spinner-15dea833.png";export{u as S,$ as a,_ as s};