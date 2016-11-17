// hide context on init
var context = $('div#context')
var contextOffset = context.width() + 30
context.css('left', contextOffset)

// show/hide context
var waypoints = $('div.frame#decision-1').waypoint(function(direction) {
	if (direction=='down') {
		context.animate({left: "-=" + contextOffset}, 1000)
	} else {
		context.animate({left: "+=" + contextOffset}, 1000)
	}
}, {
	offset: '50%'
})

// show/hide decision point options/outcome & context
var waypoints = $('div.frame').not('#intro').waypoint(function(direction) {
	var decisionFrame = $(this.element)
	var options = decisionFrame.children('div.decision-option')
	var outcome = options.filter('.outcome')
	var nonOutcome = options.not('.outcome')
	var outcomeContext = $('div#context > div[id*="' + decisionFrame.attr('id') + '"]')

	if (direction=='down') {
		outcomeContext.prev().animate({opacity: 0}, 1000)
		outcome.animate({left: "+=" + outcome.width()/1.5}, 1000)
		nonOutcome.animate({opacity: 0}, 1000)
		outcomeContext.animate({opacity: 1}, 1000)
	} else {
		outcomeContext.prev().animate({opacity: 1}, 1000)
		outcome.animate({left: "-=" + outcome.width()/1.5}, 1000)
		nonOutcome.animate({opacity: 1}, 1000)
		$('div#context > div[id*="' + decisionFrame.attr('id') + '"]').animate({opacity: 0}, 1000)
	}
}, {
	offset: '10%'
})


