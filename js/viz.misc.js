// animate header
var anim = function() {
  $(document).one('scroll', function(event) {
    $('div#header').css({'animation': 'play 1s steps(14)',
                         'animation-fill-mode': 'forwards'});
  }
)}

$('div#header').on('inview', function(event, isInView) {
  if (isInView) { setTimeout(anim, 250) }
  else { $(this).css('animation', '') }
})