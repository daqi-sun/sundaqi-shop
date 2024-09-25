; (function () {
  const htmlToObjectBySelector = (html, selector) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    const el = dom.querySelector(selector);
    let obj = {}
    try {
      obj = JSON.parse(el.innerText.trim());
    } catch (error) {
      console.warn("htmlToObjectBySelector error", error);
    }
    return obj;
  }
  const ShopifyObjectApi = {
    /**
     * Query `templates/customers/account.data.liquid` to get the Liquid object
     * @returns {Promise<object>}
     * @example 
     * {
     *   "customer": {
     *     "email": "name@domain.com"
     *   }
     * }
     */
    async queryLiquidObject() {
      return fetch(`/account?view=data&timestamp=${Date.now()}`, {
        credentials: 'same-origin',
        method: 'GET'
      })
        .then(res => res.text())
        .then((html) => htmlToObjectBySelector(html, "#data"));
    },
  }

  window.ShopifyObjectApi = ShopifyObjectApi;
}())