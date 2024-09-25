document.addEventListener("alpine:init", () => {
  Alpine.data("bfTakeGuess", () => ({
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
        label: "A. DELTA PRO",
        value: "1",
      },
      {
        label: "B. DELTA 2 MAX",
        value: "2",
      },
      {
        label: "C. DELTA 2",
        value: "3",
      },
      {
        label: "D. RIVER 2 PRO",
        value: "4",
      },
      {
        label: "E. RIVER 2",
        value: "5",
      },
    ],

    // Functions
    setStep(step) {
      this.step = step;
    },
    // Save email to alpine and pass to next step
    submitStepOneEmail() {
      const isEmailValid = validateEmail(this.email);
      if (!isEmailValid) {
        this.stepOneErrMsg = "Please enter a valid email address";
        return;
      }
      // If no error, remove error message and go to step 2
      this.stepOneErrMsg = "";
      this.setStep(2);
    },
    async submitResult() {
      this.stepTwoErrMsg = "";
      // Checking for empty answer
      if (this.step === 2 && this.answer === "") {
        this.stepTwoErrMsg = "Please select an answer";
        return;
      }

      // getContactListId function in subscription-form-common.js
      const contactListId = getContactListId(bfTakeGuessSettingJsons);

      // Extract theme global variables from theme.liquid
      const { apiUrl, acceptedLanguage, apiKey, xAppid } =
        theme.emailSubscription;

      const apiBody = {
        email: this.email,
        contactListId,
        fields: [
          {
            id: "9116",
            type: "multiple",
            value: [Number(this.answer)],
            overwrite: true,
          },
          {
            id: "4426",
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
            value: [6],
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
          this.setStep(3);
        }
      } catch (error) {
        this.stepTwoErrMsg =
          "Oops... Something went wrong, please refresh and try again.";
      } finally {
        this.loading = false;
      }
    },
    // Copy discount code to clipboard
    copyCodeToClipboard() {
      navigator.clipboard.writeText(this.couponCode);
      this.showSuccessCopyMessage = true;
    },
  }));
});
