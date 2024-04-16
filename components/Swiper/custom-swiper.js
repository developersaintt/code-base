if (!customElements.get("custom-swiper")) {
  customElements.define(
    "custom-swiper",

    class CustomSwiper extends HTMLElement {
      constructor() {
        super();

        this.swiperId = this.getAttribute("id");
        this.swiperOptions = JSON.parse(
          this.querySelector("[id^=SwiperOptions]").innerHTML
        );
        new Swiper(`#${this.swiperId} .swiper`, this.swiperOptions);
      }
    }
  );
}
