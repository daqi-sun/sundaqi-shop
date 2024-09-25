// REMARKS:
// Variables and functions are stored in subscription-form-common.js
// settingsJson should be defined in the liquid section

document.addEventListener("DOMContentLoaded", function () {
  const postEcoflowSubscribeApiAndSubmitForm = async () => {
    const email = document.getElementById("contact_email").value;
    // createFieldsArray and getContactListId function in subscription-form-common.js
    const fieldsArray = createFieldsArray(pdpSettingJsons);
    const contactListId = getContactListId(pdpSettingJsons);
    // Extract theme global variables from theme.liquid
    const { apiUrl, acceptedLanguage, apiKey, xAppid } =
      theme.emailSubscription;
      
    document.getElementById("pdp-subscription-error").removeAttribute("style");

    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      document.getElementById("pdp-subscription-error").innerText =
        "Please enter a valid email address";
      document.getElementById("pdp-subscription-error").style.display = "block";
      return;
    }

    const apiBody = {
      email,
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
        document
          .getElementById("pdp-subscription-error")
          .removeAttribute("style");
        document.getElementById("pdp-subscription-submit-hidden").click();
      } else {
        document.getElementById("pdp-subscription-error").style.display =
          "block";
        document.getElementById("pdp-subscription-error").innerText =
          "Oops... Something went wrong, please refresh and try again.";
      }
    } catch (error) {
      document.getElementById("pdp-subscription-error").innerText =
        "Oops... Something went wrong, please refresh and try again.";
      console.log(error);
    }
  };

  document
    .getElementById("pdp-subscription-submit-button")
    .addEventListener("click", (e) => {
      e.preventDefault();
      postEcoflowSubscribeApiAndSubmitForm();
    });
});
