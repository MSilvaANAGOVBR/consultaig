define(["dojo/_base/declare",
        "widgets/modBasico"
    ],
    function(declare, modBasico) {
        return declare("widgets.montaPainelConsultas", null, {
            _mapa: null,
            constructor: function( /*Object*/ mapa) {
                // alert('foi');
                var teste = new modBasico();
            },
            addLayers: function() {
                return this._mapa;
            }
        });
    }
);