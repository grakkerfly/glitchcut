// script.js - Thumbnail + modal (arquivos: videos/vid1.mp4 ...)

function pauseAllVideos(){
  document.querySelectorAll('video').forEach(v=>{ try{ v.pause(); v.currentTime=0; }catch(e){} });
}

function createFlash(color,duration,zIndex){
  const flash=document.createElement('div');
  flash.className=`flash flash-${color}`;
  flash.style.animation=`flash-animation ${duration}ms forwards`;
  flash.style.zIndex=zIndex;
  document.getElementById('flash-container').appendChild(flash);
  setTimeout(()=>{ if(flash.parentNode) flash.parentNode.removeChild(flash); },duration);
}

function initPortal(){
  if(!document.querySelector('.portal-page')) return;
  const portal=document.getElementById('portal');
  const vortex=document.getElementById('vortex');
  const glitchInterval=setInterval(()=>{ document.body.style.transform=`translate(${Math.random()*4-2}px, ${Math.random()*4-2}px)`; },100);
  portal.addEventListener('click',()=>{
    clearInterval(glitchInterval);
    createFlash('white',100,11); setTimeout(()=>createFlash('purple',100,11),50); setTimeout(()=>createFlash('white',100,11),100); setTimeout(()=>createFlash('purple',150,11),150);
    createPurpleMatrixEffect();
    vortex.style.animation="vortex 1s forwards"; vortex.style.opacity="1";
    document.body.style.transform='scale(1.2)'; document.body.style.filter='blur(3px)';
    setTimeout(()=>window.location.href='main.html',900);
  });
  function createPurpleMatrixEffect(){
    const chars='01010101010101010101';
    const container=document.getElementById('flash-container');
    for(let i=0;i<50;i++){ setTimeout(()=>{ const char=document.createElement('div'); char.className='matrix-char'; char.textContent=chars[Math.floor(Math.random()*chars.length)]; char.style.left=`${Math.random()*100}%`; char.style.animationDuration=`${Math.random()*2+1}s`; container.appendChild(char); setTimeout(()=>{ if(char.parentNode) char.parentNode.removeChild(char); },3000); }, i*50); }
  }
}

function initMain(){
  if(!document.querySelector('.main-page')) return;
  const mediaData=[];
  for(let i=1;i<=10;i++) mediaData.push({type:'image', src:`memes/meme${i}.png`, id:`meme-${i}`});
  for(let i=1;i<=10;i++) mediaData.push({type:'video', src:`videos/vid${i}.mp4`, id:`vid-${i}`});

  const container=document.getElementById('media-container');
  const modal=document.getElementById('media-modal');
  const closeBtn=document.querySelector('.close');
  const flashOverlay=document.getElementById('flash-overlay');
  const bgVideo=document.getElementById('bg-video');
  if(bgVideo) bgVideo.play().catch(e=>console.log('BG play failed',e));

  let flashInterval=setInterval(()=>{ setTimeout(()=>{ flashOverlay.style.opacity='0.7'; setTimeout(()=>{ flashOverlay.style.opacity='0'; setTimeout(()=>{ flashOverlay.style.opacity='0.7'; setTimeout(()=>{ flashOverlay.style.opacity='0'; },50); },100); },50); }, Math.random()*1000); }, 3200);

  mediaData.forEach((media,index)=>{
    const mediaElement=document.createElement('div');
    mediaElement.className='media-item'; mediaElement.id=media.id;

    const loadMedia=()=> new Promise(resolve=>{
      if(media.type==='image'){
        const img=new Image();
        img.onload=function(){ const maxSize=200, w=this.width, h=this.height; mediaElement.style.width = w>h?`${maxSize}px`:`${(w/h)*maxSize}px`; mediaElement.style.height = w>h?`${(h/w)*maxSize}px`:`${maxSize}px`; const imgEl=document.createElement('img'); imgEl.src=media.src; imgEl.alt=''; mediaElement.appendChild(imgEl); resolve(); };
        img.onerror=function(){ mediaElement.style.width='200px'; mediaElement.style.height='200px'; mediaElement.style.backgroundColor='#333'; mediaElement.style.display='flex'; mediaElement.style.alignItems='center'; mediaElement.style.justifyContent='center'; mediaElement.innerHTML='🖼️'; resolve(); };
        img.src=media.src;
      } else {
        mediaElement.style.width='200px'; mediaElement.style.height='200px';
        const thumbnailContainer=document.createElement('div');
        thumbnailContainer.className='video-thumbnail'; thumbnailContainer.style.width='100%'; thumbnailContainer.style.height='100%'; thumbnailContainer.style.position='relative'; thumbnailContainer.style.background='#111'; thumbnailContainer.style.display='flex'; thumbnailContainer.style.alignItems='center'; thumbnailContainer.style.justifyContent='center';

        const videoForThumb=document.createElement('video');
        videoForThumb.src = media.src;
        videoForThumb.muted = true;
        videoForThumb.preload = 'auto';
        videoForThumb.playsInline = true;
        videoForThumb.crossOrigin = 'anonymous';
        videoForThumb.style.display='none';
        document.body.appendChild(videoForThumb);

        let thumbTimeout = setTimeout(()=>{
          if(!thumbnailContainer.querySelector('img')){
            thumbnailContainer.innerHTML='🎬 VIDEO'; thumbnailContainer.style.fontSize='24px';
            try{ if(videoForThumb.parentNode) videoForThumb.remove(); }catch(e){}
          }
        }, 3000);

        videoForThumb.addEventListener('loadedmetadata', ()=>{
          try{ videoForThumb.currentTime = 0.05; }catch(e){ setTimeout(()=>{ try{ videoForThumb.currentTime = 0.05; }catch(_){} }, 150); }
        });

        videoForThumb.addEventListener('seeked', ()=>{
          try{
            const canvas=document.createElement('canvas');
            canvas.width = videoForThumb.videoWidth || 160;
            canvas.height = videoForThumb.videoHeight || 90;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoForThumb, 0, 0, canvas.width, canvas.height);
            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = canvas.toDataURL('image/png');
            thumbnailImg.style.width='100%'; thumbnailImg.style.height='100%'; thumbnailImg.style.objectFit='cover';
            thumbnailContainer.appendChild(thumbnailImg);
            mediaElement.dataset.thumb = thumbnailImg.src;
          }catch(e){
            thumbnailContainer.innerHTML='🎬 VIDEO'; thumbnailContainer.style.fontSize='24px';
          }finally{
            clearTimeout(thumbTimeout);
            try{ if(videoForThumb.parentNode) videoForThumb.remove(); }catch(e){}
          }
        });

        videoForThumb.addEventListener('error', ()=>{ clearTimeout(thumbTimeout); thumbnailContainer.innerHTML='🎬 VIDEO'; thumbnailContainer.style.fontSize='24px'; try{ if(videoForThumb.parentNode) videoForThumb.remove(); }catch(e){} });

        try{ videoForThumb.load(); }catch(e){ console.log('videoForThumb.load() failed',e); }

        const playIcon=document.createElement('div'); playIcon.className='video-play-icon'; playIcon.innerHTML='▶';
        playIcon.style.position='absolute'; playIcon.style.top='50%'; playIcon.style.left='50%'; playIcon.style.transform='translate(-50%,-50%)'; playIcon.style.fontSize='40px'; playIcon.style.color='white'; playIcon.style.textShadow='0 0 10px rgba(0,0,0,0.7)'; playIcon.style.zIndex='10';
        thumbnailContainer.appendChild(playIcon);
        mediaElement.appendChild(thumbnailContainer);
        resolve();
      }
    });

    mediaElement.style.left = `${Math.random()*(window.innerWidth-200)}px`;
    mediaElement.style.top = `${Math.random()*(window.innerHeight-200)}px`;
    mediaElement.addEventListener('click', ()=> openModal(media));
    loadMedia().then(()=>{ container.appendChild(mediaElement); startBounceAnimation(mediaElement,index); });
  });

  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });
  setInterval(()=>{ document.body.style.transform=`translate(${Math.random()*4-2}px, ${Math.random()*4-2}px)`; }, 200);

  function closeModal(){
    modal.style.display='none';
    const v=document.querySelector('#modal-media video'); if(v){ try{ v.pause(); v.currentTime=0; }catch(e){} }
    if(bgVideo) bgVideo.play().catch(e=>console.log('BG play fail',e));
  }

  function openModal(media){
    pauseAllVideos();
    const mediaContainer=document.getElementById('modal-media'); mediaContainer.innerHTML='';

    if(media.type==='image'){
      const img=document.createElement('img'); img.src=media.src; img.alt='';
      const temp=new Image(); temp.onload=function(){ const max=500,w=this.width,h=this.height; img.style.width=w>h?`${max}px`:`${(w/h)*max}px`; img.style.height=w>h?`${(h/w)*max}px`:`${max}px`; };
      temp.onerror=function(){ img.style.maxWidth='500px'; img.style.maxHeight='500px'; };
      temp.src=media.src; mediaContainer.appendChild(img);
    } else {
      const video=document.createElement('video');
      video.src = media.src; video.controls = true; video.playsInline = true; video.preload = 'auto';
      video.style.maxWidth='500px'; video.style.maxHeight='500px';
      try{ const thumbEl = document.getElementById(media.id); if(thumbEl && thumbEl.dataset && thumbEl.dataset.thumb) video.poster = thumbEl.dataset.thumb; }catch(e){}
      video.addEventListener('error', (ev)=>{ console.log('Modal video error', ev); mediaContainer.innerHTML = '<div style="color:#fff;padding:20px">Erro ao carregar vídeo.</div>'; });
      mediaContainer.appendChild(video);
      try{ video.load(); }catch(e){ console.log('video.load failed', e); }
    }

    modal.style.display='block'; if(bgVideo) bgVideo.pause();
  }

  function startBounceAnimation(element,index){
    let baseSpeed=2; let speedX=(Math.random()-0.5)*baseSpeed; let speedY=(Math.random()-0.5)*baseSpeed;
    function animate(){ if(!element.parentNode) return; const rect=element.getBoundingClientRect(); let newX=parseFloat(element.style.left)+speedX; let newY=parseFloat(element.style.top)+speedY; if(newX<=0||newX>=window.innerWidth-rect.width){ speedX=-speedX; element.style.filter='brightness(500%)'; setTimeout(()=>{ element.style.filter=''; },50); } if(newY<=0||newY>=window.innerHeight-rect.height){ speedY=-speedY; element.style.filter='brightness(500%)'; setTimeout(()=>{ element.style.filter=''; },50); } element.style.left=`${newX}px`; element.style.top=`${newY}px`; requestAnimationFrame(animate); }
    animate();
  }

  window.addEventListener('beforeunload', ()=> clearInterval(flashInterval));
}

document.addEventListener('DOMContentLoaded', ()=>{ initPortal(); initMain(); });