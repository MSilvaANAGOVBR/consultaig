define(["dojo/_base/declare",
        "esri/graphic",
        "esri/geometry/webMercatorUtils",
        "esri/symbols/SimpleLineSymbol",
        "dojo/_base/Color",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/geometry/Polyline",
        "widgets/conectaRest",
        "widgets/infoLayers",
        "widgets/janelaProcessando"
    ],
    function(declare, Graphic, webMercatorUtils, SimpleLineSymbol, Color,
        Query, QueryTask, Polyline, conectaRest, infoLayers, janelaProcessando) {

        var processando = new janelaProcessando();
        function desenhaTrechos(feat) {
            app.map.graphics.clear();

            var polyline = new Polyline({
                "paths": [],
                "spatialReference": {
                    "wkid": 4326
                }
            });

            var symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([153, 0, 255, 255]),
                3
            );

            for (var i in feat.features) {
                polyline.addPath(feat.features[i].geometry.paths[0]);
            }

            var graphic = new Graphic(polyline);
            graphic.setSymbol(symbol);
            app.map.graphics.add(graphic);
            app.map.setExtent(graphic.geometry.getExtent().expand(2), true);

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

        return declare("widgets.consultaOtto", null, {
            _info: null,
            _serv_montante: null,
            _serv_rest: null,
            _otto: null,
            _trechos: null,
            constructor: function() {
                this._info = new infoLayers();
                this._serv_rest = new conectaRest();
                this._serv_montante = this._info.get_url_consulta_trechos_jusante();

            },
            monta_consulta: function(resp) {
                var con = '';
                // console.log(trechos['items']);

                for (var i in resp) {
                    con = con + ' TDR_CD_OTTOBACIA = "' + resp[i].trecho_ottobacia + '" OR ';
                }
                con = con.substring(0, con.length - 4);
                // console.log(con);
                return con;
            },
            get_resposta_serv: function(otto, offset) {
                var resp = this._serv_rest.getRestJSON(this._serv_montante, {
                    cod_otto: otto,
                    offset: offset
                });
                return resp;
            },
            processa_resp_serv: function(otto) {
                var trechos = [];
                var offset = 0;
                var resp = this.get_resposta_serv(otto, offset);
                // console.log(resp);
                trechos = resp['items'];
                // console.log(this._trechos);
                while (resp['limit'] == resp['count']) {
                    offset = offset + 25;
                    resp = this.get_resposta_serv(otto, offset);
                    for (var i in resp['items']) {
                        trechos.push(resp['items'][i]);
                    }
                }
                return trechos;
                // console.log(this._trechos);
            },
            identificaTrechosJusante: function(otto) {
                // console.log(otto);
                // console.log(this._serv_montante);
                // this._otto = otto;
                var trechos_lista = this.processa_resp_serv(otto);
                // console.log(trechos_lista);
                if (trechos_lista.length == 0) {
                    alert('Não existe na BHO o código otto informado!');
                } else {
                    var consulta = this.monta_consulta(trechos_lista);
                    // console.log(consulta);
                    consultaBHO(consulta);
                }
            }
        });
    });