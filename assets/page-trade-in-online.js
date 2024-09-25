$(document).ready(function(){

    let select = s => document.querySelector(s),
        selectAll = s => document.querySelectorAll(s),
        client,
        customerInformation = {
            contact: '',
            email: '',
            phone: '',
            country: 'US',
            province: '',
            city: '',
            address: '',
            postalCode: '',
            product: '',
            sn: '',
            image: '',
            isFunctional: false,
            isMalformed: false,
            isReturn: false
        },
        productData = {
            "DELTA mini": {
                giftCardLevel1: 200,
                giftCardLevel2: 160,
                giftCardLevel3: 40
            },
            "DELTA 1300": {
                giftCardLevel1: 250,
                giftCardLevel2: 200,
                giftCardLevel3: 40
            },
            "DELTA 1000": {
                giftCardLevel1: 220,
                giftCardLevel2: 180,
                giftCardLevel3: 40
            },
            "RIVER": {
                giftCardLevel1: 50,
                giftCardLevel2: 30,
                giftCardLevel3: 20
            },
            "RIVER Max": {
                giftCardLevel1: 80,
                giftCardLevel2: 50,
                giftCardLevel3: 30
            }
        },
        createdOrderData = {}

    const fieldInput = selectAll('.field__input'),
        enterInformationButton = select('[data-enter-information]'),
        confirmWorkableButton = select('[data-confirm-workable]'),
        confirmReturnToWarehouseButton = select('[data-confirm-return-to-warehouse]'),
        confirmProductIsDamageButton = select('[data-confirm-product-is-damage]'),
        tradeInForAGiftButtons = selectAll('[data-trade-in-for-a-gift]'),
        getReturnLabelButton = select('[data-get-return-label]'),
        generateReturnLabelButton = select('[data-generate-return-label]'),
        backButtons = selectAll('[data-back-button]'),
        errorMessage = selectAll('[data-error-message]'),
        aliOssUploadFile = selectAll('.aliOssUploadFile'),
        stepContainerActiveCLass = 'step-container--active'

    const isEmpty = str => !str.trim().length
    // const serverUrl = 'https://oa-test.ecoflow.com' // DEV
    const serverUrl = 'https://oa.ecoflow.com' // PROD
    const headersConfig = {
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'Content-Type': 'application/json',
        // 'Token': '2c41ca28b6fced883317b5acc2e03866' // DEV
        'Token': 'AK5cUbb2CHYOW3IoVjM6DLYGqM9tLJCb' // PROD
    }

    // Float label animation
    function fieldLabelFloat() {
        if(isEmpty(this.value)) this.closest('.field').classList.remove('field--show-floating-label')
        else this.closest('.field').classList.add('field--show-floating-label')
    }
    fieldInput.forEach(input => { input.addEventListener('keyup', fieldLabelFloat) })

    async function tradeInEvaluate(data) {
        const res = await fetch(`${serverUrl}/api/afterSales.tradeIn.evaluate`, {
            method: 'POST',
            headers: headersConfig,
            body: JSON.stringify(data)
        })
        const res_data = await res.json()
        return res_data
    }

    async function tradeInCreateOrder(data) {
        const res = await fetch(`${serverUrl}/api/afterSales.tradeIn.createOrder`, {
            method: 'POST',
            headers: headersConfig,
            body: JSON.stringify(data)
        })
        const res_data = await res.json()
        return res_data
    }

    async function tradeInGenerateReturnLabel(data) {
        const res = await fetch(`${serverUrl}/api/afterSales.tradeIn.generateReturnLabel`, {
            method: 'POST',
            headers: headersConfig,
            body: JSON.stringify(data)
        })
        const res_data = await res.json()
        return res_data
    }

    async function getProvinces(data) {
        const res = await fetch(`${serverUrl}/api/afterSales.customerOrder.getProvinces`, {
            method: 'POST',
            headers: headersConfig,
            body: JSON.stringify(data)
        })
        const res_data = await res.json()
        return res_data
    }

    async function getAliOssTokens(data) {
        const res = await fetch(`${serverUrl}/api/afterSales.customerOrder.getAliOssCredentials`, {
            method: 'POST',
            headers: headersConfig,
            body: JSON.stringify(data)
        })
        const res_data = await res.json()
        return res_data
    }

    async function putObject(data,fname,inputHidden,last,e) {
        const serialNumber = select('[data-serial-number]').value
        const res = await client.put(
          "exampledir/uploaded-"+fname,
          data
        )
        const imageValue = res.url;
        customerInformation = {
            ...customerInformation,
            sn: serialNumber,
            image: imageValue
        }

        // Create Order
        let customerInformationData = {
            "type": "api2",
            "args": [customerInformation]
        }
        loadingButton('[data-get-return-label]', false)
        tradeInCreateOrder(customerInformationData).then(data => {
            createdOrderData = data.data
            if (getReturnLabelButton.hasAttribute('submit-level3')) {
                showPopup('popup-submitted-successfully')
            } else {
                select('[data-step="6"]').classList.remove(stepContainerActiveCLass)
                select('[data-step="7"]').classList.add(stepContainerActiveCLass)
            }
            loadingButton('[data-get-return-label]', false)
        })
    }

    function checkRequiredFields(containerEl) {
        const requiredFields = selectAll(`${containerEl} [required]`)
        let isEmptyField = true

        requiredFields.forEach(field => {
            if (!isEmptyField) return
            if(isEmpty(field.value)) isEmptyField = false
        })

        return isEmptyField
    }

    function scrollTop() {
        window.scroll({
            top: select('.page-tradein-online__section').offsetTop,
            behavior: 'smooth'
        })
    }

    function setGiftCardPrice(giftLevel) {
        const productName = customerInformation.product
        const giftPrice = productData[productName][giftLevel]

        return giftPrice
    }

    function isOrderNumberValid(jsonData, fromStep, selectedOption) {
        const codeStr = jsonData.code ? jsonData.code.toString() : '0'
        const data = jsonData.data
        const hasError = jsonData.message

        if(hasError) {
            errorMessage.forEach(message => message.innerText = jsonData.message)
            showPopup('popup-error-message')
        } else {
            switch(codeStr) {
                case '0':
                    // valid
                    if(fromStep == 0) {

                    } else if(fromStep == 1) {

                    } else if(fromStep == 2) {
                        if(selectedOption) {
                            select('[data-step="2"]').classList.remove(stepContainerActiveCLass)
                            select('[data-step="3"]').classList.add(stepContainerActiveCLass)
                        } else {
                            selectAll('[data-step="gift-level-3"] .gift-card-img--price').forEach(price => price.innerText = setGiftCardPrice('giftCardLevel3'))
                            select('[data-step="2"]').classList.remove(stepContainerActiveCLass)
                            select('[data-step="gift-level-3"]').classList.add(stepContainerActiveCLass)
                        }
                    } else if(fromStep == 3) {
                        if(selectedOption) {
                            select('[data-step="3"]').classList.remove(stepContainerActiveCLass)
                            select('[data-step="4"]').classList.add(stepContainerActiveCLass)
                        } else {
                            selectAll('[data-step="gift-level-3"] .gift-card-img--price').forEach(price => price.innerText = setGiftCardPrice('giftCardLevel3'))
                            select('[data-step="3"]').classList.remove(stepContainerActiveCLass)
                            select('[data-step="gift-level-3"]').classList.add(stepContainerActiveCLass)
                        }
                    } else if(fromStep == 4) {
                        if(selectedOption) {
                            selectAll('[data-step="gift-level-2"] .gift-card-img--price').forEach(price => price.innerText = setGiftCardPrice('giftCardLevel2'))
                            select('[data-step="4"]').classList.remove(stepContainerActiveCLass)
                            select('[data-step="gift-level-2"]').classList.add(stepContainerActiveCLass)
                        } else {
                            selectAll('[data-step="gift-level-1"] .gift-card-img--price').forEach(price => price.innerText = setGiftCardPrice('giftCardLevel1'))
                            select('[data-step="4"]').classList.remove(stepContainerActiveCLass)
                            select('[data-step="gift-level-1"]').classList.add(stepContainerActiveCLass)
                        }
                    } else if(fromStep == 6) {
                        const returnLabelUrl = data.returnLabel
                        const returnLabelTemplate = `<a href="${returnLabelUrl}" class="hide btn btn-primary btn-pill text-capitalize" target="_blank" rel="noopener noreferrer" data-download-returl-label>Generate & Download Label</a>`

                        // Download return label
                        select('[data-download-link]').insertAdjacentHTML('beforeend', returnLabelTemplate)
                        setTimeout(() => {
                            select('[data-download-returl-label]').click()
                            select('[data-download-returl-label]').classList.remove('hide')
                            generateReturnLabelButton.classList.add('hide')
                        }, 250)
                    } else {
                        return
                    }
                    break
                case '204':
                    // not a valid order number
                    showPopup('popup-not-valid-order-number')
                    break
                default:
                    return
            }
        }
    }

    let tokenData = {
        "type": "api2",
        "args": []
    }
    getAliOssTokens(tokenData)
        .then((resp) => {
            const data = resp.data
            client = new OSS({
                region: data.region,
                accessKeyId: data.accessKeyId,
                accessKeySecret:  data.accessKeySecret,
                stsToken: data.stsToken,
                bucket:  data.bucket,
            })
    })

    function loadingButton(selector, boolean) {
        const thisButon = select(selector)
        const btnLoaderTemplate = '<span class="btn-loader"></span>'

        if(boolean) {
            thisButon.classList.add('isDisabled')
            thisButon.insertAdjacentHTML('beforeend', btnLoaderTemplate)
        } else {
            thisButon.classList.remove('isDisabled')
            if(select('.btn-loader'))select('.btn-loader').remove()
        }
    }

    function updateProvinceOptions() {
        const provinceSelectField = select('[data-province]')
        const isProvinceHasOptions = provinceSelectField.children.length
        const provincesStatic = '<option value="" data-default-static-province>Select state</option><option value="Alabama">Alabama</option><option value="Colorado">Colorado</option><option value="Delaware">Delaware</option><option value="Florida">Florida</option><option value="Idaho">Idaho</option><option value="Indiana">Indiana</option><option value="Kentucky">Kentucky</option><option value="Massachusetts">Massachusetts</option><option value="Michigan">Michigan</option><option value="Montana">Montana</option><option value="North Dakota">North Dakota</option><option value="Nevada">Nevada</option><option value="Virginia">Virginia</option><option value="Vermont">Vermont</option><option value="Washington">Washington</option><option value="West Virginia">West Virginia</option><option value="Alaska">Alaska</option><option value="Arkansas">Arkansas</option><option value="Arizona">Arizona</option><option value="California">California</option><option value="Connecticut">Connecticut</option><option value="District of Columbia">District of Columbia</option><option value="Georgia">Georgia</option><option value="Hawaii">Hawaii</option><option value="Iowa">Iowa</option><option value="Illinois">Illinois</option><option value="Kansas">Kansas</option><option value="Louisiana">Louisiana</option><option value="Maryland">Maryland</option><option value="Maine">Maine</option><option value="Minnesota">Minnesota</option><option value="Missouri">Missouri</option><option value="Mississippi">Mississippi</option><option value="North Carolina">North Carolina</option><option value="Nebraska">Nebraska</option><option value="New Hampshire">New Hampshire</option><option value="New Jersey">New Jersey</option><option value="New Mexico">New Mexico</option><option value="New York">New York</option><option value="Ohio">Ohio</option><option value="Oklahoma">Oklahoma</option><option value="Oregon">Oregon</option><option value="Pennsylvania">Pennsylvania</option><option value="Rhode Island">Rhode Island</option><option value="South Carolina">South Carolina</option><option value="South Dakota">South Dakota</option><option value="Tennessee">Tennessee</option><option value="Texas">Texas</option><option value="Utah">Utah</option><option value="Wisconsin">Wisconsin</option><option value="Wyoming">Wyoming</option>'

        function _setProvince(data) {
            const provincesCount = data.data.length
            const provinces = data.data.map(province => {
                return `<option value="${province.name}">${province.name}</option>`
            })

            if(provincesCount > 0 && !provinces[0].includes('undefined')) {
                provinceSelectField.innerHTML = ''
                provinceSelectField.insertAdjacentHTML('afterbegin', '<option value="">Select state</option>')
                provinceSelectField.insertAdjacentHTML('beforeend', provinces.join(''))
            } else {
                provinceSelectField.innerHTML = ''
                provinceSelectField.innerHTML = provincesStatic
            }
        }

        if(isProvinceHasOptions <= 0) {
            let provinceData = {
                "type": "api2",
                "args": [{
                  "country": "US"
                }]
            }
            getProvinces(provinceData).then(data => {
                _setProvince(data)
            }).catch((error) => {
                console.error(error)

                provinceSelectField.innerHTML = ''
                provinceSelectField.innerHTML = provincesStatic
            })
        }

        return
    }

    function uploadImageButtonFunc(e){
        var index = this.getAttribute('block-index');
        select(`[data-uploaded-label="${index}"]`).classList.add('hide')
        select(`[data-uploaded-images="${index}"]`).classList.remove('hide')
        select(`[data-uploaded-images="${index}"]`).querySelector('ul').innerHTML = '';
        var dataLength = this.files.length, i
        for (i = 0; i < dataLength; i++) {
            fileName = this.files[i].name;
            select(`[data-uploaded-images="${index}"]`).querySelector('ul').innerHTML += '<li><span class="tick-btn"></span> <span class="uploaded-filename">'+fileName+'</span></li>'
        }
        getReturnLabelButton.classList.remove('isDisabled');
    }

    function initImageUploadFunc(elem){
        var dataLength = (selectAll('[data-upload-image]').length-1), isLast = false;

        loadingButton('[data-get-return-label]', true)
        selectAll('[data-upload-image]').forEach(function(e,i){
            if(e.value !== ''){
                data = e.files[0];
                fileName = e.files[0].name;
                if(i === dataLength){
                    isLast = true;
                }
                putObject(data,fileName,select(`[name=product_images_${i}]`),isLast,elem)
            }
        })
    }

    function checkInformation() {
        const requiredFields = selectAll('[data-information-form] [required]')
        const requiredSelectFields = selectAll('[data-information-form] select[required]')
        const requiredAgree = select('[data-agree-to-ecoflow]')

        function _toggleSubmit() {
            if(checkRequiredFields('[data-information-form]') && requiredAgree.checked) enterInformationButton.classList.remove('isDisabled')
            else enterInformationButton.classList.add('isDisabled')
        }

        // Check if all required fields are filled then enable Submit button
        requiredFields.forEach(option => option.addEventListener('keyup', _toggleSubmit))
        requiredSelectFields.forEach(select => select.addEventListener('change', _toggleSubmit))
        requiredAgree.addEventListener('change', _toggleSubmit)
    }

    function enterInformation() {
        const firstName = select('[data-information-form] [data-info-first-name]').value
        const lastName = select('[data-information-form] [data-info-last-name]').value
        const email = select('[data-information-form] [data-info-email]').value
        const phoneNumber = select('[data-information-form] [data-info-phone-number]').value
        const province = select('[data-information-form] [data-info-province]').value
        const city = select('[data-information-form] [data-info-city]').value
        const zipCode = select('[data-information-form] [data-info-zip-code]').value
        const address = select('[data-information-form] [data-info-address]').value

        customerInformation = {
            ...customerInformation,
            contact: `${firstName} ${lastName}`,
            email: email,
            phone: phoneNumber,
            province: province,
            city: city,
            address: address,
            postalCode: zipCode,
        }

        loadingButton('[data-enter-information]', true)
        setTimeout(()=>{
            select('[data-step="1"]').classList.remove(stepContainerActiveCLass)
            select('[data-step="2"]').classList.add(stepContainerActiveCLass)
            loadingButton('[data-enter-information]', false)
        }, 250)
    }

    function checkProductModel() {
        const requiredFields = selectAll('[data-confirm-workable-form] [required]')
        const requiredSelectFields = selectAll('[data-confirm-workable-form] select[required]')

        function _toggleSubmit() {
            if(checkRequiredFields('[data-information-form]')) confirmWorkableButton.classList.remove('isDisabled')
            else confirmWorkableButton.classList.add('isDisabled')
        }

        // Check if all required fields are filled then enable Submit button
        requiredFields.forEach(option => option.addEventListener('keyup', _toggleSubmit))
        requiredSelectFields.forEach(select => select.addEventListener('change', _toggleSubmit))
    }

    function confirmWorkable() {
        let productModel = select('[data-product-model]').value
        let selectedOption = select('input[name="product_workable"]:checked').value
        selectedOption = selectedOption == 'true' ? true : false

        customerInformation = {
            ...customerInformation,
            product: productModel,
            isFunctional: selectedOption
        }

        let customerInformationData = {
            "type": "api2",
            "args": [customerInformation]
        }

        loadingButton('[data-confirm-workable]', true)
        tradeInEvaluate(customerInformationData).then(data => {
            isOrderNumberValid(data, 2, selectedOption)
            loadingButton('[data-confirm-workable]', false)
        })
    }

    function confirmReturnToWarehouse() {
        let selectedOption = select('input[name="product_return_to_warehouse"]:checked').value
        selectedOption = selectedOption == 'true' ? true : false

        customerInformation = {
            ...customerInformation,
            isReturn: selectedOption
        }

        let customerInformationData = {
            "type": "api2",
            "args": [customerInformation]
        }

        loadingButton('[data-confirm-return-to-warehouse]', true)
        tradeInEvaluate(customerInformationData).then(data => {
            isOrderNumberValid(data, 3, selectedOption)
            loadingButton('[data-confirm-return-to-warehouse]', false)
        })
    }

    function confirmProductIsDamage() {
        let selectedOption = select('input[name="product_is_damage"]:checked').value
        selectedOption = selectedOption == 'true' ? true : false

        customerInformation = {
            ...customerInformation,
            isMalformed: selectedOption
        }

        let customerInformationData = {
            "type": "api2",
            "args": [customerInformation]
        }

        loadingButton('[data-confirm-product-is-damage]', true)
        tradeInEvaluate(customerInformationData).then(data => {
            isOrderNumberValid(data, 4, selectedOption)
            loadingButton('[data-confirm-product-is-damage]', false)
        })
    }

    function tradeInForAGift() {
        const giftCardValue = this.getAttribute('data-gift-card')
        const backButtonBeforeGiftStep = select('[data-back-button-from-gift]').setAttribute('data-back-button-from-gift', giftCardValue);
        const stepLevelsProgress = selectAll('.steps-level')

        // reset
        select('[data-serial-number]').value = ''
        select('[data-field-serial-number]').classList.remove('field--show-floating-label')
        selectAll('[data-uploaded-label]').forEach(uploadLabel => uploadLabel.classList.remove('hide'))
        selectAll('[data-uploaded-images]').forEach(uploadLabel => uploadLabel.classList.add('hide'))

        function _showStepProgress(className) {
            switch(className) {
                case 'steps-level3':
                    stepLevelsProgress.forEach(progress => {
                        if(progress.classList.contains('steps-level3')) progress.classList.remove('hide')
                        else progress.classList.add('hide')
                    })
                    getReturnLabelButton.innerText = 'Submit'
                    getReturnLabelButton.setAttribute('submit-level3','')
                    break
                default:
                    stepLevelsProgress.forEach(progress => {
                        if(progress.classList.contains('steps-level3')) progress.classList.add('hide')
                        else progress.classList.remove('hide')
                    })
                    getReturnLabelButton.innerText = 'Get The Return Label'
                    getReturnLabelButton.removeAttribute('submit-level3')
                    break
            }
        }

        loadingButton(`[data-gift-card="${giftCardValue}"]`, true)
        setTimeout(()=>{
            switch(giftCardValue) {
                case 'level3':
                    _showStepProgress('steps-level3')
                    select('[data-step="gift-level-3"]').classList.remove(stepContainerActiveCLass)
                    select('[data-step="6"]').classList.add(stepContainerActiveCLass)
                    loadingButton(`[data-gift-card="${giftCardValue}"]`, false)
                    break
                case 'level2':
                    _showStepProgress()
                    select('[data-step="gift-level-2"]').classList.remove(stepContainerActiveCLass)
                    select('[data-step="6"]').classList.add(stepContainerActiveCLass)
                    loadingButton(`[data-gift-card="${giftCardValue}"]`, false)
                    break
                case 'level1':
                    _showStepProgress()
                    select('[data-step="gift-level-1"]').classList.remove(stepContainerActiveCLass)
                    select('[data-step="6"]').classList.add(stepContainerActiveCLass)
                    loadingButton(`[data-gift-card="${giftCardValue}"]`, false)
                    break
                default:
                    return
            }
        }, 250)
    }

    function generateReturnLabel(e) {
        e.preventDefault()
        const createdOrderId = createdOrderData.id

        loadingButton('[data-generate-return-label]', true)
        let generateReturnLabelData = {
            "type": "api2",
            "args": [
                createdOrderId,
                {
                    "forwardStatus": true
                }
            ]
        }

        tradeInGenerateReturnLabel(generateReturnLabelData).then(data => {
            isOrderNumberValid(data, 6)
            loadingButton('[data-generate-return-label]', false)
        })

        return
    }

    checkInformation()
    updateProvinceOptions()
    checkProductModel()

    enterInformationButton.addEventListener('click', enterInformation)
    confirmWorkableButton.addEventListener('click', confirmWorkable)
    confirmReturnToWarehouseButton.addEventListener('click', confirmReturnToWarehouse)
    confirmProductIsDamageButton.addEventListener('click', confirmProductIsDamage)
    generateReturnLabelButton.addEventListener('click', generateReturnLabel)
    tradeInForAGiftButtons.forEach(button => button.addEventListener('click', tradeInForAGift))
    getReturnLabelButton.addEventListener('click', initImageUploadFunc)
    aliOssUploadFile.forEach(input => { input.addEventListener('change', uploadImageButtonFunc) })

    backButtons.forEach(button => button.addEventListener('click', function() {
        const isGiftStep = this.getAttribute('data-gift-card-step')
        const backButtonBeforeGiftStep = this.getAttribute('data-back-button-from-gift')

        if(isGiftStep) {
            const activeStepNumber = isGiftStep
            const prevStepNumber = parseInt(activeStepNumber) - 1
            select(`.${stepContainerActiveCLass}`).classList.remove(stepContainerActiveCLass)
            select(`[data-step="${prevStepNumber}"]`).classList.add(stepContainerActiveCLass)
        } else if(backButtonBeforeGiftStep) {
            switch(backButtonBeforeGiftStep) {
                case 'level3':
                    select(`.${stepContainerActiveCLass}`).classList.remove(stepContainerActiveCLass)
                    select('[data-step="gift-level-3"]').classList.add(stepContainerActiveCLass)
                    break
                case 'level2':
                    select(`.${stepContainerActiveCLass}`).classList.remove(stepContainerActiveCLass)
                    select('[data-step="gift-level-2"]').classList.add(stepContainerActiveCLass)
                    break
                case 'level1':
                    select(`.${stepContainerActiveCLass}`).classList.remove(stepContainerActiveCLass)
                    select('[data-step="gift-level-1"]').classList.add(stepContainerActiveCLass)
                    break
                default:
                    return
            }
        }
        else {
            const activeStepNumber = select('.step-container--active').getAttribute('data-step')
            const prevStepNumber = parseInt(activeStepNumber) - 1
            select(`[data-step="${activeStepNumber}"]`).classList.remove(stepContainerActiveCLass)
            select(`[data-step="${prevStepNumber}"]`).classList.add(stepContainerActiveCLass)
        }
    }))

})