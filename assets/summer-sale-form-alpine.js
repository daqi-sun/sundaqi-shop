document.addEventListener("alpine:init", () => {
    Alpine.data("SummerSaleForm", () => ({
      loading: false,
      step: 1,
      agreeToMarketing: false,
      email: "",
      answer: "1",
      stepOneErrMsg: "",
      stepTwoErrMsg: "",
      showSuccessCopyMessage: false,

      // Functions
      setStep(step) {
        this.step = step;
      },
      // Save email to alpine and pass to next step
      async submitResult() {
        const isEmailValid = validateEmail(this.email);
        if (!isEmailValid) {
          this.stepOneErrMsg = "Introduce una dirección de email válida por favor.";
          return;
        } else if (!this.agreeToMarketing) {
          this.stepOneErrMsg = "Marque las casillas para continuar.";
          return;
        }

        // If no error, remove error message
        this.stepOneErrMsg = "";

        // getContactListId function in subscription-form-common.js
        const contactListId = getContactListId(SpringSaleFormSettingJsons);

        // Extract theme global variables from theme.liquid
        const { apiUrl, acceptedLanguage, apiKey, xAppid } =
          theme.emailSubscription;

        const apiBody = {
          email: this.email,
          contactListId,
          fields: [
            {
              // Country field id: EU = 4427
              id: "4426",
              type: "single",
              value: 1,
              overwrite: true,
            },
            {
              id: "31",
              type: "single",
              value: 1,
              overwrite: true,
            },
            {
              id: "10830",
              type: "multiple",
              value: [Number(this.answer)],
              overwrite: true,
            },
          ],
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
            this.setStep(2);
          }
        } catch (error) {
          this.stepTwoErrMsg =
            "Oops…algo salió mal, actualice y inténtalo otra vez.";
        } finally {
          this.loading = false;
        }
      },
      // Copy discount code to clipboard
      copyCodeToClipboard(couponCode) {
        navigator.clipboard.writeText(couponCode);
        this.showSuccessCopyMessage = true;
      },
    }));
  });
