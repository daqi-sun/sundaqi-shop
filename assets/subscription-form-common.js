// Mainly to provide common functions for the emarsys email subscription sections js file

// -------- Common Functions -------- //
// Extract the key-value pairs from the JSON object that match a specific format
// e.g. {single_1_id: "1", single_1_value: "1", single_1_overwrite: "false" etc...}
function getKeyValuePairWithSpecificFormat (jsonObject, format) {
  // Initialize an empty object to hold the matching key-value pairs
  let result = {};

  // Iterate over each key-value pair in the JSON object
  for (let key in jsonObject) {
    // If the key matches the pattern "text_number", add it to the result object
    if (key.indexOf(format) === 0) {
      result[key] = jsonObject[key];
    }
  }

  return result;
};

// Group the objects by their number
// Reference: https://apifox.com/apidoc/shared-39dd366b-a30e-4bab-a065-63aa9c7469c7
// e.g.
// emial: massageJsonIntoArrayOfObjectsByPrefix("", obj, type)
// from {single_1_id: "1", single_1_value: "1", single_1_overwrite: "false" etc...}
// to [{id: "1", "type": "single", "value": "1", "overwrite": "false"}, {id: "2", "type": "single", "value": "2", "overwrite": "false"}...]
// e.g.
// sms: massageJsonIntoArrayOfObjectsByPrefix("sms_", obj, type)
// from {sms_single_1_id: "1", sms_single_1_value: "1", sms_single_1_overwrite: "false" etc...}
// to [{id: "1", "type": "single", "value": "1", "overwrite": "false"}, {id: "2", "type": "single", "value": "2", "overwrite": "false"}...]
function massageJsonIntoArrayOfObjectsByPrefix(prefix, obj, type) {
  let result = {};

  for (let key in obj) {
    // Extract the number part of the key
    let numberPart = key.match(/\d+/)[0];

    // If the resulting object doesn't have a property for this number, create it
    if (!result[numberPart]) {
      result[numberPart] = {};
    }

    // Determine the new key name
    let newKey = key.replace(
      `${prefix ? prefix : ''}${type === "text" ? "subscription_text" : type}_` + `${numberPart}_`,
      ""
    );

    // Assign the value to the new key in the grouped object
    if (type === "multiple" && newKey === "value") {
      // Convert the value to an array of numbers
      result[numberPart][newKey] = obj[key]
        .split(",")
        .map((item) => Number(item));
    } else if (type === "single" && newKey === "value") {
      // Convert the value to a number
      result[numberPart][newKey] = Number(obj[key]);
    } else {
      result[numberPart][newKey] = obj[key];
    }

    // Convert the overwrite value from string to boolean
    if (newKey === "overwrite")
      result[numberPart]["overwrite"] = JSON.parse(obj[key]);
    // Add the type property
    result[numberPart]["type"] = type;
  }

  // Convert the resulting object to an array of objects
  let arrayResult = Object.values(result);

  // Remove empty objects
  arrayResult = arrayResult.filter((item) => item.id !== "");

  return arrayResult;
}

function massageJsonIntoArrayOfObjects (obj, type) {
  return massageJsonIntoArrayOfObjectsByPrefix("", obj, type);
}

function massageSMSJsonIntoArrayOfObjects  (obj, type) {
  return massageJsonIntoArrayOfObjectsByPrefix("sms_", obj, type);
}

function validateEmail (email) {
  var regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

/**
 * @param {string} code like: +1 or +111
 * @param {string} phone like: 1234567890
 * @returns {boolean}
 */
function validatePhone (code, phone) {
  const text = `${code.substring(1)}${phone}`;
  return /^\d{8,15}$/.test(text);
}

function createTraceId () {
  const date = new Date();
  const year = `00${date?.getFullYear()}`.slice(-2);
  const month = `00${date.getMonth() + 1}`.slice(-2);
  const day = `00${date.getDay()}`.slice(-2);
  const hour = `00${date.getHours()}`.slice(-2);
  const minute = `00${date.getMinutes()}`.slice(-2);
  const second = `00${date.getSeconds()}`.slice(-2);
  const millSecond = `000${date.getMilliseconds()}`.slice(-3);
  const randomStr1 = `${Math.random()}`;
  const randomStr2 = `${Math.random()}`;
  return (
    year +
    month +
    day +
    hour +
    minute +
    second +
    millSecond +
    randomStr1.slice(-8) +
    randomStr2.slice(-9)
  );
};

function getContactListId (json) {
  return json.contact_list_id;
};

function getSMSContactListId (json) {
  return json.sms_contact_list_id;
};

function createFieldsArray (json) {
  // REMARKS: settingsJson is defined in the pdp-subscription-form.liquid section or other parent sections
  let getSingleObjects = getKeyValuePairWithSpecificFormat(
    json,
    "single_"
  );
  let getTextObjects = getKeyValuePairWithSpecificFormat(
    json,
    "subscription_text_"
  );
  let getMultipleObjects = getKeyValuePairWithSpecificFormat(
    json,
    "multiple_"
  );
  
  let singleObjectsArray = massageJsonIntoArrayOfObjects(
    getSingleObjects,
    "single"
  );
  let textObjectsArray = massageJsonIntoArrayOfObjects(getTextObjects, "text");
  let multipleObjectsArray = massageJsonIntoArrayOfObjects(
    getMultipleObjects,
    "multiple"
  );
  
  return [
    ...singleObjectsArray,
    ...textObjectsArray,
    ...multipleObjectsArray,
  ];
};

function createSMSFieldsArray (json) {
  // REMARKS: settingsJson is defined in the footer.liquid newsletter block or other parent sections
  let getSingleObjects = getKeyValuePairWithSpecificFormat(
    json,
    "sms_single_"
  );
  let getTextObjects = getKeyValuePairWithSpecificFormat(
    json,
    "sms_subscription_text_"
  );
  let getMultipleObjects = getKeyValuePairWithSpecificFormat(
    json,
    "sms_multiple_"
  );
  
  let singleObjectsArray = massageSMSJsonIntoArrayOfObjects(
    getSingleObjects,
    "single"
  );
  let textObjectsArray = massageSMSJsonIntoArrayOfObjects(getTextObjects, "text");
  let multipleObjectsArray = massageSMSJsonIntoArrayOfObjects(
    getMultipleObjects,
    "multiple"
  );
  
  return [
    ...singleObjectsArray,
    ...textObjectsArray,
    ...multipleObjectsArray,
  ];
};
// -------- Common Functions -------- //

// -------- Common Variables --------//
window.traceId = createTraceId();
