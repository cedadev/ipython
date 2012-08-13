var IPython = (function (IPython) {

    // TODO: escape : in root when sending, ie. : -> \:, \ -> \\

    var PydapLauncher = function () {
        this.frame = document.getElementById('pydap_frame');
        var settings = {
            processData : false,
            cache : false,
            type : "GET",
            dataType : "json",
            success : $.proxy(this.set_path, this)
        };
        var url = $('body').data('baseProjectUrl') + 'pydapgetroot';
        $.ajax(url, settings);
        this.style();
        this.bind_events();
    };

    PydapLauncher.prototype.style = function () {
        $('#pydap_path').css('width', '500px');
        $('#pydap_go').button();
        $('#pydap_home').button({
            icons : {primary: 'ui-icon-home-1-s'},
            text : false
        });
        $('#pydap_refresh').button({
            icons : {primary: 'ui-icon-arrowrefresh-1-s'},
            text : false
        });
    };

    PydapLauncher.prototype.bind_events = function () {
        var that = this;
        $('#pydap_path').keydown(function (e) {
            if (e.keyCode == 13) $.proxy(that.go(), this);
        });
        $('#pydap_go').click($.proxy(this.go, this));
        $('#pydap_home').click($.proxy(this.home, this));
        $('#pydap_refresh').click($.proxy(this.reload, this));
    };

    PydapLauncher.prototype.set_path = function (root) {
        this.root = root;
        $('#pydap_path').val(root);
        //this.home();
    };

    PydapLauncher.prototype.go = function () {
        this.root = $('#pydap_path').val();
        this.home();
    };

    PydapLauncher.prototype.home = function (data) {
        this.frame.src = '/pydap:' + this.root + ':/';
    };

    PydapLauncher.prototype.reload = function () {
        this.frame.contentWindow.location.reload();
    }

    IPython.PydapLauncher = PydapLauncher;

    return IPython;

}(IPython));
