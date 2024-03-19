define(["dojo/_base/declare",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/request",
        "esri/symbols/Symbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/geometry/Point",
        "esri/SpatialReference",
        "esri/graphic",
        "dojo/_base/Color",
        "widgets/infoLayers"
    ],
    function(declare,
        Query,
        QueryTask,
        esriRequest,
        Symbol, SimpleMarkerSymbol,
        SimpleLineSymbol, SimpleFillSymbol, PictureMarkerSymbol,
        Point, SpatialReference,
        Graphic, Color,
        infoLayers) {

        var url_lyr;
        var info = new infoLayers();

        function consultaRespostaSelecionada(cd, valor) {
            query_Lyr = new esri.tasks.QueryTask(url_lyr);
            query = new esri.tasks.Query();
            query.where = cd + " = '" + valor + "'";
            query.returnGeometry = true;
            query.outSpatialReference = {
                "wkid": 4326
            };
            query.outFields = ["*"];
            query_Lyr.execute(query, desenhaConsultaPlano);
        }

        function desenhaConsultaPlano(resp) {
            var tipo = resp.geometryType;
            var feat = resp.features[0];
            var symbol = '';



            if (feat.geometry.type == "point") {
                var feat_cent = feat.geometry;
                var symbol = new PictureMarkerSymbol('http://static.arcgis.com/images/Symbols/Shapes/YellowStarLargeB.png', 30, 30);
            } else {
                var feat_cent = new Point({
                    "x": feat.geometry.getExtent()["xmin"],
                    "y": feat.geometry.getExtent()["ymin"],
                    "spatialReference": {
                        "wkid": 4326
                    }
                });
                var symbol = new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([153, 0, 255, 255]),
                    3
                );
                app.map.setExtent(feat.geometry.getExtent(), true);
            }
            feat.setSymbol(symbol);
            app.map.graphics.add(feat);

            app.map.centerAndZoom(feat_cent, 13);
        }

        return declare("widgets.ConsultaPlanos", null, {

            identifPlanosCampos: function(order) {
                var lin = info.get_matriz_Layer(order);
                // console.log(lin);
                url_lyr = lin["url"];
                var requestHandle = esriRequest({
                    "url": url_lyr,
                    "content": {
                        "f": "json"
                    },
                    "callbackParamName": "callback"
                });
                requestHandle.then(this.retornaCampos, this.retornaCamposErro());
            },
            retornaCampos: function(response) {
                $('#con_feat_coluna').empty();
                this.table_head = '<thead><tr>';
                for (var n in response.fields) {
                    nome_campo = response.fields[n].name;
                    if (nome_campo.indexOf("POLIGONO") > -1 || nome_campo.indexOf("LINHA") > -1 || nome_campo.indexOf("PONTO") > -1) {
                        continue;
                    }
                    $('#con_feat_coluna').append('<option value="' + nome_campo + '" select="">' + nome_campo + '</option>');
                    this.table_head = this.table_head + "<th>" + nome_campo + "</th>";
                }
                this.table_head = this.table_head + "</tr></thead>";
            },
            retornaCamposErro: function(error) {
                for (var i in error) {
                    console.log("Erro (consultaPlanos): " + i);
                }
            },
            consultaSqlPlano: function() {
                query_Lyr = new esri.tasks.QueryTask(url_lyr);
                var coluna = $('#con_feat_coluna').val();
                var exp = $('#con_feat_expressao').val();
                var valor = $('#con_feat_valor').val();
                query = new esri.tasks.Query();
                query.where = coluna + " " + exp + " '" + valor + "'";
                // console.log(query.where);
                query.returnGeometry = true;
                query.outSpatialReference = {
                    "wkid": 4326
                };
                query.outFields = ["*"];
                query_Lyr.execute(query, this.respostaConsulta);
            },
            respostaConsulta: function(resp) {
                $("#con_feat_tabela_resp").append(this.table_head);
                // console.log(resp.features.length);
                if (resp.features.length == 0) {
                    $("#consulta_Plano_label").text("Nenhum resultado");
                    return;
                }
                try {
                    for (var f in resp.features) {
                        feat = resp.features[f].attributes;
                        var cd;
                        $("#map").css("height", 700);
                        $("#con_feat_tabela").show();
                        var table_body = '<tbody><tr class="plano_zoom" style="cursor: pointer;">';
                        for (var i in feat) {
                            table_body = table_body + '<td class="' + i + '">' + feat[i] + "</td>";
                        }
                        table_body = table_body + "</tr></tbody>";
                        $("#con_feat_tabela_resp").append(table_body);
                    }
                    $('.plano_zoom').on('click', function() {
                        $('.plano_zoom').css("background-color", "white");
                        for (var k in feat) {
                            cd = k;
                            break;
                        }
                        $(this).css("background-color", "rgb(173,216,230)");
                        consultaRespostaSelecionada(cd, $(this).find('.' + cd).text());
                    });
                } catch (err) {
                    alert("Consulta vazia!");
                }
            }
        });
    });