define(["dojo/_base/declare"],
        function(declare) {
            return declare("widgets.Tooltip", null, {
                _mapa: null,
                constructor: function(/*Object*/ mapa) {  
                    // alert('foi');
                    this._mapa = mapa;
                },
                addLayers: function() {
                    return this._mapa;
                }
            });
        }
);