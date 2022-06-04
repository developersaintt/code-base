( function blogsSlider(){
    var selectors = {
        swiper : '.blogs-swiper',
        container: '.blog-container',
        navigations:{
            next: `.blog-navigation-next`,
            prev: `.blog-navigation-prev`
        }
    }
    var swiperOptions = {
        slidesPerView: 'auto',
        spaceBetween: 30,
        navigation: {
            nextEl: `${selectors.container} ${selectors.navigations.next}`,
            prevEl: `${selectors.container} ${selectors.navigations.prev}`
        },
        breakpoints: {
            320:{
                slidesPerView: 0.7,
            },
            640:{
                slidesPerView: 2,
                spaceBetween: 15,
            },
            1440:{
                spaceBetween: 50
            }
        }
    }
    var swiper = document.querySelector( selectors.swiper );
    if(!swiper){ return }  // if there is no swiper, return
    new Swiper( swiper, swiperOptions); 
})();



( function imageWithTextSwiper(){
    var selectors = {
        contentSwiper : '.image-with-text-swiper--content',
        imageSwiper: '.image-with-text-swiper--image',
        pagination: '.image-with-text-swiper--content .swiper-pagination',
        container: '.shopify-section--image-with-text-swiper',
        paramsContainer: `.shopify-section--image-with-text-swiper .image-with-text `,
    }
    var contentSliderOptions = {
        slidesPerView: 1,
        thumbs: { swiper: imageSlider },
        pagination: { el: selectors.pagination }, 
        autoplay: {
            delay: document.querySelector( selectors.paramsContainer ) ? document.querySelector( selectors.paramsContainer ).dataset.delay : 1000,
            disableOnInteraction: false
        },
    }

    var imageSwiperOptions = {
        slidesPerView: 1,
        watchslidesProgress: true,
        thumbs: {
            swiper: contentSlider
        }
    }

    var contentSwiper = document.querySelector( selectors.contentSwiper );
    var imagesSwiper = document.querySelector( selectors.imageSwiper );
    if(!imagesSwiper) { return }
    if(!contentSwiper){ return }  // if there is no swiper, return
    var contentSlider = new Swiper( contentSwiper, contentSliderOptions);
    var imageSlider = new Swiper( imagesSwiper, imageSwiperOptions);

    contentSlider.controller.control = imageSlider;
    imageSlider.controller.control = contentSlider;
    // new Swiper( swiper, swiperOptions); 
})();




( function imageWithTextVerticalSwiper(){
    var selectors = {
        contentSwiper : '.image-with-text-v-swiper--content',
        thumbSwiper: '.image-with-text-v-swiper--thumbs',
        container: '.shopify-section--image-with-text-v-swiper',
    };
    var contentSwiperOptions = {
        slidesPerView: 1,
        thumbs: { swiper: thumbSwiper },
        on: {
            slideChangeTransitionEnd: function(){
                thumbSwiper.slideTo(this.activeIndex)
                document.querySelectorAll(selectors.thumbSwiper + ' .swiper-slide').forEach(function(el){
                    el.classList.remove('swiper-slide-active--custom');
                })
                document.querySelectorAll(selectors.thumbSwiper + ` .swiper-slide:nth-of-type(${this.activeIndex + 1})`).forEach(function(el){
                    el.classList.add('swiper-slide-active--custom');
                })
            }
        }
    };

    var thumbOptions = {
        slidesPerView: 3,
        
        watchslidesProgress: true,
        thumbs: { swiper: contentSwiper },
        breakpoints: {
            990:{ direction: "vertical" },
        }
    };

    var contentSwiperEl = document.querySelector( selectors.contentSwiper );
    var thumbSwiperEl = document.querySelector( selectors.thumbSwiper );
    if(!contentSwiperEl) { return }
    if(!thumbSwiperEl){ return }  // if there is no swiper, return
    var contentSwiper = new Swiper( contentSwiperEl, contentSwiperOptions);
    var thumbSwiper = new Swiper( thumbSwiperEl, thumbOptions);
 
    contentSwiper.controller.control = thumbSwiper;
    thumbSwiper.controller.control = contentSwiper;
})();





( function multiColumnSwiper(){
    var selectors = {
        pagination: '.image-with-text-swiper--content .swiper-pagination',
        swiper: '.multicolumn-swiper',
        actions: {
            next: `.multicolumn-swiper__actions .swiper-button-next`,
            prev: `.multicolumn-swiper__actions .swiper-button-prev`,
            pagination: `.multicolumn-swiper__actions .swiper-pagination`
        }
    }
    var swiperOptions = {
        
        loop: true,
        loopedSlides: 3,
        spaceBetween: 30,
        breakpoints: {
            320:{
                slidesPerView: 1,
            },
            640:{
                slidesPerView: 2
            },
            1200:{
                slidesPerView: 3,
            }
        },
        navigation: {
            nextEl: `${selectors.actions.next}`,
            prevEl: `${selectors.actions.prev}`
        },
        pagination: { el: selectors.actions.pagination }, 

    }

    var multicolumn = document.querySelector( selectors.swiper );
    if(!multicolumn) { return }
    var contentSlider = new Swiper( multicolumn, swiperOptions);
})();



( function articleVideo(){
    var selectors = {
        playButton: '.play-article-video',
        heroContainer: '.article-template__hero-container'
    }
    function youtube_parser(url){
        var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match&&match[1].length==11)? match[1] : false;
    }

    var playButton = document.querySelector( selectors.playButton );
    if(!playButton) { return }
    playButton.addEventListener('click', function(){
        var video = playButton.dataset.youtubeVideo;
        var containerHeight = document.querySelector( selectors.heroContainer ).offsetHeight;
        var videoContainer = document.querySelector( selectors.heroContainer );
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${youtube_parser(video)}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0`);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '1');
        iframe.setAttribute('allow', 'autoplay');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', containerHeight);

        videoContainer.innerHTML = '';
        videoContainer.appendChild(iframe);
    })
})();


( function cardProductAddToCart(){
      var selectors = {
        form: document.querySelectorAll('form[data-type="add-to-cart-form"]')
    }
      selectors.form.forEach(function(form){
        form.addEventListener('submit', (e) => addToCart(e))
      });
      function addToCart(e) {
        e.preventDefault();
        var target = e.target;
        var id = target.querySelector('input[name="id"]').value;
        var quantity = target.querySelector('input[name="quantity"]') !== null ?  target.querySelector('input[name="quantity"]').value : '1'
        var items = {items: [{
          id: parseInt(id, 10),
          quantity: parseInt(quantity, 10)
        }]
       };
        var headers =
            {
  			  method: 'POST',
  			  headers: {
                'Content-Type': 'application/json'
               },
              body: JSON.stringify(items)
			}
 fetch('/cart/add.js', headers)
        .then(function(res){
          window.cartFunctions.getCart();
          console.log(res);
        })
        .then((data) => {
            console.log(data);
        })
        .catch(function(err) {
          console.log(err)
        })
     	 }
})();
