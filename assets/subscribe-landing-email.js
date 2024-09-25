// REMARKS:
// Variables and functions are stored in subscription-form-common.js
// settingsJson should be defined in the liquid section
// ShopifyObjectApi 在 assets/shopify-object-api.js 中定义

document.addEventListener("DOMContentLoaded", function () {
  //#region Locales
  const Locales = {
    "Oops": "¡Uy! Algo salió mal. Actualiza la página e inténtalo de nuevo.",
    "emailEmpty": "Please enter your email address.",
    "emailValid": "Please enter a valid email address (Example: name@domain.com).",
    "emailOptIn": "Please tick agreement boxes to proceed.",
    "success": "Thank you for signing up our text messages！",
  }
  /**
   * 
   * @param {keyof typeof Locales} key 
   * @returns 
   */
  function t(key) {
    return Locales[key];
  }
  function initLocales() {
    if (!subscribeLandingSettingJsons) {
      return
    }
    Locales["emailEmpty"] = subscribeLandingSettingJsons['hint_email_empty']
    Locales["emailValid"] = subscribeLandingSettingJsons['hint_email_valid']
    Locales["emailOptIn"] = subscribeLandingSettingJsons['hint_email_opt_in']
    Locales["success"] = subscribeLandingSettingJsons['subcribe_success_text']
  }
  initLocales()
  //#endregion end Locales

  //#region Request
  const SubscribeAPI = {
    CODE: {
      SUCCESS: "0",
      /**
       * This number has been signed, 
       * please use another phone number
       */
      PHONE_SIGNED: "2058",
      /**
       * This email non has been subscribed,Please subscribe email address first
       */
      WAIT_EMAIL: "20199"
    },
    getHeader() {
      // Extract theme global variables from theme.liquid
      const { acceptedLanguage, apiKey, xAppid } =
        theme.emailSubscription;

      return {
        // Except traceId is defined in subscription-form-common.js
        "Content-Type": "application/json",
        apiKey: apiKey,
        traceId: traceId,
        "X-appid": xAppid,
        "Accepted-Language": acceptedLanguage,
      };
    },

    /**
     * @param {object} params
     * @param {string} params.email
     * @param {string} params.phone
     * code: success code: 0
     * @returns {Promise<{
          "code": string,
          "message": string,
          "data": {
            "acceptsMarketing": boolean,
            "acceptsMarketingSms": boolean,
            "acceptsMarketingCreatedAt":string,
            "registerUser": boolean,
            "registerPhone": boolean
          }
        }>}
     */
    async searchSubInfo(params) {
      // Extract theme global variables from theme.liquid
      const { infoApiUrl } =
        theme.emailSubscription;
      const searchUrlParams = new URLSearchParams(params).toString();

      return fetch(`${infoApiUrl}?${searchUrlParams}`, {
        method: "GET",
        headers: SubscribeAPI.getHeader()
      }).then((res) => res.json())
    },

    async subscribeEmail() {
      const { apiUrl } = theme.emailSubscription;

      const email = DOMUtils.getEmail();
      // createFieldsArray and getContactListId function in subscription-form-common.js
      const fieldsArray = createFieldsArray(subscribeLandingSettingJsons);
      const contactListId = getContactListId(subscribeLandingSettingJsons);

      const apiBody = {
        email,
        contactListId,
        fields: fieldsArray,
      };

      return fetch(apiUrl, {
        method: "POST",
        headers: SubscribeAPI.getHeader(),
        body: JSON.stringify(apiBody),
      }).then((res) => res.json())
    },
  }
  //#endregion end Request

  //#region DOM Utils
  const DOMUtils = {
    getEmailEl() {
      return document.getElementById('subscription-email');
    },
    getEmail() {
      return DOMUtils.getEmailEl().value;
    },
    getUrlEmail() {
      return new URLSearchParams(window.location.search).get('email')
    },
    setEmail(email) {
      return DOMUtils.getEmailEl().value = email;
    },
    getEmailOptIn() {
      return document.getElementById('subscription-email-opt-in').checked;
    },
    setEmailOptIn(value) {
      if (value) {
        return document.getElementById('subscription-email-opt-in').setAttribute("checked", "checked");
      } else {
        return document.getElementById('subscription-email-opt-in').removeAttribute("checked");
      }
    },

    getSubmitBtnEl() {
      return document.getElementById("subscription-submit-button");
    },

    displayEmailError(message) {
      const el = document.getElementById("subscription-email-error");
      if (!el) {
        return
      }
      el.innerText = message;
      el.style.display = "block";
    },

    hideError() {
      const emailErrorEl = document.getElementById("subscription-email-error");
      const phoneErrorEl = document.getElementById("subscription-phone-error");
      if (emailErrorEl) {
        emailErrorEl.style.display = "none";
      }
      if (phoneErrorEl) {
        phoneErrorEl.style.display = "none";
      }
    },
  }
  //#endregion end DOM Utils

  const postEcoflowSubscribeApiAndSubmitForm = async () => {
    DOMUtils.hideError()

    const email = DOMUtils.getEmail()
    const isValidateEmail = validateEmail(email);
    const isEmailOptIn = DOMUtils.getEmailOptIn();

    if (!email || !isValidateEmail || !isEmailOptIn) {
      !isEmailOptIn && DOMUtils.displayEmailError(t("emailOptIn"));
      !isValidateEmail && DOMUtils.displayEmailError(t("emailValid"));
      !email && DOMUtils.displayEmailError(t("emailEmpty"));
      return
    }

    // POST Email
    try {
      const data = await SubscribeAPI.subscribeEmail();

      if (data.message !== "Success") {
        DOMUtils.displayEmailError(t("Oops"));
        return
      }
      DOMUtils.displayEmailError(t("success"));
    } catch (error) {
      DOMUtils.displayEmailError(t("Oops"));
      console.error(error);
    }
  };

  /**
   * 1. URL 有 email 参数时, 自动填充email
   * or
   * 2. 检查Shopify Customer是否订阅了邮件, 已订阅邮箱不需要显示邮箱订阅checkbox
   * @returns 
   */
  async function initialize() {
    const obj = await ShopifyObjectApi.queryLiquidObject()
    let email = DOMUtils.getUrlEmail()

    if (!email) {
      // 未登录 或者 未订阅
      if (!obj.customer || !obj.customer.email) {
        return
      }

      email = obj.customer.email;
    }

    // email 存在
    // 自动填充
    DOMUtils.setEmail(email)
  }

  initialize()

  DOMUtils.getSubmitBtnEl()
    .addEventListener("click", (e) => {
      e.preventDefault();
      postEcoflowSubscribeApiAndSubmitForm();
    });
});
