document.addEventListener("alpine:init", () => {
  Alpine.data("bfBanner", () => ({
    loading: false,
    email: "",
    errMsg: "",
    checked: false,
    isSuccess: false,

    async submitResult() {
      if (!this.checked) {
        this.errMsg = "Marque las casillas para continuar.";
        return;
      }
      const isEmailValid = validateEmail(this.email);
      if (!isEmailValid) {
        this.errMsg = "Email: invalid format!";
        return;
      }
      // If no error, remove error message
      this.errMsg = "";

      const fieldsArray = createFieldsArray(springSaleSettingJsons);
      // getContactListId function in subscription-form-common.js
      const contactListId = getContactListId(bfbannerSettingJsons);

      // Extract theme global variables from theme.liquid
      const { apiUrl, acceptedLanguage, apiKey, xAppid } =
        theme.emailSubscription;

      const apiBody = {
        email: this.email,
        contactListId,
        fields: fieldsArray,
      };
      this.loading = true;
      try {
        const response = await fetch(
          // Header global settings are defined in star-email-subscription-form.liquid
          // Except traceId is defined in subscription-form-common.js
          apiUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apiKey: apiKey,
              traceId: traceId,
              "X-appid": xAppid,
              "Accepted-Language": acceptedLanguage,
            },
            body: JSON.stringify(apiBody),
          }
        );

        const data = await response.json();

        if (data.message === "Success") {
          this.isSuccess = true;
        }
      } catch (error) {
        this.errMsg =
          "Oops... Something went wrong, please refresh and try again.";
      } finally {
        this.loading = false;
      }
    },
  }));
});
