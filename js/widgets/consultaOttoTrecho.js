define(["dojo/_base/declare",
        "esri/graphic",
        "esri/geometry/webMercatorUtils",
        "esri/symbols/SimpleLineSymbol",
        "dojo/_base/Color",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "widgets/conectaRest",
        "widgets/infoLayers"
    ],
    function(declare, Graphic, webMercatorUtils, SimpleLineSymbol, Color,
        Query, QueryTask, conectaRest, infoLayers) {

        function desenhaTrechos(feat) {
            app.map.graphics.clear();
            var symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([153, 0, 255, 255]),
                3
            );
            var n = 0;
            for (var i in feat.features) {
                var graphic = feat.features[i];
                graphic.setSymbol(symbol);
                app.map.graphics.add(graphic);
                n = n + 1;
            }
            if (n >= 1){
                app.map.setExtent(graphic.geometry.getExtent().expand(3), true);                
            } else {
                alert('Não foram identificados trechos com este código otto!')
            }
            setJanelaProcessando("off");            
        }

        function consultaBHO(consult) {
            BHO_query = new esri.tasks.QueryTask("http://www.snirh.gov.br/arcgis/rest/services/IG/Servicos_Base_IG/MapServer/1");
            query = new esri.tasks.Query();
            query.where = consult;
            query.returnGeometry = true;
            query.outSpatialReference = {
                "wkid": 4326
            };
            query.outFields = ["*"];
            setJanelaProcessando("on");
            BHO_query.execute(query, desenhaTrechos);
        }

        function setJanelaProcessando(status) {
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

        return declare("widgets.consultaOttoTrecho", null, {
            _info: null,
            _serv_bho: null,
            constructor: function() {
                this._info = new infoLayers(); 
                this._serv_bho = this._info.get_info_BHO_Dominio()["url"];
            },            
            consultaOttoTrecho: function(otto) {
                var con = "TDR_CD_OTTOBACIA = '" + otto + "'";                
                consultaBHO(con);
            }
        });
    });