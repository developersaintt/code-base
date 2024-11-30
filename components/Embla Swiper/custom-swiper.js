customElements.get("custom-swiper") ||
  customElements.define(
    "custom-swiper",
    class extends HTMLElement {
      constructor() {
        super(),
          (this.selectors = {
            embla: ".embla",
            viewport: ".embla__viewport",
            prevButton: "[data-embla-prev]",
            nextButton: "[data-embla-next]",
            dots: ".embla__dots",
          }),
          (this.swiperId = this.getAttribute("id")),
          (this.swiperOptions = this.querySelector("[id^=SwiperOptions]")
            ? JSON.parse(this.querySelector("[id^=SwiperOptions]").innerHTML)
            : {});
        const viewportNode = this.querySelector(this.selectors.viewport),
          dotsNode = this.querySelector(this.selectors.dots),
          prevButtonNode = this.querySelector(this.selectors.prevButton),
          nextButtonNode = this.querySelector(this.selectors.nextButton),
          emblaApi = EmblaCarousel(viewportNode, this.swiperOptions);
        if (nextButtonNode && prevButtonNode) {
          const removePrevNextBtnsClickHandlers =
            this.addPrevNextBtnsClickHandlers(
              emblaApi,
              prevButtonNode,
              nextButtonNode
            );
          emblaApi.on("destroy", removePrevNextBtnsClickHandlers);
        }
        if (dotsNode) {
          const removeDotBtnsAndClickHandlers = this.addDotBtnsAndClickHandlers(
            emblaApi,
            dotsNode
          );
          emblaApi.on("destroy", removeDotBtnsAndClickHandlers);
        }
      }
      addDotBtnsAndClickHandlers = (emblaApi, dotsNode) => {
        let dotNodes = [];
        const addDotBtnsWithClickHandlers = () => {
            dotsNode.innerHTML = emblaApi
              .scrollSnapList()
              .map(() => '<button class="embla__dot" type="button"></button>')
              .join("");
            const scrollTo = (index) => {
              emblaApi.scrollTo(index);
            };
            (dotNodes = Array.from(dotsNode.querySelectorAll(".embla__dot"))),
              dotNodes.forEach((dotNode, index) => {
                dotNode.addEventListener("click", () => scrollTo(index), !1);
              });
          },
          toggleDotBtnsActive = () => {
            const previous = emblaApi.previousScrollSnap(),
              selected = emblaApi.selectedScrollSnap();
            dotNodes[previous].classList.remove("embla__dot--selected"),
              dotNodes[selected].classList.add("embla__dot--selected");
          };
        return (
          emblaApi
            .on("init", addDotBtnsWithClickHandlers)
            .on("reInit", addDotBtnsWithClickHandlers)
            .on("init", toggleDotBtnsActive)
            .on("reInit", toggleDotBtnsActive)
            .on("select", toggleDotBtnsActive),
          () => {
            dotsNode.innerHTML = "";
          }
        );
      };
      addTogglePrevNextBtnsActive = (emblaApi, prevBtn, nextBtn) => {
        const togglePrevNextBtnsState = () => {
          emblaApi.canScrollPrev()
            ? prevBtn.removeAttribute("disabled")
            : prevBtn.setAttribute("disabled", "disabled"),
            emblaApi.canScrollNext()
              ? nextBtn.removeAttribute("disabled")
              : nextBtn.setAttribute("disabled", "disabled");
        };
        return (
          emblaApi
            .on("select", togglePrevNextBtnsState)
            .on("init", togglePrevNextBtnsState)
            .on("reInit", togglePrevNextBtnsState),
          () => {
            prevBtn.removeAttribute("disabled"),
              nextBtn.removeAttribute("disabled");
          }
        );
      };
      addPrevNextBtnsClickHandlers = (emblaApi, prevBtn, nextBtn) => {
        const scrollPrev = () => {
            emblaApi.scrollPrev();
          },
          scrollNext = () => {
            emblaApi.scrollNext();
          };
        prevBtn.addEventListener("click", scrollPrev, !1),
          nextBtn.addEventListener("click", scrollNext, !1);
        const removeTogglePrevNextBtnsActive = this.addTogglePrevNextBtnsActive(
          emblaApi,
          prevBtn,
          nextBtn
        );
        return () => {
          removeTogglePrevNextBtnsActive(),
            prevBtn.removeEventListener("click", scrollPrev, !1),
            nextBtn.removeEventListener("click", scrollNext, !1);
        };
      };
    }
  );
