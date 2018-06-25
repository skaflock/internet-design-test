(function($) {
  "use strict";

  var resizeTimeout;

  /**
   * Установка одинаковой высоты блокам
   * @returns jQuery
   */
  $.fn.equalHeight = function() {
    var t = $(this);
    var heightArray = t.map(function() {
      return $(this).height();
    }).get();
    var maxHeight = Math.max.apply(Math, heightArray);
    t.height(maxHeight);
    return t;
  };

  /**
   * Установка одинаковой высоты блокам внутри элементов многострочного списка
   * @param {string} container - селектор списка элементов
   * @param {string} item - селектор отдельного элемента
   * @param {string} target - селектор блоков внутри item, высоту которых требуется сделать одинаковой
   * @param {number=} num - количество элементов в строке
   */
  function equalizeBlockHeight(container, item, target, num) {
    $(container).each(function() {
      var t = $(this);
      var c = t.find(item);
      var arr = [];
      num = typeof num !== "undefined" ? num : Math.floor(t.width() / c.first().width());
      if (t.width()) {
        for (var i = 0; i < c.length; i += num) {
          arr.push( c.slice(i, i + num).find(target).equalHeight() );
        }
      }
    });
  }

  $(document).on("click", ".header__toggle", function() {
    var $t = $(this);
    $t.parent().toggleClass("is-collapsed").delay(250).queue(function(next) {
      $(this).toggleClass("is-animated");
      next();
    });
  });

  $('.header__menu-item').removeClass('is-hover').children('.header__submenu').addClass('is-hidden');

  $('.header__menu-item').on('mouseenter', function(){
    var $t = $(this);
    $t.children('.header__submenu').removeClass('is-hidden').delay(150).queue(function(next){
      $t.addClass('is-hover');
      next();
    });
  }).on('mouseleave', function(){
    var $t = $(this);
    $t.removeClass('is-hover').delay(250).queue(function(next){
      $t.children('.header__submenu').addClass('is-hidden');
      next();
    });
  });

  $(window)
    .on("resize", function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function(){
        $('.card__text-wrap').removeAttr('style');
        equalizeBlockHeight('.card__list', '.card', '.card__text-wrap');
        $('.card__text-wrap').each(function(){
          var $t = $(this);
          $t.css({
            'line-height': $t.outerHeight() + 'px'
          });
        });
      }, 50);
    })
    .on("load", function() {
      var mouseKeyPressed = 0;
      var mouseDiffX = 0;
      var mouseDiffY = 0;
      var mouseX = 0;
      var mouseY = 0;

      $(window).resize();

      $(document)
        .on('mousedown', function(e){
          mouseKeyPressed = 1;
          mouseX = e.pageX;
          mouseY = e.pageY;
        })
        .on('mousedown', '.scroller img', function(e){
          e.preventDefault();
        })
        .on('mouseup', function(e){
          mouseKeyPressed = 0;
        })
        .on('mousemove', '.scroller.is-hoverable', function(e){
          // скролл картинки по ховеру
          var $t = $(this);
          var $img = $t.children('img');
          var imgOverflowX = $img.width() - $t.width();
          var imgOverflowY = $img.height() - $t.height();
          var moveX = (e.pageX - $t.offset().left)/$t.width();
          var moveY = (e.pageY - $t.offset().top)/$t.height();
          $img.css({
            'left': Math.max(Math.min((-imgOverflowX * moveX), 0), -imgOverflowX) + 'px',
            'top': Math.max(Math.min((-imgOverflowY * moveY), 0), -imgOverflowY) + 'px'
          });
        })
        .on('mousemove', '.scroller.is-draggable', function(e){
          // скролл картинки по перетаскиванию
          if (mouseKeyPressed) {
            e.preventDefault();
            var $t = $(this);
            var $img = $t.children('img');
            var imgOverflowX = $img.width() - $t.width();
            var imgOverflowY = $img.height() - $t.height();
            mouseDiffX = e.pageX - mouseX;
            mouseDiffY = e.pageY - mouseY;
            mouseX = e.pageX;
            mouseY = e.pageY;
            $img.css({
              'left': Math.max(Math.min(($img.position().left + mouseDiffX), 0), -imgOverflowX) + 'px',
              'top': Math.max(Math.min(($img.position().top + mouseDiffY), 0), -imgOverflowY) + 'px'
            });
          }
        })
        .on('click', '[data-tooltip]', function(e){
          e.stopPropagation();
          $('[data-tooltip] .tooltip').remove();
          var $t = $(this);
          $t.append('<div class="tooltip">' + $t.attr('data-tooltip') + '</div>');
        })
        .on('click', function(e){
          $('[data-tooltip] .tooltip').remove();
        });

    });
})(jQuery);
