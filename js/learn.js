// draw charts on show
$('section').waypoint(function(direction) {
    $(this.element).animate({'opacity': 1});

    chartsInSlide = $(this.element).find('[id*="_chart"]');

    if ( chartsInSlide ) {

        chartsInSlide.each(function() {
            chart_obj = window.charts[$(this).attr('data-chart')];
            new Highcharts.Chart(chart_obj);
        })

        $('[data-toggle="tooltip"]').tooltip();

    }

    this.destroy();
}, {offset: '50%'});

// do section nav 
function showSection(el, direction) {

    if ( direction == 'down' ) {
        anim = 'slideInDown';
    } else {
        anim = 'slideInUp';
    };

    $(el).removeAttr('class');
    $(el).addClass('animated ' + anim);

}

function hideSection(el, direction) {

    $(el).removeAttr('class');
    $(el).addClass('hidden');

}

function makeShareUrl(el) {

    try {
        tweet = 'It\'s #NotJusticeWhen ' + el.text() + ' ' + window.location;
        return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet);
    } catch (err) {
        return undefined;
    }
    
}


$('section').waypoint(function(direction) {
    sectionId = $(this.element).attr('id');
    if ( sectionId ) {
        sections = ['intro', 'unequal', 'lifelong', 'action'];

        currentSection = sectionId.split('-').pop();
        currentElement = $('[data-section="' + currentSection + '"]');

        prevSection = sections[sections.indexOf(currentSection) - 1];
        prevElement = '[data-section="' + prevSection + '"]';

        if ( direction == 'down' ) {

            if ( currentSection == 'unequal' ) { 
                showSection('#prefix', direction);
            } else if ( currentSection == 'action' ) {
                hideSection('#prefix', direction);
            }

            hideSection(prevElement, direction);
            showSection(currentElement, direction);
            twitterShareURL = makeShareUrl(currentElement);
            $('#callout').attr('href', twitterShareURL);

        } else {
            
            if ( currentSection == 'unequal' ) { 
                hideSection('#prefix', direction);
            } else if ( currentSection == 'action' ) {
                showSection('#prefix', direction);
            } 

            hideSection(currentElement, direction);
            showSection(prevElement, direction);
            twitterShareURL = makeShareUrl(prevElement);
            $('#callout').attr('href', twitterShareURL);

        }
    }
}, {offset: '50%'});  
