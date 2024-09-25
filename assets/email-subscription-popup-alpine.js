/**
 Type of alpine data params

 showTriggerLogo: boolean;
 showPopup: boolean;

 showStep: 'subscription' | 'sms | 'thank-you' | 'thank-you-member' | 'thank-you-sms'; 
 @usage (showStep): 
 * Type of step to show in popup
 * subscription: show subscription form
 * sms: show sms form
 * thank-you: show thank you message with register button
 * thank-you-member: show thank you message only when user is member
 * thank-you-sms: show thank you message only when user is subscribed to sms
 
 email: string;
 phoneCode: string; Please follow the list of phone code in phoneCodeList
 phoneNumber: string;
 disclaimerChecked: boolean;
 smsDisclaimerChecked: boolean;
 errMsg: string;
 loading: boolean;

 popupDelayDate: number | null;
 @usage (popupDelayDate):
 * Number of days that popup should show again after close

 isLogin: boolean;
 isSubscribed: boolean;
 isMember: boolean;

 enableSms: boolean;
 enableRegistration: boolean;
 @usage (enableSms, enableRegistration):
 * Settings from popup element
 * Enable or disable sms and registration form
 
 shouldPageActive: {
  subscription: boolean;
  sms: boolean;
  thank-you: boolean;
  thank-you-member: boolean;
  thank-you-sms: boolean;
 };
 @usage (shouldPageActive):
 * Enable or disable each step based on user's status and popup settings
 * If active page status is true, show the page, otherwise hide it

 * See function usage in function comment section
 toggleTriggerLogo: () => void;
 togglePopup: () => void;
 resetActivePage: () => void;
 setStep: () => void;
 getActiveStep: (step: string) => string | null;
 goNextStep: (expectedNextStep: string) => void;
 submitEmailForm: () => void;
 submitSmsForm: () => void;
 fetchCustomerInfo: (email: string) => Promise<any>;
 */

document.addEventListener("alpine:init", () => {
  // Extract theme global variables from theme.liquid
  const { apiUrl, acceptedLanguage, apiKey, xAppid } = theme.emailSubscription;

  // Get popup data settings from popup element
  const popup = document.getElementById("email-subscription-popup");
  const {
    customerTags,
    customerEmail,
    popupDelayDays,
    popupDelaySeconds,
    popupSubscribed,
    autoShowPopup,
    enableSms,
    enableRegistration,
  } = popup.dataset;

  Alpine.data("emailSubscriptionPopup", () => ({
    showTriggerLogo: false,
    showPopup: false,
    showStep: "subscription",
    email: "",
    phoneCode: "+34",
    phoneNumber: "",
    disclaimerChecked: false,
    smsDisclaimerChecked: false,
    errMsg: "",
    loading: false,
    popupDelayDate: null,
    isLogin: false,
    isSubscribed: false,
    isSmsSubscribed: false,
    isMember: false,
    enableSms: true,
    enableRegistration: true,
    shouldPageActive: {
      subscription: true,
      sms: true,
      "thank-you": true,
      "thank-you-member": true,
      "thank-you-sms": true,
    },

    toggleTriggerLogo() {
      this.showTriggerLogo = !this.showTriggerLogo;
    },
    togglePopup() {
      this.showPopup = !this.showPopup;
      // Set disable auto popup date to local storage when close
      if (!this.showPopup) {
        const targetDay = new Date();
        // Set to 0 to make sure the saved time is on the target day 12am
        targetDay.setHours(0);
        targetDay.setMinutes(0);
        targetDay.setSeconds(0);
        targetDay.setMilliseconds(0);

        // Today + delay days
        const delayDate = new Date().getDate() + this.popupDelayDate;
        targetDay.setDate(delayDate);
        // Save delay date to local storage and use it to check if popup should show
        localStorage.setItem(
          `${window.location.hostname}_email_subscription_popup_delay_date`,
          targetDay
        );

        // Reset all state when close popup
        this.resetActivePage();
        this.goNextStep("subscription");

        this.email = "";
        this.disclaimerChecked = false;
        this.errMsg = "";
      }
    },
    resetActivePage() {
      /**
        When user is logged in,  
        Detect if user is subscribed to email, sms
        or sms / register section is enabled
        Set it back to the initial state
      */
      if (this.isLogin) {
        this.shouldPageActive = {
          subscription: !this.isSubscribed,
          sms: !this.isSmsSubscribed && this.enableSms,
          "thank-you": !this.isMember && this.enableRegistration,
          "thank-you-member": true,
          "thank-you-sms": true,
        };
        return;
      }

      this.shouldPageActive = {
        subscription: true,
        sms: true,
        "thank-you": true,
        "thank-you-member": true,
        "thank-you-sms": true,
      };
    },
    setStep(step) {
      this.showStep = step;
    },
    getActiveStep(step) {
      // Get the next active step by checking the shouldPageActive object
      // If the step is active (true), return the step
      const steps = Object.keys(this.shouldPageActive);
      let index = steps.indexOf(step);

      while (index < steps.length) {
        if (this.shouldPageActive[steps[index]]) {
          return steps[index];
        }
        index++;
      }

      return null; // Return null if no step with a value of true is found
    },
    goNextStep(expectedNextStep) {
      // Get the next active step and set it as the current step
      const nextStep = this.getActiveStep(expectedNextStep);
      this.setStep(nextStep);
    },
    async submitEmailForm() {
      this.errMsg = "";

      // Validation
      const isEmailValid = validateEmail(this.email);
      if (!this.disclaimerChecked) {
        this.errMsg =
          "Por favor acepta la Política de privacidad y los Términos de servicio.";
        return;
      }
      if (this.email === "") {
        this.errMsg =
          "Por favor, introduce una dirección de correo electrónico válida.";
        return;
      }
      if (!isEmailValid) {
        this.errMsg =
          "Por favor, introduce una dirección de correo electrónico válida.";
        return;
      }

      // If user is logged in, check if user is subscribed
      const { data } = await this.fetchCustomerInfo(this.email);

      // Set active page based on the user's subscription status
      this.shouldPageActive = {
        ...this.shouldPageActive,
        sms: !data.acceptsMarketingSms && this.enableSms,
        "thank-you": !data.registerUser && this.enableRegistration,
      };

      // If user is subscribed, do not call post api and directly go to next step
      // if (data.acceptsMarketing) {
      //   this.goNextStep("sms");
      //   return;
      // }

      // Functions from subscription-form-common.js
      const fieldsArray = createFieldsArray(emailSubscriptionPopupSettingJsons);
      const contactListId = getContactListId(
        emailSubscriptionPopupSettingJsons
      );

      const apiBody = {
        email: this.email,
        contactListId,
        smsContactListId:
          emailSubscriptionPopupSettingJsons.contact_list_id_sms,
        fields: fieldsArray,
      };

      try {
        this.loading = true;
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
          this.goNextStep("sms");

          // Hide email subscription page once user finished subscription using his own email
          if (this.email === customerEmail) {
            this.shouldPageActive.subscription = false;
            this.isSubscribed = true;
          }
        } else {
          this.errMsg =
            "¡Uy! Algo salió mal. Actualiza la página e inténtalo de nuevo.";
        }
      } catch (error) {
        this.errMsg =
          "¡Uy! Algo salió mal. Actualiza la página e inténtalo de nuevo.";
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async submitSmsForm() {
      this.errMsg = "";

      const phone = `${this.phoneCode}${this.phoneNumber}`;

      const isPhoneNumberValid = () => {
        // Phone number regex
        // 1. Must start with "+"
        // 2. Must contain only numbers and one or no hyphen
        // 3. Must be between 9 and 15 characters including country code
        const phoneNumberRegex = /^(?=.{9,15}$)\+\d(-?\d)*$/;
        const containOnlyOneOrNoHyphen = phone.split("-").length - 1 <= 1;
        return phoneNumberRegex.test(phone) && containOnlyOneOrNoHyphen;
      };

      // Validation
      if (!this.smsDisclaimerChecked) {
        this.errMsg = "Marque las casillas para continuar.";
        return;
      }
      if (this.phoneNumber === "") {
        this.errMsg = "Por favor, ingresa tu número de teléfono.";
        return;
      }
      if (!isPhoneNumberValid(phone)) {
        this.errMsg = "Por favor, ingresa un número de teléfono válido.";
        return;
      }

      /**
        Merchant requested to have 2 extra fields for sms subscription
        1 single and 1 multiple
      */
      const {
        s_id_sms,
        s_value_sms,
        s_overwrite_sms,
        t_id_sms,
        t_value_sms,
        t_overwrite_sms,
        m_id_sms,
        m_value_sms,
        m_overwrite_sms,
        m_2_id_sms,
        m_2_value_sms,
        m_2_overwrite_sms,
        contact_list_id_sms,
      } = emailSubscriptionPopupSettingJsons;

      // Functions from subscription-form-common.js
      let fieldsArray = createFieldsArray(emailSubscriptionPopupSettingJsons);
      const contactListId = getContactListId(
        emailSubscriptionPopupSettingJsons
      );
      fieldsArray = [
        ...fieldsArray,
        ...(s_id_sms
          ? [
              {
                id: s_id_sms,
                type: "single",
                value: Number(s_value_sms),
                overwrite: JSON.parse(s_overwrite_sms),
              },
            ]
          : []),
        ...(t_id_sms
          ? [
              {
                id: t_id_sms,
                type: "text",
                value: Number(t_value_sms),
                overwrite: JSON.parse(t_overwrite_sms),
              },
            ]
          : []),
        ...(m_id_sms
          ? [
              {
                id: m_id_sms,
                type: "multiple",
                value: m_value_sms.split(",").map((item) => Number(item)),
                overwrite: JSON.parse(m_overwrite_sms),
              },
            ]
          : []),
        ...(m_2_id_sms
          ? [
              {
                id: m_2_id_sms,
                type: "multiple",
                value: m_2_value_sms.split(",").map((item) => Number(item)),
                overwrite: JSON.parse(m_2_overwrite_sms),
              },
            ]
          : []),
      ];

      const apiBody = {
        email: this.email === "" ? customerEmail : this.email,
        phone,
        contactListId,
        smsContactListId: contact_list_id_sms,
        fields: fieldsArray,
      };

      try {
        this.loading = true;
        const checkPhoneRegistered = await this.fetchCustomerInfo(
          this.email === "" ? customerEmail : this.email,
          encodeURIComponent(phone)
        );

        if (checkPhoneRegistered.data.registerPhone) {
          this.errMsg =
            "Ya estás suscrito a nuestras actualizaciones por SMS. No es necesario volver a registrarse.";
          return;
        }

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            // Header global settings are defined `in pdp-subscription-form.liquid
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
          // When this.email is blank, it means user is member and have subscribed to email, set sms page to false as he has subscribed sms to his own account
          // When this.email is not blank, it means user have subscribed to email, but may or may not be typing in his account email
          // If this.email is not equal to customerEmail, set sms page to true as he is not subscribed sms to his own account, so sms page will still showing
          const shouldSmsPageActive =
            this.email === "" ? false : this.email !== customerEmail;

          this.shouldPageActive = {
            ...this.shouldPageActive,
            sms: shouldSmsPageActive,
            "thank-you": !this.isMember && this.enableRegistration,
            "thank-you-member": false,
          };
          this.isSmsSubscribed = !shouldSmsPageActive;

          this.goNextStep("thank-you");
        } else {
          this.errMsg =
            "¡Uy! Algo salió mal. Actualiza la página e inténtalo de nuevo.";
        }
      } catch (error) {
        this.errMsg =
          "¡Uy! Algo salió mal. Actualiza la página e inténtalo de nuevo.";
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchCustomerInfo(email, phone) {
      // Fetch customer information by email
      try {
        this.loading = true;
        // Use to get phone number is registered or not
        const phoneQuery = phone ? `&phone=${phone}` : "";
        const response = await fetch(
          `https://api-e.ecoflow.com/website/subscribe/searchSubInfo?email=${email}${phoneQuery}`,
          {
            method: "GET",
            headers: {
              "X-appid": xAppid,
            },
          }
        );
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(error);
      } finally {
        this.loading = false;
      }
    },
    init() {
      this.isLogin = customerEmail ? true : false;
      this.isMember = customerEmail ? true : false;
      this.enableSms = JSON.parse(enableSms);
      this.enableRegistration = JSON.parse(enableRegistration);

      // If user is not logged in, set active page based on popup settings
      this.shouldPageActive = {
        ...this.shouldPageActive,
        sms: this.enableSms,
        "thank-you": this.enableRegistration,
      };

      if (customerEmail) {
        const fetchCustomerInformation = async () => {
          try {
            const data = await this.fetchCustomerInfo(customerEmail);

            if (data.message === "Success") {
              const { acceptsMarketing, acceptsMarketingSms, registerUser } =
                data.data;

              this.isSubscribed = acceptsMarketing;
              this.isSmsSubscribed = acceptsMarketingSms;
              this.shouldPageActive = {
                ...this.shouldPageActive,
                subscription: !acceptsMarketing,
                sms: !acceptsMarketingSms && this.enableSms,
                "thank-you": !registerUser && this.enableRegistration,
              };

              // Remove popup if user is fully subscribed
              if (
                (acceptsMarketing && acceptsMarketingSms && registerUser) ||
                (acceptsMarketing &&
                  !this.enableSms &&
                  !this.enableRegistration)
              ) {
                document.getElementById("email-subscription-popup").remove();
                return;
              } else {
                this.showTriggerLogo = true;
              }

              // Disable steps based on configuration
              if (!enableSms) this.shouldPageActive.sms = false;
              if (!enableRegistration)
                this.shouldPageActive["thank-you"] = false;

              this.goNextStep("subscription");
            }
          } catch (error) {
            console.log(error);
            window.alert(
              "¡Uy! Algo salió mal. Actualiza la página e inténtalo de nuevo."
            );
            document.getElementById("email-subscription-popup").remove();
          }
        };

        fetchCustomerInformation();
      } else {
        this.showTriggerLogo = true;
      }

      // Set data attribute to alpine data
      this.popupDelayDate = Number(popupDelayDays);
      // this.isSubscribed = isSubscribed;
      // this.isMember = customerTags.includes("member");

      // If user has closed the popup before, check if the delay date is still valid
      const now = new Date();
      const delayDate = localStorage.getItem(
        `${window.location.hostname}_email_subscription_popup_delay_date`
      );

      const isDelayDateValid = now.getTime() < new Date(delayDate).getTime();
      // Undefine autoShowPopup will be false
      const parsedAutoShowPopup = autoShowPopup
        ? JSON.parse(autoShowPopup)
        : false;

      // If user is not subscribed and out of delay date range, show popup automatically after X seconds when enter the page
      // Otherwise, hide popup
      if (!this.isSubscribed && !isDelayDateValid && parsedAutoShowPopup) {
        setTimeout(() => {
          this.showPopup = true;
        }, Number(popupDelaySeconds) * 1000);
      }
    },
    // Phone code list
    phoneCodeList: [
      "+1",
      "+7",
      "+20",
      "+27",
      "+30",
      "+31",
      "+32",
      "+33",
      "+34",
      "+36",
      "+39",
      "+40",
      "+41",
      "+43",
      "+44",
      "+45",
      "+46",
      "+47",
      "+48",
      "+49",
      "+51",
      "+52",
      "+53",
      "+54",
      "+55",
      "+56",
      "+57",
      "+58",
      "+60",
      "+61",
      "+62",
      "+63",
      "+64",
      "+65",
      "+66",
      "+81",
      "+82",
      "+84",
      "+86",
      "+90",
      "+91",
      "+92",
      "+94",
      "+95",
      "+98",
      "+211",
      "+212",
      "+213",
      "+216",
      "+218",
      "+220",
      "+221",
      "+222",
      "+223",
      "+224",
      "+225",
      "+226",
      "+227",
      "+228",
      "+229",
      "+230",
      "+231",
      "+232",
      "+233",
      "+234",
      "+235",
      "+236",
      "+237",
      "+238",
      "+239",
      "+240",
      "+241",
      "+242",
      "+243",
      "+244",
      "+245",
      "+246",
      "+248",
      "+249",
      "+250",
      "+251",
      "+252",
      "+253",
      "+254",
      "+255",
      "+256",
      "+257",
      "+258",
      "+260",
      "+261",
      "+262",
      "+263",
      "+264",
      "+265",
      "+266",
      "+267",
      "+268",
      "+269",
      "+290",
      "+291",
      "+297",
      "+298",
      "+299",
      "+350",
      "+351",
      "+352",
      "+353",
      "+354",
      "+355",
      "+356",
      "+357",
      "+358",
      "+359",
      "+370",
      "+371",
      "+372",
      "+373",
      "+374",
      "+375",
      "+376",
      "+377",
      "+378",
      "+379",
      "+380",
      "+381",
      "+382",
      "+383",
      "+385",
      "+386",
      "+387",
      "+389",
      "+420",
      "+421",
      "+423",
      "+500",
      "+501",
      "+502",
      "+503",
      "+504",
      "+505",
      "+506",
      "+507",
      "+508",
      "+509",
      "+590",
      "+591",
      "+592",
      "+593",
      "+594",
      "+595",
      "+596",
      "+597",
      "+598",
      "+599",
      "+670",
      "+672",
      "+673",
      "+674",
      "+675",
      "+676",
      "+677",
      "+678",
      "+679",
      "+680",
      "+681",
      "+682",
      "+683",
      "+685",
      "+686",
      "+687",
      "+688",
      "+689",
      "+690",
      "+691",
      "+692",
      "+850",
      "+852",
      "+853",
      "+855",
      "+856",
      "+870",
      "+880",
      "+886",
      "+960",
      "+961",
      "+962",
      "+963",
      "+964",
      "+965",
      "+966",
      "+967",
      "+968",
      "+970",
      "+971",
      "+972",
      "+973",
      "+974",
      "+975",
      "+976",
      "+977",
      "+992",
      "+993",
      "+994",
      "+995",
      "+996",
      "+998",
      "+0055",
      "+1721",
      "+1-242",
      "+1-246",
      "+1-264",
      "+1-268",
      "+1-284",
      "+1-340",
      "+1-345",
      "+1-441",
      "+1-473",
      "+1-649",
      "+1-664",
      "+1-670",
      "+1-671",
      "+1-684",
      "+1-758",
      "+1-767",
      "+1-784",
      "+1-868",
      "+1-869",
      "+1-876",
      "+358-18",
      "+44-1481",
      "+44-1534",
      "+44-1624",
    ],
  }));
});
