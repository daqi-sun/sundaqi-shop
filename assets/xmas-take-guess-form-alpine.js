document.addEventListener("alpine:init", () => {
  Alpine.data("xmasTakeGuess", () => ({
    loading: false,
    step: 1,
    agreeToMarketing: true,
    email: "",
    answer: "",
    stepOneErrMsg: "",
    stepTwoErrMsg: "",
    successSubmit: false,

    // Functions
    setStep(step) {
      this.step = step;
    },
    // Save email to alpine and pass to next step
    async submitStepOneEmail() {
      // If no error, remove error when try to submit
      this.stepOneErrMsg = "";

      const isEmailValid = validateEmail(this.email);
      if (!this.agreeToMarketing) {
        this.stepOneErrMsg = "Please tick agreement boxes to proceed";
        return;
      }
      if (!isEmailValid) {
        this.stepOneErrMsg = "Please enter a valid email address";
        return;
      }

      // getContactListId function in subscription-form-common.js
      const contactListId = getContactListId(xmasTakeGuessSettingJsons);

      // Extract theme global variables from theme.liquid
      const { apiUrl, acceptedLanguage, apiKey, xAppid } =
        theme.emailSubscription;

      // Submit emarsys api for marketing purpose
      const apiBody = {
        email: this.email,
        contactListId,
        fields: [
          {
            id: "4426",
            type: "single",
            value: 1,
            overwrite: false,
          },
          {
            id: "31",
            type: "single",
            value: 1,
            overwrite: false,
          },
          {
            id: "5910",
            type: "single",
            value: 1,
            overwrite: false,
          },
          {
            id: "7596",
            type: "multiple",
            value: [8],
            overwrite: false,
          },
          {
            id: "9244",
            type: "multiple",
            value: [Number(xmas23GuessID)],
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
          "Oops... Something went wrong, please refresh and try again.";
      } finally {
        this.loading = false;
      }
    },
    async submitResult() {
      this.stepTwoErrMsg = "";
      // Checking for empty answer
      if (this.step === 2 && this.answer === "") {
        this.stepTwoErrMsg = "Please select an answer";
        return;
      }

      this.successSubmit = true;
    },
  }));
});
