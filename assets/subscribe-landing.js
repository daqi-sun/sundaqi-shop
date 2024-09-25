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
    "phoneOptIn": "Please tick agreement boxes to proceed.",
    "success": "Thank you for signing up our text messages！",
    "emailSmsSubscribed": "You're already subscribed to our SMS updates. No need to sign up again.",
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
    Locales["phoneEmpty"] = subscribeLandingSettingJsons['hint_phone_empty']
    Locales["phoneValid"] = subscribeLandingSettingJsons['hint_phone_valid']
    Locales["phoneSigned"] = subscribeLandingSettingJsons['hint_phone_signed']
    Locales["phoneOptIn"] = subscribeLandingSettingJsons['hint_phone_opt_in']
    Locales["emailSmsSubscribed"] = subscribeLandingSettingJsons['hint_email_sms_subscribed']
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

    async subscribeSMS() {
      const { apiUrl } = theme.emailSubscription;

      const email = DOMUtils.getEmail();
      const phoneStr = DOMUtils.getPhone();
      const code = DOMUtils.getPhoneCode();
      const phone = `${code}${phoneStr}`

      // createSMSFieldsArray, getContactListId and getSMSContactListId function in subscription-form-common.js
      const fieldsArray = createSMSFieldsArray(subscribeLandingSettingJsons);
      const contactListId = getContactListId(subscribeLandingSettingJsons);
      const smsContactListId = getSMSContactListId(subscribeLandingSettingJsons);
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

      let trytimes = 3
      async function checkEmail() {
        trytimes--;
        try {
          const infoData = await SubscribeAPI.searchSubInfo({ email: email })
          if (infoData.code !== SubscribeAPI.CODE.SUCCESS) {
            if (trytimes > 0) {
              return await checkEmail()
            }
            return infoData
          }

          if (!infoData.data.acceptsMarketing) {
            const emailData = await fetch(apiUrl, {
              method: "POST",
              headers: SubscribeAPI.getHeader(),
              body: JSON.stringify({
                email,
                contactListId,
                fields: fieldsArray,
              }),
            }).then((res) => res.json())

            if (emailData.code !== SubscribeAPI.CODE.SUCCESS) {
              if (trytimes > 0) {
                return await checkEmail()
              }
              return emailData
            }
          }
        
          return
        } catch (error) {
          console.error(error);
        }
      }

      const emailData = await checkEmail()
      if (emailData) {
        return emailData
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
    showEmailOptIn() {
      return document.getElementById('subscription-email-opt-in-box').removeAttribute("style");
    },
    setEmailOptIn(value) {
      if (value) {
        return document.getElementById('subscription-email-opt-in').setAttribute("checked", "checked");
      } else {
        return document.getElementById('subscription-email-opt-in').removeAttribute("checked");
      }
    },
    saveEmailStorage(email) {
      localStorage.setItem(DOMUtils.STORAGE_EMAIL, email);
    },
    removeEmailStorage() {
      localStorage.removeItem(DOMUtils.STORAGE_EMAIL);
    },

    getPhone() {
      return document.getElementById('subscription-phone').value;
    },
    getPhoneOptIn() {
      return document.getElementById('subscription-phone-opt-in').checked;
    },
    getPhoneCode() {
      return document.getElementById('subscription-phone-code').value;
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

    displaySMSError(message) {
      const el = document.getElementById("subscription-phone-error");
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

    async initPhoneCode() {
      const select = document.querySelector("#subscription-phone-code")
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
        if (!value) {
          return
        }
        const selectStyle = window.getComputedStyle(select)
        const div = document.createElement("div")
        div.style.position = "absolute"
        div.style.visibility = "hidden"
        div.style.fontSize = selectStyle.fontSize
        div.style.fontFamily = selectStyle.fontFamily
        div.style.letterSpacing = selectStyle.letterSpacing
        div.style.paddingLeft = selectStyle.paddingLeft
        div.style.whiteSpace = "nowrap"
        div.innerText = value
        document.body.append(div)
        const width = div.offsetWidth
        div.remove()

        select.style.width = `${width}px`
        const input = document.querySelector("#subscription-phone")
        input.style.paddingLeft = `${width + 6}px`
      }

      select.addEventListener("change", setSelectWidth)
      setSelectWidth()
    }
  }
  //#endregion end DOM Utils

  const postSMSForm = async () => {
    try {
      const smsData = await SubscribeAPI.subscribeSMS();
      if (smsData.code !== SubscribeAPI.CODE.SUCCESS) {
        if (smsData.code === SubscribeAPI.CODE.PHONE_SIGNED) {
          DOMUtils.displaySMSError(t("phoneSigned"));
          // 邮箱已经绑定过了电话号码
        } else if (smsData.code === SubscribeAPI.CODE.WAIT_EMAIL) {
          DOMUtils.displaySMSError(t("emailSmsSubscribed"));
        } else {
          DOMUtils.displaySMSError(t("Oops"));
        }
        return
      }

      DOMUtils.hideError()
      DOMUtils.displaySMSError(t("success"));
    } catch (error) {
      DOMUtils.displaySMSError(t("Oops"));
      console.error(error);
    }
  }

  const postEcoflowSubscribeApiAndSubmitForm = async () => {
    DOMUtils.hideError()

    const email = DOMUtils.getEmail()
    const phone = DOMUtils.getPhone();
    const code = DOMUtils.getPhoneCode();
    const isValidateEmail = validateEmail(email);
    const isValidatePhone = validatePhone(code, phone);
    const isPhoneOptIn = DOMUtils.getPhoneOptIn();
    const isEmailOptIn = DOMUtils.getEmailOptIn();

    if (!email || !phone || !isValidateEmail || !isValidatePhone || !isEmailOptIn || !isPhoneOptIn) {
      !isPhoneOptIn && DOMUtils.displaySMSError(t("phoneOptIn"));
      !isEmailOptIn && DOMUtils.displayEmailError(t("emailOptIn"));
      !isValidatePhone && DOMUtils.displaySMSError(t("phoneValid"));
      !isValidateEmail && DOMUtils.displayEmailError(t("emailValid"));
      !phone && DOMUtils.displaySMSError(t("phoneEmpty"));
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
    } catch (error) {
      DOMUtils.displayEmailError(t("Oops"));
      console.error(error);
    }

    // POST SMS
    // 1s delay to send the request
    // https://3.basecamp.com/3926929/buckets/27531426/todos/7502729698#__recording_7512892539
    await new Promise(resolve => setTimeout(resolve, 1 * 1000));
    return await postSMSForm();
  };

  /**
   * 1. URL 有 email 参数时, 自动填充email
   * or
   * 2. 检查Shopify Customer是否订阅了邮件, 已订阅邮箱不需要显示邮箱订阅checkbox
   * @returns 
   */
  async function initialize() {
    DOMUtils.initPhoneCode()
    const obj = await ShopifyObjectApi.queryLiquidObject()
    let email = DOMUtils.getUrlEmail()

    if (!email) {
      // 未登录 或者 未订阅
      if (!obj.customer || !obj.customer.email) {
        DOMUtils.showEmailOptIn()
        return
      }

      email = obj.customer.email;
    }

    // email 存在
    // 自动填充
    DOMUtils.setEmail(email)

    try {
      const info = await SubscribeAPI.searchSubInfo({ email: email })
      if (!info.code === SubscribeAPI.CODE.SUCCESS) {
        return
      }

      // 未订阅 显示邮箱订阅checkbox
      if (!info.data.acceptsMarketing) {
        DOMUtils.showEmailOptIn()
      } else {
        // 不显示但是默认勾选
        DOMUtils.setEmailOptIn(true)
      }
    } catch (error) {
      console.error(error);
      DOMUtils.showEmailOptIn()
    }
  }

  initialize()

  DOMUtils.getSubmitBtnEl()
    .addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.classList.contains('btn--disabled')) return;
      e.target.classList.add('btn--disabled');
      e.target.querySelector('.loader').classList.remove('hide');
      postEcoflowSubscribeApiAndSubmitForm().finally(() => {
        e.target.classList.remove('btn--disabled');
        e.target.querySelector('.loader').classList.add('hide');
      });
    });
});
