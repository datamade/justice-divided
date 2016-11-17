// hide context on init
var context = $('div#context')
var contextOffset = context.width() + 30
context.css('left', contextOffset)

// show/hide context
$('div.frame#decision-1').waypoint(function(direction) {
	if (direction == 'down') {
		context.animate({left: "-=" + contextOffset}, 1000)
		$('.navbar-nav').delay(250).animate({opacity: 1}, 1000)
		$('.navbar-default').animate({top: "-=14vh"}, 1000)
		$('.navbar-brand').animate({'font-size': '1.5em',
									'margin-top': '+=55px'}, 1000)
	} else {
		context.animate({left: "+=" + contextOffset}, 1000)
		$('.navbar-nav').animate({opacity: 0}, 250)
		$('.navbar-default').animate({top: "+=14vh"}, 500)
		$('.navbar-brand').animate({'font-size': '4em',
									'margin-top': '-=55px'}, 500)
	}
}, {
	offset: '50%'
})

// decision point options => outcome & context
$('div.frame').not('#intro').waypoint(function(direction) {
	var decisionFrame = $(this.element)
	var decisionLabel = decisionFrame.children('div').children('div.decision-label')
	var options = decisionFrame.children('div').children('div.decision-option')
	var outcome = options.filter('.outcome')
	var nonOutcome = options.not('.outcome')
	var outcomeNarrative = decisionFrame.children('div').children('div.outcome-narrative')
	var outcomeContext = $('div#context > div[id*="' + decisionFrame.attr('id') + '"]')

	if (direction == 'down') {
		outcome.animate({left: "+=" + outcome.width()/1.5}, 1000) // bring outcome to center
		outcomeContext.animate({opacity: 1}, 1000) // fade in outcome context
		outcomeNarrative.animate({opacity: 1}, 1000) // fade in narrative
		nonOutcome.animate({opacity: 0}, 1000) // fade out non outcome
		decisionLabel.animate({opacity: 0}, 1000) // fade out label
	} else {
		outcome.animate({left: "-=" + outcome.width()/1.5}, 1000)  // push outcome back to left
		outcomeContext.animate({opacity: 0}, 1000) // fade out outcome context
		outcomeNarrative.animate({opacity: 0}, 1000) // fade out narrative
		nonOutcome.animate({opacity: 1}, 1000) // fade in non outcome
		decisionLabel.animate({opacity: 1}, 1000) // fade in label
	}
}, {
	offset: '-10%'
})

// clear context for next decision
$('div.frame').not('#intro').waypoint(function(direction) {
	var decisionFrame = $(this.element)
	var outcomeContext = $('div#context > div[id*="' + decisionFrame.attr('id') + '"]')

	if (direction == 'down') {
		outcomeContext.prev().animate({opacity: 0}, 1000) // fade out context of previous outcome
	} else {
		outcomeContext.prev().animate({opacity: 1}, 1000) // fade in context of previous outcome
	}
}, {
	offset: '60%'
})
