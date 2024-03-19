define(["dojo/_base/declare",
        "esri/tasks/Geoprocessor",
        "esri/symbols/Symbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/graphic",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "dojo/_base/Color",
        "widgets/conectaRest",
        "widgets/infoLayers",
        "widgets/janelaProcessando"
    ],
    function(declare, Geoprocessor, Symbol, SimpleMarkerSymbol,
        SimpleLineSymbol, SimpleFillSymbol, Graphic, Query,
        QueryTask, Color, conectaRest, infoLayers, janelaProcessando) {

        var gp, BHO_Dominio_query, muni_query;

        var processando = new janelaProcessando();

        // --------------------------------------------------------------------------------------
        // ZOOM RIO

        function desenhaMunicipio(resp) {
            feat = resp.features[0];
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([0, 0, 0, 0]));
            var graphic = feat;
            graphic.setSymbol(symbol);
            app.map.setExtent(feat.geometry.getExtent(), true);
            app.map.graphics.add(graphic);
            processando.setJanelaProcessando("off");
            // $("#jan_Processando").css({
            //     "display": "none"
            // });
            $("#nomes_consulta").css({
                opacity: 1
            });
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

        function consultaRio(cod_rio, nomeest, nomemun) {

            // Desenha trecho
            query = new esri.tasks.Query();
            query.where = "TDR_RIO_CD = '" + cod_rio + "'";
            query.returnGeometry = true;
            query.outSpatialReference = {
                "wkid": 4326
            };
            query.outFields = ["*"];
            processando.setJanelaProcessando("on");
            // $("#jan_Processando").css({
            //     "display": "block",
            //     "left": "590px",
            //     "top": "380px"
            // });

            BHO_Dominio_query.execute(query, desenhaTrechosRio);

            //Desenha municipio
            query = new esri.tasks.Query();
            query.where = "MUN_NM = '" + nomemun + "' AND MUN_SG_UF = '" + nomeest + "'";
            query.returnGeometry = true;
            query.outSpatialReference = {
                "wkid": 4326
            };
            query.outFields = ["*"];
            municipios_query.execute(query, desenhaMunicipio);
        }


        return declare("widgets.consultaNomes", null, {
            _nomes_url: null,
            _serv_rest: null,
            _info: null,
            _parametros: null,
            constructor: function() {
                this._info = new infoLayers();
                this._consulta_nomes_url = this._info.get_url_consulta_nomes();
                this._info_municipios_ArcGIS = this._info.get_info_municipios_ArcGIS();
                this._serv_rest = new conectaRest();

                // Servicos
                // console.log('teste ' + this._info_municipios_ArcGIS['url']);
                BHO_Dominio_query = new esri.tasks.QueryTask("http://www.snirh.gov.br/arcgis/rest/services/IG/Servicos_Base_IG/MapServer/1");
                municipios_query = new esri.tasks.QueryTask(this._info_municipios_ArcGIS['url']);

            },
            selectEstados: function(codigo, NomeEstados) {
                var cod_alpha = codigo;
                cod_alpha.sort();
                cod_alpha.reverse();
                var est_alpha = NomeEstados;
                est_alpha.sort();
                est_alpha.reverse();
                for (var i = est_alpha.length - 1; i >= 0; i--) {
                    var ind = NomeEstados.indexOf(est_alpha[i]);
                    $("#Estado").append('<option value="' + codigo[ind] + '" >' + est_alpha[i] + '</option>');
                }
            },
            selectMunicipios: function(NomeMunicipio) {
                var muni_alpha = NomeMunicipio;
                muni_alpha.sort();
                muni_alpha.reverse();
                for (var i = muni_alpha.length - 1; i >= 0; i--) {
                    $("#Municipios").append('<option value="' + muni_alpha[i] + '" >' + muni_alpha[i] + '</option>');
                }
            },
            consultaTabelaEstados: function(UF) {
                var UF_estados = ["RS", "SC", "PR", "SP",
                    "RJ", "MG", "ES", "MS", "DF",
                    "GO", "BA", "SE", "AL", "PI", "PE",
                    "CE", "RN", "PB", "MA", "TO", "MT",
                    "RO", "AC", "AP", "RR", "PA", "AM"
                ];

                var cod_estados = [
                    "Rio Grande do Sul", "Santa Catarina", "Paraná", "São Paulo", "Rio de Janeiro",
                    "Minas Gerais", "Espírito Santo", "Mato Grosso do Sul", "Distrito Federal",
                    "Goiás", "Bahia", "Sergipe", "Alagoas", "Piauí", "Pernambuco", "Ceará",
                    "Rio Grande do Norte", "Paraíba", "Maranhão", "Tocantins", "Mato Grosso",
                    "Rondônia", "Acre", "Amapá", "Roraima", "Pará", "Amazonas"
                ];

                var ind = UF_estados.indexOf(UF);
                return cod_estados[ind];
            },
            preencheTabela: function(lista, chaves) {
                var lista_estados = [];
                var nome_estados = [];
                var lista_muni = [];
                $(".tab_zoom").empty();
                // console.log(chaves);
                // console.log(lista);
                for (var n in lista) {
                    // alert(lista[n][chaves[3]]);
                    nomEstado = this.consultaTabelaEstados(lista[n]['municipio_uf']);
                    $("#tab_Nome_Rios").append('<tr class="tab_zoom" style="cursor: pointer;"><td  class="cod">' + lista[n]['trecho_cd_rio'] + '</td><td>' + lista[n]['trecho_nome'] + '</td><td class="muni">' + lista[n]['municipio_nome'] + '</td><td class="est">' + lista[n]['municipio_uf'] + '</td><td>' + lista[n]['trecho_dominio'] + '</td></tr>');

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

                this.selectEstados(lista_estados, nome_estados);
                this.selectMunicipios(lista_muni);

                $('.tab_zoom').on('click', function() {
                    consultaRio($(this).find('.cod').text(), $(this).find('.est').text(), $(this).find('.muni').text());
                });
            },
            monta_Tabela: function() {
                $("#Estado").empty();
                $("#Estado").append('<option value="-1" select>Selecione o Estado</option>');

                $("#Municipios").empty();
                $("#Municipios").append('<option value="-1" select>Selecione o Município</option>');
            },
            setParametros: function(dominio, uf, ibge_mun, nome_rio) {
                this._parametros = {};
                // DOMINIO
                if (dominio != '-1') {
                    this._parametros["dominio"] = dominio;
                }

                // UF
                if (uf != '-1') {
                    this._parametros["uf"] = uf;
                }

                // MUNICIPIO
                if (ibge_mun != '-1') {
                    this._parametros["ibge_mun"] = ibge_mun.slice(4);
                }

                // NOME RIO
                if (nome_rio != '*') {
                    this._parametros["nome"] = nome_rio;
                }

                // this._parametros["ORDERBY"] = 'MUN_SG_UF'

            },
            getParametros: function() {                
                return this._parametros;
            },
            execConsultaNomes: function() {   
                // console.log(this._consulta_nomes_url);
                // console.log(this.getParametros());             
                var dados_trechos = this._serv_rest.getRestJSON(
                    this._consulta_nomes_url,
                    this.getParametros()
                );
                // console.log(dados_trechos);                
                var chaves = Object.keys(dados_trechos['items'][0]);
                this.preencheTabela(dados_trechos['items'], chaves);
            },
            clearTabelaNomes: function(){
                $(".tab_zoom").empty();
            }
        });
    }
);