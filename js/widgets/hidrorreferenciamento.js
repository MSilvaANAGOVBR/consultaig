define(["dojo/_base/declare",
        "dojo/_base/lang",
        "esri/tasks/locator",
        "esri/symbols/PictureMarkerSymbol",
        "esri/graphic",
        "esri/InfoTemplate",
        "esri/geometry/webMercatorUtils",
        "dojo/_base/Color",
        "widgets/conectaRest",
        "widgets/infoLayers",
        "widgets/consultaServRest",
    ],
    function(declare,
        lang,
        Locator,
        PictureMarkerSymbol,
        Graphic,
        InfoTemplate,
        webMercatorUtils,
        Color,
        conectaRest,
        infoLayers,
        consultaServRest
    ) {
        var pnt;
        var atr = {};
        var graph_pnt;
        var serv_rest;

        function addAttributes(atrib_name, atrib_value) {
            atr[atrib_name] = atrib_value;
        }

        function getAttributes() {
            return atr;
        }

        function getConteudo() {
            var conteudo = "<table border=\"1\">" +
                '<td colspan="2" style="font-weight: bold; text-align: center; background-color:#428bca">Hidrorreferenciamento</span></td>' +
                '<tr><td style="text-align:left;"><b>Área Montante (km²): </b></td><td style="text-align:right;">${Area_Max}</td></tr>' +
                '<tr><td style="text-align:left;"><b>Distancia &agrave; Foz (km): </b></td><td style="text-align:right;">${Distancia}</td></tr>' +
                '<tr><td style="text-align:left;"><b>Nome do Rio: </b></td><td style="text-align:right;">${NomeRio}</td></tr>' +
                '<tr><td style="text-align:left;"><b>C&oacute;d. CursoDagua: </b></td><td style="text-align:right;"> ${COCURSODAG}</td></tr>' +
                '<tr><td style="text-align:left;"><b>C&oacute;d. Bacia: </b></td><td style="text-align:right;"> ${COBACIA}</td></tr>' +
                '<tr><td style="text-align:left;"><b>Dom. Curso d´água: </b></td><td style="text-align:right;">${DEDOMINIAL}</td></tr>' +
                '<tr><td style="text-align:left;"><b>Trecho c/ Delegação: </b></td><td style="text-align:right;">${Delegacao}</td></tr>' +
                '<tr><td style="text-align:left;"><b>Trecho Crítico: </b></td><td style="text-align:right;">${Trecho_Critico}</td></tr>' +
                '<tr><td style="text-align:left;"><b>Enquadramento CONAMA: </b></td><td style="text-align:right;">${Enquadramento_CONAMA}</td></tr>' +
                '<tr><td style="text-align:left;"><b>Lat. (ajustada):</b></td><td style="text-align:right;">${Lat}</td></tr>' +
                '<tr><td style="text-align:left;"><b>Lon. (ajustada):</b></td><td style="text-align:right;">${Lon}</td></tr>' +
                '</td></tr></ table>';
            return conteudo;
        }

        function getInfoTamplate() {
            var infoTemp = new InfoTemplate(getTitulo(), getConteudo());
            return infoTemp;
        }

        function getTitulo() {
            var title = "<img src=\"img/ana90_tundra.jpg\"  width=\"45\" height=\"15\"><i>&nbspInformações do Trecho</i>";
            return title;
        }

        function getSymbol() {
            var symbol = new PictureMarkerSymbol('https://static.arcgis.com/images/Symbols/Shapes/GreenCircleLargeB.png', 30, 30);
            return symbol;
        }

        function setInfoWindow() {
            app.map.infoWindow.setTitle(getTitulo());
            app.map.infoWindow.setContent(graph_pnt.getContent());
            app.map.infoWindow.resize(300, 300); //resize(width, height)
            app.map.infoWindow.show(getPontoHidrorref(), webMercatorUtils.geographicToWebMercator(getPontoHidrorref()));
        }

        function plotaPonto() {
            if (graph_indx > 0) {
                app.map.graphics.remove(app.map.graphics.graphics[graph_indx]);
            }
            graph_pnt = new Graphic(getPontoHidrorref(), getSymbol(), getAttributes(), getInfoTamplate());
            graph_indx = app.map.graphics.graphics.length;
            app.map.graphics.add(graph_pnt);
            setInfoWindow();
            // app.map.centerAndZoom(getPontoHidrorref(), zoom_aprox);
        }

        function setPontoHidrorref(lat, lon) {
            pnt = new esri.geometry.Point({
                "x": (lon),
                "y": (lat),
                " spatialReference": {
                    " wkid": 4326
                }
            });
        }

        function getPontoHidrorref() {
            return pnt;
        }

        function getLatHidrorref() {
            return pnt.y;
        }

        function getLonHidrorref() {
            return pnt.x;
        }

        function setJanelaProcessando(status) {
            var tp = '';
            if (status == 'on') {
                tp = "block";
            } else if (status == 'off') {
                tp = "none";
            }
            $("#jan_Processando").css({
                "display": tp
            });
        }

        function consultaAreaMontante() {
            var area = serv_rest.getAreaMontante();
            // console.log(area);
            addAttributes("Area_Max", area);
        }

        function consultaIntelGeo() {
            var resp = serv_rest.getIntelGeo();
            // console.log(resp.Classe_CONAMA + ' / ' + resp.Delegacao);
            addAttributes("Enquadramento_CONAMA", resp.classe_conama);
            addAttributes("Delegacao", resp.delegacao);
            addAttributes("Trecho_Critico", resp.trecho_critico);
        }

        return declare("widgets.hidrorreferenciamento", null, {
            _locator: null,
            _mask_arr: null,
            _serv_rest: null,
            __area_mont_url: null,
            _info: null,
            constructor: function(in_lat, in_lon) {
                this.getGeocode(in_lat, in_lon);
            },
            getGeocode: function(lat, lon) {
                setJanelaProcessando('on');
                setPontoHidrorref(lat, lon);
                var locator = new Locator("http://www.snirh.gov.br/arcgis/rest/services/IG/GCD_BHO_TRECHODRENAGEM2013V13/GeocodeServer");
                locator.locationToAddress(getPontoHidrorref(), 1000, this.setHidrorref, this.erroLocalizacao);
            },
            setHidrorref: function(evt) {
                var latitude = evt.location.y;
                var longitude = evt.location.x;
                var trecho_info = evt.address.NORIOCOMP;
                var cobacia = evt.address["COBACIA"];
                var cocursodag = evt.address["COCURSODAG"];
                var dedominial = evt.address["DEDOMINIAL"];
                var distancia = (trecho_info.substring(0, trecho_info.indexOf(" ")) / 1000).toFixed(2);
                var nomeRio = trecho_info.substring(trecho_info.indexOf(" "));

                addAttributes("Distancia", distancia);
                addAttributes("NomeRio", nomeRio);
                addAttributes("COBACIA", cobacia);
                addAttributes("COCURSODAG", cocursodag);
                addAttributes("DEDOMINIAL", dedominial);
                addAttributes("Lat", latitude.toFixed(5));
                addAttributes("Lon", longitude.toFixed(5));
                addAttributes("Area_Max", 0);

                setPontoHidrorref(latitude, longitude);
                serv_rest = new consultaServRest(latitude, longitude);
                consultaAreaMontante();
                consultaIntelGeo();
                setJanelaProcessando('off');
                plotaPonto();
            },
            erroLocalizacao: function(erro) {
                // alert('erroLocalizacao: ' + erro);
                alert('erroLocalizacao:\n A coordenada informada não possui área montante calculada!');
                setJanelaProcessando('off');
            },

        });
    }
);