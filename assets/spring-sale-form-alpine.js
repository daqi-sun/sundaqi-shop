document.addEventListener("alpine:init", () => {
  Alpine.data("SpringSaleForm", () => ({
    loading: false,
    step: 1,
    agreeToMarketing: true,
    email: "",
    answer: "",
    stepOneErrMsg: "",
    stepTwoErrMsg: "",
    showSuccessCopyMessage: false,
    options: [
      {
        label: "1. Crea un sistema solar con EcoFlow PowerStream en el balcón/jardín de tu casa y ahorra un año entero en facturas de la luz.",
        value: "1",
      },
      {
        label: "2. Abre una heladería en una calle comercial con EcoFlow DELTA 2 Max.",
        value: "2",
      },
      {
        label: "3. Lleva EcoFlow DELTA 2 a una excursión y recarga totalmente gratis el teléfono de otra persona en la cumbre de una montaña.",
        value: "3",
      },
      {
        label: "4. Lleva EcoFlow RIVER 2 Pro de acampada en primavera.",
        value: "4",
      },
      {
        label: "5. Vete de viaje con tus amigos en una caravana con EcoFlow DELTA Max.",
        value: "5",
      },
    ],

    // Functions
    setStep(step) {
      this.step = step;
    },
    // Save email to alpine and pass to next step
    async submitStepOneEmail() {
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
            // Country field id: ES = 4426
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
            id: "7596",
            type: "multiple",
            value: [18],
            overwrite: false,
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
    async submitResult() {
      this.stepTwoErrMsg = "";
      // Checking for empty answer
      if (this.step === 2 && this.answer === "") {
        this.stepTwoErrMsg = "Por favor seleccione una respuesta.";
        return;
      }

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
            id: "9887",
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
          this.setStep(3);
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
