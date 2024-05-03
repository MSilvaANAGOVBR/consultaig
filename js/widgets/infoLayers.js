define(["dojo/_base/declare",
        "esri/layers/FeatureLayer",
        "esri/layers/ArcGISTiledMapServiceLayer"
    ],
    function(declare,
        FeatureLayer,
        ArcGISTiledMapServiceLayer) {

        return declare("widgets.infoLayers", null, {
            _lyrs: [],
            _info_Outorgas_Uso: {},
            _info_Cnarh3_Informada: {},
            _info_Reserv_SIN: {},
            _info_Reserv_NE: {},
            _info_BHO_Dominio: {},
            _info_BHO_Ottobacias: {},
            _info_Espelhos: {},
            _info_Unid_Conserv: {},
            _info_Terra_Ind: {},
			//_info_Estacao_Hidro: {},
            _info_municipios_ArcGIS: {},
            constructor: function() {
                // Necessario informar a ordem
                this.set_info_Outorgas_Uso(14);
                this.set_info_Cnarh3_Informada(13);
                this.set_info_Reserv_SIN(12);
                this.set_info_Reserv_NE(11);
                this.set_info_BHO_Dominio(10);
                this.set_info_BHO_Ottobacias(9);
                this.set_info_Espelhos(8);
                this.set_info_Unid_Conserv(7);
                this.set_info_Terra_Ind(6);
				//this.set_info_Estacao_Hidro(5);
                this.set_info_municipios_ArcGIS(4);
                this.set_matriz_Layers();
            },
            set_matriz_Layers: function() {
                // Ordem para carregar os lyrs no mapa                
                this._lyrs = [];
                this._lyrs.push(this.get_info_BHO_Dominio());
                this._lyrs.push(this.get_info_BHO_Ottobacias());
                this._lyrs.push(this.get_info_Espelhos());
                this._lyrs.push(this.get_info_Outorgas_Uso());
                this._lyrs.push(this.get_info_Cnarh3_Informada());
                this._lyrs.push(this.get_info_Reserv_SIN());
                this._lyrs.push(this.get_info_Reserv_NE());
                this._lyrs.push(this.get_info_Unid_Conserv());
                this._lyrs.push(this.get_info_Terra_Ind());
				//this._lyrs.push(this.get_info_Estacao_Hidro());
                this._lyrs.push(this.get_info_municipios_ArcGIS());
                // console.log(this._lyrs);
            },
            get_matriz_Layer: function(order) {
                for (var i in this.get_matriz_Layers()) {
                    if (this.get_matriz_Layers()[i]["ordem"] == order) {
                        return this.get_matriz_Layers()[i];
                    }
                }
            },
            get_matriz_Layers: function(order) {
                return this._lyrs;
            },
            get_html_Layers: function() {
                var html = '';
                var i;
                for (i = 0; i < this.get_matriz_Layers().length; i++) {
                    html = html + this.get_matriz_Layer(this.get_matriz_Layers()[i]["ordem"])["html"];
                }
                return html;
            },
            //-----------------------------------------
            // Espelhos
            set_info_Espelhos: function(ordem) {
                // var nome = "Espelhos";
                var id = 'check_espelhos';
                var titulo = "Massas d'água";
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                    '<input id="' + id + '" type="checkbox" aria-label="..." ></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
                var url = 'https://www.snirh.gov.br/arcgis/rest/services/IG/Servicos_Base_IG/MapServer/3';
                var conteudo = {
                    "Código:": 'ESP_CD',
                    "Nome": 'ESP_NM_RESERVATORIO',
                    "Tipo": 'ESP_TP_RESERVATORIO',
                    "Domínio": 'ESP_DS_DOMINIO',
                    "Área (km²)": 'ESP_GM_AREA'
                };
                var lyr = new esri.layers.FeatureLayer(url, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"],
                    opacity: 0.5
                });
                this._info_Espelhos = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },
            get_info_Espelhos: function() {
                return this._info_Espelhos;
            },
            //-----------------------------------------           
            // BHO Dominio
            set_info_BHO_Dominio: function(ordem) {
                var id = 'check_BHO_Dominio';
                var titulo = 'Base Hidrogr. Trechos';
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                    '<input id="' + id + '" type="checkbox" aria-label="..."  checked="checked"></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
/*                 var url = 'https://www.snirh.gov.br/arcgis/rest/services/SGI/Base_Hidrografica_2013/MapServer/0';
                console.log(url.slice(0, url.length - 2));
                var conteudo = '';
                // var lyr = new esri.layers.ArcGISDynamicMapServiceLayer(url.slice(0, url.length - 2), {
                //     id: id,
                //     title: titulo
                // });

                var lyr = new ArcGISTiledMapServiceLayer(url.slice(0, url.length - 2), {
                    displayLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
                }); */

                var url = 'https://www.snirh.gov.br/arcgis/rest/services/IG/Servicos_Base_IG/MapServer/1';
                var conteudo = '';
                var lyr = new esri.layers.FeatureLayer(url, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"]
                });

                this._info_BHO_Dominio = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },
            get_info_BHO_Dominio: function() {
                return this._info_BHO_Dominio;
            },
            //-----------------------------------------           
            // BHO Ottobacias
            set_info_BHO_Ottobacias: function(ordem) {
                var id = 'check_BHO_Ottobacias';
                var titulo = 'Base Hidrogr. Área de Drenag.';
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                    '<input id="' + id + '" type="checkbox" aria-label="..." ></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
                var url = 'https://www.snirh.gov.br/arcgis/rest/services/IG/Servicos_Base_IG/MapServer/2';
                var conteudo = '';
                var lyr = new esri.layers.FeatureLayer(url, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"]
                });
                this._info_BHO_Ottobacias = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },
            get_info_BHO_Ottobacias: function() {
                return this._info_BHO_Ottobacias;
            },
            //-----------------------------------------            
            // Unidade de Conservacao
            set_info_Unid_Conserv: function(ordem) {
                var id = 'check_unidade_cons';
                var titulo = 'Unidades de Conservação';
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                    '<input id="' + id + '" type="checkbox" aria-label="..." ></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
                var url = 'https://www.snirh.gov.br/arcgis/rest/services/IG/Servicos_Base_IG/MapServer/6';
                var conteudo = {
                    "Nome Unidade": 'UNC_NM',
                    "Categoria": 'UNC_CA',
                    "Esfera": 'UNC_DS_ESFERA',
                    "Ano Criação": 'UNC_AA_CRIACAO'
                };
                var lyr = new esri.layers.FeatureLayer(url, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"]
                });
                this._info_Unid_Conserv = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },
            get_info_Unid_Conserv: function() {
                return this._info_Unid_Conserv;
            },
            //-----------------------------------------            
            // Terra indigena
            set_info_Terra_Ind: function(ordem) {
                var id = 'check_terra_ind';
                var titulo = 'Terras Indígenas';
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                    '<input id="' + id + '" type="checkbox" aria-label="..." ></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
                var url = 'https://www.snirh.gov.br/arcgis/rest/services/IG/Servicos_Base_IG/MapServer/7';
                var conteudo = {
                    "Nome Terra Indígena": 'TIN_NM',
                    "Grupos Ind.": 'TIN_DS_GRUPO_ETNICO',
                    "Titulação": 'TIN_DS_TITULACAO',
                    "Situação Jurid.": 'TIN_DS_SITUACAO_JURIDICA',
                    "Área Oficial (ha)": 'TIN_AR_OFICIAL_HA'
                };
                var lyr = new esri.layers.FeatureLayer(url, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"]
                });
                this._info_Terra_Ind = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },
            get_info_Terra_Ind: function() {
                return this._info_Terra_Ind;
            },
            //-----------------------------------------            
            // Outorgas de Uso
            set_info_Outorgas_Uso: function(ordem) {
                var id = 'check_outorgas_uso';
                var titulo = 'Outorgas de Uso';
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                    '<input id="' + id + '" type="checkbox" aria-label="..." ></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
                var url = 'https://www.snirh.gov.br/arcgis/rest/services/SRE/OutorgasDireitodeUso/MapServer/0';
                var conteudo = {
                    "Código CNARH": 'CODIGO_CNARH',
                    "CPF/CNPJ": 'CPF_CNPJ',
                    "Município": 'MUNICIPIO',
                    "UF": 'UF',
                    "Resolução": 'RESOLUCAO',
                    "Volume anual m³": 'VOLUME_ANUAL_M3',
                    "Cultura Irrigada": 'CULTURA_IRRIGADA',
                    "DBO Bruto (mg/L)": 'DBO_BRUTO_MG_L',
                    "P Bruto(mg/L)": 'P_BRUTO_MG_L',
                    "Temperatura (ºC)": 'TEMPERATURA'
                };
                var lyr = new esri.layers.FeatureLayer(url, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"]
                });
                this._info_Outorgas_Uso = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },
            get_info_Outorgas_Uso: function() {
                return this._info_Outorgas_Uso;
            },
            //-----------------------------------------            
            // Estações do Hidro --- Outorgas CNARH 3 - Mudei para Estações do Hidro até resolver o check_estacao_hidro para aparecer o pop-up.
            set_info_Cnarh3_Informada: function(ordem) {
                var id = 'check_cnarh3_informada';
                var titulo = 'Estações HIDRO';
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +	
                    '<input id="' + id + '" type="checkbox" aria-label="..." ></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
                var url = 'https://portal1.snirh.gov.br/server/rest/services/Esta%C3%A7%C3%B5es_Hidrometeorol%C3%B3gicas_SNIRH/MapServer/0';
                var conteudo = {
                    "Código Estação": 'Codigo',
                    "Nome": 'Nome',
                    "Rio": 'Rio',
                    "Operando": 'Operando',
                    "UF": 'UF',
					"Municipio": 'Municipio',
                    "Área de Drenagem": 'AreaDrenagem',
                    "BaciaCodigo": 'BaciaCodigo',
					"SubBaciaCodigo": 'SubBaciaCodigo',
					"ResponsavelSigla": 'ResponsavelSigla',
					"Operadora": 'Operadora'
                };
                var lyr = new esri.layers.FeatureLayer(url, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"]
                });
                this._info_Cnarh3_Informada = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },
            get_info_Cnarh3_Informada: function() {
                return this._info_Cnarh3_Informada;
            },
            //-----------------------------------------            
            // Disponibilidade Hidrica
            set_info_Disp_Hidrica: function(ordem) {
                var id = 'check_disp_hidrica';
                var titulo = 'Disponib. hídrica superficial (Q95)';
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                    '<input id="' + id + '" type="checkbox" aria-label="..." ></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
                var url = 'https://www.snirh.gov.br/arcgis/rest/services/CONJUNTURA_RHB/Disponibilidade_hidrica_superficial/MapServer';
                var conteudo = {
                    "Disponibilidade Q95": 'DISPQ95'
                };
                var lyr = '';
                this._info_Disp_Hidrica = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },
            get_info_Disp_Hidrica: function() {
                return this._info_Disp_Hidrica;
            },
            //-----------------------------------------            
            // Reservatorios SAR SIN
            set_info_Reserv_SIN: function(ordem) {
                var id = 'check_reserv_sin';
                var titulo = 'Sistema Interligado Nacional - SIN';
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                    '<input id="' + id + '" type="checkbox" aria-label="..." ></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
                var url = 'https://www.snirh.gov.br/arcgis/rest/services/IG/SAR/MapServer/0';
                var conteudo = {
                    "Nome Reservatório": 'SAR_NM',
                    "Capacidade (m³)": 'SAR_QT_CAPACIDADE',
                    "Última Cota medida (m)": 'SAR_CO_ULTIMA',
                    "Cota Máxima (m)": 'SAR_CO_MAX',
                    "Cota Mínima (m)": 'SAR_CO_MIN',
                    "Último Volume medido (m³)": 'SAR_VO_ULTIMA',
                    "Percentual do Volume (%)": 'SAR_PC_VOLUME',
                    "Volume Mínimo (m³)": 'SAR_VO_MIN',
                    "Volume Máximo(m³)": 'SAR_VO_MAX'
                };
                var lyr = new esri.layers.FeatureLayer(url, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"]
                });
                this._info_Reserv_SIN = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },
            get_info_Reserv_SIN: function() {
                return this._info_Reserv_SIN;
            },
            //-----------------------------------------            
            // Reservatorios SAR NE
            set_info_Reserv_NE: function(ordem) {
                var id = 'check_reserv_ne';
                var titulo = 'Reservatórios do Nordeste';
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                    '<input id="' + id + '" type="checkbox" aria-label="..." ></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
                var url = 'https://www.snirh.gov.br/arcgis/rest/services/IG/SAR/MapServer/1';
                var conteudo = {
                    "Nome Reservatório": 'SAR_NM',
                    "Capacidade (m³)": 'SAR_QT_CAPACIDADE',
                    "Última Cota medida (m)": 'SAR_CO_ULTIMA',
                    "Último Volume medido (m³)": 'SAR_VO_ULTIMA',
                    "Volume Mínimo (m³)": 'SAR_VO_MIN',
                    "Volume Máximo(m³)": 'SAR_VO_MAX'
                };
                var lyr = new esri.layers.FeatureLayer(url, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"]
                });
                this._info_Reserv_NE = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },
            get_info_Reserv_NE: function() {
                return this._info_Reserv_NE;
            },
            //-----------------------------------------            
            // Municipios
            set_info_municipios_ArcGIS: function(ordem) {
                var id = 'check_municipios_arcgis';
                var titulo = 'Municípios';
                var html = '<div class="input-group">' +
                    '<span class="input-group-addon">' +
                    '<input id="' + id + '" type="checkbox" aria-label="..." ></span>' +
                    '<span class="form-control">' + titulo + '</span>' +
                    '</div>';
                var url = 'https://www.snirh.gov.br/arcgis/rest/services/IG/Servicos_Base_IG/MapServer/10';
                var conteudo = {
                    "Código Município": 'MUN_NU_IBGE7_MUNICIPIO',
                    "Nome Município": 'MUN_NM'
                };
                var lyr = new esri.layers.FeatureLayer(url, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"]
                });
                this._info_municipios_ArcGIS = {
                    "id": id,
                    "ordem": ordem,
                    "titulo": titulo,
                    "url": url,
                    "html": html,
                    "conteudo": conteudo,
                    "layer": lyr
                };
            },           
            get_info_municipios_ArcGIS: function() {
                // var url = "http://www.snirh.gov.br/arcgis/rest/services/IG/IG_ConsultaMunicipios/MapServer/0";
                return this._info_municipios_ArcGIS;
                // return url;
            },
            //-----------------------------------------            
            // Consulta IntelGeo
            get_url_consulta_IntelGeo: function() {
                var url = "https://ows.snirh.gov.br/ords/servicos/snirh_ig/intelgeo";
                return url;
            },
             //-----------------------------------------            
            // Consulta area Montante
            get_url_consulta_Area_Montante: function() {
                var url = "https://ows.snirh.gov.br/ords/servicos/snirh_ig/fac";
                return url;
            },           
            //-----------------------------------------            
            // Municipios
            get_url_consulta_municipios: function() {
                var url = "https://ows.snirh.gov.br/ords/servicos/snirh_ig/municipio";
                return url;
            },
            //-----------------------------------------            
            // Consulta Nomes
            get_url_consulta_nomes: function() {
                var url = "https://ows.snirh.gov.br/ords/servicos/snirh_ig/nome_rio_municipio";
                return url;
            },  
            //-----------------------------------------            
            // Consulta Trechos Montante
            get_url_consulta_trechos_montante: function() {
                var url = "https://ows.snirh.gov.br/ords/servicos/snirh_ig/trechos_mont_afl";
                return url;
            },    
            //-----------------------------------------            
            // Consulta Cursos d Agua Jusante
            get_url_consulta_trechos_jusante: function() {
                var url = "https://ows.snirh.gov.br/ords/servicos/snirh_ig/trechos_jusante";
                return url;
            },                                
            //-----------------------------------------            
            // Municipios
            // get_url_municipios_Django: function() {
            //     var url = "http://cosfi_servicos.agencia.gov.br/   /consultaMunicipio";
            //     return url;
            // },
            //-----------------------------------------            
            // Consulta Nomes
            // get_url_consulta_nomes_Django: function() {
            //     var url = "http://cosfi_servicos.agencia.gov.br/webservices/consultaNomes";
            //     return url;
            // },
            //-----------------------------------------            
            // Consulta area Montante
            // get_url_consulta_Area_Montante_Django: function() {
            //     var url = "http://cosfi_servicos.agencia.gov.br/webservices/consultaAreaMontante";
            //     return url;
            // },
            //-----------------------------------------            
            // Consulta IntelGeo
            // get_url_consulta_IntelGeo_Django: function() {
            //     var url = "http://cosfi_servicos.agencia.gov.br/webservices/consultaIntelGeo";
            //     return url;
            // },

        });
    }
);