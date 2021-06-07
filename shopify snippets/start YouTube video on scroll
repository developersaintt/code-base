const videoFrame = document.querySelector('.video-wrapper iframe');
  const startVideo = function (entries){
    const [entry] = entries;
    if(entry.isIntersecting){
      console.log(entry.target);
      entry.target.src += entry.target.src + "&autoplay=1&muted=1"
    }
  }
  const videoObserver = new IntersectionObserver(startVideo, {
    root: null,
    threshold: 0.3,
  })
  videoObserver.observe(videoFrame);
