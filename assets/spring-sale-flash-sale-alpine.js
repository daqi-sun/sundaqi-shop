document.addEventListener("alpine:init", () => {
    Alpine.data("springSaleFlash", () => ({
      email: "",
      errMsg: "",
      agreeToMarketing: false,
      isSuccess: false,
      async postEcoflowSubscribeApiAndSubmitForm() {
        this.errMsg = "";

        const isEmailValid = validateEmail(this.email);

        if (!isEmailValid) {
          this.errMsg = "Introduce una dirección de email válida por favor.";
          return;
        }else if (!this.agreeToMarketing) {
          this.errMsg = "Marque las casillas para continuar.";
          return;
        }

        // Functions from subscription-form-common.js
        const fieldsArray = createFieldsArray(springSaleSettingJsons);
        const contactListId = getContactListId(springSaleSettingJsons);

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
            this.isSuccess = true;
          } else {
            this.errMsg =
              "Oops…algo salió mal, actualice y inténtalo otra vez.";
          }
        } catch (error) {
          this.errMsg =
            "Oops…algo salió mal, actualice y inténtalo otra vez.";
          console.log(error);
        }
      }
    }));
  });
