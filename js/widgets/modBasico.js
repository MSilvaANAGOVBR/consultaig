define(["dojo/_base/declare"],
        function(declare) {
            return declare("widgets.modBasico", null, {
                _mapa: null,
                constructor: function(/*Object*/ mapa) {
                    alert('foi modbasico');
                    // this._mapa = mapa;
                },
                addLayers: function() {
                    return this._mapa;
                }
            });
        }
);


