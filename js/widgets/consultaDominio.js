define(["dojo/_base/declare",
        "esri/graphic",
        "esri/geometry/webMercatorUtils",
        "esri/symbols/PictureMarkerSymbol",
        "esri/tasks/Geoprocessor",
        "esri/InfoTemplate",
        "widgets/conectaRest",
        "widgets/infoLayers"
    ],
    function(declare, Graphic, webMercatorUtils, PictureMarkerSymbol,
        Geoprocessor, InfoTemplate, conectaRest, infoLayers) {

        var pnt;
        var atr = {};
        var gra;
        var gp;
        var graph_pnt;

        return declare("widgets.consultaDominio", null, {
            _long_inter: null,
            _lat_inter: null,
            _consulta_dominio_url: null,
            _serv_rest: null,
            _info: null,
            constructor: function(lat, lon) {
                this._info = new infoLayers();
                this._consulta_dominio_url = this._info.get_url_consulta_dominio_Django();
                this._serv_rest = new conectaRest();

                // gp = new Geoprocessor("http://www.snirh.gov.br/arcgis/rest/services/IG/IG_ConsultaDominio/GPServer/IG_ConsultaDominio");
                this.setPontoInterferencia(lat, lon);
                this.rodaConsultaDominio();
            },
            getPontoInterferencia: function() {
                return pnt;
            },
            getLatInterferencia: function() {
                return pnt.y;
            },
            getLonInterferencia: function() {
                return pnt.x;
            },
            setPontoInterferencia: function(lat, lon) {
                pnt = new esri.geometry.Point({
                    "x": (lon),
                    "y": (lat),
                    " spatialReference": {
                        " wkid": 4326
                    }
                });
            },
            setJanelaProcessando: function(status) {
                var tp = '';
                if (status == 'on') {
                    this.setOpacidadeJanelaPonto(0.7);
                    tp = "block";
                } else if (status == 'off') {
                    this.setOpacidadeJanelaPonto(1);
                    tp = "none";
                }
                $("#jan_Processando").css({
                    "display": tp
                });
            },
            setOpacidadeJanelaPonto: function(opacidade) {
                $("#janela_ponto").css({
                    opacity: opacidade
                });
            },
            setInfoWindow: function(gra) {
                app.map.infoWindow.setTitle(this.getTitulo());
                app.map.infoWindow.setContent(gra.getContent());
                app.map.infoWindow.resize(300, 250);
                app.map.infoWindow.show(this.getPontoInterferencia(), webMercatorUtils.geographicToWebMercator(pnt));
            },
            getAttributes: function() {
                return atr;
            },
            getConteudo: function() {
                var conteudo = '<table border="1">' +
                    '<tr><td style="text-align:left;"><b>Domínio Interferência: </b></td><td style="text-align:right"><span style="color:red;">${Dom_Interf}</span</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Nome do Rio: </b></td><td style="text-align:right;">${Nome_Rio}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Código do Trecho: </b></td><td style="text-align:right;">${Otto_Rio}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Domínio do trecho: </b></td><td style="text-align:right;">${Dom_Rio}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Lat.: </b></td><td style="text-align:right;">${YCoord}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Long.: </b></td><td style="text-align:right;">${XCoord}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Nome Reservatório: </b></td><td style="text-align:right;">${Nome_Espelho}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Unidade de Conservação: </b></td><td style="text-align:right;">${Nome_UC}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Terra Indígena: </b></td><td style="text-align:right;">${Terra_Ind}</td></tr>' +
                    '</td></tr></ table>';
                return conteudo;
            },
            getInfoTamplate: function() {
                var infoTemp = new InfoTemplate(this.getTitulo(), this.getConteudo());
                return infoTemp;
            },
            getTitulo: function() {
                var title = "<img src=\"img/ana90_tundra.jpg\"  width=\"45\" height=\"15\"><i>&nbspDomínio Interferência</i>";
                return title;
            },
            getSymbol: function() {
                var symbol = new PictureMarkerSymbol('http://static.arcgis.com/images/Symbols/Shapes/YellowCircleLargeB.png', 30, 30);
                return symbol;
            },
            rodaConsultaDominio: function() {
                this.setOpacidadeJanelaPonto(0.7);
                this.setJanelaProcessando('on');
                var dados_dominio = this._serv_rest.getRestJSON(
                    this._consulta_dominio_url, {
                        lat: this.getLatInterferencia(),
                        lon: this.getLonInterferencia()
                    }
                );
                this.setJanelaProcessando('off');
                this.setOpacidadeJanelaPonto(1);
                this.setAttributes(dados_dominio);
                this.plotaPonto();
            },
            setAttributes: function(resp) {
                atr = {
                    "XCoord": this.getLonInterferencia(),
                    "YCoord": this.getLatInterferencia(),
                    "Nome_Rio": resp.Nome_BHO_TDR,
                    "Dom_Rio": resp.Dominio_BHO_TDR,
                    "Otto_Rio": resp.Ottobacia_BHO_TDR,
                    "Terra_Ind": resp.Nome_Terra_Indigena,
                    "Nome_UC": resp.Nome_UC,
                    "Nome_Espelho": resp.Nome_Espelho,
                    "Dom_Interf": resp.Dominio_Interferencia
                };
            },
            plotaPonto: function() {
                if (graph_indx > 0) {
                    app.map.graphics.remove(app.map.graphics.graphics[graph_indx]);
                }
                var graph_pnt = new Graphic(this.getPontoInterferencia(), this.getSymbol(), this.getAttributes(), this.getInfoTamplate());
                graph_indx = app.map.graphics.graphics.length;
                app.map.graphics.add(graph_pnt);
                this.setInfoWindow(graph_pnt);
                app.map.centerAndZoom(this.getPontoInterferencia(), zoom_aprox);
            }
        });
    });