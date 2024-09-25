$(function () {

    const showMeBtn = document.querySelector(".show-me-button")
    if (showMeBtn)
      showMeBtn.addEventListener("click", function () {
        showMeBtn.classList.toggle("show-me-button--active")
      })

    $(".show-me-button").click(function () {
      $(this).next(".show-me").slideToggle("slow")

      if ($(this).children(".iconfont").hasClass("icon-jiahao")) {
        $(this).children(".iconfont").removeClass("icon-jiahao")
        $(this).children(".iconfont").addClass("icon-jianhao")
      } else if ($(this).children(".iconfont").hasClass("icon-jianhao")) {
        $(this).children(".iconfont").removeClass("icon-jianhao")
        $(this).children(".iconfont").addClass("icon-jiahao")
      }
    })

    /*$('.solar-generator-slider').slick({
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 1,
      adaptiveHeight: false,
      arrows : false
    });*/

    $(".question-container").click(function() {
      $(this).next(".des").slideToggle("slow");

      if($(this).children(".plus").hasClass("active")) {
        $(this).children(".plus").removeClass("active");
        $(this).children(".minus").addClass("active");
      }else if($(this).children(".minus").hasClass("active")){
        $(this).children(".minus").removeClass("active");
        $(this).children(".plus").addClass("active");
      }
    });

    $(".question .title-h3").click(function () {
      $(this).next(".des").slideToggle("slow")

      if ($(this).children(".iconfont").hasClass("icon-xiajiantou")) {
        $(this).children(".iconfont").removeClass("icon-xiajiantou")
        $(this).children(".iconfont").addClass("icon-shangjiantou")
      } else if ($(this).children(".iconfont").hasClass("icon-shangjiantou")) {
        $(this).children(".iconfont").removeClass("icon-shangjiantou")
        $(this).children(".iconfont").addClass("icon-xiajiantou")
      }
    })

    var portablePowerStationSwiper = new Swiper(".protable-swiper-container", {
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    })

  $('.blog-slider-container').each(function(index, element){
      var pagination_elem_blog = $('.swiper-pagination',this);
      var navigation_next_elem_blog = $('.swiper-button-next',this);
      var navigation_prev_elem_blog = $('.swiper-button-prev',this);
      new Swiper(element, {
        loop: false,
        observer: true,
        observeParents: true,
        pagination: {
          el: pagination_elem_blog,
          clickable: true,
        },
        navigation: {
          nextEl: navigation_next_elem_blog,
          prevEl: navigation_prev_elem_blog,
        },
        breakpoints: {
        320: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        1400: {
          slidesPerView: 3,
          spaceBetween: 48
        }
      }
    });
  });

  $('.buyers-guides-slider-container').each(function(index, element){
    var pagination_elem_blog = $('.swiper-pagination',this);
    var navigation_next_elem_blog = $('.swiper-button-next',this);
    var navigation_prev_elem_blog = $('.swiper-button-prev',this);
    new Swiper(element, {
      centeredSlides: true,
      paginationClickable: true,
      loop: true,
      spaceBetween: 49.33,
      slideToClickedSlide: true,
      pagination: {
        el: pagination_elem_blog,
        clickable: true,
      },
      navigation: {
        nextEl: navigation_next_elem_blog,
        prevEl: navigation_prev_elem_blog,
      },
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1380: {
          slidesPerView: 4,
          spaceBetween: 48
        }
      }
  });
  });

    $('.products-swiper').each(function(index, element){
      var pagination_elem = $('.swiper-pagination',this);
      new Swiper(element, {
        loop: true,
        pagination: {
          el: pagination_elem,
          clickable: true,
        },
        breakpoints: {
          480: {
            slidesPerView: 2,
            spaceBetween: 20,
          }
        }
      });
    });

    $('.content-swiper').each(function(index, element){
      var pagination_elem = $('.swiper-pagination',this);
      new Swiper(element, {
        loop: true,
        pagination: {
          el: pagination_elem,
          clickable: true,
        },
        breakpoints: {
          480: {
            slidesPerView: 1,
            spaceBetween: 20,
          }
        }
      });
    });

    $('.product-swiper-portable-power').each(function(index, element){
      var pagination_elem = $('.swiper-pagination',this);
      var navigation_next_elem = $('.swiper-button-next',this);
      var navigation_prev_elem = $('.swiper-button-prev',this);
      new Swiper(element, {
        loop: false,
        observer: true,
        observeParents: true,
        pagination: {
          el: pagination_elem,
          clickable: true,
        },
        navigation: {
          nextEl: navigation_next_elem,
          prevEl: navigation_prev_elem,
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          681: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1101: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1351: {
            slidesPerView: 4,
            spaceBetween: 24,
          }
        }
      });
    });


    //   $(".section-75 .show-content .content-slide .des").hide();
    //   $(".section-75 .show-content .content-slide.active-slide .des").show();
    $(".section-75 .show-content .title-h6").click(function () {
      if ($(this).parent(".content-slide").hasClass("active-slide")) {
        return false
      }

      //$(this).parent(".content-slide").parent(".show-content").children(".content-slide")
      $(this)
        .parents(".show-content")
        .children(".content-slide")
        .each(function () {
          if ($(this).hasClass("active-slide")) {
            $(this).children(".des").slideToggle("slow")
            $(this).removeClass("active-slide")
          }
        })
      $(this).next(".des").slideToggle("slow")
      $(this).parent(".content-slide").addClass("active-slide")
    })
  })

