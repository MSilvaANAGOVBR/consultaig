define(["dojo/_base/declare"],
    function(declare) {

        return declare("widgets.janelaProcessando", null, {
            _tp: null,
            _opac: null,
            constructor: function() {
                this._tp = '';
                this._opac = 0;
            },
            setJanelaProcessando: function(status) {
                var tp = '';
                var opac = 0;
                if (status == 'on') {
                    opac = 0.7;
                    tp = "block";
                } else if (status == 'off') {
                    opac = 1;
                    tp = "none";
                }
                $("#jan_Processando").css({
                    "display": tp,
                    "opacity": opac
                });
            }
        });
    });