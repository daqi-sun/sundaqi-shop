// Home Ecosystem start
$(document).ready(function() {
  var activeSlideIndex = $('.home-ecosystem-slideshow-navigation .ecosystem-slide-nav.slide-active').index();
  if(activeSlideIndex < 0) activeSlideIndex = 0;
  if($('.home-ecosystem-slideshow-inner').length > 0) {
    $('.home-ecosystem-slideshow-inner').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
      adaptiveHeight: false,
      initialSlide: activeSlideIndex
    });
  }

  $('.home-ecosystem-slideshow-navigation .ecosystem-slide-nav').eq(activeSlideIndex).addClass('slide-active');
  $('.home-ecosystem-slideshow-navigation .ecosystem-slide-nav').click(function(){
    $('.home-ecosystem-slideshow-inner').slick("slickGoTo", $(this).index());
    $('.home-ecosystem-slideshow-navigation .ecosystem-slide-nav').removeClass('slide-active');
    $(this).addClass('slide-active');
  });

  $('.home-ecosystem-slideshow-inner').on('beforeChange', function(event, slick, currentSlide, nextSlide){
    $('.home-ecosystem-slideshow-navigation .ecosystem-slide-nav').removeClass('slide-active');
    $('.home-ecosystem-slideshow-navigation .ecosystem-slide-nav').eq(nextSlide).addClass('slide-active');
  });

  function fixBundleDescHeight(){
    $('.home-ecosystem-bundles-inner .bundle-desc').css('height', 'unset');
    var maxHeight = 0;
    $('.home-ecosystem-bundles-inner .bundle-desc').each(function(){
      if(maxHeight < $(this).height()){ maxHeight = $(this).height(); }
    });
    $('.home-ecosystem-bundles-inner .bundle-desc').css('height', maxHeight+'px');
    $(":root").css("--header-height", $('.site-header').height());
  }
  fixBundleDescHeight();
  $(":root").css("--header-height", $('.site-header').height());
  $(window).on('resize', fixBundleDescHeight);
});


//Home Ecosystem End
