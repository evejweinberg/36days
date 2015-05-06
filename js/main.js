var canvas,
    context,

    canvasWidth,
    canvasHeight,

    existingImages = {};

function initCanvas() {
  canvas = $('#canvas')[0];
  context = canvas.getContext('2d');

  // scale canvas for retina:
  if (window.devicePixelRatio > 1) {
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    canvas.width = canvasWidth * 4;
    canvas.height = canvasHeight * 4;
    canvas.style.width = canvasWidth;
    canvas.style.height = canvasHeight;

    context.scale(4, 4);
  }
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

function renderMessage(message) {

  // clear the canvas:
  context.clearRect(0, 0, canvas.width, canvas.height);

  // split the message into an array of characters:
  var chars = message.match(/(.|\n)/g),
      x = 0,
      y = 0,
      lettersPerLine = 12,
      size = canvasWidth / lettersPerLine, // width/height of each image
      lineSpacing = 5; // space between lines

  if (!chars || !chars.length) { return; }

  for (var i=0; i<chars.length; i++) {
    var char = chars[i],
        isAlphanumeric = char.match(/[A-z0-9]/);

    if (isAlphanumeric) {
      var src = getImageForLetter(char, i),
          image = $('<img src="' + src + '" />');

      // if at the end of the line, go to the next line:
      if (x >= canvasWidth) {
        y += size;
        x = 0;
      }

      image.load(renderLetter.bind(this, image[0], x, y, size)); 

      x += size;
    } else if (char === ' ') {
      // for spaces just advance the x position:
      x += size;
    } else if (char.match(/\n/)) {
      // for enter/new lines advance the y position:
      y += size + lineSpacing;
      x = 0;
    }
  }
}


$(document).ready(function(){

  initCanvas();

  // anytime there's a keyup event
  // re-render the whole message:
  $('.input').keyup(function() {
    renderMessage( $(this).val() );
  });

  // put focus in the textarea so they can
  // type right away:
  $('.input').focus();

})
