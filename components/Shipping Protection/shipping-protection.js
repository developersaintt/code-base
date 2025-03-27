if (!customElements.get("shipping-protection")) {
  class ShippingProtection extends HTMLElement {
    constructor() {
      super();

      this.input = this.querySelector("input");
      this.checkoutButtonOverlay = document.querySelector(
        ".checkout-button-overlay"
      );

      (async () => {
        await this.getShippingProduct();
        await this.fetchCart();
        this.removeShippingProduct();
      })();

      this.checkoutButtonOverlay.addEventListener(
        "click",
        this.handleCheckoutButtonClick.bind(this)
      );

      // this.removedShippingProduct =
      //   sessionStorage.getItem("removedShippingProduct") ?? false;

      // (async () => {
      //   await this.getShippingProduct();
      //   await this.fetchCart();
      //   this.autoCheck();

      //   document.addEventListener("cart:refresh", (event) => {
      //     cart = event.detail.cart;
      //     if (cart.items.length == 0) return;
      //     if (
      //       cart.items.length == 1 &&
      //       cart.items[0].product_id == this.shippingProduct.id
      //     ) {
      //       this.removeShippingProduct();
      //     }
      //   });

      //   const cartRes = await fetch("/cart.js");
      //   cart = await cartRes.json();
      //   if (cart.items.length == 0) return;
      //   if (
      //     cart.items.length == 1 &&
      //     cart.items[0].product_id == this.shippingProduct.id
      //   ) {
      //     this.removeShippingProduct();
      //   }
      // })();

      // this.input.addEventListener("change", () => {
      //   this.input.checked
      //     ? this.addShippingProduct()
      //     : this.removeShippingProduct();
      // });
    }

    async autoCheck() {
      let cart;
      document.addEventListener("cart:refresh", (event) => {
        cart = event.detail.cart;
        if (
          !cart.items.find((itm) => itm.product_id == this.shippingProduct.id)
        ) {
          sessionStorage.getItem("removedShippingProduct") != "true" &&
            this.addShippingProduct();
          return;
        }
      });

      const cartRes = await fetch("/cart.js");
      cart = await cartRes.json();
      if (
        !cart.items.find((itm) => itm.product_id == this.shippingProduct.id)
      ) {
        sessionStorage.getItem("removedShippingProduct") != "true" &&
          this.addShippingProduct();
        return;
      }
    }

    async fetchCart() {
      document.addEventListener(
        "cart:refresh",
        (event) => (this.cart = event.detail.cart)
      );

      const res = await fetch("/cart.js");
      this.cart = await res.json();
    }

    async getShippingProduct() {
      const productHandle = this.getAttribute("data-product-handle");

      const res = await fetch(`/products/${productHandle}.js`);
      this.shippingProduct = await res.json();

      console.log("this.shippingProduct", this.shippingProduct);
    }

    async addShippingProduct() {
      const variant =
        this.shippingProduct.variants[
          Math.min(
            this.cart.item_count,
            this.cart.items.reduce((sum, itm) => {
              return itm.product_id == this.shippingProduct.id
                ? sum
                : sum + itm.quantity;
            }, 0) - 1
          )
        ];

      await fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: variant.id, quantity: 1 }] }),
      });

      const cartRes = await fetch("/cart.js");
      const cartData = await cartRes.json();

      fetch("/?sections=cart-drawer,cart-item-count")
        .then((res) => res.json())
        .then((cart) => window.refreshCart({ ...cartData, sections: cart }));
    }

    async removeShippingProduct() {
      const shippingProductId = this.cart.items.find(
        (itm) => itm.product_id == this.shippingProduct.id
      );
      if (!shippingProductId) return;
      let updates = { [shippingProductId.id]: 0 };

      console.log("remove insurance");
      console.log(shippingProductId);

      await fetch(window.Shopify.routes.root + "cart/update.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      this.removedShippingProduct = true;
      sessionStorage.setItem("removedShippingProduct", true);

      fetch("/cart.js")
        .then((res) => res.json())
        .then((cart) => (this.cart = cart));

      fetch("/?sections=cart-drawer,cart-item-count")
        .then((res) => res.json())
        .then((cart) => window.refreshCart({ sections: cart }));
    }

    handleCheckoutButtonClick() {
      if (!this.input.checked) {
        this.checkoutButtonOverlay.parentElement.querySelector("form").submit();
        return;
      }

      console.log(this.shippingProduct);
      console.log(this.shippingProduct.variants);

      const variant =
        this.shippingProduct.variants[
          Math.min(
            this.cart.item_count,
            this.cart.items.reduce((sum, itm) => {
              return itm.product_id == this.shippingProduct.id
                ? sum
                : sum + itm.quantity;
            }, 0) - 1
          )
        ];

      console.log(variant);
      let formData = {
        items: [
          {
            id: variant.id,
            quantity: 1,
          },
        ],
      };

      fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          this.checkoutButtonOverlay.parentElement
            .querySelector("form")
            .submit();
        });
    }
  }

  customElements.define("shipping-protection", ShippingProtection);
}
