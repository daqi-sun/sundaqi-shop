class TierPromotion extends HTMLElement {
    constructor() {
      super();
      this.init();
    }

    init() {
      const orderSections = document.querySelector(".order-summary__sections");
      const tierElem = document.getElementsByTagName("tier-promotion")[0];
      orderSections.insertAdjacentElement('beforeEnd', tierElem);
      this.calculateFreePromotion();
    }

    calculateFreePromotion() {
        setTimeout(function(){
            document.querySelectorAll(".tier-message").forEach(function(i,e){
                i.classList.remove("active")
            });
            const dcOrderTag = document.querySelectorAll("form.edit_checkout .tag__wrapper").length;
            const dcOrderLine = document.querySelectorAll(".order-summary__section--total-lines .total-line-table__tbody .total-line--reduction").length;
            if((dcOrderTag > 0 || dcOrderLine > 0) && false) {
                const tierAmountAttr = document.querySelector("span[data-checkout-payment-due-target]").getAttribute("data-checkout-payment-due-target");
                const tierAmount = parseFloat(tierAmountAttr) / 100;
                if(tierAmount >= 5000) {
                    document.querySelector(".tier-above").classList.add("active");
                } else if(tierAmount >= 3000 && tierAmount < 5000){
                    document.querySelector(".tier-mid").classList.add("active");
                    document.querySelector(".tier-mid span").innerHTML = '$'+parseFloat(5000-tierAmount).toFixed(2);
                } else {
                    document.querySelector(".tier-below span").innerHTML = '$'+parseFloat(3000-tierAmount).toFixed(2);
                    document.querySelector(".tier-below").classList.add("active");
                }
            }
        },100);
    }
}
customElements.define('tier-promotion', TierPromotion);
