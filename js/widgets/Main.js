// require(["esri/map", "esri/dijit/BasemapGallery", "dojo/domReady!"],
//     function(Map, BasemapGallery) {
//         var map = new Map("map", {
//             center: [-50, -14.5],
//             zoom: 5,
//             basemap: "topo"
//         });
//     });

var app = {};
var map, ponto;
var identifyTask, identifyParams;
var graphic, address, loc, distancia, nomeRio;
var n = 0;
var pixel_mat = [];
var ponto_arr;
var lat, lon;
var dataSource;
var nome_rio, estado, municipio;
var lyr;
var conteudo;
var long_inter;
var lat_inter;

require([
    "esri/map",
    "esri/dijit/BasemapToggle",
    "esri/tasks/locator",
    "esri/tasks/identify",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/graphic",
    "esri/dijit/Legend",
    "esri/geometry/webMercatorUtils",
    "esri/tasks/Geoprocessor",
    "esri/symbols/Symbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/InfoTemplate",
    "esri/layers/QueryDataSource",
    "esri/layers/LayerDataSource",
    "esri/layers/FeatureLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/DynamicLayerInfo",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "dojo/_base/Color",
    "dojo/number",
    "dojo/parser",
    "dojo/dom",
    "dijit/registry",
    "esri/dijit/BasemapGallery",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!",
    "dijit/form/Button",
    "esri/lang"
], function(
    Map, BasemapToggle, Locator, identify, Query, QueryTask, Graphic,
    Legend, webMercatorUtils, Geoprocessor,
    Symbol, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
    InfoTemplate, QueryDataSource, LayerDataSource,
    FeatureLayer, ArcGISDynamicMapServiceLayer,
    DynamicLayerInfo, Extent, SpatialReference,
    Color, number, parser, dom, registry,
    BasemapGallery, OverviewMap,
    domStyle, esriLang
) {
    parser.parse();

    app.map = new esri.Map("map", {
        extent: new esri.geometry.Extent(-75, -34, -34, 6, new esri.SpatialReference({
            wkid: 4326
        })),
        basemap: "streets"
    }); // -75, -34, -34, 6


    // ---------------------------------------------
    // LAYERS
    //BASEMAP GALERY
    var toggle = new BasemapToggle({
        map: app.map,
        basemap: "satellite"
    }, "BasemapToggle");
    toggle.startup();

    // ESPELHOS
    var esp_dynamic = new esri.layers.ArcGISDynamicMapServiceLayer("http://intranet.snirh.gov.br/arcgis/rest/services/SGI/Espelhos_Dagua/MapServer");
    app.map.addLayer(esp_dynamic);

    // BHO_Dominio
    var BHO_Dominio = new esri.layers.ArcGISDynamicMapServiceLayer("http://intranet.snirh.gov.br/arcgis/rest/services/SGI/Base_Hidrografica_2013/MapServer");
    app.map.addLayer(BHO_Dominio);
    var BHO_Dominio_query = new esri.tasks.QueryTask("http://intranet.snirh.gov.br/arcgis/rest/services/SGI/Base_Hidrografica_2013/MapServer/0");

    // UNIDADE CONSERV
    var uni_conserv = new esri.layers.ArcGISDynamicMapServiceLayer("http://intranet.snirh.gov.br/arcgis/rest/services/SFI/Unidades_Conservacao/MapServer");

    // TERRA INDIGENA
    var terra_ind = new esri.layers.ArcGISDynamicMapServiceLayer("http://intranet.snirh.gov.br/arcgis/rest/services/SFI/Terras_Indigenas/MapServer");

    // INTERFERENCIAS FEDERAIS  
    // var interferencias = new esri.layers.ArcGISDynamicMapServiceLayer("http://intranet.snirh.gov.br/arcgis/rest/services/CNARH/Interferencias_CNARH40/MapServer");
    // var interferencias_fed = new esri.layers.FeatureLayer("http://intranet.snirh.gov.br/arcgis/rest/services/CNARH/Interferencias_CNARH40/MapServer/0", {
    //     mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
    //     outFields: ["*"]
    // });
    // interferencias_fed.on("mouse-over", showTooltip);
    // interferencias_fed.on("mouse-out", closeDialog);

    // MUNICIPIOS    
    var municipios_query = new esri.tasks.QueryTask("http://intranet.snirh.gov.br/arcgis/rest/services/SGI/Municípios/MapServer/0");
    var query = new esri.tasks.Query();
    var muni_nomes = [];
    var muni_geom = [];

    // FLOW ACCUMULATION
    var flow_lyr = new esri.layers.ArcGISDynamicMapServiceLayer("http://intranet.snirh.gov.br/arcgis/rest/services/SGI_RASTER/FlowAccumulation/MapServer", {
        opacity: 0.0,
        id: "flow"
    });
    app.map.addLayer(flow_lyr);

    // ---------------------------------------------
    //LEGENDA
    var mat_legenda = [{
        "layer": esp_dynamic,
        "title": "Espelhos d'água"
    }, {
        "layer": BHO_Dominio,
        "title": "Base Hidrográfica"
    }];

    var legend = new Legend({
        map: app.map,
        respectCurrentMapScale: true,
        layerInfos: mat_legenda
    }, "legendiv");

    legend.startup();

    // --------------------------------------------- 
    // ADICIONA E REMOVE LAYERS
    $("input").on("click", function() {

        mat_legenda = [];

        // TERRA INDIGENA
        if ($('#check_terra_ind').is(':checked') === true) {
            app.map.addLayer(terra_ind);
            mat_legenda.push({
                "layer": terra_ind,
                "title": "Terras Indígenas"
            });
            app.map.reorderLayer(terra_ind, 9);
        } else if ($('#check_terra_ind').is(':checked') === false) {
            app.map.removeLayer(terra_ind);
        }
        // UNIDADE CONSERV
        if ($('#check_unidade_cons').is(':checked') === true) {
            app.map.addLayer(uni_conserv);
            mat_legenda.push({
                "layer": uni_conserv,
                "title": "Unidades de Conservação"
            });
            app.map.reorderLayer(uni_conserv, 8);
        } else if ($('#check_unidade_cons').is(':checked') === false) {
            app.map.removeLayer(uni_conserv);
        }
        // ESPELHOS
        if ($('#check_espelhos').is(':checked') === true) {
            app.map.addLayer(esp_dynamic);
            mat_legenda.push({
                "layer": esp_dynamic,
                "title": "Espelhos d'água"
            });
            app.map.reorderLayer(esp_dynamic, 7);
        } else if ($('#check_espelhos').is(':checked') === false) {
            app.map.removeLayer(esp_dynamic);
        }
        // BHO
        if ($('#check_cursodagua').is(':checked') === true) {
            app.map.addLayer(BHO_Dominio);
            mat_legenda.push({
                "layer": BHO_Dominio,
                "title": "Base Hidrográfica"
            });
            app.map.reorderLayer(BHO_Dominio, 6);
        } else if ($('#check_cursodagua').is(':checked') === false) {
            app.map.removeLayer(BHO_Dominio);
        }
        // TERRA INDIGENA
        // if ($('#check_unidade_cons').is(':checked') === true) {
        //     app.map.addLayer(uni_conserv);
        //     mat_legenda.push({
        //         "layer": uni_conserv,
        //         "title": "Unidades de Conservação"
        //     });
        //     app.map.reorderLayer(esp_dynamic, 6);
        // } else if ($('#check_unidade_cons').is(':checked') === false) {
        //     app.map.removeLayer(uni_conserv);
        // }                   
        // Interferencias
        // if ($('#check_interferencias').is(':checked') === true) {
        //     app.map.addLayer(interferencias_fed);
        //     mat_legenda.push({
        //         "layer": interferencias_fed,
        //         "title": "Interferências"
        //     });
        //     app.map.reorderLayer(interferencias_fed, 6);
        // } else if ($('#check_interferencias').is(':checked') === false) {
        //     app.map.removeLayer(interferencias_fed);
        // }       

        legend.refresh(mat_legenda);
    });


    // ---------------------------------------------
    // FUNCOES LAYERS
    function showTooltip(evt) {
        // alert(evt);
        closeDialog();
        var content_info = "";

        if (evt.graphic.attributes.RESOLUCAO) {
            content_info = "<b style='color:red;'>Outorga</b> " +
                "<br><b>Resolução </b>: " + evt.graphic.attributes.RESOLUCAO +
                "<br><b>CNARH </b>: " + evt.graphic.attributes.CODIGO_CNARH +
                "<br><b>Declaração </b>: " + evt.graphic.attributes.DECLARACAO_OUTORGADA +
                "<br><b>Finalidade </b>: " + evt.graphic.attributes.FINALIDADE_PRINCIPAL +
                "<br><b>Interferência </b>: " + evt.graphic.attributes.TIPO_INTERFERENCIA +
                "<br><b>Volume Anual (m3)  </b>: " + evt.graphic.attributes.VOLUME_ANUAL_M3;
        } else if (evt.graphic.attributes.ESP_PER_M) {
            content_info = "<b style='color:blue;'>Espelhos</b> " +
            // "<br><b>Código Espelho </b>: " + evt.graphic.attributes.ESP_CD +
            "<br><b>Nome Espelho </b>: " + evt.graphic.attributes.ESP_NM_RESERVATORIO +
                "<br><b>Tipo espelho </b>: " + evt.graphic.attributes.ESP_TP_RESERVATORIO +
            // "<br><b>Domínio espelho  </b>: " + evt.graphic.attributes.ESP_DS_DOMINIO +
            "<br><b>Perímetro (m)</b>: " + evt.graphic.attributes.ESP_PER_M +
                "<br><b>Área (km2)</b>: " + evt.graphic.attributes.ESP_AR_M2;

        } else if (evt.graphic.attributes.FID) {
            content_info = "<b>Nome Município </b>: " + evt.graphic.attributes.NM_NNG +
                "<br><b>UF </b>: " + evt.graphic.attributes.UF;
        }


        var dialog = new dijit.TooltipDialog({
            id: "tooltipDialog",
            content: content_info,
            style: "position: absolute; width: 250px; font: normal normal bold 10pt Tahoma;z-index:100"
        });
        dialog.startup();

        dojo.style(dialog.domNode, "opacity", 0.85);
        dijit.placeOnScreen(dialog.domNode, {
            x: evt.pageX,
            y: evt.pageY
        }, ["TL", "BL"], {
            x: 10,
            y: 10
        });
    }

    function closeDialog() {
        var widget = dijit.byId("tooltipDialog");
        if (widget) {
            widget.destroy();
        }
    }




    // --------------------------------------------- 
    // LOCATOR
    var locator = new Locator("http://intranet.snirh.gov.br/arcgis/rest/services/hidroreferenciamento/hidroreferenciamento_2013v13/GeocodeServer");
    // alert(locator);
    var symbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE,
        15,
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([0, 0, 255, 0.5]),
            8
        ),
        new Color([255, 0, 0])
    );

    locator.on("location-to-address-complete", function(evt) {
        // app.map.graphics.clear();
        if (evt.address.address) {

            // Identifica atributos do trecho
            address = evt.address.address;
            // loc = webMercatorUtils.geographicToWebMercator(evt.address.location);
            // for (var p in loc) {
            //     alert(loc[p]);
            // }
            //this service returns geocoding results in geographic - convert to web mercator to display on map
            // var location = webMercatorUtils.geographicToWebMercator(evt.location);

            street = evt.address.address.NORIOCOMP;
            distancia = street.substring(0, street.indexOf(" "));
            nomeRio = street.substring(street.indexOf(" "));

            // Coordenada do ponto 
            ponto = evt.address.location;

            $("#Lat_inter").val(ponto.y);
            $("#Long_inter").val(ponto.x);
            $("#Lat").val(ponto.y);
            $("#Long").val(ponto.x);

            pixel_mat = [];
            ponto_arr = constr_matriz();
            n = 0;
            lat = 0;
            lon = 0;

            // Identifica a Area montante
            pixel_value(ponto);
        }
    });

    app.map.on("click", function(evt) {
        // app.map.graphics.clear();
        locator.locationToAddress(webMercatorUtils.webMercatorToGeographic(evt.mapPoint), 1000, loc_Callback, loc_Error);

    });

    function loc_Error(err) {
        alert('Não foi possível localizer trecho. Tente um ponto mais próximo!');
    }

    function loc_Callback(err) {

    }
    var overviewMapDijit = new OverviewMap({
        map: app.map,
        visible: true,
        attachTo: "bottom-right"
    });
    overviewMapDijit.startup();

    // ---------------------------------------------
    //  JANELA HIDRORREFERENCIAMENTO
    $("#Loca_Ponto").click(function() {

        $("#Lat_inter").val($("#Lat").val());
        $("#Long_inter").val($("#Long").val());
        zoom_Cordenada($("#Lat").val(), $("#Long").val());
        // alert($("#Lat").val()+' / '+$("#Long").val());
    });


    function zoom_Cordenada(lati, longi) {
        // app.map.graphics.clear();
        var point_lon_lat = new esri.geometry.Point(longi, lati, new esri.SpatialReference({
            wkid: 4326
        }));

        locator.locationToAddress(point_lon_lat, 1000);
        app.map.graphics.add(
            new esri.Graphic(point_lon_lat, symbol)
        );
        app.map.centerAndZoom(point_lon_lat, 11);
    }

    // --------------------------------------------------------------------------------------
    // CONSULTA MUNICIPIOS
    $("#Estado").change(function() {
        // alert('foi' + $("#Estado option:selected").val());
        consultaMunicipios($("#Estado option:selected").val());
    });

    function consultaMunicipios(est) {
        $("#Municipios").empty();
        $("#Municipios").append('<option value="-1" select>Selecione p/ zoom</option>');


        query.where = "MUN_SG_UF = '" + est + "'";
        query.returnGeometry = false;
        query.outSpatialReference = {
            "wkid": 4326
        };
        query.outFields = ["*"];
        query.orderByFields = ["MUN_NM"];

        $("#nomes_consulta").css({
            opacity: 0.5
        });
        $("#jan_Processando").css({
            "display": "block",
            "left": "590px",
            "top": "380px"
        });
        municipios_query.execute(query, municipiosEstado);
    }

    function municipiosEstado(feat) {
        muni_nomes = [];
        muni_geom = [];
        for (var i in feat.features) {
            var m = feat.features[i].attributes.MUN_NM;
            muni_nomes.push(m);
            // muni_geom.push(feat.features[i]);
            // alert(m);
            $("#Municipios").append('<option value="' + m + '" >' + m + '</option>');
        }

        $("#jan_Processando").css({
            "display": "none"
        });
        $("#nomes_consulta").css({
            opacity: 1
        });
    }



    // --------------------------------------------------------------------------------------
    // DESENHA MUNICIPIOS
    $("#Municipios").change(function() {
        // alert("Zoom Municipio" + $("#Municipios option:selected").text());
        identifMunicipio($("#Municipios option:selected").text());
    });

    function identifMunicipio(mun_nome) {
        query = new esri.tasks.Query();
        // alert('foi');
        query.where = "MUN_NM = '" + mun_nome + "'";
        query.returnGeometry = true;
        query.outSpatialReference = {
            "wkid": 4326
        };
        query.outFields = ["*"];

        $("#nomes_consulta").css({
            opacity: 0.5
        });
        $("#jan_Processando").css({
            "display": "block",
            "left": "590px",
            "top": "380px"
        });
        municipios_query.execute(query, desenhaMunicipio);
    }

    function desenhaMunicipio(resp) {
        feat = resp.features[0];
        var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([0, 0, 0, 0]));
        var graphic = feat;
        graphic.setSymbol(symbol);
        app.map.setExtent(feat.geometry.getExtent(), true);
        app.map.graphics.add(graphic);

        $("#jan_Processando").css({
            "display": "none"
        });
        $("#nomes_consulta").css({
            opacity: 1
        });
    }

    // --------------------------------------------------------------------------------------
    // CONSULTA NOMES
    var gp = new Geoprocessor("http://intranet.snirh.gov.br/arcgis/rest/services/IG/HidrorrefJSON/GPServer/HidrorrefJSON");
    // $("#tab_Nome_Rios").append('<tr style="background-color: #C0C0C0;"><th>Código do Rio</th><th>Nome Rio</th><th>Município</th><th>Estado</th><th>Domínio</th></tr>');
    // $("#tab_Nome_Rios").append('<tr class="tab_zoom"><td> </td><td> </td><td> </td><td> </td><td> </td></tr>');

    $("#hidro_bt_Limpar, #nomes_bt_Limpar, #dominio_bt_Limpar").click(function() {
        app.map.infoWindow.hide();
        $(".tab_zoom").empty();
        // alert('foi');
        app.map.graphics.clear();
        $("#Nome_Rio").val('');
        $("#Estado").empty();
        $("#Estado").append('<option value="-1" select>Selecione o Estado</option>');
        monta_Tabela_Estados();

        $("#Municipios").empty();
        $("#Municipios").append('<option value="-1" select>Selecione o Município</option>');

        $("#Dominio").val('-1').change();
    });


    $("#bt_Consult_Nomes").click(function() {

        var nome_rio = $("#Nome_Rio").val();

        var estado = $("#Estado").val();
        if (estado === '-1') {
            estado = '';
        }

        var municipio = $("#Municipios").val();
        if (municipio === '-1') {
            municipio = '';
        }

        var dominio = $("#Dominio").val();
        if (dominio === '-1') {
            dominio = '';
        }

        if (nome_rio === '') {
            consultaMunicipios(estado);
        } else if (nome_rio === '*') {
            var consulta = consulta_Nome(' ', estado, municipio, dominio);
            roda_Consulta(consulta);
        } else {
            var consulta = consulta_Nome(nome_rio, estado, municipio, dominio);
            roda_Consulta(consulta);
        }
    });

    function consulta_Nome(nome, UF, munic, domi) {
        // var sql_nome = "DISTINCT HIN_RIO_CD, HIN_NM_COMPLETO, MUN_NM, MUN_UFD_CD, DOMINIALIDADE from SDE.HIDROGRAFIA_x_MUNICIPIOS_SCD where HIN_NM_COMPLETO like '%" + nome + "%'" + muni + " and MUN_NM is not null " + UF + " and DOMINIALIDADE not like 'INTERNACIONAL' " + domi + " order by HIN_NM_COMPLETO desc, HIN_RIO_CD";
        var sql_nome = "Hidrorref_Consulta_Nome(" + nome + "," + UF + "," + munic + "," + domi + ")";
        // alert(sql_nome);
        return sql_nome;
    }

    function roda_Consulta(consulta_sql) {
        var params = {
            'Consulta': String(consulta_sql)
        };
        $("#nomes_consulta").css({
            opacity: 0.5
        });
        $("#jan_Processando").css({
            "display": "block",
            "left": "590px",
            "top": "380px"
        });
        gp.submitJob(params, completeCallback, statusCallback, errback);
    }

    function errback(error) {
        alert(error);
    }

    function statusCallback(jobInfo) {
        var status = jobInfo.jobStatus;
        if (status === 'esriJobFailed') {
            alert("Consulta vazia!");
        }
    }

    function completeCallback(jobInfo) {
        $("#nomes_consulta").css({
            opacity: 1
        });
        $("#jan_Processando").css({
            "display": "none"
        });
        gp.getResultData(jobInfo.jobId, "output", result_GP);
    }

    function result_GP(res, messages) {

        var resp = res.value;

        var key = Object.keys(resp);

        // CONSULA NOME RIOS 
        if (key == 'Hidrorref_Consulta_Nome') {
            // alert('Nome');
            monta_Tabela();
            // alert(Object.keys(resp.Hidrorref_Consulta_Nome[0]));
            var chaves = Object.keys(resp.Hidrorref_Consulta_Nome[0]);
            preenche_Tabela(resp.Hidrorref_Consulta_Nome, chaves);
        }
        // CONSULTA GEOMETRIA
        else if (key == 'Hidrorref_Geometria_Rio') {
            // alert('geometria');
            var chaves = Object.keys(resp.Hidrorref_Geometria_Rio[0]);
            coordenadas_Intersect(resp.Hidrorref_Geometria_Rio, chaves);
        }
    }

    function monta_Tabela() {
        //Limpa os selects
        // $(".tab_zoom").remove();

        $("#Estado").empty();
        $("#Estado").append('<option value="-1" select>Selecione o Estado</option>');

        $("#Municipios").empty();
        $("#Municipios").append('<option value="-1" select>Selecione o Município</option>');

    }

    function preenche_Tabela(lista, chaves) {
        lista_estados = [];
        nome_estados = [];
        lista_muni = [];
        $(".tab_zoom").empty();
        for (var n in lista) {
            // alert(lista[n][chaves[3]]);
            nomEstado = consulta_Tabela_Estados(lista[n][chaves[3]]);
            $("#tab_Nome_Rios").append('<tr class="tab_zoom" style="cursor: pointer;"><td  class="cod">' + lista[n][chaves[0]] + '</td><td>' + lista[n][chaves[1]] + '</td><td class="muni">' + lista[n][chaves[2]] + '</td><td class="est">' + lista[n][chaves[3]] + '</td><td>' + lista[n][chaves[4]] + '</td></tr>');

            if (lista_estados.lastIndexOf(lista[n][chaves[3]]) === -1) {
                lista_estados.push(lista[n][chaves[3]]);
                nome_estados.push(nomEstado);
                // alert(nomEstado + " ; " + nomEstado.length);
                // select_Estados(lista[i][3], nomEstado);
            }
            if (lista_muni.lastIndexOf(lista[n][chaves[2]]) === -1) {
                lista_muni.push(lista[n][chaves[2]]);
                // select_Municipios(lista[i][2]);
            }
        }

        select_Estados(lista_estados, nome_estados);
        select_Municipios(lista_muni);

        $('.tab_zoom').on('click', function() {
            consultaRio($(this).find('.cod').text(), $(this).find('.est').text(), $(this).find('.muni').text());
        });

    }

    function select_Estados(codigo, NomeEstados) {
        cod_alpha = codigo;
        cod_alpha.sort();
        cod_alpha.reverse();
        est_alpha = NomeEstados;
        est_alpha.sort();
        est_alpha.reverse();
        // alert(codigo + ";" + est_alpha);

        for (var i = est_alpha.length - 1; i >= 0; i--) {
            var ind = NomeEstados.indexOf(est_alpha[i]);
            $("#Estado").append('<option value="' + codigo[ind] + '" >' + est_alpha[i] + '</option>');
        }
    }

    function select_Municipios(NomeMunicipio) {
        muni_alpha = NomeMunicipio;
        muni_alpha.sort();
        muni_alpha.reverse();
        for (var i = muni_alpha.length - 1; i >= 0; i--) {
            $("#Municipios").append('<option value="' + muni_alpha[i] + '" >' + muni_alpha[i] + '</option>');
        }
    }

    function monta_Tabela_Estados() {
        $("#Estado").append('<option value="AC">Acre</option><option value="AL">Alagoas</option><option value="AP">Amapá</option><option value="AM">Amazonas</option><option value="BA">Bahia</option><option value="CE">Ceará</option><option value="DF">Distrito Federal</option><option value="ES">Espírito Santo</option><option value="GO">Goiás</option><option value="MA">Maranhão</option><option value="MT">Mato Grosso</option><option value="MS">Mato Grosso do Sul</option><option value="MG">Minas Gerais</option><option value="PA">Pará</option><option value="PR">Paraíba</option><option value="PR">Paraná</option><option value="PE">Pernambuco</option><option value="PI">Piauí</option><option value="RJ">Rio de Janeiro</option><option value="RN">Rio Grande do Norte</option><option value="RS">Rio Grande do Sul</option><option value="RO">Rondônia</option><option value="RR">Roraima</option><option value="SC">Santa Catarina</option><option value="SP">São Paulo</option><option value="SE">Sergipe</option><option value="TO">Tocantins</option>');
    }

    function consulta_Tabela_Estados(UF) {
        UF_estados = ["RS", "SC", "PR", "SP",
            "RJ", "MG", "ES", "MS", "DF",
            "GO", "BA", "SE", "AL", "PI", "PE",
            "CE", "RN", "PB", "MA", "TO", "MT",
            "RO", "AC", "AP", "RR", "PA", "AM"
        ];

        cod_estados = [
            "Rio Grande do Sul", "Santa Catarina", "Paraná", "São Paulo", "Rio de Janeiro",
            "Minas Gerais", "Espírito Santo", "Mato Grosso do Sul", "Distrito Federal",
            "Goiás", "Bahia", "Sergipe", "Alagoas", "Piauí", "Pernambuco", "Ceará",
            "Rio Grande do Norte", "Paraíba", "Maranhão", "Tocantins", "Mato Grosso",
            "Rondônia", "Acre", "Amapá", "Roraima", "Pará", "Amazonas"
        ];

        var ind = UF_estados.indexOf(UF);
        // alert(ind);
        return cod_estados[ind];
    }

    // --------------------------------------------------------------------------------------
    // ZOOM RIO
    function consultaRio(cod_rio, nomeest, nomemun) {
        // Desenha trecho
        query = new esri.tasks.Query();
        query.where = "TDR_RIO_CD = '" + cod_rio + "'";
        query.returnGeometry = true;
        query.outSpatialReference = {
            "wkid": 4326
        };
        query.outFields = ["*"];
        $("#jan_Processando").css({
            "display": "block",
            "left": "590px",
            "top": "380px"
        });       
        BHO_Dominio_query.execute(query, desenhaTrechosRio);

        //Desenha municipio
        query = new esri.tasks.Query();        
        query.where = "MUN_NM = '" + nomemun + "' AND MUN_SG_UF = '" + nomeest + "'";
        query.returnGeometry = true;
        query.outSpatialReference = {
            "wkid": 4326
        };
        query.outFields = ["*"];
        municipios_query.execute(query, featureMunicipio);
    }

    function featureMunicipio(feat) {
        desenhaMunicipio(feat);
    }

    function desenhaTrechosRio(feat) {
        var symbol = new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([153, 0, 255, 255]),
            3
        );
        for (var i in feat.features) {
            var graphic = feat.features[i];
            graphic.setSymbol(symbol);
            app.map.graphics.add(graphic);
        }
    }



    // --------------------------------------------------------------------------------------
    // CONSULTA DOMINIO INTERFERENCIA
    var gp_DOM = new Geoprocessor("http://intranet.snirh.gov.br/arcgis/rest/services/IG/IG_ConsultaDominio/GPServer/IG_ConsultaDominio");

    $("#Loca_Interf").click(function() {
        var long_inter_val = $("#Long_inter").val();
        var lat_inter_val = $("#Lat_inter").val();
        $("#Lat").val(lat_inter_val);
        $("#Long").val(long_inter_val);
        localiza_Interferencia(lat_inter_val, long_inter_val);
    });

    function localiza_Interferencia(lati, longi) {
        long_inter = Number(longi).toFixed(5);
        lat_inter = Number(lati).toFixed(5);
        roda_Consulta_DOM(lati, longi);
    }

    function roda_Consulta_DOM(lati, longi) {
        // alert('Consulta: ' + consulta_sql);
        var params = {
            'IG_ConsultaDominio': String(lati + "," + longi)
        };
        $("#dominio_janela").css({
            opacity: 0.7
        });
        gp_DOM.submitJob(params, completeCallback_DOM, statusCallback_DOM, errback_DOM);
    }

    function errback_DOM(error) {
        alert(error);
    }

    function statusCallback_DOM(jobInfo) {
        var status = jobInfo.jobStatus;
        $("#jan_Processando").css({
            "display": "block",
            "left": "390px",
            "top": "280px"
        });

        if (status === 'esriJobFailed') {
            alert("Problema ao alocar Interferência");
            $("#dominio_janela").css({
                opacity: 1
            });
        }

        setTimeout(function() {
            $("#jan_Processando").css({
                "display": "none"
            });
        }, 2000);
    }

    function completeCallback_DOM(jobInfo) {
        gp_DOM.getResultData(jobInfo.jobId, "output", result_GP_DOM);
    }

    function result_GP_DOM(res, messages) {
        $("#dominio_janela").css({
            opacity: 1
        });
        define_Dominio(res.value);
    }

    function define_Dominio(resp) {
        var atr = ['', '', '', '', '', '', ''];
        atr[0] = resp.Nome_BHO_TDR;
        atr[1] = resp.Dominio_BHO_TDR;
        atr[2] = resp.Ottobacia_BHO_TDR;
        if (resp.Nome_Terra_Indigena) {
            atr[3] = resp.Nome_Terra_Indigena;
        } else {
            atr[3] = '';
        }
        if (resp.Nome_UC) {
            atr[4] = resp.Nome_UC;
        } else {
            atr[4] = '';
        }
        if (resp.Nome_Espelho) {
            atr[5] = resp.Nome_Espelho;
        } else {
            atr[5] = '';
        }
        if (resp.Dominio_Interferencia) {
            atr[6] = resp.Dominio_Interferencia;
        } else {
            atr[6] = '';
        }
        // alert(atr);
        ponto_Interferencia(atr);
    }

    function ponto_Interferencia(atr) {

        pnt = [$("#Long_inter").val(), $("#Lat_inter").val()];

        var conteudo = '<table border="1">';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Domínio Interferência: </b></td><td style="text-align:right"><span style="color:red;">${Dom_Interf}</span</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Nome do Rio: </b></td><td style="text-align:right;">${Nome_Rio}</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Código do Trecho: </b></td><td style="text-align:right;">${Otto_Rio}</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Domínio do trecho: </b></td><td style="text-align:right;">${Dom_Rio}</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Lat.: </b></td><td style="text-align:right;">${YCoord}</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Long.: </b></td><td style="text-align:right;">${XCoord}</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Nome Reservatório: </b></td><td style="text-align:right;">${Nome_Espelho}</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Unidade de Conservação: </b></td><td style="text-align:right;">${Nome_UC}</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Terra Indígena: </b></td><td style="text-align:right;">${Terra_Ind}</td></tr>';
        conteudo = conteudo + '</td></tr></ table>';

        var myPoint = {
            "geometry": {
                "x": pnt[0],
                "y": pnt[1],
                "spatialReference": {
                    "wkid": 4326
                }
            },
            "attributes": {
                "XCoord": Number(pnt[0]).toFixed(5),
                "YCoord": Number(pnt[1]).toFixed(5),
                "Nome_Rio": atr[0],
                "Dom_Rio": atr[1],
                "Otto_Rio": atr[2],
                "Terra_Ind": atr[3],
                "Nome_UC": atr[4],
                "Nome_Espelho": atr[5],
                "Dom_Interf": atr[6]
            },
            "symbol": {
                "color": [255, 0, 0, 128],
                "size": 13,
                "angle": 0,
                "xoffset": 0,
                "yoffset": 0,
                "type": "esriSMS",
                "style": "esriSMSCross",
                "outline": {
                    "color": [0, 0, 0, 255],
                    "width": 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                }
            },
            "infoTemplate": {
                "title": "<img src=\"img/ana90_tundra.jpg\"  width=\"45\" height=\"15\">" + "<i>&nbspDomínio Interferência</i>",
                "content": conteudo
                // "Domínio: ${Dominio} <br/>Latitude: ${YCoord} <br/>Longitude: ${XCoord} <br/> Nome Reservatório:${Reserv} <br/> Unidade de Conservação:${Uni_Conc} <br/> Terra Indígena:${Terra_Ind}"
            }
        };

        var gra = new Graphic(myPoint);
        app.map.infoWindow.setTitle(gra.getTitle());
        app.map.infoWindow.setContent(gra.getContent());
        //display the info window with the address information        
        app.map.infoWindow.resize(300, 250);
        app.map.infoWindow.show(webMercatorUtils.geographicToWebMercator(gra.geometry));
        app.map.graphics.add(gra);
        zoom_Ponto(pnt);

    }

    // APROXIMA AO RIO
    function zoom_Ponto(ponto) {
        // PONTO
        var lon_lat = new esri.geometry.Point(ponto[0], ponto[1], new esri.SpatialReference({
            wkid: 4326
        }));
        app.map.centerAndZoom(lon_lat, 11);
    }

    // --------------------------------------------------------------------------------------
    // AREA MONTANTE
    function publica_Info(areaMax) {
        // app.map.graphics.clear();
        var conteudo = "<table border=\"1\">";
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Área Montante (km²): </b></td><td style="text-align:right;">' + areaMax + '</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Distancia &agrave; Foz (km): </b></td><td style="text-align:right;">' + String((distancia / 1000).toFixed(3)) + '</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Nome do Rio: </b></td><td style="text-align:right;">' + nomeRio + '</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>C&oacute;d. CursoDagua: </b></td><td style="text-align:right;"> ${COCURSODAG}</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>C&oacute;d. Bacia: </b></td><td style="text-align:right;"> ${COBACIA}</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Dom. Curso d´água: </b></td><td style="text-align:right;">${DEDOMINIAL}</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Lat. (ajustada):</b></td><td style="text-align:right;">' + lat + '</td></tr>';
        conteudo = conteudo + '<tr><td style="text-align:left;"><b>Lon. (ajustada):</b></td><td style="text-align:right;">' + lon + '</td></tr>';
        conteudo = conteudo + '</td></tr></ table>';

        var infoTemplate = new esri.InfoTemplate("<img src=\"img/ana90_tundra.jpg\"  width=\"45\" height=\"15\">" + "<i>&nbspHidrorreferenciamento</i>", conteudo);

        var graphic = new Graphic(ponto, symbol, address, infoTemplate);
        app.map.graphics.add(graphic);

        app.map.infoWindow.setTitle(graphic.getTitle());
        app.map.infoWindow.setContent(graphic.getContent());
        //display the info window with the address information
        var screenPnt = app.map.toScreen(ponto);
        app.map.infoWindow.resize(250, 250);
        app.map.infoWindow.show(ponto, app.map.getInfoWindowAnchor(ponto));
        app.map.centerAndZoom(ponto, 11);
        // ponto = '';
    }

    // Identifica pixel
    function pixel_value(pnt) {
        identifyTask = new esri.tasks.IdentifyTask("http://intranet.snirh.gov.br/arcgis/rest/services/SGI_RASTER/FlowAccumulation/MapServer");
        identifyParams = new esri.tasks.IdentifyParameters();
        identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
        identifyParams.geometry = pnt;
        identifyParams.layerIds = ["flow"];
        identifyParams.tolerance = 0;
        identifyParams.mapExtent = app.map.extent;

        //Executa task
        identifyTask.execute(identifyParams, onComplete, onError);
    }

    function constr_matriz() {
        // 1 2 3
        // 4 5 6
        // 7 8 9
        ponto_1 = new esri.geometry.Point({
            "x": (ponto.x - 0.00081),
            "y": (ponto.y + 0.00081),
            " spatialReference": {
                " wkid": 4326
            }
        });

        ponto_2 = new esri.geometry.Point({
            "x": (ponto.x),
            "y": (ponto.y + 0.00081),
            " spatialReference": {
                " wkid": 4326
            }
        });

        ponto_3 = new esri.geometry.Point({
            "x": (ponto.x + 0.00081),
            "y": (ponto.y + 0.00081),
            " spatialReference": {
                " wkid": 4326
            }
        });

        ponto_4 = new esri.geometry.Point({
            "x": (ponto.x - 0.00081),
            "y": (ponto.y),
            " spatialReference": {
                " wkid": 4326
            }
        });

        // ponto_5 = ponto;

        ponto_6 = new esri.geometry.Point({
            "x": (ponto.x + 0.00081),
            "y": (ponto.y),
            " spatialReference": {
                " wkid": 4326
            }
        });

        ponto_7 = new esri.geometry.Point({
            "x": (ponto.x - 0.00081),
            "y": (ponto.y - 0.00081),
            " spatialReference": {
                " wkid": 4326
            }
        });

        ponto_8 = new esri.geometry.Point({
            "x": (ponto.x),
            "y": (ponto.y - 0.00081),
            " spatialReference": {
                " wkid": 4326
            }
        });

        ponto_9 = new esri.geometry.Point({
            "x": (ponto.x + 0.00081),
            "y": (ponto.y - 0.00081),
            " spatialReference": {
                " wkid": 4326
            }
        });

        return [ponto_1, ponto_2, ponto_3,
            ponto_4, ponto_6,
            ponto_7, ponto_8, ponto_9
        ];

    }

    function onComplete(identifyResults) {
        area = (identifyResults[0].feature.attributes['Pixel Value'] * 0.09 * 0.09).toFixed(3);
        // alert('Pixel Value:'+String(area));
        pixel_mat.push(area);

        try {
            if (n < 8) {
                ponto = ponto_arr[n];
                // alert(ponto.x+' '+ponto.y);
                n = n + 1;
                pixel_value(ponto);
            } else if (n == 8) {
                var max = Math.max.apply(Math, pixel_mat);
                for (var i = pixel_mat.length - 1; i >= 0; i--) {
                    if (pixel_mat[i] == max) {
                        lat = (ponto_arr[i].y).toFixed(3);
                        lon = (ponto_arr[i].x).toFixed(3);
                        publica_Info(pixel_mat[i]);
                        break;
                    }
                }
            }
        } catch (err) {
            txt = "Error: Não pode calcular área montante desta coordenada.\n\n";
            alert(txt);
        }
    }

    function onError(error) {
        alert('erro' + error);
    }

});