class Tabs extends HTMLElement {
  constructor() {
    super();

    this.tabHeaders = this.querySelectorAll("tab-header");
    this.tabDetails = this.querySelectorAll("tab-details");

    this.tabHeaders.forEach((header) => {
      header.addEventListener("click", this.onHeaderClick.bind(this));
    });
  }

  onHeaderClick(event) {
    const header = event.target;
    const tab = header.closest("tab-header");
    const tabDetails = this.querySelector(
      `#Detail-${tab.getAttribute("aria-controls")}`
    );

    this.tabHeaders.forEach((header) => {
      header.removeAttribute("aria-selected");
      header.setAttribute("tabindex", -1);
    });

    this.tabDetails.forEach((details) => {
      details.setAttribute("aria-hidden", true);
    });

    tab.setAttribute("aria-selected", true);
    tab.setAttribute("tabindex", 0);
    tabDetails.removeAttribute("aria-hidden");
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute("open")) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute("open");
    this.mainDetailsToggle
      .querySelector("summary")
      .setAttribute("aria-expanded", false);
  }
}

customElements.define("custom-tabs", Tabs);
