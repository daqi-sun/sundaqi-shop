document.addEventListener("alpine:init", () => {
  Alpine.data("fallSaleFlash", () => ({
    email: "",
    errMsg: "",
    submitSuccess: false,
    async postEcoflowSubscribeApiAndSubmitForm() {
      this.errMsg = "";

      const isEmailValid = validateEmail(this.email);

      if (!isEmailValid) {
        this.errMsg = "Please enter a valid email address";
        return;
      }

      // Functions from subscription-form-common.js
      const fieldsArray = createFieldsArray(fallSaleSettingJsons);
      const contactListId = getContactListId(fallSaleSettingJsons);

      // Extract theme global variables from theme.liquid
      const { apiUrl, acceptedLanguage, apiKey, xAppid } =
        theme.emailSubscription;

      const apiBody = {
        email: this.email,
        contactListId,
        fields: fieldsArray,
      };
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            // Header global settings are defined in pdp-subscription-form.liquid
            // Except traceId is defined in subscription-form-common.js
            "Content-Type": "application/json",
            apiKey: apiKey,
            traceId: traceId,
            "X-appid": xAppid,
            "Accepted-Language": acceptedLanguage,
          },
          body: JSON.stringify(apiBody),
        });

        const data = await response.json();

        if (data.message === "Success") {
          document
            .getElementById("fall-sale-flash-subscription-submit-hidden")
            .click();
        } else {
          this.errMsg =
            "Oops... Something went wrong, please refresh and try again.";
        }
      } catch (error) {
        this.errMsg =
          "Oops... Something went wrong, please refresh and try again.";
        console.log(error);
      }
    },
    init() {
      if (
        window.location.href.includes("form_type=customer") ||
        window.location.href.includes("customer_posted=true#contact_form")
      ) {
        submitSuccess = true;
      } else {
        submitSuccess = false;
      }
    },
  }));
});
