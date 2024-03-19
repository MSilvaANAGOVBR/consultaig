define(["dojo/_base/declare",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/symbols/Symbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/graphic",
        "widgets/infoLayers"
    ],
    function(declare, Query, QueryTask, Symbol, SimpleMarkerSymbol,
        SimpleLineSymbol, SimpleFillSymbol, Graphic, infoLayers) {
        return declare("widgets.desenhaMunicipio", null, {
            _query: null,
            _muni_query: null,
            constructor: function() {
                this._muni_query = new esri.tasks.QueryTask("http://www.snirh.gov.br/arcgis/rest/services/IG/IG_ConsultaMunicipios/MapServer/0");
                this._query = new esri.tasks.Query();
            },
            identifMunicipio: function(mun_nome) {
                // alert('foi');
                this._query.where = "MUN_NM = '" + mun_nome + "'";
                this._query.returnGeometry = true;
                this._query.outSpatialReference = {
                    "wkid": 4326
                };
                
                this._query.outFields = ["*"];

                $("#nomes_consulta").css({
                    opacity: 0.5
                });

                $("#jan_Processando").css({
                    "display": "block",
                    "left": "590px",
                    "top": "380px"
                });
                
                this._muni_query.execute(this._query, this.desenhaMunicipio);
            },
            desenhaMunicipio: function(resp) {
                var feat = resp.features[0];
                var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([0, 0, 0, 0]));
                // var graphic = feat;
                feat.setSymbol(symbol);
                app.map.setExtent(feat.geometry.getExtent(), true);
                app.map.graphics.add(feat);

                $("#jan_Processando").css({
                    "display": "none"
                });
                $("#nomes_consulta").css({
                    opacity: 1
                });
            }
        });
    }
);