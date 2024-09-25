  /* Product recommendations page */

  $('.recommendation-wrapper').on('change', '.power-station-dropdown', function(){
    var power_station_val = $(this).val();
    $(this).parents('.recommendation-row').attr('data-station', power_station_val);
    $(this).parents('.recommendation-row').find(".recommended_products, .power-station-image").removeClass('active');
    $(this).parents('.recommendation-row').find(".recommended_products[data-station='"+power_station_val+"'], .power-station-image[data-station='"+power_station_val+"']").addClass('active');
    var element = $(this).parents('.recommendation-row').find(".recommended_products[data-station='"+power_station_val+"']")
    if(element.hasClass('count-2') && $('.recommendation-page-lp-outer').length){
      var top_value = parseInt(element.find(".recommended_product").first().outerHeight() - 14);
      $('.bundle-sign.hideMobile').css('top', top_value+'px');
    }
    if($(this).parents('.recommendation-row').find(".recommended_products[data-station='"+power_station_val+"']").hasClass('slick-initialized') == false && $('.product-recommendation-wrapper').hasClass('slick-enabled')){
      var slick_elem = $(this).parents('.recommendation-row').find(".recommended_products[data-station='"+power_station_val+"']");
      setTimeout(function(){ mobileOnlySlider(slick_elem, true, true, 767); },500);
    }
  });

  if($('.recommendation-page-lp-outer').length && $('.recommended_products.active').hasClass('count-2')){
    var top_value = parseInt($('.recommended_products.active').find(".recommended_product").first().outerHeight() - 14);
    $('.bundle-sign.hideMobile').css('top', top_value+'px');
  }

  $('.product-recommendations-page-wrapper').on('click','.view-details-btn', function(){
    var product_handle = $(this).attr('data-handle');
    if(product_handle != ''){
      $.ajax({
        url: '/products/'+product_handle+'?view=view_details',
        success: function(result){
          $('.view-details-popup .product-content').html(result);
          $('.view-details-popup').fadeIn();
          $('body').css('overflow', 'hidden');
          setTimeout(function(){
            mobileOnlySlider($(".view-details-popup .product-images-wrapper"), true, true, 767);
            $(".view-details-popup .product-images-wrapper").css('opacity', '1').css('visibility', 'visible');
          }, 500);
        }
      });
    }
  });

  $(window).on('load', function(){
    $('.view-details-popup').on('click','.popup-overlay, .popup-close', function(){
      $('.view-details-popup').fadeOut();
      $('body').css('overflow', 'unset');
      if($('.products-images-wrapper').hasClass('slick-slider')) $('.products-images-wrapper').slick('unslick');
    });
  });

  function adjustQtyPrice(new_qty, element){
    element.siblings('.qty-value').val(new_qty);
    var product_price = element.parents('.product-info').find('.product-price').attr('data-price');
    var total_price = new_qty*product_price;
    if(total_price > 999900){
      element.parents('.product-info').find('.product-price').html(theme.Currency.formatMoney(new_qty*product_price, theme.moneyFormat).replace(',00', '').replace('.', ' '));
    }
    else{
      element.parents('.product-info').find('.product-price').html(theme.Currency.formatMoney(new_qty*product_price, theme.moneyFormat).replace(',00', '').replace('.', ''));
    }

    if(element.parents('.product-info').find('.product-compare-price').length){
      var compare_product_price = element.parents('.product-info').find('.product-compare-price').attr('data-compare-price');
      var total_c_price = new_qty*compare_product_price;
      if(total_c_price > 999900){
        element.parents('.product-info').find('.product-compare-price').html(theme.Currency.formatMoney(new_qty*compare_product_price, theme.moneyFormat).replace(',00', '').replace('.', ' '));
      }
      else{
        element.parents('.product-info').find('.product-compare-price').html(theme.Currency.formatMoney(new_qty*compare_product_price, theme.moneyFormat).replace(',00', '').replace('.', ''));
      }
    }
  }
  $('.product-recommendations-page-wrapper').on('click','.qty-minus', function(){
    var qty = $(this).siblings('.qty-value').val();
    if(qty > 1){
      var new_qty = qty - 1;
      adjustQtyPrice(new_qty, $(this));
    }
  });

  $('.product-recommendations-page-wrapper').on('click','.qty-plus', function(){
    var qty = parseInt($(this).siblings('.qty-value').val());
    var new_qty = qty + 1;
    adjustQtyPrice(new_qty, $(this));
  });

  $('.product-recommendations-page-wrapper').on('click','.add-to-cart-btn', function(){
    var element = $(this);
    $(this).attr("aria-disabled", true);
    element.find('[data-add-to-cart-text]').addClass('hide');
    element.find('[data-loader]').removeClass('hide');
    let formData = {
      items: [
        {
          quantity: $(this).parents('.product-info').find('.qty-value').val(),
          id: $(this).attr('data-variant-id')
        },
      ],
    }

    fetch("/cart/add.js", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(formData),
    })
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        if (json.status && json.status !== 200) {
          var error = new Error(json.description)
          error.isFromServer = true
          throw error
        }

        element.find('[data-added]').removeClass('hide');
        setTimeout(() => {
          element.find('[data-added]').addClass('hide');
          element.find('[data-loader]').addClass('hide');
          element.removeAttr("aria-disabled");
          element.find('[data-add-to-cart-text]').removeClass('hide');
        }, 1000);

        element.siblings('[data-error-message]').html('');
        theme.Cart.prototype._onProductAdded();
      })
      .catch(function (error) {
        var errorMessage = error.isFromServer && error.message.length ? error.message : theme.strings.cartError;
        element.siblings('[data-error-message]').html(errorMessage);
        element.removeAttr("aria-disabled");
        element.find('[data-add-to-cart-text]').removeClass('hide');
        element.find('[data-loader]').addClass('hide');
        // eslint-disable-next-line no-console
        console.log(error)
      });
  });

  if($('.product-recommendation-wrapper').hasClass('slick-enabled'))
    mobileOnlySlider($(".recommended_products:visible"), true, true, 767);

  mobileOnlySlider($(".accessories-wrapper .recommendation-row"), true, true, 767);

  function mobileOnlySlider($slidername, $dots, $arrows, $breakpoint) {
      var slider = $slidername;
      var settings = {
        mobileFirst: true,
        dots: $dots,
        arrows: $arrows,
        adaptiveHeight: true,
        responsive: [
          {
            breakpoint: $breakpoint,
            settings: "unslick"
          }
        ]
      };

      slider.slick(settings);

      $(window).on("resize", function () {
        if ($(window).width() > $breakpoint) {
          return;
        }
        if (!slider.hasClass("slick-initialized")) {
          return slider.slick(settings);
        }
      });
  }
  var recommendation_row_html = $('.recommendation-row-1').html();
  $('.add_more_btn').click(function(){
    if($('.recommendation-wrapper .recommendation-row').length < 3){
      var count = parseInt($('.recommendation-wrapper .recommendation-row').length) + parseInt(1);
      $('.recommendation-wrapper').append('<div class="recommendation-row recommendation-row-' + count + '">' + recommendation_row_html + '</div>');
      var option_value = $('.recommendation-row-' + count + ' .power-station-dropdown option:first').val();
      $('.recommendation-row-' + count + ' .power-station-dropdown').val(option_value).change();
      if($(".recommendation-row-" + count + ".recommended_products:visible").hasClass('slick-initialized') == false){
        mobileOnlySlider($(".recommendation-row-" + count + ".recommended_products:visible"), true, true, 767);
      }
    }
    if($('.recommendation-wrapper .recommendation-row').length >= 3){ $('.add_more_btn_wrap').hide(); }
  });

  $('.more-accessories .show-more-btn').click(function(){
    $('.recommendation-column').toggleClass('active');
    $(this).toggleClass('active');
    if($(this).hasClass('active')) $('span', this).text('Show Less  >>');
    else $('span', this).text('View More  >>');
  });
