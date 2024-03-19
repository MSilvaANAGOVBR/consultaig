define(["dojo/_base/declare",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "widgets/conectaRest",
        "widgets/infoLayers"
    ],
    function(declare, Query, QueryTask, conectaRest, infoLayers) {
        return declare("widgets.consultaMunicipio", null, {
            // _query: null,
            _muni_url: null,
            _muni_nomes: null,
            _serv_rest: null,
            _info: null,
            constructor: function() {
                this._info = new infoLayers();
                this._muni_url = this._info.get_url_consulta_municipios();
                this._serv_rest = new conectaRest();
            },
            consultaServMunicipio: function(est) {
                $("#nomes_consulta").css({
                    opacity: 0.5
                });
                $("#jan_Processando").css({
                    "display": "block",
                    "left": "590px",
                    "top": "380px"
                });
                var dados_muni = this._serv_rest.getRestJSON(this._muni_url, {
                    mun_sg_uf: est
                });
                // console.log(dados_muni['items']);
                // resp['items'];
                this.municipiosEstado(dados_muni['items']);

            },
            municipiosEstado: function(muni) {
                $("#Municipios").empty();
                $("#Municipios").append('<option value="-1" select>Selecione p/ zoom</option>');

                for (var i in muni) {
                    $("#Municipios").append('<option value="cod_' + muni[i].mun_nu_ibge7_municipio + '" >' + muni[i].mun_nm + '</option>');
                }

                $("#jan_Processando").css({
                    "display": "none"
                });
                $("#nomes_consulta").css({
                    opacity: 1
                });
            }
        });
    }
);