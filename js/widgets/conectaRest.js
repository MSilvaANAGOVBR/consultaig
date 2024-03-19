//Funcao que conecta a um servico REST e retorna o(s) dado(s);
define(["dojo/_base/declare"],
    function(declare) {
        return declare("widgets.conectaRest", null, {
            __dados_resposta: null,
            constructor: function() {
                // alert('foi conectaRest');
            },
            getRestJSON: function(serv_url, serv_param) {
                $.ajaxSetup({
                    async: false,
                    dataType: 'text/plain'
                });
                var dados;
                $.getJSON(serv_url, serv_param, function(data) {
                    dados = data;
                });
                return dados;
            },
            getRestAJAX: function(serv_url, serv_param) {
                // var url = "http://cosfi_servicos.agencia.gov.br/webservices/consultaNomes";
                alert(serv_url + ' | ' + serv_param);
                var dados;

                $.ajax({

                    // beforeSend: function(xhr) {
                    //     xhr.setRequestHeader("Content-Type", "application/json");
                    //     xhr.setRequestHeader("Accept", "text/plain");
                    // },
                    // async: false,
                    type: "POST",
                    url: serv_url,
                    dataType: 'json',
                    // headers: {
                    //     'Content-Type': 'text/html'
                    // },
                    data: serv_param,
                    success: function(data) {
                        dados = data.result;
                    }
                });

                return dados;
            },
        });
    }
);