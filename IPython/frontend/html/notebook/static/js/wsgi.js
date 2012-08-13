var IPython = (function (IPython) {

    var WSGIApps = function () {
        this.style();
        this.bind_events();
        // reset loaded applications that come from factories
        var settings = {
            processData : false,
            cache : false,
            type : "GET",
            dataType : "json",
            success : $.proxy(this.reset_complete, this)
        };
        var url = $('body').data('baseProjectUrl') + 'wsgireset';
        $.ajax(url, settings);
    };

    WSGIApps.prototype.style = function () {
        $('.wsgi_launch').button();
    };

    WSGIApps.prototype.bind_events = function () {
        var that = this;
        $('.wsgi_launch').click(function () {
            $.proxy(that.launch, that)(this);
        });
    };

    WSGIApps.prototype.launch = function (b) {
        // launch/restart an application
        // get frame via ident in button's id
        var id = b.id.substring('wsgi_launch_'.length);
        var frame = $('#wsgi_frame_' + id);
        // set iframe to point to the application
        frame.attr('src', '/wsgi/' + id);
        // change the button's text if necessary
        b = $(b);
        var that = this;
        if (b.text() == 'Launch application') {
            b.replaceWith($('<button/>')
                .addClass('wsgi_launch')
                .attr('id', 'wsgi_launch_' + id)
                .text('Restart application')
                .button()
                .click(function () {
                    $.proxy(that.launch, that)(this);
                })
            );
        }
    };

    WSGIApps.prototype.reset_complete = function () {
        // load autoloading applications (via launch)
        var that = this;
        $('.wsgi_frame_autoload').each(function () {
            var id = this.id.substring('wsgi_frame_'.length);
            var b = $('#wsgi_launch_' + id)[0];
            $.proxy(that.launch, that)(b);
        });
    };

    IPython.WSGIApps = WSGIApps;

    return IPython;

}(IPython));
