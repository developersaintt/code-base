subscribe(PUB_SUB_EVENTS.cartUpdate, async (event) => {
  const cart = await (await fetch(`${window.routes.cart_url}.js`)).json();
  const cartCheckpointsEl = document.querySelector(
    "#CartCheckpointBarSettings"
  );

  if (!cartCheckpointsEl) return;

  const cartCheckpoints = JSON.parse(cartCheckpointsEl.innerHTML).goals.filter(
    (goal) => goal.product
  );

  const goalsReached = cartCheckpoints.filter(
    (goal) => cart.total_price >= goal.amount
  );

  const unreachedGoals = cartCheckpoints.filter(
    (goal) => cart.total_price < goal.amount
  );

  const giftsToAdd = goalsReached
    .map((goal) => goal.product)
    .filter((product) => {
      return !cart.items.find((item) => item.variant_id == product);
    });

  const giftsToRemove = unreachedGoals
    .map((goal) => goal.product)
    .filter((product) => cart.items.find((item) => item.variant_id == product));

  console.log("giftsToRemove", giftsToRemove);
  console.log("giftsToAdd", giftsToAdd);

  if (giftsToAdd.length) {
    addProductToCart(giftsToAdd[0]);
  }
  if (giftsToRemove.length) {
    const line = cart.items.findIndex(
      (item) => item.variant_id == giftsToRemove[0]
    );
    console.log("line", line + 1);
    removeProductFromCart(line + 1);
  }
});

function addProductToCart(productId) {
  const config = fetchConfig("javascript");
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  delete config.headers["Content-Type"];

  const formData = new FormData();
  formData.append("id", productId);
  const cartDrawer =
    document.querySelector("cart-notification") ||
    document.querySelector("cart-drawer");
  if (cartDrawer) {
    formData.append(
      "sections",
      cartDrawer.getSectionsToRender().map((section) => section.id)
    );
    formData.append("sections_url", window.location.pathname);
    cartDrawer.setActiveElement(document.activeElement);
  }
  config.body = formData;

  fetch(`${routes.cart_add_url}`, config)
    .then((response) => response.json())
    .then((response) => {
      publish(PUB_SUB_EVENTS.cartUpdate, {
        source: "product-form",
        productVariantId: formData.get("id"),
        cartData: response,
      });

      cartDrawer.renderContents(response);
    })
    .catch((e) => {
      console.error(e);
    });
}

function removeProductFromCart(line, quantity = 0) {
  const sectionsToRender = [
    {
      id: "cart-drawer",
      selector: "#CartDrawer",
      section: "cart-drawer",
    },
    {
      id: "cart-icon-bubble",
      section: "cart-icon-bubble",
    },
  ];

  const body = JSON.stringify({
    line,
    quantity,
    sections: sectionsToRender.map((section) => section.id),
    sections_url: window.location.pathname,
  });

  fetch(`${routes.cart_change_url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/json`,
    },
    ...{ body },
  })
    .then((response) => {
      return response.text();
    })
    .then((state) => {
      const parsedState = JSON.parse(state);

      const cartDrawer =
        document.querySelector("cart-notification") ||
        document.querySelector("cart-drawer");
      cartDrawer.renderContents(parsedState);

      publish(PUB_SUB_EVENTS.cartUpdate, {
        source: "cart-items",
        cartData: parsedState,
      });
    });
}
