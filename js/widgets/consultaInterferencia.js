define(["dojo/_base/declare",
        "esri/graphic",
        "esri/geometry/webMercatorUtils",
        "esri/symbols/PictureMarkerSymbol",
        "esri/tasks/Geoprocessor",
        "esri/InfoTemplate",
        "widgets/conectaRest",
        "widgets/infoLayers",
        "widgets/consultaServRest"
    ],
    function(declare, Graphic, webMercatorUtils, PictureMarkerSymbol,
        Geoprocessor, InfoTemplate, conectaRest, infoLayers, consultaServRest) {

        var pnt;
        var atr = {};
        var gra;
        var gp;
        var graph_pnt;

        return declare("widgets.consultaInterferencia", null, {
            _long_inter: null,
            _lat_inter: null,
            _consulta_dominio_url: null,
            _serv_rest: null,
            _info: null,
            constructor: function(lat, lon) {
                // this._info = new infoLayers();
                // this._consulta_dominio_url = this._info.get_url_consulta_IntelGeo();
                // this._serv_rest = new conectaRest();

                // gp = new Geoprocessor("http://www.snirh.gov.br/arcgis/rest/services/IG/IG_ConsultaDominio/GPServer/IG_ConsultaDominio");
                this.setPontoInterferencia(lat, lon);
                this.rodaConsultaIntelGeo();
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
                app.map.infoWindow.resize(350, 450); //resize(width, height)
                app.map.infoWindow.show(this.getPontoInterferencia(), webMercatorUtils.geographicToWebMercator(pnt));
            },
            getAttributes: function() {
                return atr;
            },
            getConteudo: function() {
                var conteudo = '<table border="1">' +
                    '<td colspan="2" style="font-weight: bold; text-align: center; background-color:#428bca">Informações de Localização</span></td>' + 
                    '<tr><td style="text-align:left;"><b>UF: </b></td><td style="text-align:right;">${UF_Municipio}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Município: </b></td><td style="text-align:right;">${Nome_Municipio}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Cód. Municipio IBGE: </b></td><td style="text-align:right;">${IBGE_Municipio}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Comitê Estadual: </b></td><td style="text-align:right;">${Nome_Comite_Estadual}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Comitê Federal: </b></td><td style="text-align:right;">${Nome_Comite_Federal}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Região Hidrográfica: </b></td><td style="text-align:right;">${Nome_Regiao_Hidrografica}</td></tr>' +
                    '<td colspan="2" style="font-weight: bold; text-align: center; background-color:#428bca">Informações de Domínio</td>' + 
                    '<tr><td style="text-align:left;"><b>Domínio Interferência: </b></td><td style="text-align:right"><span style="color:red;">${Dom_Interf}</span></td></tr>' +
                    '<tr><td style="text-align:left;"><b>Nome do Rio: </b></td><td style="text-align:right;">${Nome_Rio}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Código do Trecho: </b></td><td style="text-align:right;">${Otto_Rio}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Domínio do trecho: </b></td><td style="text-align:right;">${Dom_Rio}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Lat.: </b></td><td style="text-align:right;">${YCoord}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Long.: </b></td><td style="text-align:right;">${XCoord}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Nome Reservatório: </b></td><td style="text-align:right;">${Nome_Espelho}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Cód. do Reservatório: </b></td><td style="text-align:right;">${Codigo_Espelho}</td></tr>' +                    
                    '<tr><td style="text-align:left;"><b>Unidade de Conservação: </b></td><td style="text-align:right;">${Nome_UC}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Terra Indígena: </b></td><td style="text-align:right;">${Terra_Ind}</td></tr>' +
                    '<td colspan="2" style="font-weight: bold; text-align: center; background-color:#428bca">Informações de Regulação</td>' +
                    '<tr><td style="text-align:left;"><b>Corpo Hídrico Nome: </b></td><td style="text-align:right;">${Nome_Corpo_Hidrico}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Corpo Hídrico Tipo: </b></td><td style="text-align:right;">${Tipo_Corpo_Hidrico}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Corpo Hídrico Crítico: </b></td><td style="text-align:right;">${Critico_Corpo_Hidrico}</td></tr>' +                    
                    '<tr><td style="text-align:left;"><b>Captação Vazão Máxima: </b></td><td style="text-align:right;">${Captacao_Maxima}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Lançamento Vazão Máxima: </b></td><td style="text-align:right;">${Lancamento_Maxima}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Lançamento Temp.(C°) Máxima: </b></td><td style="text-align:right;">${Lancamento_Temp_Maxima}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Medida Uso Insignificante: </b></td><td style="text-align:right;">${Medida_Uso_Insignificante}</td></tr>' +                    
                    '<tr><td style="text-align:left;"><b>Comprometimento Qualitativo (%): </b></td><td style="text-align:right;">${Comp_quali}</td></tr>' +
                    '<tr><td style="text-align:left;"><b>Comprometimento Quantitativo (%): </b></td><td style="text-align:right;">${Comp_quanti}</td></tr>' +
                    '</td></tr></ table>';
                return conteudo;
            },
            getInfoTamplate: function() {
                var infoTemp = new InfoTemplate(this.getTitulo(), this.getConteudo());
                return infoTemp;
            },
            getTitulo: function() {
                var title = "<img src=\"img/ana90_tundra.jpg\"  width=\"45\" height=\"15\"><i>&nbspConsulta Coordenada</i>";
                return title;
            },
            getSymbol: function() {
                var symbol = new PictureMarkerSymbol('http://static.arcgis.com/images/Symbols/Shapes/YellowCircleLargeB.png', 30, 30);
                return symbol;
            },
            rodaConsultaIntelGeo: function() {
                this.setOpacidadeJanelaPonto(0.7);
                this.setJanelaProcessando('on');
                serv_rest = new consultaServRest(this.getLatInterferencia, this.getLonInterferencia);
                var dados_dominio = serv_rest.getIntelGeo();
                this.setJanelaProcessando('off');
                this.setOpacidadeJanelaPonto(1);
                this.setAttributes(dados_dominio);
                this.plotaPonto();
            },
            setAttributes: function(resp) {
                atr = {
                    "XCoord": this.getLonInterferencia(),
                    "YCoord": this.getLatInterferencia(),
                    "Nome_Rio": resp.nome_bho_tdr,
                    "Dom_Rio": resp.dominio_bho_tdr,
                    "Otto_Rio": resp.ottobacia_bho_tdr,
                    "Terra_Ind": resp.nome_terra_indigena,
                    "Nome_UC": resp.nome_uc,
                    "Nome_Espelho": resp.nome_espelho,
                    "Codigo_Espelho": resp.codigo_espelho,
                    "Dom_Interf": resp.dominio_interferencia,
                    "Nome_Municipio": resp.nome_municipio,
                    "IBGE_Municipio": resp.ibge_municipio,
                    "Nome_Comite_Federal": resp.nome_comite_federal,
                    "Nome_Comite_Estadual": resp.nome_comite_estadual,
                    "Nome_Regiao_Hidrografica": resp.nome_regiao_hidrografica,
                    "UF_Municipio": resp.uf_municipio,
                    // Regulação
                    "Nome_Corpo_Hidrico": resp.nome_corpo_hidrico,
                    "Tipo_Corpo_Hidrico": (resp.tipo_corpo_hidrico == 2) ? "Massa d'água": "Trecho",
                    "Critico_Corpo_Hidrico": resp.trecho_critico, 
                    "Captacao_Maxima": resp.capt_max_uso_insig,
                    "Lancamento_Maxima": resp.lanc_max_uso_insig,
                    "Lancamento_Temp_Maxima": resp.lanc_max_te_insig,
                    "Medida_Uso_Insignificante": resp.medida_uso_insig,
                    "Comp_quali": resp.comp_qualitativo,
                    "Comp_quanti": resp.comp_quantitativo,
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
                // app.map.centerAndZoom(this.getPontoInterferencia(), zoom_aprox);
            }
        });
    });