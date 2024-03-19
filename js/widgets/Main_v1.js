var app = {};
var map;
var graph_indx = 0;
var pnt;
var zoom_aprox = 11;
var con_graph_indx = 0;

require([
    "esri/map",
    "esri/dijit/BasemapToggle",
    "esri/dijit/FeatureTable",
    "esri/layers/FeatureLayer",
    "dojo/_base/Color",
    "dojo/number",
    "dojo/parser",
    "dojo/dom",
    "dijit/registry",
    "esri/dijit/BasemapGallery",
    "esri/geometry/webMercatorUtils",
    "dojo/domReady!",
    "esri/lang",
    "widgets/addLayersLegend",
    "widgets/hidrorreferenciamento",
    "widgets/consultaMunicipio",
    "widgets/desenhaMunicipio",
    "widgets/consultaNomes",
    "widgets/consultaInterferencia",
    "widgets/consultaPlanos",
    "widgets/montaPainelConsultas",
    "widgets/pontoTela",
    "widgets/ConverteCoordenadas",
    "widgets/consultaOttoTrecho",
    "widgets/consultaOttoMontante",
    "widgets/consultaOttoJusante"    
], function(
    Map,
    BasemapToggle,
    FeatureTable,
    FeatureLayer,
    Color,
    number,
    parser,
    dom,
    registry,
    BasemapGallery,
    webMercatorUtils,
    domStyle,
    esriLang,
    addLayersLegend,
    hidrorreferenciamento,
    consultaMunicipio,
    desenhaMunicipio,
    consultaNomes,
    consultaInterferencia,
    ConsultaPlanos,
    montaPainelConsultas,
    pontoTela,
    ConverteCoordenadas,
    consultaOttoTrecho,
    consultaOttoMontante,
    consultaOttoJusante
) {

    parser.parse();

    // ---------------------------------------------
    // MAPA FUNCOES
    app.map = new esri.Map("map", {
        //                      Extent(xmin, ymin, xmax, ymax, spatialReference)
        extent: new esri.geometry.Extent(-85, -32, -34, 4, new esri.SpatialReference({
            wkid: 4326
        })),
        basemap: "satellite",
        showLabels : true,
        sliderPosition: "top-right"
    });

    app.map.on("load", function() {
        app.map.graphics.enableMouseEvents(); 
        app.map.on("mouse-move", showCoordinates);
    });

    app.map.on("click", function(evt) {
        pnt = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
        var pntTela = new pontoTela(pnt);
        setBotoesConsulta();
    });

    function showCoordinates(evt) {
        var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
        $("#info_coord").html("<b>Lat.: " + mp.y.toFixed(3) + "   Long.: " + mp.x.toFixed(3) + "</b>");
    }

    // ---------------------------------------------
    //BASEMAP GALERY
    var toggle = new BasemapToggle({
        map: app.map,
        basemap: "streets"
    }, "BasemapToggle");
    toggle.startup();

    // ---------------------------------------------
    // LAYERS
    var mapaLayers = new addLayersLegend();
    $('#features_janela_body').append(mapaLayers.insert_html_Layers());

    // ADICIONA E REMOVE LAYERS
    $("input").on("click", function() {
        mapaLayers.addRemoveLayersAndLegend();
    });

    // ---------------------------------------------
    //  CONSULTA JANELA HIDRORREFERENCIAMENTO
    var convertcoordenadas = new ConverteCoordenadas();

    $("#Long_g, #Long_m, #Long_s").change(function() {
        var g = Number($("#Long_g").val());
        var m = Number($("#Long_m").val());
        var s = Number($("#Long_s").val());
        $("#Long").val(convertcoordenadas.GMSDecimais(g, m, s));
    });

    $("#Long").change(function() {
        var decimais = Number($("#Long").val());
        $("#Long_g").val(convertcoordenadas.DecimaisGMS(decimais)[0]);
        $("#Long_m").val(convertcoordenadas.DecimaisGMS(decimais)[1]);
        $("#Long_s").val(convertcoordenadas.DecimaisGMS(decimais)[2]);
    });

    $("#Lat_g, #Lat_m, #Lat_s").change(function() {
        var g = Number($("#Lat_g").val());
        var m = Number($("#Lat_m").val());
        var s = Number($("#Lat_s").val());
        $("#Lat").val(convertcoordenadas.GMSDecimais(g, m, s));
    });

    $("#Lat").change(function() {
        var decimais = Number($("#Lat").val());
        $("#Lat_g").val(convertcoordenadas.DecimaisGMS(decimais)[0]);
        $("#Lat_m").val(convertcoordenadas.DecimaisGMS(decimais)[1]);
        $("#Lat_s").val(convertcoordenadas.DecimaisGMS(decimais)[2]);
    });

    function setBotoesConsulta() {
        var long_val = Number($("#Long").val()).toFixed(5);
        var lat_val = Number($("#Lat").val()).toFixed(5);

        // CONSULTA HIDRORREFERENCIAMENTO   
        $("#pnt_bnt_hidrorref").click(function() {
            var con_hidrorref = new hidrorreferenciamento(lat_val, long_val);
        });

        // CONSULTA DOMINIO INTERFERENCIA    
        $("#pnt_bnt_consdomin").click(function() {
            var con_dominio = new consultaInterferencia(lat_val, long_val);
        });
    }

    $("#Loca_Ponto").click(function() {
        var point_lon_lat = new esri.geometry.Point({
            "x": $("#Long").val(),
            "y": $("#Lat").val(),
            " spatialReference": {
                " wkid": 4326
            }
        });
        var pntTela = new pontoTela(point_lon_lat);
        app.map.centerAndZoom(point_lon_lat, 13);
        setBotoesConsulta();
    });

    // --------------------------------------------------------------------------------------
    // CONSULTA OTTO    
    $("#btn_con_otto").click(function() {  
        var con_ottobacia;  
        var cod_otto = $("#ottobacia").val();    
        var sel = $("#con_otto option:selected").val();
        if (sel == 'loc_trecho') {
            con_ottobacia = new consultaOttoTrecho();
            con_ottobacia.consultaOttoTrecho(cod_otto);
        } else if (sel == 'trecho_montante') {
            con_ottobacia = new consultaOttoMontante();
            con_ottobacia.identificaTrechosMontante(cod_otto);
        }  else if (sel == 'trecho_jusante') {
            con_ottobacia = new consultaOttoJusante();
            con_ottobacia.identificaTrechosJusante(cod_otto);
        }       
    });

    // --------------------------------------------------------------------------------------
    // CONSULTA MUNICIPIOS
    var con_muni = new consultaMunicipio();
    $("#Estado").change(function() {
        con_muni.consultaServMunicipio($("#Estado option:selected").val());
    });

    // --------------------------------------------------------------------------------------
    // DESENHA MUNICIPIO  
    var des_muni = new desenhaMunicipio();
    $("#Municipios").change(function() {
        des_muni.identifMunicipio($("#Municipios option:selected").text());
    });

    // --------------------------------------------------------------------------------------
    // CONSULTA NOMES  
    var con_nomes = new consultaNomes();
    $("#bt_Consult_Nomes").click(function() {
        con_nomes.setParametros($("#Dominio").val(),
            $("#Estado").val(),
            $("#Municipios").val(),
            $("#Nome_Rio").val());
        con_nomes.execConsultaNomes();
    });

    // ---------------------------------------------
    // GRAFICOS
    $("#hidro_bt_Limpar, #nomes_bt_Limpar, #con_bt_Limpar, #bt_otto_Limpar").click(function() {
        app.map.infoWindow.hide();
        app.map.graphics.clear();
        con_nomes.clearTabelaNomes();
    });

    // --------------------------------------------------------------------------------------
    // CONSULTA PLANOS DE INFORMACAO
    var con_planos = new ConsultaPlanos();
    $("#con_feat_select").change(function() {
        // console.log(this.value);
        con_planos.identifPlanosCampos(this.value);
    });
    $("#con_feat_executar").click(function() {
        con_planos.consultaSqlPlano();
        $("#con_feat_tabela_resp").empty();
    });
    // $("#carregar_tabela").click(function() {
    //     if ($('#carregar_tabela').is(':checked') === false) {
    //         $("#con_feat_tabela").hide();
    //         $("#map").css("height", "97.5%");
    //     } else if ($('#carregar_tabela').is(':checked') === true) {
    //         $("#con_feat_tabela").show();
    //         $("#map").css("height", 700);
    //     }
    // });
    $("#minimiza_tabela").click(function(){
        $("#con_feat_tabela").hide();
        $("#map").css("height", "97.5%");
    })
});