$('h2[id], h3[id]').waypoint(function(direction) {
    id = $(this.element).attr('id');
    currLink = $('a[href="#' + id + '"]');

    if ( direction == 'down' ) {
        prevLink = currLink.prevAll('a.active');
        prevLink.removeClass('active');
        currLink.addClass('active');
    } else {
        prevLinks = currLink.prevAll('a');
        if ( prevLinks.length ) {
            prevLink = $(prevLinks[0]);
            prevLink.addClass('active');
            currLink.removeClass('active');
        }
    };
}, {offset: '25%'});
