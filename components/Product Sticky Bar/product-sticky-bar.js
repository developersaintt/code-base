(function () {
  const selectors = {
    stickyBar: ".Product__StickyBar",
    stickyBarItem: ".Product__StickyBarItem",
    stickyBarLink: ".Product__StickyBarLink",
  };

  const stickyBarLinks = document.querySelectorAll(selectors.stickyBarLink);
  const stickyBar = document.querySelector(selectors.stickyBar);

  stickyBarLinks.forEach((link) => {
    const sectionPosition = link.getAttribute("data-section-position");
    const sectionId = document
      .querySelector(`main .shopify-section:nth-of-type(${sectionPosition})`)
      .getAttribute("id");
    link.setAttribute("data-section-id", `#${sectionId}`);

    link.addEventListener("click", (event) => {
      event.preventDefault();

      const section = document.querySelector(
        link.getAttribute("data-section-id")
      );

      setTimeout(() => {
        const y = section.getBoundingClientRect().top + window.scrollY - 150;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100); // 100ms delay, adjust as needed

      stickyBarLinks.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");

      console.log(link);
      // setTimeout(() => {
      //   link.scrollIntoView({
      //     behavior: "smooth",
      //   });
      // }, 300);
    });
  });

  const allSections = document.querySelectorAll("main .shopify-section");

  allSections.forEach((section) => {
    const makeFormSticky = function (entries) {
      const [entry] = entries;
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute("id");
        const stickyBarItem = document.querySelector(
          `${selectors.stickyBarLink}[data-section-id="#${sectionId}"]`
        );

        if (!stickyBarItem) return;

        stickyBarLinks.forEach((item) => item.classList.remove("is-active"));
        stickyBarItem.classList.add("is-active");
        console.log(stickyBarItem);

        // Checking if stickyBarItem out of view

        if (
          stickyBarItem.getBoundingClientRect().left +
            stickyBarItem.getBoundingClientRect().width >
            window.innerWidth &&
          stickyBarItem.getBoundingClientRect().left > 0
        ) {
          stickyBar.scrollTo({
            left:
              stickyBarItem.getBoundingClientRect().left +
              stickyBarItem.getBoundingClientRect().width -
              window.innerWidth +
              stickyBar.scrollLeft +
              50,
          });
        } else if (stickyBarItem.getBoundingClientRect().left < 0) {
          stickyBar.scrollTo({
            left:
              stickyBar.scrollLeft -
              Math.abs(stickyBarItem.getBoundingClientRect().left) -
              50,
          });
        }
      }
    };
    const stickyFormObserver = new IntersectionObserver(makeFormSticky, {
      root: null,
      threshold: 0.2,
    });
    stickyFormObserver.observe(section);
  });
})();
