define(["dojo/_base/declare",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/dijit/Legend",
        "esri/InfoTemplate",
        "esri/layers/FeatureLayer",
        "esri/symbols/Symbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/graphic",
        "dojo/_base/Color",
        "esri/geometry/webMercatorUtils",
        "widgets/infoLayers"
    ],
    function(declare, Query, QueryTask, Legend,
        InfoTemplate, FeatureLayer, Symbol,
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
        Graphic, Color, webMercatorUtils, infoLayers) {

        var title;
        var conteudo;
        var conteudo_lyr;
        var atr;
        var info = new infoLayers();
        var grafico_apontado;
        var pnt_info_window;

        function setPontoInfoWindow(pnt) {
            pnt_info_window = pnt;
        }

        function getPontoInfoWindow() {
            return pnt_info_window;
        }

        function getInfoTamplate() {
            var infoTemp = new InfoTemplate(getTitulo(), getConteudo());
            return infoTemp;
        }

        function setTitulo(titulo) {
            title = "<img src=\"img/ana90_tundra.jpg\"  width=\"45\" height=\"15\"><i>&nbsp" + titulo + "</i>";
        }

        function getTitulo() {
            return title;
        }

        function setAtttributes(at) {
            atr = at;
        }

        function getAtttributes() {
            return atr;
        }

        function setConteudoLayer(content) {
            conteudo_lyr = content;
        }

        function getConteudoLayer() {
            return conteudo_lyr;
        }

        function getConteudo() {
            var con = getConteudoLayer();
            var content = '';
            for (var i in con) {
                content = content + '<tr><td style="text-align:left;"><b>' + i + '</b></td><td style="text-align:right;">${' + con[i] + '}</td></tr>';
            }

            var cont = "<table border=\"1\">" + content + '</td></tr></ table>';

            return cont;
        }

        function getSymbol() {
            var symbol = new PictureMarkerSymbol('http://static.arcgis.com/images/Symbols/Shapes/YellowCircleLargeB.png', 30, 30);
            return symbol;
        }

        function setInfoWindow() {
            app.map.infoWindow.setTitle(getTitulo());
            app.map.infoWindow.setContent(grafico_apontado.getContent());
            app.map.infoWindow.resize(300, 250);
            app.map.infoWindow.show(getPontoInfoWindow(), getPontoInfoWindow());
        }

        function mostraInfoWindow(evt) {
            setAtttributes(evt.graphic.attributes);
            var feat = evt.graphic.geometry;
            var tipo = feat.type;
            var symbol;

            if (tipo == "esriGeometryPolyline") {
                symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([053, 0, 255, 255]), 3);
            } else if (tipo == "polygon") {
                symbol = new SimpleFillSymbol();
                setPontoInfoWindow(feat.getCentroid());
            } else if (tipo == "point") {
                symbol = new SimpleMarkerSymbol();
                setPontoInfoWindow(feat);
            }

            if (con_graph_indx > 0) {
                app.map.graphics.remove(app.map.graphics.graphics[con_graph_indx]);
            }

            grafico_apontado = new Graphic(getPontoInfoWindow(), symbol, getAtttributes(), getInfoTamplate());
            con_graph_indx = app.map.graphics.graphics.length;
            app.map.graphics.add(grafico_apontado);
            setInfoWindow();
        }

        function escondeInfoWindow() {
            app.map.graphics.remove(app.map.graphics.graphics[con_graph_indx]);
            app.map.infoWindow.hide();
        }

        return declare("widgets.addLayersLegend", null, {

            _espelhos: null,
            _BHO_Dominio: null,
            _BHO_Ottobacias: null,
            _uni_conserv: null,
            _terra_ind: null,
            _flow_lyr: null,
            _legenda: null,
            _mat_lyrs: null,
            _cnarh3_inform: null,
            _mat_add_remove: null,
            _lyr_order: null,
            // ---------------------------------------------
            constructor: function() {
                this.setFeatureServicesLayers();
                this.addInitialLegend();
                this.setLayersOrder();
            },
            // ---------------------------------------------
            // FEATURES
            setFeatureServicesLayers: function() {

                this._mat_lyrs = info.get_matriz_Layers();
                //-----------------------------------------
                // BHO_Dominio  
                this._BHO_Dominio = info.get_info_BHO_Dominio()["layer"];
                app.map.addLayer(this._BHO_Dominio);
                this._mat_lyrs[0]["layer"] = this._BHO_Dominio;
                //-----------------------------------------
                // BHO_Ottobacias
                this._BHO_Ottobacias = info.get_info_BHO_Ottobacias()["layer"];
                this._mat_lyrs[1]["layer"] = this._BHO_Ottobacias;
                //-----------------------------------------
                // ESPELHOS
                this._espelhos = info.get_info_Espelhos()["layer"];
                this._espelhos.on("mouse-over", function(event) {
                    setTitulo(info.get_info_Espelhos()["titulo"]);
                    setConteudoLayer(info.get_info_Espelhos()["conteudo"]);
                    mostraInfoWindow(event);
                });
                this._espelhos.on("mouse-out", function(event) {
                    escondeInfoWindow();
                });
                this._mat_lyrs[2]["layer"] = this._espelhos;
                //-----------------------------------------
                // UNIDADE CONSERV
                this._uni_conserv = info.get_info_Unid_Conserv()["layer"];
                this._uni_conserv.on("mouse-move", function(event) {
                    setTitulo(info.get_info_Unid_Conserv()["titulo"]);
                    setConteudoLayer(info.get_info_Unid_Conserv()["conteudo"]);
                    mostraInfoWindow(event);
                });
                this._uni_conserv.on("mouse-out", function(event) {
                    escondeInfoWindow();
                });
                this._mat_lyrs[7]["layer"] = this._uni_conserv;
                //-----------------------------------------
                // TERRA INDIGENA
                this._terra_ind = info.get_info_Terra_Ind()["layer"];
                this._terra_ind.on("mouse-move", function(event) {
                    setTitulo(info.get_info_Terra_Ind()["titulo"]);
                    setConteudoLayer(info.get_info_Terra_Ind()["conteudo"]);
                    mostraInfoWindow(event);
                });
                this._terra_ind.on("mouse-out", function(event) {
                    escondeInfoWindow();
                });
                this._mat_lyrs[8]["layer"] = this._terra_ind;
                //-----------------------------------------
                // Outorgas de Uso de Recursos Hídricos 
                this._outorgas_uso = info.get_info_Outorgas_Uso()["layer"];
                this._outorgas_uso.on("mouse-over", function(event) {
                    setTitulo(info.get_info_Outorgas_Uso()["titulo"]);
                    setConteudoLayer(info.get_info_Outorgas_Uso()["conteudo"]);
                    mostraInfoWindow(event);
                });
                // this._mat_add_remove.push(this._outorgas_uso);
                // this._outorgas_uso.on("mouse-out", function(event) {
                //     escondeInfoWindow();
                // });
                this._mat_lyrs[3]["layer"] = this._outorgas_uso;
                //-----------------------------------------
                // Outorgas CNARH 3 Informada 
                this._cnarh3_inform = info.get_info_Cnarh3_Informada()["layer"];
                this._cnarh3_inform.on("mouse-over", function(event) {
                    setTitulo(info.get_info_Cnarh3_Informada()["titulo"]);
                    setConteudoLayer(info.get_info_Cnarh3_Informada()["conteudo"]);
                    mostraInfoWindow(event);
                });
                // this._mat_add_remove.push(this._cnarh3_inform);
                // this._cnarh3_inform.on("mouse-out", function(event) {
                //     escondeInfoWindow();
                // });
                this._mat_lyrs[4]["layer"] = this._cnarh3_inform;
                //-----------------------------------------
                // Reservatorios SIN
                this._reserv_sin = info.get_info_Reserv_SIN()["layer"];
                this._reserv_sin.on("mouse-over", function(event) {
                    setTitulo(info.get_info_Reserv_SIN()["titulo"]);
                    setConteudoLayer(info.get_info_Reserv_SIN()["conteudo"]);
                    mostraInfoWindow(event);
                });
                // this._mat_add_remove.push(this._reserv_sin);
                // this._reserv_sin.on("mouse-out", function(event) {
                //     escondeInfoWindow();
                // });
                this._mat_lyrs[5]["layer"] = this._reserv_sin;
                //-----------------------------------------
                // Reservatorios NE
                this._reserv_ne = info.get_info_Reserv_NE()["layer"];
                this._reserv_ne.on("mouse-over", function(event) {
                    setTitulo(info.get_info_Reserv_NE()["titulo"]);
                    setConteudoLayer(info.get_info_Reserv_NE()["conteudo"]);
                    mostraInfoWindow(event);
                });
                // this._mat_add_remove.push(this._reserv_ne);
                // this._reserv_ne.on("mouse-out", function(event) {
                //     escondeInfoWindow();
                // });
                this._mat_lyrs[6]["layer"] = this._reserv_ne;
            },
            insert_html_Layers: function() {
                return info.get_html_Layers();
            },
            getBHODominioQuery: function() {
                return new esri.tasks.QueryTask(info.get_info_BHO_Dominio()["url"]);
            },
            getMunicipiosQuery: function() {
                return new esri.tasks.QueryTask(info.get_url_municipios());
            },
            // ---------------------------------------------
            // LEGENDA
            addInitialLegend: function() {
                this._mat_legenda = [{
                    "layer": this._BHO_Dominio,
                    "title": info.get_info_BHO_Dominio()["titulo"]
                }];
                this._legenda = new Legend({
                    map: app.map,
                    respectCurrentMapScale: true,
                    layerInfos: this._mat_legenda
                }, "legendiv");
                this._legenda.startup();
                $('#con_feat_select').append('<option value="' + info.get_info_BHO_Dominio()["ordem"] + '" select="">Base Hidrográfica</option>');
            },
            // --------------------------------------------- 
            // ORDENA LAYERS PELA ORDEM
            setLayersOrder: function() {
                this._lyr_order = new Array(this._mat_lyrs.length);

                for (var i in this._mat_lyrs) {
                    this._lyr_order[this._mat_lyrs[i]["ordem"]] = this._mat_lyrs[i];
                }
                // console.log(this._lyr_order);
            },
            // --------------------------------------------- 
            // ADICIONA E REMOVE LAYERS
            addRemoveLayersAndLegend: function() {
                this._mat_legenda = [];
                $('#con_feat_select').empty().append('<option value="-1" select>Selecione Plano de Inf.</option>');

                var div_id = '';
                var layer_obj;
                var layer_name = '';
                var layer_order = 0;

                for (var i in this._lyr_order) {

                    div_id = this._lyr_order[i]["id"];
                    layer_obj = this._lyr_order[i]["layer"];
                    layer_name = this._lyr_order[i]["titulo"];
                    layer_order = this._lyr_order[i]["ordem"];
                    layer_url = this._lyr_order[i]["url"];

                    if ($('#' + div_id).is(':checked') === true) {
                        $('#con_feat_select').append('<option value="' + layer_order + '" select="">' + layer_name + '</option>');
                        app.map.addLayer(layer_obj);
                        this._mat_legenda.push({
                            "layer": layer_obj,
                            "title": layer_name
                        });
                        app.map.reorderLayer(layer_obj, layer_order);
                    } else if ($('#' + div_id).is(':checked') === false) {
                        app.map.removeLayer(layer_obj);
                    }
                }
                this._legenda.refresh(this._mat_legenda);
            }
        });
    }
);