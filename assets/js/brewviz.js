$(document).ready(function() {

    // fix menu when passed
    $('.masthead')
        .visibility({
            once: false,
            onBottomPassed: function() {
                $('.fixed.menu').transition('fade in');
            },
            onBottomPassedReverse: function() {
                $('.fixed.menu').transition('fade out');
            }
        });

    resizeDiv(".masthead");

    window.onresize = function(event) {
        resizeDiv();
    }

    function resizeDiv(e) {
        vph = $(window).height();
        $(e).css({'height': vph + 'px'});
    }

    // create sidebar and attach to menu open
    $('.ui.sidebar')
        .sidebar('attach events', '.toc.item');

});
