// draw charts on show
$('section').waypoint(function(direction) {
    $(this.element).animate({'opacity': 1});

    chartsInSlide = $(this.element).find('[id*="_chart"]');

    if ( chartsInSlide ) {

        chartsInSlide.each(function() {
            chart_obj = window[$(this).attr('data-chart')];
            new Highcharts.Chart(chart_obj);
        })

        $('[data-toggle="tooltip"]').tooltip();

    }

    this.destroy();
}, {offset: '50%'});

// do navigation 
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
    if ( direction == 'down' ) {
        anim = 'slideOutDown';
    } else {
        anim = 'slideOutUp';
    };

    $(el).removeAttr('class');
    $(el).addClass('animated ' + anim);
    $(el).addClass('hidden');

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

        } else {
            
            if ( currentSection == 'unequal' ) { 
                hideSection('#prefix', direction);
            } else if ( currentSection == 'action' ) {
                showSection('#prefix', direction);
            } 

            hideSection(currentElement, direction);
            showSection(prevElement, direction);

        }
    }
}, {offset: '75%'});  
