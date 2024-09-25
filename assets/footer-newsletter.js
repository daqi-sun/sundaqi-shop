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
    "phoneEmpty": "Please enter your phone number",
    "phoneValid": "Please enter a valid phone number.",
    "phoneSigned": "This number has been signed, \nplease use another phone number",
    "emailSuccess": "Thank you for subscribing!\nSign up for EcoFlow text updates.",
    "emailSuccessSubscribed": "Thank you for subscribing!",
    "phoneSuccess": "Thank you for signing up our text messages！",
    "phoneSuccessSubscribed": "Thank you for subscribing!",
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
    if (!footerNewsletterSettingJsons) {
      return
    }
    Locales["emailEmpty"] = footerNewsletterSettingJsons['hint_email_empty']
    Locales["emailValid"] = footerNewsletterSettingJsons['hint_email_valid']
    Locales["emailOptIn"] = footerNewsletterSettingJsons['hint_email_opt_in']
    Locales["emailSuccess"] = footerNewsletterSettingJsons['email_success_subscribing']
    Locales["emailSuccessSubscribed"] = footerNewsletterSettingJsons['email_success_subscribed']
    Locales["phoneEmpty"] = footerNewsletterSettingJsons['hint_phone_empty']
    Locales["phoneValid"] = footerNewsletterSettingJsons['hint_phone_valid']
    Locales["phoneSigned"] = footerNewsletterSettingJsons['hint_phone_signed']
    Locales["phoneSuccess"] = footerNewsletterSettingJsons['hint_phone_success']
    Locales["phoneSuccessSubscribed"] = footerNewsletterSettingJsons['hint_phone_success_subscribed']
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
      PHONE_SIGNED: "2058"
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

      const email = document.getElementById('footer-subscription-email').value;
      // createFieldsArray and getContactListId function in subscription-form-common.js
      const fieldsArray = createFieldsArray(footerNewsletterSettingJsons);
      const contactListId = getContactListId(footerNewsletterSettingJsons);

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

    async subscribeSMS() {
      const { apiUrl } = theme.emailSubscription;

      const email = DOMUtils.getSMSEmail()
      const phoneStr = DOMUtils.getSMSPhone();
      const code = DOMUtils.getSMSPhoneCode();
      const phone = `${code}${phoneStr}`

      // createSMSFieldsArray, getContactListId and getSMSContactListId function in subscription-form-common.js
      const fieldsArray = createSMSFieldsArray(footerNewsletterSettingJsons);
      const contactListId = getContactListId(footerNewsletterSettingJsons);
      const smsContactListId = getSMSContactListId(footerNewsletterSettingJsons);
      const SMS_OPT_IN_ID = "3511";
      const optInField = fieldsArray.find((field) => field.id === SMS_OPT_IN_ID)
      // If the field is not exist, add it
      if (!optInField) {
        fieldsArray.unshift({
          id: SMS_OPT_IN_ID,
          type: "single",
          value: 1,
          overwrite: true,
        })
      } else {
        // If the field is exist, use setting value
      }

      const apiBody = {
        email,
        phone,
        contactListId,
        smsContactListId,
        fields: fieldsArray,
      };

      // update sms
      return await fetch(apiUrl, {
        method: "POST",
        headers: SubscribeAPI.getHeader(),
        body: JSON.stringify(apiBody),
      }).then((res) => res.json())
    }
  }
  //#endregion end Request

  //#region DOM Utils
  const DOMUtils = {
    STORAGE_EMAIL: "email",

    scrollToForm() {
      location.hash = "#newsletter-form"
    },

    getEmail() {
      return document.getElementById('footer-subscription-email').value;
    },
    getUrlEmail() {
      return new URLSearchParams(window.location.search).get('email')
    },
    getStorageEmail() {
      return localStorage.getItem(DOMUtils.STORAGE_EMAIL);
    },
    getEmailOptIn() {
      return document.getElementById('footer-subscription-email-opt-in').checked;
    },
    setEmailOptIn(value) {
      if (value) {
        return document.getElementById('footer-subscription-email-opt-in').setAttribute("checked", "checked");
      } else {
        return document.getElementById('footer-subscription-email-opt-in').removeAttribute("checked");
      }
    },
    saveStorageEmail(email) {
      localStorage.setItem(DOMUtils.STORAGE_EMAIL, email);
    },
    removeStorageEmail() {
      localStorage.removeItem(DOMUtils.STORAGE_EMAIL);
    },
    displaySuccess(message) {
      document.querySelector("#footer-subscription-success [data-text]").innerText = message;
      document.querySelector("#footer-subscription-success").style.display = "flex";
    },
    hideSuccess() {
      document.querySelector("#footer-subscription-success").style.display = "none";
    },

    displayError(message) {
      document.getElementById("footer-subscription-error").innerText = message;
      document.getElementById("footer-subscription-error").style.display = "block";
    },
    hideError() {
      document.getElementById("footer-subscription-error").style.display = "none";
    },

    /**
     * HTML in modal-consent.liquid
     * @param {string} containerId 
     * @param {Function} callback 
     */
    displayConsent(containerId, callback) {
      const consent = document.getElementById(containerId);
      const consentConfirm = consent.querySelector(".confirm");
      const consentClose = consent.querySelector(".close");
      consent.removeAttribute("style");
      const confirmHandler = () => {
        callback();
        closeModal()
      }
      const closeHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        closeModal()
      }
      const closeModal = () => {
        consent.setAttribute("style", "display: none;");
        consentClose.removeEventListener("click", closeHandler, true)
        consentConfirm.removeEventListener("click", confirmHandler)
      }
      consentClose.addEventListener("click", closeHandler, true)
      consentConfirm.addEventListener("click", confirmHandler)
    },
    displayEmailConsent(callback) {
      DOMUtils.displayConsent("footer-email-consent", callback)
    },
    displaySMSConsent(callback) {
      DOMUtils.displayConsent("footer-sms-consent", callback)
    },

    isEmailSuccess() {
      const smsForm = document.querySelector('.footer-form-inner')
      const isSuccess = smsForm.classList.contains("is-success")
      function isUrlSuccess() {
        if (window.location.href.indexOf('?contact%5Btags%5D=newsletter') < 0) {
          return
        }
        const footerEmailInput = document.querySelector('[name="contact[email]"]')
        return footerEmailInput.value != ''
      }
      if (!DOMUtils.getStorageEmail()) {
        return false
      }
      return isSuccess || isUrlSuccess()
    },
    setEmailIsSuccess() {
      document.querySelector('.footer-form-inner').classList.add("is-success")
    },
    getSMSFormEl() {
      return document.getElementById("footer-subscription-sms-form");
    },
    getSMSEmail() {
      return document.getElementById('footer-subscription-sms-email').value;
    },
    setSMSEmail(email) {
      document.getElementById('footer-subscription-sms-email').value = email;
    },
    getSMSPhone() {
      return document.getElementById('footer-subscription-sms-phone').value;
    },
    getSMSPhoneCode() {
      return document.getElementById('footer-subscription-sms-phone-code').value;
    },
    getSMSSubmitEl() {
      return document.getElementById("footer-subscription-sms-submit-button")
    },
    displaySMSForm() {
      const smsContactListId = getSMSContactListId(footerNewsletterSettingJsons);
      if (!smsContactListId) {
        return
      }

      const smsForm = DOMUtils.getSMSFormEl()
      smsForm.removeAttribute("style")
      DOMUtils.initPhoneCode()
      // sms输入时隐藏邮箱的成功提示
      const emailInput = document.getElementById('footer-subscription-sms-phone')
      emailInput.addEventListener("input", () => {
        DOMUtils.hideSuccess()
      })
    },
    hideSMSForm() {
      const smsForm = DOMUtils.getSMSFormEl()
      smsForm.setAttribute("style", "display: none;")
    },
    /**
     * 初始化电话区号
     * 当前选中的区号为：block.dataset.iso
     * value: block.settings.sms_phone_code | default: localization.language.iso_code
     */
    async initPhoneCode() {
      const select = document.querySelector("#footer-subscription-sms-phone-code")
      const url = select.dataset.url
      const isoCode = String(select.dataset.iso).toUpperCase()
      const countries = await fetch(url).then(res => res.json())
      const currentCountrie = countries.find(item => {
        const iso2 = String(item.iso2).toUpperCase()
        const iso3 = String(item.iso3).toUpperCase()
        return item.phone_code === isoCode || iso2 === isoCode || iso3 === isoCode || iso2.startsWith(isoCode) || iso3.startsWith(isoCode)
      })

      const options = countries.map(item => {
        const option = document.createElement("option")
        option.value = item.phone_code
        option.text = item.phone_code + " " + item.name
        return option
      })
      select.append(...options)
      if (currentCountrie) {
        select.value = currentCountrie.phone_code
      }

      /**
       * 根据 select 选择的值，设置 select 的宽度
       */
      const setSelectWidth = () => {
        const value = select.value
        const selectStyle = window.getComputedStyle(select)
        const div = document.createElement("div")
        div.style.position = "absolute"
        div.style.visibility = "hidden"
        div.style.fontSize = selectStyle.fontSize
        div.style.fontFamily = selectStyle.fontFamily
        div.style.letterSpacing = selectStyle.letterSpacing
        div.style.whiteSpace = "nowrap"
        div.innerText = value
        document.body.append(div)
        // 18 = padding-left + padding-right
        const width = div.offsetWidth + 18
        div.remove()

        select.style.width = `${width}px`
        const input = document.querySelector("#footer-subscription-sms-phone")
        input.style.paddingLeft = `${width + 12}px`
      }

      select.addEventListener("change", setSelectWidth)
      setSelectWidth()
    },
  }
  //#endregion end DOM Utils

  let emailIsSubscribed = false
  const postEcoflowSubscribeApiAndSubmitForm = async () => {
    const email = DOMUtils.getEmail()
    emailIsSubscribed = false

    try {
      const info = await SubscribeAPI.searchSubInfo({ email: email })
      if (info.code === SubscribeAPI.CODE.SUCCESS && info.data.acceptsMarketing) {
        emailIsSubscribed = true
      }
      const data = await SubscribeAPI.subscribeEmail({ email });

      if (data.code === SubscribeAPI.CODE.SUCCESS) {
        DOMUtils.saveStorageEmail(email);
        // 别使用Shopify的表单提交，因为会刷新页面。使用我们自己的表单提交，有做邮箱同步至Shopify
        initEmailSuccess()
      } else {
        DOMUtils.displayError(t("Oops"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function postEcoflowSMSSubscribeApiAfterEmail() {
    try {
      const data = await SubscribeAPI.subscribeSMS();
      if (data.code !== SubscribeAPI.CODE.SUCCESS) {
        if (data.code === SubscribeAPI.CODE.PHONE_SIGNED) {
          DOMUtils.displayError(t("phoneSigned"));
        } else {
          DOMUtils.displayError(t("Oops"))
        }
        return
      }

      DOMUtils.displaySuccess(t('phoneSuccess'))
      DOMUtils.hideSMSForm()
      DOMUtils.removeStorageEmail()
    } catch (error) {
      console.error(error);
    }
  }

  async function initEmailSuccess() {
    DOMUtils.setEmailIsSuccess()

    //#region 检查SMS是否需要展示
    try {
      const email = DOMUtils.getStorageEmail();

      if (!email) {
        return
      }

      const data = await SubscribeAPI.searchSubInfo({ email: email })
      if (data.code !== SubscribeAPI.CODE.SUCCESS) {
        return
      }

      // 已经订阅了短信 不需要显示SMS 表单
      if (data.data.acceptsMarketingSms) {
        DOMUtils.displaySuccess(t("phoneSuccessSubscribed"))
        return
      }

      // 已经订阅了邮箱 确定显示文案
      if (emailIsSubscribed) {
        DOMUtils.displaySuccess(t("emailSuccessSubscribed"))
      } else {
        DOMUtils.displaySuccess(t("emailSuccess"))
      }
      DOMUtils.setSMSEmail(email)
      DOMUtils.scrollToForm()
      DOMUtils.removeStorageEmail()
      // 显示SMS订阅表单
      DOMUtils.displaySMSForm()
    } catch (error) {
      console.error(error);
    }
    //#endregion 检查SMS是否需要展示

    //#region SMS订阅表单 提交按钮
    DOMUtils.getSMSSubmitEl().addEventListener("click", (e) => {
      e.preventDefault();

      DOMUtils.hideError();

      const phone = DOMUtils.getSMSPhone();
      const code = DOMUtils.getSMSPhoneCode();

      if (!phone) {
        DOMUtils.displayError(t("phoneEmpty"));
        return;
      }

      if (!validatePhone(code, phone)) {
        DOMUtils.displayError(t("phoneValid"));
        return;
      }

      DOMUtils.displaySMSConsent(postEcoflowSMSSubscribeApiAfterEmail)
    });
    //#endregion SMS订阅表单 提交按钮
  }

  async function initSmsForm() {
    // Check if the Email subscription is success
    if (!DOMUtils.isEmailSuccess()) {
      return
    }

    initEmailSuccess()
  }
  // postEcoflowSubscribeApiAndSubmitForm 会刷新页面, 进入页面直接判断是否需要显示SMS订阅
  initSmsForm()

  if (footerNewsletterSettingJsons.email_consent_type === "checkbox") {
    document
      .getElementById("footer-subscription-submit-button")
      .addEventListener("click", (e) => {
        e.preventDefault();
        DOMUtils.hideError()
        const email = DOMUtils.getEmail()

        if (!email) {
          DOMUtils.displayError(t("emailEmpty"));
          return;
        }

        if (!validateEmail(email)) {
          DOMUtils.displayError(t("emailValid"));
          return;
        }

        if (!DOMUtils.getEmailOptIn()) {
          DOMUtils.displayError(t("emailOptIn"));
          return;
        }

        postEcoflowSubscribeApiAndSubmitForm()
      });
  } else {
    // popup
    document
      .getElementById("footer-subscription-submit-button")
      .addEventListener("click", (e) => {
        e.preventDefault();
        DOMUtils.hideError()
        const email = DOMUtils.getEmail()

        if (!email) {
          DOMUtils.displayError(t("emailEmpty"));
          return;
        }

        if (!validateEmail(email)) {
          DOMUtils.displayError(t("emailValid"));
          return;
        }

        DOMUtils.displayEmailConsent(postEcoflowSubscribeApiAndSubmitForm)
      });

  }
});
