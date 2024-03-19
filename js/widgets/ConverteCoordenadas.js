define(["dojo/_base/declare"],
    function(declare) {
        return declare("widgets.ConverteCoordenadas", null, {
            _gms: null,
            _decimais: null,
            DecimaisGMS: function(dgr) {
                this._gms = [];
                var g = Math.trunc(dgr);
                var m = (Math.abs(dgr) - Math.abs(g) ) * 60 ;
                var s = (m - Math.trunc(m) ) * 60 ;
                this._gms = [g, m, s];
                return this._gms;
            },
            GMSDecimais: function(g, m, s) {
                this._decimais = 0;
                var minutos = s / 60 + m;
                if (g < 0) {
                    this._decimais = Math.abs(g) + (minutos / 60);
                    this._decimais = Number(this._decimais * (-1)).toFixed(5);
                } else {
                    this._decimais = Number((minutos / 60) + g).toFixed(5);
                }
                return this._decimais;
            }
        });
    }
);