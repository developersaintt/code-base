(function animatedBelts(){
  var selectors = {
    swiper: '.animated-belts-swiper',
    delay: '[data-delay]',
    section: '[id^="AnimatedBelts-"]'
  }

  var swiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
    effect: 'fade',
    loop: true,
    fadeEffect: {
      crossFade: true
    },
  }
  var sections = document.querySelectorAll(selectors.section);
  
  if(sections.length == 0) return;


  sections.forEach(section => {
    var animatedBeltsSwiper = section.querySelector(selectors.swiper);
    swiperOptions['autoplay'] = { 'delay': parseFloat(animatedBeltsSwiper.dataset.delay), disableOnInteraction: false };
    new Swiper(animatedBeltsSwiper, swiperOptions)
  })

})();


(function ajaxAddToCart(){
  let selectors = {
    trigger: "[ajax-add-to-cart]",
  }

  const triggers = document.querySelectorAll(selectors.trigger);

  if(!triggers.length > 0){ return }

  triggers.forEach(trigger => trigger.addEventListener('click', () => {
    if(trigger.closest('.grid-product')){
      const productId = trigger.closest('.grid-product').querySelector('.grid-product__form select[name="id"]').selectedOptions[0].value;
      
      let formData = {
        'items': [{
        'id': parseFloat(productId),
        'quantity': 1
        }]
      };
      
      fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        document.dispatchEvent(new CustomEvent('ajaxProduct:added', {
          detail: {
            product: data.items[0],
            addToCartBtn: this.addPackToCartBtn
          }
        }))
      })
      .catch((error) => {
        console.error('Error:', error);
      })

    }
  }));


})();