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
$('section').waypoint(function(direction) {
    sectionId = $(this.element).attr('id');
    if ( sectionId ) {

        sections = ['intro', 'unequal', 'lifelong', 'action'];

        currentSection = sectionId.split('-').pop();
        prevSection = sections[sections.indexOf(currentSection) - 1];

        if ( direction == 'down' ) {

            if ( currentSection == 'unequal' ) { 

                $('#prefix').removeAttr('class');
                $('#prefix').removeClass('hidden');
                $('#prefix').addClass('animated slideInDown');

            } else if ( currentSection == 'action' ) {

                $('#prefix').removeAttr('class');
                $('#prefix').addClass('animated slideOutDown');
                $('#prefix').addClass('hidden');

            }

            if ( currentSection != 'unequal' ) {

                // hide previous section
                $('[data-section="' + prevSection + '"]').removeAttr('class');
                $('[data-section="' + prevSection + '"]').addClass('animated slideOutDown');
                $('[data-section="' + prevSection + '"]').addClass('hidden');

            }

            // show current section
            $('[data-section="' + currentSection + '"]').removeAttr('class');
            $('[data-section="' + currentSection + '"]').removeClass('hidden');
            $('[data-section="' + currentSection + '"]').addClass('animated slideInDown');

        } else {
            
            if ( currentSection == 'unequal' ) { 

                $('#prefix').removeAttr('class');
                $('#prefix').addClass('animated slideOutUp');
                $('#prefix').addClass('hidden');

            } else if ( currentSection == 'action' ) {

                $('#prefix').removeAttr('class');
                $('#prefix').removeClass('hidden');
                $('#prefix').addClass('animated slideInUp');

            } 

            if ( currentSection != 'action' ) { 

                // hide current section
                $('[data-section="' + currentSection + '"]').removeAttr('class');
                $('[data-section="' + currentSection + '"]').addClass('animated slideOutUp');
                $('[data-section="' + currentSection + '"]').addClass('hidden');

            }

            // show previous section
            $('[data-section="' + prevSection + '"]').removeAttr('class');
            $('[data-section="' + prevSection + '"]').removeClass('hidden');
            $('[data-section="' + prevSection + '"]').addClass('animated slideInUp');

        }

    }
}, {offset: '75%'});  