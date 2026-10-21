function lineChart(cv,series){
  const dpr=devicePixelRatio||1,w=cv.clientWidth||500,h=cv.clientHeight||220;cv.width=w*dpr;cv.height=h*dpr;
  const g=cv.getContext('2d');g.scale(dpr,dpr);
  const cs=getComputedStyle(document.documentElement),tc=cs.getPropertyValue('--mut').trim(),gc=cs.getPropertyValue('--bd').trim();
  const pts=series.flatMap(s=>s.data);g.font='12px system-ui';g.fillStyle=tc;
  if(!pts.length){g.fillText('Belum ada data — tambahkan pencatatan pertama Anda',w/2-140,h/2);return}
  const ys=pts.map(p=>p.y),xs=pts.map(p=>p.x);let mn=Math.min(...ys),mx=Math.max(...ys);if(mn===mx){mn--;mx++}
  const pd=(mx-mn)*.15;mn-=pd;mx+=pd;const x0=Math.min(...xs),x1=Math.max(...xs),L=40,R=12,T=12,Bt=24;
  const X=x=>x1===x0?L+(w-L-R)/2:L+(w-L-R)*(x-x0)/(x1-x0),Y=y=>T+(h-T-Bt)*(1-(y-mn)/(mx-mn));
  g.strokeStyle=gc;g.lineWidth=1;
  for(let i=0;i<=4;i++){const y=T+(h-T-Bt)*i/4;g.beginPath();g.moveTo(L,y);g.lineTo(w-R,y);g.stroke();g.fillText((mx-(mx-mn)*i/4).toFixed(mx-mn<10?1:0),4,y+4)}
  const fd=x=>new Date(x).toLocaleDateString('id-ID',{day:'numeric',month:'short'});g.fillText(fd(x0),L,h-6);if(x1!==x0)g.fillText(fd(x1),w-R-34,h-6);
  series.forEach((s,i)=>{g.strokeStyle=g.fillStyle=s.color;g.lineWidth=2;g.beginPath();
    s.data.forEach((p,j)=>j?g.lineTo(X(p.x),Y(p.y)):g.moveTo(X(p.x),Y(p.y)));g.stroke();
    s.data.forEach(p=>{g.beginPath();g.arc(X(p.x),Y(p.y),3.5,0,7);g.fill()});
    g.fillText('● '+s.label,L+i*120,T+10)});
}
const ts=(d,t)=>new Date(d+'T'+(t||'00:00')).getTime();
