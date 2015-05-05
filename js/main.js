$(document).ready(function(){
  var urlRoot = 'img/';

  $('input').keyup(function(event) {
    var character = String.fromCharCode(event.which);

    if (character.match(/[A-z0-9]/)) {
      var numImages = LetterImages[character],
          randomImage = Math.floor(Math.random() * numImages),
          filename = 'img/LETTERS/' + character + '/' + randomImage + '.jpg';

      $('#images-placeholder').append('<img id="letter-image" src="' + filename + '" />');
    }
  });

})
