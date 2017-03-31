// dynamically set height of sections
$('.section').each(function() {
    $(this).css({'min-height': window.innerHeight * 1.25});
})

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

// stats slides
$('div#stages').slick({
  prevArrow: '<i class="fa fa-chevron-left fa-fw pull-left"></i>',
  nextArrow: '<i class="fa fa-chevron-right fa-fw pull-right"></i>',
  appendArrows: $('div#stages-nav'),
  dots: true,
  appendDots: $('div#status')
});