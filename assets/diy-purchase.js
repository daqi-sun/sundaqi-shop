document.addEventListener('DOMContentLoaded', function () {
  const selectedVariantItems = { items: [] }
  var priceFormat = theme.priceCurrencyCodeEnable ? theme.moneyFormatWithCurrency : theme.moneyFormat;
  const qtySelectors = document.querySelectorAll('.diy-purchase__option__qty');
  const taxExemptionCheckbox = document.querySelector('input[name="confirm-tax-exemption"]');
  const taxExemptionLabel = document.querySelector('.confirm-tax-exemption');
  const taxExemptionErrorMsg = document.querySelector('.confirm-tax-exemption__error-msg');
  const radioButtons = document.querySelectorAll('.diy-purchase__form-group input[type="radio"]');
  const totalPriceElement = document.querySelector('[data-total-price]');
  const compareAtPriceElement = document.querySelector('.diy-footer__compare-at-price[data-compare-at-price]');
  const dicountedPriceElement = document.querySelector('[data-discounted-price]');
  const comparePriceWrapper = document.querySelector('.diy-footer__compare-price');
  const showSubOptions = document.querySelectorAll('[data-show-sub-options]');
  const viewMoreButtons = document.querySelectorAll('[data-view-more-button]');
  const tabButtons = document.querySelectorAll('input[name="diy-purchase-option"]');
  const tabForms = document.querySelectorAll('.diy-purchase__form');
  const diyPurchaseItemPrices = document.querySelectorAll('.diy-purchase__price');
  const checkoutButton = document.querySelector('[data-checkout-button]');
  const checkoutButtonText = checkoutButton.querySelector('.btn__text');
  const checkoutButtonLoader = checkoutButton.querySelector('[data-loader]');
  const microInverterEUs = document.querySelectorAll('input[data-country="eu"][name="micro-inverter"]');
  const urlParams = getUrlParams();
  const diyPurchaseOption = urlParams['diy-purchase-option'];
  const dataInfos = document.querySelectorAll('[data-info]');

  // create tooltip when hover on data-info element
  dataInfos.forEach(dataInfo => {
    const dataInfoText = dataInfo.getAttribute('data-info');
    const tooltip = document.createElement('div');
    tooltip.classList.add('diy-purchase__tooltip');
    tooltip.innerHTML = dataInfoText;
    dataInfo.appendChild(tooltip);


    // close the tooltip
    function closeTooltip() {
      tooltip.classList.remove('diy-purchase__tooltip--active');
    }

    // on mobile remove mouseenter event and create click event
    function renderTooltip(windowWidth) {

      if(windowWidth < 750) {
        // create on touch
        dataInfo.addEventListener('touchstart', () => {
          tooltip.classList.add('diy-purchase__tooltip--active');

          // append blur div in the body
          const blurBackground = document.createElement('div');
          blurBackground.classList.add('blur-background', 'diy-purchase__tooltip--blur-background');

          const tooltipCloseButton = document.createElement('div');
          tooltipCloseButton.classList.add('tooltip-close-button');

          if(!document.querySelector('.diy-purchase__tooltip--blur-background')) {
            tooltip.after(blurBackground);
            tooltip.append(tooltipCloseButton);

            // add diy-purchase__tooltip-rendered class to body
            document.body.classList.add('diy-purchase__tooltip-rendered');

            // close popup
            setTimeout(() => {
              function closeTooltipAndRemoveClasses() {
                closeTooltip();
                blurBackground.remove();
                document.body.classList.remove('diy-purchase__tooltip-rendered');
              }
              tooltipCloseButton.addEventListener('click', closeTooltipAndRemoveClasses);
              blurBackground.addEventListener('click', closeTooltipAndRemoveClasses);
            }, 250)
          }

        });
      } else {
        if(document.querySelector('.diy-purchase__tooltip--blur-background')) document.querySelector('.diy-purchase__tooltip--blur-background').remove()
        if(document.querySelector('.diy-purchase__tooltip--active')) document.querySelector('.diy-purchase__tooltip--active').classList.remove('diy-purchase__tooltip--active')

        dataInfo.addEventListener('mouseenter', () => {
          tooltip.classList.add('diy-purchase__tooltip--active');
        });

        dataInfo.addEventListener('mouseleave', () => {
          closeTooltip()
          if(document.querySelector('.diy-purchase__tooltip--blur-background')) document.querySelector('.diy-purchase__tooltip--blur-background').remove()
        });
      }
    }

    renderTooltip(window.innerWidth)

    var doit;
    window.onresize = function() {
        clearTimeout(doit);
        doit = setTimeout(function() {
          renderTooltip(window.innerWidth)
        }, 100);
    };

  });

  taxExemptionCheckbox.addEventListener('change', () => {
    if(!taxExemptionErrorMsg.classList.contains('hide')) taxExemptionErrorMsg.classList.add('hide');
    if (taxExemptionCheckbox.checked) {
      microInverterEUs.forEach(radioButton => {
        radioButton.disabled = true;
      });
    } else {
      microInverterEUs.forEach(radioButton => {
        radioButton.disabled = false;
      });
    }

    updateAllPrices()
  });

  const microInverterEULabels = document.querySelectorAll('.diy-purchase__option-eu-micro-inverter');
  microInverterEULabels.forEach(label => {
    label.addEventListener('click', event => {
      if (taxExemptionCheckbox.checked) {
        taxExemptionErrorMsg.classList.remove('hide');
        setTimeout(() => {
          taxExemptionErrorMsg.classList.add('hide');
        }, 4000);
      }

    });
  });

  taxExemptionLabel.addEventListener('click', () => {
    if(taxExemptionCheckbox.disabled) {
      taxExemptionErrorMsg.classList.remove('hide');
    }
  });

  function updateAllPrices() {
    const formGroups = document.querySelectorAll('.diy-purchase__form-group');
    formGroups.forEach(formGroup => {
      const radioButton = formGroup.querySelector('input[type="radio"]:checked');
      if(radioButton) {
        radioButton.dispatchEvent(new Event('change'));
      }
    });
  }

  qtySelectors.forEach(selector => {
    const formGroup = selector.closest('.diy-purchase__form-group');
    const qtyInput = selector.querySelector('.product-form__input--quantity');
    const minQuantityValue = parseInt(qtyInput.getAttribute('min'));
    const minQuantity = minQuantityValue > 0 ? minQuantityValue : 0;
    const wattValue = selector.querySelector('.diy-purchase__watt-value');
    const dataWattValue = qtyInput.dataset.watt;
    const minusBtn = selector.querySelector('.minus_btn');
    const plusBtn = selector.querySelector('.plus_btn');
    const priceElement = formGroup.querySelector('.diy-purchase__price');

    // check if formGroup has item-selected class then remove it
    function toggleItemSelection(formGroup, qty) {
      if(qty === 0) {
        if (formGroup.classList.contains('item-selected')) formGroup.classList.remove('item-selected');
        checkRadioInputs();
      } else {
        if (!formGroup.classList.contains('item-selected')) {
          formGroup.classList.add('item-selected');
          checkRadioInputs();
        }
      }
    }

    minusBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const qty = parseInt(qtyInput.value);
      const dataQuantityRadio = minusBtn.closest('.diy-purchase__option').querySelector('input[type="radio"][data-quantity]');

      if (qty > minQuantity) {
        qtyInput.value = qty - 1;
        if(wattValue) wattValue.textContent = dataWattValue * qtyInput.value;
        if(dataQuantityRadio) dataQuantityRadio.setAttribute('data-quantity', 'minus');
        updatePrice(minusBtn.closest('.diy-purchase__option').querySelector('input[type="radio"][data-quantity]'));
      }
      if (parseInt(qtyInput.value) === 0) {

        minusBtn.classList.add('disabled');
        priceElement.style.display = 'none';
        if(dataQuantityRadio) dataQuantityRadio.setAttribute('data-quantity', '');

        function updateDiyImages() {
          const defaultImage = document.querySelector(`[data-category="${dataQuantityRadio.dataset.category}"][data-image="default"]`);
          const omnibusImage = document.querySelector(`[data-image="omnibus"]`);
          const imagesToHide = document.querySelectorAll(`.diy-purchase__image[data-category="${dataQuantityRadio.dataset.category}"]:not([data-image="default"])`);

          omnibusImage.classList.add('hide');
          defaultImage.classList.remove('hide');
          imagesToHide.forEach(image => image.classList.add('hide'));
        }
        if(dataQuantityRadio.dataset.category) updateDiyImages();

      } else {
        minusBtn.classList.remove('disabled');
      }

      toggleItemSelection(formGroup, parseInt(qtyInput.value));
    });

    plusBtn.addEventListener('click', (event) => {
      event.preventDefault();

      qtyInput.value = parseInt(qtyInput.value) + 1;
      minusBtn.classList.remove('disabled');
      if(wattValue) wattValue.textContent = dataWattValue * qtyInput.value;

      // check dataQuantity radio if quantiy start with 0
      const dataQuantityRadio = plusBtn.closest('.diy-purchase__option').querySelector('input[type="radio"][data-quantity]');
      if(dataQuantityRadio) dataQuantityRadio.checked = true;
      if(dataQuantityRadio) dataQuantityRadio.setAttribute('data-quantity', 'plus');
      updatePrice(plusBtn.closest('.diy-purchase__option').querySelector('input[type="radio"]:checked'));

      // check if priceElement has display none then shows it
      if(priceElement.style.display === 'none') priceElement.style.display = ''; // Show price element

      function updateDiyImages() {
        const selectedImage = document.querySelector(`[data-category="${dataQuantityRadio.dataset.category}"][data-image="${dataQuantityRadio.dataset.image}"]`);
        const omnibusImage = document.querySelector(`[data-image="omnibus"]`);
        const imagesToHide = document.querySelectorAll(`.diy-purchase__image[data-category="${dataQuantityRadio.dataset.category}"]:not([data-image="${dataQuantityRadio.dataset.image}"])`);

        omnibusImage.classList.add('hide');
        selectedImage.classList.remove('hide');
        imagesToHide.forEach(image => image.classList.add('hide'));
      }

      if(dataQuantityRadio.dataset.category) updateDiyImages();

      toggleItemSelection(formGroup, parseInt(qtyInput.value));
    });

    // create change event for qtyInput
    qtyInput.addEventListener('change', () => {
      const qty = parseInt(qtyInput.value);
      const inputRadio = qtyInput.closest('.diy-purchase__option').querySelector('input[type="radio"]');

      // set input to check
      if(!inputRadio.checked) inputRadio.checked = true;

      if (qty > minQuantity) {
        if(wattValue) wattValue.textContent = dataWattValue * qtyInput.value;
      }
      if (parseInt(qtyInput.value) === 0) {
        minusBtn.classList.add('disabled');
        priceElement.style.display = 'none';

        // uncheck dataQuantity radio
        const dataQuantityRadio = minusBtn.closest('.diy-purchase__option').querySelector('input[type="radio"][data-quantity]');
        if(dataQuantityRadio) dataQuantityRadio.checked = false;

        function updateDiyImages() {
          const defaultImage = document.querySelector(`[data-category="${dataQuantityRadio.dataset.category}"][data-image="default"]`);
          const omnibusImage = document.querySelector(`[data-image="omnibus"]`);
          const imagesToHide = document.querySelectorAll(`.diy-purchase__image[data-category="${dataQuantityRadio.dataset.category}"]:not([data-image="default"])`);

          omnibusImage.classList.add('hide');
          defaultImage.classList.remove('hide');
          imagesToHide.forEach(image => image.classList.add('hide'));
        }
        if(dataQuantityRadio.dataset.category) updateDiyImages();
      } else {
        minusBtn.classList.remove('disabled');
      }

      toggleItemSelection(formGroup, parseInt(qtyInput.value));
    });

    // create a function to update .diy-purchase__price when minus or add
    function updatePrice(radioButton) {
      const formGroup = radioButton.closest('.diy-purchase__form-group')
      const priceElement = formGroup.querySelector('.diy-purchase__price');
      const qty = parseInt(formGroup.querySelector('.product-form__input--quantity').value);

      // Check if the "confirm-tax-exemption" checkbox is checked
      const isTaxExemptionChecked = taxExemptionCheckbox && taxExemptionCheckbox.checked;
      // Get the selected radio button's data attributes
      const dataPrice = radioButton.getAttribute('data-price');
      const dataPriceNoVatValue = radioButton.getAttribute('data-price-no-vat');
      const dataPriceNoVat = dataPriceNoVatValue != '' ? radioButton.getAttribute('data-price-no-vat'): dataPrice;
      const price = isTaxExemptionChecked ? (dataPriceNoVat * qty) : (dataPrice * qty);

      let formattedPrice;
      if(price > 999900){
        formattedPrice = theme.Currency.formatMoney(price, priceFormat).replace('EUR','').replace(',00','').replace('.',' ');
      }
      else{
        formattedPrice = theme.Currency.formatMoney(price, priceFormat).replace('EUR','').replace(',00','').replace('.','');
      }

      priceElement.textContent = formattedPrice;


      // dispatch change even to diy-purchase__option input[type="radio"] to update prices
      radioButton.dispatchEvent(new Event('change'));
    }

  });

  // add event listener to each tab button
  tabButtons.forEach(function(tabButton) {
    tabButton.addEventListener('change', function() {
      // get the form ID associated with the selected radio button
      const formId = this.getAttribute('data-form-id');

      // remove the active class from all the tabForm
      tabForms.forEach(tabForm => tabForm.classList.remove('diy-purchase__form--active'));

      // add hide class to all .diy-purchase__form-group--sub-options
      const subOptions = document.querySelectorAll('.diy-purchase__form-group--sub-options');
      subOptions.forEach(subOption => {
        if(!subOption.classList.contains('hide')) subOption.classList.add('hide')
      })

      // reset tax exemption checkbox
      taxExemptionCheckbox.disabled = false;
      if(!taxExemptionErrorMsg.classList.contains('hide')) taxExemptionErrorMsg.classList.add('hide');

      // add the active class to the selected form
      const selectedForm = document.getElementById(formId);
      selectedForm.classList.add('diy-purchase__form--active');

      // reset the price
      radioButtons.forEach(radioButton => radioButton.checked = false);

      // hide diy-purchase__price
      diyPurchaseItemPrices.forEach(diyPurchaseItemPrice => diyPurchaseItemPrice.innerHTML = '');

      // show image omnibus
      const omnibusImage = document.querySelector(`[data-image="omnibus"]`);
      if(omnibusImage.classList.contains('hide')) omnibusImage.classList.remove('hide');

      // reset accordion if there is diy-purchase__accordion-item--active
      const activeAccordion = document.querySelector('.diy-purchase__accordion-item--active');
      if(activeAccordion) activeAccordion.classList.remove('diy-purchase__accordion-item--active');

      // reset all requiredFormGroup i.e. remove item-selected class
      const requiredFormGroup = document.querySelectorAll('.diy-purchase__form--active .diy-purchase__form-group[data-required]');
      requiredFormGroup.forEach(formGroup => formGroup.classList.remove('item-selected'));

      // Disable checkout button
      checkoutButton.disabled = true;

      // reset the "total price"
      totalPriceElement.textContent = '';
      compareAtPriceElement.textContent = '';
      dicountedPriceElement.textContent = '';
      if(!comparePriceWrapper.classList.contains('hide')) comparePriceWrapper.classList.add('hide');


      if(formId === 'diy') {
        // show customizeImageWrapper if it is hidden
        const customizeImageWrapper = document.querySelector('.diy-purchase__image-wrapper');
        if(customizeImageWrapper.classList.contains('hide')) customizeImageWrapper.classList.remove('hide');

        // add hide class to all diy-purchase__slider
        const sliders = document.querySelectorAll('.diy-purchase__slider');
        sliders.forEach(slider => {
          if(!slider.classList.contains('hide')) slider.classList.add('hide')
        })
        if(diyPurchaseOption == 'diy') {
          initUrlParams();
        }
      } else {
        if(diyPurchaseOption == 'feature-bundle') {
          initUrlParams();
        } else {
          // pre-select first bundle option
          const firstAccordionButton = document.querySelector(`#${formId} .diy-purchase__accordion-button`);
          const formGroup = firstAccordionButton.closest('.diy-purchase__form-group');
          const inputRadio = firstAccordionButton.closest('.diy-purchase__form-group').querySelector('input[type="radio"]');
          const accordionItem = firstAccordionButton.closest('.diy-purchase__accordion-item');

          formGroup.classList.add('item-selected')
          accordionItem.classList.add('diy-purchase__accordion-item--active')
          inputRadio.checked = true
          inputRadio.dispatchEvent(new Event('change'))
        }
      }
    });
  });

  // on load: pre-select first bundle option if featuerd-bundle is active
  const checkedFormId = document.querySelector('input[name="diy-purchase-option"]:checked').getAttribute('data-form-id');
  if(checkedFormId === 'feature-bundle' && !diyPurchaseOption) {
    // Only pre-select first bundle option if diy-purchase-option is not set in the URL
    setTimeout(() => {
      // pre-select first bundle option
      const firstAccordionButton = document.querySelector(`#${checkedFormId} .diy-purchase__accordion-button`);
      const formGroup = firstAccordionButton.closest('.diy-purchase__form-group');
      const inputRadio = firstAccordionButton.closest('.diy-purchase__form-group').querySelector('input[type="radio"]');
      const accordionItem = firstAccordionButton.closest('.diy-purchase__accordion-item');

      formGroup.classList.add('item-selected')
      accordionItem.classList.add('diy-purchase__accordion-item--active')
      inputRadio.checked = true
      inputRadio.dispatchEvent(new Event('change'))
    }, 1000);
  }

  viewMoreButtons.forEach(viewMoreButton => {
    viewMoreButton.addEventListener('click', () => {
      const formGroup = viewMoreButton.closest('.diy-purchase__form-group');
      const viewMoreContent = formGroup.querySelector('.diy-purchase__options--more');

      viewMoreContent.classList.toggle('hide');

      // use data-view-text to change the text of the button
      const viewText = viewMoreButton.getAttribute('data-view-text');
      const hideText = viewMoreButton.getAttribute('data-hide-text');

      if (viewMoreContent.classList.contains('hide')) {
        viewMoreButton.textContent = viewText;
      } else {
        viewMoreButton.textContent = hideText;
      }
    });
  });

  showSubOptions.forEach(showSubOption => {
    showSubOption.addEventListener('change', () => {
      const thisId = showSubOption.getAttribute('data-show-sub-options');
      const thisOptions = document.querySelector(`#${thisId}`);

      if (showSubOption.checked) thisOptions.classList.remove('hide');
    });
  });

  // create click event for checkoutButton
  checkoutButton.addEventListener('click', function() {

    checkoutButtonText.classList.add('btn__text--visually-hidden');
    checkoutButtonLoader.classList.remove('hide');

    // Disable checkout button
    checkoutButton.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(selectedVariantItems),
    })
    .then(response => {
      console.log('response', response)

      // Redirect to checkout page
      // window.location.href = '/checkout';

      // open cart drawer
      theme.Cart.prototype._onProductAdded();

      // reset checkout/ATC button
      checkoutButtonText.classList.remove('btn__text--visually-hidden');
      checkoutButtonLoader.classList.add('hide');

      // Enable checkout button
      checkoutButton.disabled = false;

    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });

  // Add event listener to each radio input
  function checkRadioInputs() {
    const requiredFormGroup = document.querySelectorAll('.diy-purchase__form--active .diy-purchase__form-group[data-required]');

    // check name="diy-purchase-option" checked data-form-id value
    const selectedTabButton = document.querySelector('input[name="diy-purchase-option"]:checked');
    const selectedTabButtonFormId = selectedTabButton.getAttribute('data-form-id');

    // check if all requiredFormGroup has item-selected class
    let allSelected = true;
    if(selectedTabButtonFormId === 'feature-bundle') {
      const selectedFormGroup = document.querySelectorAll('.diy-purchase__form--active .diy-purchase__form-group.item-selected');
      if(selectedFormGroup.length < 1) allSelected = false;
    }else {
      requiredFormGroup.forEach(formGroup => {
        if(!formGroup.classList.contains('item-selected')) {
          allSelected = false;
        }
      });
    }

    // Enable or disable checkout button based on whether at least one radio input is checked for each data-category
    if (allSelected) checkoutButton.disabled = false;
    else checkoutButton.disabled = true;
  }

  function calculateBundlePriceSums(radioButton) {
    const bundlePriceValues = radioButton.getAttribute('data-price').split(',');
    const bundlePriceNoVatValues = radioButton.getAttribute('data-price-no-vat').split(',');
    const bundleComparePriceValues = radioButton.getAttribute('data-compare-at-price').split(',');
    const bundleComparePriceNoVatValues = radioButton.getAttribute('data-compare-at-price-no-vat').split(',');

    const bundlePriceSum = bundlePriceValues.reduce((a, b) => parseInt(a) + parseInt(b), 0);

    let bundlePriceNoVatSum = 0;
    if (
      bundlePriceNoVatValues.length === 0 ||
      bundlePriceNoVatValues.some((value) => value === '' || isNaN(parseInt(value)))
    ) {
      bundlePriceNoVatSum = bundlePriceValues.reduce((a, b, index) => {
        const currentValue = isNaN(parseInt(bundlePriceNoVatValues[index]))
          ? bundlePriceValues[index]
          : bundlePriceNoVatValues[index];
        return parseInt(a) + parseInt(currentValue);
      }, 0);
    } else {
      bundlePriceNoVatSum = bundlePriceNoVatValues.reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }

    const bundleComparePriceSum = bundleComparePriceValues.reduce((a, b) => parseInt(a) + parseInt(b), 0);

    let bundleComparePriceNoVatSum = 0;
    if (
      bundleComparePriceNoVatValues.length === 0 ||
      bundleComparePriceNoVatValues.some((value) => value === '' || isNaN(parseInt(value)))
    ) {
      bundleComparePriceNoVatSum = bundleComparePriceValues.reduce((a, b, index) => {
        const currentValue = isNaN(parseInt(bundleComparePriceNoVatValues[index]))
          ? bundleComparePriceValues[index]
          : bundleComparePriceNoVatValues[index];
        return parseInt(a) + parseInt(currentValue);
      }, 0);
    } else {
      bundleComparePriceNoVatSum = bundleComparePriceNoVatValues.reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }

    return {
      bundlePriceSum,
      bundlePriceNoVatSum,
      bundleComparePriceSum,
      bundleComparePriceNoVatSum,
    };
  }


  function formatMoney(price) {
    if(price > 999900) return theme.Currency.formatMoney(price, priceFormat).replace('EUR','').replace('.',' ').replace(',00','');
    else return theme.Currency.formatMoney(price, priceFormat).replace('EUR','').replace(',00','').replace('.','');
  }

  // Loop through each radio button
  radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', (event) => {

      //clear before the loop
      selectedVariantItems.items = [];

      console.log('selectedVariantItems', selectedVariantItems)

      // Get the parent form group element
      const formGroup = radioButton.closest('.diy-purchase__form-group');

      // Get the parent form group element
      const radioButtonAccordion = radioButton.closest('.diy-purchase__accordion');

      // remove active state for other accordion in the same option group (if any)
      if(!radioButtonAccordion || radioButtonAccordion == null) {
        const activeAccordion = formGroup.querySelector('.diy-purchase__accordion .diy-purchase__accordion-item--wrapper-select.diy-purchase__accordion-item--active')
        if(activeAccordion) {
          activeAccordion.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false) // uncheck all the radio buttons inside activeAccordion
          activeAccordion.classList.remove('diy-purchase__accordion-item--active')
        }
      }

      // Get the price element within the form group
      const priceElement = formGroup.querySelector('.diy-purchase__price');

      // Check if the "confirm-tax-exemption" checkbox is checked
      const isTaxExemptionChecked = taxExemptionCheckbox && taxExemptionCheckbox.checked;

      const microInverterOptions = document.querySelectorAll('input[name="micro-inverter"]');
      let selectedCountry = '';

      microInverterOptions.forEach((option) => {
        if (option.checked) {
          selectedCountry = option.getAttribute('data-country');
        }
      });

      // add item-selected class to formGroup
      formGroup.classList.add('item-selected');

      // Get the selected radio button's data attributes
      const dataPrice = radioButton.getAttribute('data-price');
      const dataPriceNoVatValue = radioButton.getAttribute('data-price-no-vat');
      const dataPriceNoVat = dataPriceNoVatValue != '' ? parseInt(dataPriceNoVatValue) : parseInt(dataPrice);

      const dataCompareAtPrice = parseInt(radioButton.getAttribute('data-compare-at-price'));
      const dataCompareAtPriceNoVatValue = parseInt(radioButton.getAttribute('data-compare-at-price-no-vat'));

      const dataNoThanks = radioButton.hasAttribute('data-no-thanks');
      const dataQuantity = radioButton.hasAttribute('data-quantity');

      let bundleSums, bundlePriceSum, bundlePriceNoVatSum, bundleComparePriceSum, bundleComparePriceNoVatSum, priceDisplay
      if(radioButton.hasAttribute('data-bundle')) {
        bundleSums = calculateBundlePriceSums(radioButton);
        bundlePriceSum = bundleSums.bundlePriceSum;
        bundlePriceNoVatSum = bundleSums.bundlePriceNoVatSum;
        bundleComparePriceSum = bundleSums.bundleComparePriceSum;
        bundleComparePriceNoVatSum = bundleSums.bundleComparePriceNoVatSum;
      }

      // Determine which price to use based on the selected radio button and checkbox values
      let price;
      if (dataNoThanks) {
        priceElement.style.display = 'none'; // Hide price element
      } else if (dataQuantity) {
        const qty = radioButton.closest('.diy-purchase__option').querySelector('.product-form__input--quantity');
        const qtyButtonType = radioButton.getAttribute('data-quantity');

        if(qty.value == 0 && qtyButtonType == 'minus') radioButton.checked = false;
        if(qty.value == 0 && qtyButtonType != 'minus') qty.value = 1;

        const dataPriceTotal = parseInt(dataPrice * qty.value);
        const dataPriceNoVatTotal = parseInt(dataPriceNoVat * qty.value);

        const dataCompareAtPriceTotal = parseInt(dataCompareAtPrice * qty.value);
        const dataCompareAtPriceNoVatTotal = parseInt(dataCompareAtPriceNoVatValue * qty.value);

        const bundlePriceSumTotal = parseInt(bundlePriceSum * qty.value);
        const bundlePriceNoVatSumTotal = parseInt(bundlePriceNoVatSum * qty.value);

        if(radioButton.hasAttribute('data-bundle')) {
          priceDisplay = dataCompareAtPrice != '' ? checkCompareAtPriceVsPrice(dataCompareAtPriceTotal, bundlePriceSumTotal) : formatMoney(bundlePriceSumTotal);
          price = isTaxExemptionChecked && dataPriceNoVatValue != '' ? formatMoney(bundlePriceNoVatSumTotal) + ` <span class="diy-purchase__price-no-vat"><s>${formatMoney(bundlePriceSumTotal)}</s><i>|</i> 0% VAT</span>` : priceDisplay;
        } else {
          priceDisplay = dataCompareAtPrice != '' ? checkCompareAtPriceVsPrice(dataCompareAtPriceTotal, dataPriceTotal) : formatMoney(dataPriceTotal);
          price = isTaxExemptionChecked && dataPriceNoVatValue != '' ? formatMoney(dataPriceNoVatTotal) + ` <span class="diy-purchase__price-no-vat"><s>${formatMoney(dataCompareAtPriceNoVatTotal)}</s><i>|</i> 0% VAT</span>` : priceDisplay;
        }
        priceElement.style.display = ''; // Show price element

      } else if (selectedCountry === 'eu') {
        if(radioButton.hasAttribute('data-bundle')) {
          price = formatMoney(bundlePriceSum) || formatMoney(bundlePriceNoVatSum);
        } else {
          priceDisplay = dataCompareAtPrice != '' ? checkCompareAtPriceVsPrice(dataCompareAtPrice, dataPrice) : formatMoney(dataPrice);
          price = priceDisplay || formatMoney(dataPriceNoVat);
        }
        taxExemptionCheckbox.checked = false; // Deselect tax exemption checkbox
        priceElement.style.display = ''; // Show price element
      } else {
        if(radioButton.hasAttribute('data-bundle')) {
          priceDisplay = dataCompareAtPrice != '' ? checkCompareAtPriceVsPrice(bundleComparePriceSum, bundlePriceSum) : formatMoney(bundlePriceSum);
          price = isTaxExemptionChecked && dataPriceNoVatValue != '' ? formatMoney(bundlePriceNoVatSum) + ` <span class="diy-purchase__price-no-vat"><s>${formatMoney(bundleComparePriceNoVatSum)}</s><i>|</i> 0% VAT</span>` : priceDisplay;
        } else {
          priceDisplay = dataCompareAtPrice != '' ? checkCompareAtPriceVsPrice(dataCompareAtPrice, dataPrice) : formatMoney(dataPrice);
          price = isTaxExemptionChecked && dataPriceNoVatValue != '' ? formatMoney(dataPriceNoVat) + ` <span class="diy-purchase__price-no-vat"><s>${formatMoney(dataCompareAtPriceNoVatValue)}</s><i>|</i> 0% VAT</span>` : priceDisplay;
        }
        priceElement.style.display = ''; // Show price element

        if(!taxExemptionErrorMsg.classList.contains('hide')) taxExemptionErrorMsg.classList.add('hide');
      }

      function checkCompareAtPriceVsPrice(dataCompareAtPrice, dataPrice) {
        if(dataCompareAtPrice == dataPrice) {
          return formatMoney(dataPrice)
        } else {
          return formatMoney(dataPrice) + ` <span class="diy-purchase__price-no-vat"><s>${formatMoney(dataCompareAtPrice)}</s></span>`
        }
      }

      // show/hide sub options
      const subOptions = formGroup.querySelector('[data-show-sub-options]')
      if(subOptions && !dataNoThanks) {
        const thisId = subOptions.getAttribute('data-show-sub-options');
        const thisOptions = document.querySelector(`#${thisId}`);

        // check if thisOptions does not contain hide class
        if(!thisOptions.classList.contains('hide')) {
          thisOptions.classList.add('hide');

          // then uncheck all the radio buttons inside thisOptions
          const subRadioButtons = thisOptions.querySelectorAll('.diy-purchase__option input[type="radio"]');
          subRadioButtons.forEach(subRadioButton => {
            subRadioButton.checked = false;
          });

          // also hide the price element
          const subPriceElement = thisOptions.querySelector('.diy-purchase__price');
          subPriceElement.style.display = 'none';
        }
      }

      // Update the price element with the selected price
      if (priceElement) {
        priceElement.innerHTML = price || '';
      }

      // Disable tax exemption checkbox if country is EU
      if (taxExemptionCheckbox && selectedCountry === 'eu') {
        taxExemptionCheckbox.disabled = true;
      } else {
        taxExemptionCheckbox.disabled = false;
      }

      // selected tab buttons
      let formActive = document.querySelector('.diy-purchase__form--active')
      let activeRadioButtons = formActive.querySelectorAll('.diy-purchase__option input[type="radio"]');

      // Get the original price of each selected radio button
      const selectedOriginalPrices = Array.from(activeRadioButtons)
      .filter((radio, index) => radio.checked)
      .map((radio, index) => {
        let qty,
          dataPrice,
          dataPriceValues,
          bundleSums;
        const isQuantity = radio.hasAttribute('data-quantity');

        const radioCompareAtPrice = radio.getAttribute('data-compare-at-price');
        let radioDataPrice = radio.getAttribute('data-price');
        radioCompareAtPrice != '' ? radioDataPrice = radioCompareAtPrice : radioDataPrice = radioDataPrice

        let radioNoVatCompareAtPrice = radio.getAttribute('data-compare-at-price-no-vat');
        let radioNoVatDataPrice = radio.getAttribute('data-price-no-vat') != '' ? radio.getAttribute('data-price-no-vat') : radioDataPrice;

        let isMultiplePrice = radioDataPrice != null && radioDataPrice.includes(',')
        if(isQuantity) qty = parseInt(radio.closest('.diy-purchase__option').querySelector('.product-form__input--quantity').value);
        if(isMultiplePrice) bundleSums = calculateBundlePriceSums(radio);

        // check if radio.getAttribute('data-price-no-vat') has comma in it
        if(isMultiplePrice) dataPriceValues = bundleSums.bundlePriceSum
        else dataPriceValues = radio.getAttribute('data-price')

        if(isTaxExemptionChecked) {
          if(isMultiplePrice) radioNoVatCompareAtPrice != '' ? dataPriceValues = bundleSums.bundleComparePriceNoVatSum : dataPriceValues = bundleSums.bundlePriceSum
          else radioNoVatCompareAtPrice != '' ? dataPriceValues = radioNoVatCompareAtPrice : dataPriceValues = radioNoVatDataPrice
          dataPrice =  isQuantity ? dataPriceValues * qty : dataPriceValues
        }
        else {
          if(isMultiplePrice) dataPriceValues = dataCompareAtPrice != '' ? bundleSums.bundleComparePriceSum : bundleSums.bundlePriceSum
          else dataPriceValues = radioDataPrice
          dataPrice =  isQuantity ? dataPriceValues * qty : dataPriceValues
        }

        if(dataPrice) return  parseFloat(dataPrice)
        else return 0;
      });


      // Get the price (price or no vat price) of each selected radio button
      const selectedPrices = Array.from(activeRadioButtons)
      .filter((radio, index) => radio.checked)
      .map((radio, index) => {
        let qty,
          dataPriceNoVat,
          dataPrice,
          dataPriceNoVatValues,
          dataPriceValues,
          bundleSums;
        let dataVariantId = radio.getAttribute('data-variant-id');
        let dataVariantNoVatId = radio.getAttribute('data-variant-no-vat-id');
        const dataQuantity = radio.hasAttribute('data-quantity');
        let isMultiplePrice = radio.getAttribute('data-price') != null && radio.getAttribute('data-price').includes(',')
        let isMultipleNoVatPrice = radio.getAttribute('data-price-no-vat') != null && radio.getAttribute('data-price-no-vat').includes(',')
        if(dataQuantity) qty = radio.closest('.diy-purchase__option').querySelector('.product-form__input--quantity').value;

        if(isMultiplePrice) bundleSums = calculateBundlePriceSums(radio);

        // check if radio.getAttribute('data-price-no-vat') has comma in it
        if(isMultiplePrice) dataPriceValues = bundleSums.bundlePriceSum
        else dataPriceValues = radio.getAttribute('data-price')

        if(isMultipleNoVatPrice) dataPriceNoVatValues = bundleSums.bundlePriceNoVatSum
        else dataPriceNoVatValues = radio.getAttribute('data-price-no-vat')

        dataPriceNoVat = dataQuantity ? radio.getAttribute('data-price-no-vat') * qty : dataPriceNoVatValues
        dataPrice =  dataQuantity ? radio.getAttribute('data-price') * qty : dataPriceValues

        //let id = isTaxExemptionChecked ? parseInt(dataVariantNoVatId) : parseInt(dataVariantId);
        let quantity = dataQuantity ? parseInt(qty) : 1;

        if(dataVariantId != null) {
          // CH
          let dataVariantIdArray = dataVariantId.split(",")
          let dataVariantNoVatIdArray = dataVariantNoVatId.split(",")

          // for each dataVariantNoVatIdArray, if it is empty then assign dataVariantIdArray value
          dataVariantNoVatIdArray.forEach((str, index) => {
            if(str == '') dataVariantNoVatIdArray[index] = dataVariantIdArray[index]
          })

          selectedVariantIdArray = isTaxExemptionChecked ? dataVariantNoVatIdArray : dataVariantIdArray
          tempArray = selectedVariantIdArray.map((str, index) => {
            return { id: str, quantity: quantity };
          })
          selectedVariantItems.items = selectedVariantItems.items.concat(...tempArray);
          //
        }

        if(dataPriceNoVat || dataPrice) return  parseFloat( isTaxExemptionChecked && dataPriceNoVat != '' ? dataPriceNoVat : dataPrice )
        else return 0;
      });

      // Calculate the total original price by summing all selected prices
      const totalOriginalPrice = selectedOriginalPrices.reduce((total, price) => total + price, 0);

      // Calculate the total price (price or no vat price) by summing all selected prices
      const totalPrice = selectedPrices.reduce((total, price) => total + price, 0);

      // Calculate discount price
      const discountedPrice = totalOriginalPrice - totalPrice;

      // Update the "total price" element with the calculated value
      totalPriceElement.textContent =  formatMoney(totalPrice);

      if(totalOriginalPrice != totalPrice) {
        // Update the "compare at price" element with the calculated value
        compareAtPriceElement.textContent = formatMoney(totalOriginalPrice);

        // Update the "dicounted price" element with the calculated value
        dicountedPriceElement.textContent = '-' + formatMoney(discountedPrice);

        if(comparePriceWrapper.classList.contains('hide')) comparePriceWrapper.classList.remove('hide');

      } else {
        compareAtPriceElement.textContent = '';
        dicountedPriceElement.textContent = '';
        if(!comparePriceWrapper.classList.contains('hide')) comparePriceWrapper.classList.add('hide');
      }

      if(totalPrice == 0) _hideAllTotalPrice()

      function _hideAllTotalPrice() {
        totalPriceElement.textContent = '';
        compareAtPriceElement.textContent = '';
        dicountedPriceElement.textContent = '';
        if(!comparePriceWrapper.classList.contains('hide')) comparePriceWrapper.classList.add('hide');
      }

      function updateDiyImages() {
        // using slider as bundle images (gallery)
        if(radioButton.hasAttribute('data-bundle')) {
          const customizeImageWrapper = document.querySelector('.diy-purchase__image-wrapper');
          const sliderId = radioButton.dataset.image;

          // hide customizeImageWrapper when slider is active
          if(!customizeImageWrapper.classList.contains('hide')) customizeImageWrapper.classList.add('hide');

          // add hide class to all diy-purchase__slider
          const sliders = document.querySelectorAll('.diy-purchase__slider');
          sliders.forEach(slider => {
            if(!slider.classList.contains('hide')) slider.classList.add('hide')
          })

          // then remove class to sliderId div
          const selectedSlider = document.querySelector(`#${sliderId}`);
          selectedSlider.classList.remove('hide');

          // the reinstantiate the slick slider
          $(selectedSlider).slick('unslick');
          $(selectedSlider).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: false
          });
        }
        else {
          const selectedImage = document.querySelector(`[data-category="${radioButton.dataset.category}"][data-image="${radioButton.dataset.image}"]`);
          const omnibusImage = document.querySelector(`[data-image="omnibus"]`);
          const imagesToHide = document.querySelectorAll(`.diy-purchase__image[data-category="${radioButton.dataset.category}"]:not([data-image="${radioButton.dataset.image}"])`);

          omnibusImage.classList.add('hide');
          selectedImage.classList.remove('hide');
          imagesToHide.forEach(image => image.classList.add('hide'));
        }

      }

      if(radioButton.dataset.category) updateDiyImages();

      checkRadioInputs();
    });
  });

  function toogleRadioCheck() {
    // create click event for all data-toggle-select attribute
    const toggleSelects = document.querySelectorAll('[data-toggle-select]');

    // check if toggleSelects is empty then return nothing (to avoid error)
    if(toggleSelects.length == 0) return;

    toggleSelects.forEach(toggleSelect => {
      let clicked = false; // Flag to track whether the label has been clicked
      toggleSelect.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from bubbling up to the document

        // Check if the label has been clicked before
        if (clicked) {
          return; // If yes, don't do anything
        }

        // Check if toggleSelect input radio is checked
        let inputRadio = toggleSelect.querySelector('input[type="radio"]');
        if (inputRadio.checked) {
          setTimeout(() => {
            inputRadio.checked = false;
            inputRadio.removeAttribute('checked');
            inputRadio.dispatchEvent(new Event('change'))

            // clear price
            const priceElement = toggleSelect.closest('.diy-purchase__form-group').querySelector('.diy-purchase__price');
            priceElement.innerHTML = '';
          }, 0);
        }

        clicked = true; // Set the flag to true after the first click
        setTimeout(() => {
          clicked = false
        }, 0);

      });
    });
  }
  toogleRadioCheck();

  // create accordion
  const accordionButtons = document.querySelectorAll('.diy-purchase__accordion-button');
  accordionButtons.forEach(accordionButton => {
    accordionButton.addEventListener('click', () => {

      const checkedFormId = document.querySelector('input[name="diy-purchase-option"]:checked').getAttribute('data-form-id');
      if(checkedFormId === 'feature-bundle') {
        // scroll to closest diy-purchase__form-group
        let scrollToElement;
        if(window.innerWidth < 749) scrollToElement = accordionButton.closest('.diy-purchase__form-group')
        else scrollToElement = document.querySelector('.product-single__description-group')
        scrollToElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }

      const isSingleMode = accordionButton.classList.contains('diy-purchase__accordion-button--single-mode');

      if(isSingleMode) {

        const accordionItem = accordionButton.closest('.diy-purchase__accordion-item');
        const formGroup = accordionButton.closest('.diy-purchase__form-group');
        const inputRadio = accordionButton.closest('.diy-purchase__accordion-item').querySelector('input[type="radio"]');

        if(accordionItem.classList.contains('diy-purchase__accordion-item--active')) {
          accordionItem.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false) // uncheck all the radio buttons inside activeAccordion
          accordionItem.classList.remove('diy-purchase__accordion-item--active')
          inputRadio.checked = false;
          inputRadio.dispatchEvent(new Event('change'));

          // clear all price
          const priceElements = formGroup.querySelectorAll('.diy-purchase__price');
          priceElements.forEach(priceElement => priceElement.innerHTML = '');

        } else {
          accordionItem.classList.add('diy-purchase__accordion-item--active');
          formGroup.classList.add('item-selected');
          inputRadio.checked = true;
          inputRadio.dispatchEvent(new Event('change'));
        }

      } else {

        document.querySelectorAll('.diy-purchase__form-group--accordion').forEach(formGroup => formGroup.classList.remove('item-selected'));
        accordionButton.closest('.diy-purchase__accordion-item').classList.add('diy-purchase__accordion-item--active');
        accordionButton.closest('.diy-purchase__form-group').classList.add('item-selected');

        // check the first input radio or trigger click
        const firstInputRadio = accordionButton.closest('.diy-purchase__accordion-item').querySelector('input[type="radio"]');
        firstInputRadio.checked = true;

        // then remove check in other input radio
        const otherInputRadios = accordionButton.closest('.diy-purchase__accordion').querySelectorAll('input[type="radio"]')
        otherInputRadios.forEach(otherInputRadio => {
          if(otherInputRadio != firstInputRadio) {
            otherInputRadio.checked = false;
          }
        });

        // close other accordion
        const otherAccordionButtons = document.querySelectorAll('.diy-purchase__accordion-button');
        otherAccordionButtons.forEach(otherAccordionButton => {
          if(otherAccordionButton !== accordionButton) {
            otherAccordionButton.closest('.diy-purchase__accordion-item').classList.remove('diy-purchase__accordion-item--active');
          }
        });

        firstInputRadio.dispatchEvent(new Event('change'));
      }

    });
  });


  // Pre-select radio buttons based on URL params

  function hasParentWithClass(element, className) {
    let parent = element.parentNode;

    while (parent !== document) {
      if (parent.classList.contains(className)) {
        return true;
      }

      parent = parent.parentNode;
    }

    return false;
  }

  /**
   * Pre-selects the option based on the URL param
   * @param {*} option
   * @param {*} value
   */
  function preSelectOption(option, value) {
    if (!value) return; // If no value is passed, do nothing

    const formButton = document.querySelector(`input[name="${option}"][data-form-id="${diyPurchaseOption}"]`);
    const bundleButton = document.querySelector(`#${diyPurchaseOption} input[data-bundle][name="${value}"]`);
    const variantButton = document.querySelector(`#${diyPurchaseOption} input[name="${option}"][data-variant-id="${value}"]`);
    const productButton = document.querySelector(`#${diyPurchaseOption} input[name="${option}"][data-product-id="${value}"]`);

    if (bundleButton && bundleButton.closest('.diy-purchase__accordion-item')) {
      bundleButton.closest('.diy-purchase__accordion-item').classList.add('diy-purchase__accordion-item--active');
    }

    const radioButton = formButton ?? bundleButton ?? variantButton ?? productButton;

    if (radioButton) {
      radioButton.checked = true;

      // Don't dispatch if the radio button has data-form-id attribute
      if (formButton && diyPurchaseOption == 'diy') {
        const formElement = document.getElementById(diyPurchaseOption);
        formElement.classList.add('diy-purchase__form--active');
        formElement.previousElementSibling.classList.remove('diy-purchase__form--active');
        formElement.nextElementSibling.classList.remove('diy-purchase__form--active');
        return;
      }
    }
  }

  /**
   * Get the URL params and pre-select the fields accordingly
   */
  function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    return params;
  }

  /**
   * Get the DIY purchase options based on the option
   * @param {*} option
   * @returns
   */
  function getDYIPurchaseOptions(option) {
    const DYIPurchaseOptions = {
      'feature-bundle': ['advanced-kit', 'starter-kit', 'battery-ready', 'microinverter', 'bundle'],
      'diy': ['power-station', 'solar-panel', 'smart-plug', 'super-flat-cable', 'microinverter']
    };

    return DYIPurchaseOptions[option] ?? [];
  }

  function initUrlParams() {

    // Stop if there is no DIY purchase option
    if (!diyPurchaseOption) return;

    if(diyPurchaseOption == 'diy') {
      // show customizeImageWrapper if it is hidden
      const customizeImageWrapper = document.querySelector('.diy-purchase__image-wrapper');
      if(customizeImageWrapper.classList.contains('hide')) customizeImageWrapper.classList.remove('hide');

      // add hide class to all diy-purchase__slider
      const sliders = document.querySelectorAll('.diy-purchase__slider');
      sliders.forEach(slider => {
        if(!slider.classList.contains('hide')) slider.classList.add('hide')
      })
    }

    const purchaseOptions = getDYIPurchaseOptions(diyPurchaseOption);

    // Stop if there is no options for selected DYI purchase option
    if (purchaseOptions.length <= 0) return;

    // Pre-select the DIY purchase option
    preSelectOption('diy-purchase-option', diyPurchaseOption);

    // Pre-select the options
    purchaseOptions.forEach((option, index) => {
      const value = urlParams[option];
      if (value) preSelectOption(option, value);

      // check if last index of purchaseOptions
      if (index === purchaseOptions.length - 1) {
        const selectedRadioButton = document.querySelector('.diy-purchase__form--active input[type="radio"]:checked');

        selectedRadioButton.dispatchEvent(new Event('change'));
        checkRadioInputs()
      }

    });
  }

  initUrlParams();

});
