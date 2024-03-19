define(["dojo/_base/declare",
        "widgets/conectaRest",
        "widgets/infoLayers"
    ],
    function(declare,
        conectaRest,
        infoLayers) {
        return declare("widgets.consultaServRest", null, {
            _latitude: null,
            _longitude: null,
            constructor: function(latitude, longitude) {
                this._latitude = latitude;
                this._longitude = longitude;
                this._serv_rest = new conectaRest();
                this._info = new infoLayers();
            },
            getIntelGeo: function() {
                var consulta_intelgeo_url = this._info.get_url_consulta_IntelGeo();
                return this._serv_rest.getRestJSON(
                    consulta_intelgeo_url, {
                        lat: this._latitude,
                        lon: this._longitude
                    }
                );
            },
            getAreaMontante: function() {
                var area_mont_url = this._info.get_url_consulta_Area_Montante();
                // console.log(area_mont_url);
                var resp = this._serv_rest.getRestJSON(
                    area_mont_url, {
                        lat: this._latitude,
                        lon: this._longitude
                    });
                // console.log(resp['items'][0].area_montante_km2);
                var area = resp['items'][0].area_montante_km2;
                return area;
            },            
            // getIntelGeo: function() {
            //     var consulta_dominio_url = this._info.get_url_consulta_IntelGeo_Django();
            //     return this._serv_rest.getRestJSON(
            //         consulta_dominio_url, {
            //             lat: this._latitude,
            //             lon: this._longitude
            //         }
            //     );
            // },
            // getAreaMontante: function() {
            //     var area_mont_url = this._info.get_url_consulta_Area_Montante_Django();
            //     // console.log(area_mont_url);
            //     var resp = this._serv_rest.getRestJSON(
            //         area_mont_url, {
            //             lat: this._latitude,
            //             lon: this._longitude
            //         });
            //     // console.log(resp);
            //     var area = resp[0].area_montante_km2;
            //     return area;
            // },
        });
    }
);