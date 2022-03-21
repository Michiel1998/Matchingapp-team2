   
   
   
   
  // 🙇🏾 https://codepen.io/jeremyfrank/pen/vNPwME
  var carousel = document.getElementById('carousel');
  var cards = document.querySelectorAll('.card');
  var tray = document.getElementById('tray');
  var indicator = document.getElementById('indicator');
  var info = {
    numCards: cards.length
  };
  
  var getDimensions = function() {
    info.container_width = carousel.clientWidth;
    info.card_width = carousel.firstElementChild.clientWidth;
    info.tray_width = tray.clientWidth;
  }
  
  var moveIndicator = function(timestamp) {
    var amount_inview = info.container_width / (info.card_width * info.numCards); // < 1
    var tray_scale = info.tray_width / info.container_width;
  
    var indicator_width = info.tray_width * amount_inview;
    var indicator_offset = (info.scroll_left * amount_inview) * tray_scale;
  
    indicator.style.width = indicator_width + 'px';
    indicator.style.left = indicator_offset + 'px';
  
    requestAnimationFrame(moveIndicator);
  }
  
  var onScroll = function() {
    info.scroll_left = carousel.scrollLeft;
  }
  
  getDimensions();
  carousel.addEventListener('scroll', onScroll);
  requestAnimationFrame(moveIndicator);



  // 🙇🏾 https://stackoverflow.com/questions/56932831/how-to-scroll-right-on-a-button-click
  var scrollLnks = document.querySelector('button:first-of-type');

  function naarLinks () {
  // 🙇🏾 https://stackoverflow.com/questions/50611362/how-to-scroll-left-or-right-inside-a-div-using-pure-javascript-function-and-no-j/50611710
    document.getElementById('carousel').scrollLeft -= 290;
  };

  scrollLnks.addEventListener('click' , naarLinks);

  // Naar rechts


  var scrollRchts = document.querySelector('button:last-of-type');

  function naarRchts () {
    document.getElementById('carousel').scrollLeft += 290;
    scrollLnks.classList.add('zichtbaar');
  };

  scrollRchts.addEventListener('click' , naarRchts);
