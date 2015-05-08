var canvas,
    context,

    canvasWidth,
    canvasHeight,

    defaultSettings = {
      width: 960,
      height: 480,
      padding: 10,
      background: '#0000bf',
      letterSize: 100,
      spaceSize: 40,
      lineSpace: 15,
      scale: 4
    },

    settings = $.extend({}, defaultSettings),

    existingImages = {};

function initCanvas() {
  canvas = $('#canvas')[0];
  context = canvas.getContext('2d');

  context.scale(settings.scale, settings.scale);
}

function initSettings() {
  // listen for changes and update settings:
  $('.setting-width').keyup(function(){
    var width = parseInt($('.setting-width').val());
    if (width && !isNaN(width)) {
      settings.width = width;
      updateSettings();
    }
  });
  $('.setting-height').keyup(function(){
    var height = parseInt($('.setting-height').val());
    if (height && !isNaN(height)) {
      settings.height = height;
      updateSettings();
    }
  });
  $('.setting-padding').keyup(function(){
    var padding = parseInt($('.setting-padding').val());
    if (padding && !isNaN(padding)) {
      settings.padding = padding;
      updateSettings();
    }
  });
  $('.setting-background').keyup(function(){
    var bg = $('.setting-background').val();
    if (bg) {
      if (!bg.match(/\#/)) {
        bg = '#' + bg;
      }
      settings.background = bg;
      updateSettings();
    }
  });
  $('.setting-letter-size').keyup(function(){
    var size = parseInt($('.setting-letter-size').val());
    if (size && !isNaN(size)) {
      settings.letterSize = size;
      updateSettings();
    }
  });
  $('.setting-space-size').keyup(function(){
    var size = parseInt($('.setting-space-size').val());
    if (size && !isNaN(size)) {
      settings.spaceSize = size;
      updateSettings();
    }
  });

  // set initial values:
  $('.setting-width').val(settings.width);
  $('.setting-height').val(settings.height);
  $('.setting-padding').val(settings.padding);
  $('.setting-background').val(settings.background);
  $('.setting-letter-size').val(settings.letterSize);
  $('.setting-space-size').val(settings.spaceSize);

  // apply initial values:
  updateSettings();
}

function updateSettings() {
  canvasWidth = settings.width + (settings.padding * 2);
  canvasHeight = settings.height + (settings.padding * 2);
  // scale canvas so images look better:
  canvas.width = canvasWidth * settings.scale;
  canvas.height = canvasHeight * settings.scale;
  $(canvas).css({
    width: canvasWidth + 'px',
    height: canvasHeight + 'px'
  });

  renderMessage();
}

function getRandomImageForLetter(letter) {
    letter = letter.toUpperCase();

    var numImagesForChar = LetterImages[letter],
        randomImageNum = Math.floor(Math.random() * numImagesForChar);

    return 'img/LETTERS/' + letter + '/' + randomImageNum + '.jpg';
}

function getImageForLetter(letter, pos) {
    letter = letter.toUpperCase()

    var id = letter + pos;

    if (existingImages[id]) {
      return existingImages[id];
    } else {
      return existingImages[id] = getRandomImageForLetter(letter);
    }
}

function renderLetter(image, x, y, size) {
  context.drawImage(image, x, y, size, size);
}

function renderMessage() {
  var message = $('.input').val();

  // clear the canvas:
  context.clearRect(0, 0, canvas.width, canvas.height);

  // split the message into an array of characters:
  var chars = message.match(/(.|\n)/g);

  if (!chars || !chars.length) {
    $('body').removeClass('has-text');
    return;
  }

  $('body').addClass('has-text');

  var padding = settings.padding * settings.scale,
      letterSize = settings.letterSize * settings.scale,
      spaceSize = settings.spaceSize * settings.scale,
      lineSpace = settings.lineSpace * settings.scale,
      maxX = (settings.width * settings.scale) - padding - letterSize,
      x = padding,
      y = padding;

  // draw the background color:
  context.beginPath();
  context.rect(0,0,canvas.width, canvas.height);
  context.fillStyle = settings.background;
  context.fill();

  for (var i=0; i<chars.length; i++) {
    var char = chars[i],
        isAlphanumeric = char.match(/[A-z0-9]/);

    if (isAlphanumeric) {
      var src = getImageForLetter(char, i),
          image = $('<img src="' + src + '" />');

      // if not enough room on this line, go to the next line:
      if (x >= maxX) {
        y += letterSize + lineSpace;
        x = padding;
      }

      image.load(renderLetter.bind(this, image[0], x, y, letterSize)); 

      x += letterSize;
    } else if (char === ' ') {
      // for spaces just advance the x position:
      x += spaceSize;
    } else if (char.match(/\n/)) {
      // for enter/new lines advance the y position:
      y += letterSize + lineSpace;
      x = padding;
    }
  }
}


/////////
// Main function


$(document).ready(function(){

  initCanvas();

  initSettings();

  // anytime there's a keyup event
  // re-render the whole message:
  $('.input').keyup( renderMessage );

  // put focus in the textarea so they can
  // type right away:
  $('.input').val('').focus();

  //$('.download-button').click(function() {
    // var myImage = canvas.toDataURL("image/png");      // Get the data as an image.
    // window.open(myImage);
  // });

})
