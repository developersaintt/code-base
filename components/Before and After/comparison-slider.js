if (!customElements.get("comparison-slider")) {
  customElements.define(
    "comparison-slider",
    class ComparisonSlider extends HTMLElement {
      constructor() {
        super();
        this.sliderOverlay = this.querySelector(".comparison-slider__overlay");
        this.sliderLine = this.querySelector(".comparison-slider__line");
        this.sliderInput = this.querySelector(".comparison-slider__input");
        this.sliderInput.addEventListener(
          "input",
          this.updateSlider.bind(this)
        );

        console.log(this.sliderLine);
        console.log(this.sliderInput);
      }

      updateSlider(event) {
        const value = event.target.value;
        this.sliderOverlay.style.width = value + "%";
        this.sliderLine.style.left = value + "%";
      }
    }
  );
}
