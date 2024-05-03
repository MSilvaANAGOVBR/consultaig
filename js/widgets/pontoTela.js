define(["dojo/_base/declare",
        "esri/symbols/PictureMarkerSymbol",
        "esri/graphic",
        "dojo/_base/Color",
        "esri/InfoTemplate",
        "esri/layers/GraphicsLayer"
    ],
    function(declare,
        PictureMarkerSymbol,
        Graphic,
        Color,
        InfoTemplate,
        GraphicsLayer
    ) {

        return declare("widgets.pontoTela", null, {
            pnt: null,
            lat: null,
            lon: null,
            graph_pnt: null,
            // graph_idx: null,
            constructor: function(feat) {
                this.pnt = feat;
                this.lon = this.pnt.x;
                this.lat = this.pnt.y;
                // this.graph_pnt = new Graphic();
                this.adicionaCoordenadasConsultas();
                this.plotaPonto();
            },
            adicionaCoordenadasConsultas: function() {
                // $("#Lat_inter").val(this.lat.toFixed(5));
                // $("#Long_inter").val(this.lon.toFixed(5));
                $("#Lat").val(this.lat);
                $("#Long").val(this.lon);
            },
            plotaPonto: function() {
                // alert(app.map.graphics.graphics.length + "/" + graph_idx);
                if (graph_indx > 0) {
                    app.map.graphics.remove(app.map.graphics.graphics[graph_indx]);
                }

                this.graph_pnt = new Graphic(this.pnt, this.getSymbol(), this.getAttributes(), this.getInfoTamplate());
                graph_indx = app.map.graphics.graphics.length;
                app.map.graphics.add(this.graph_pnt);
                this.setInfoWindow();
                // app.map.centerAndZoom(this.pnt, 11);
            },
            getAttributes: function() {
                var attr = {
                    "Xcoord": Number(this.lon).toFixed(5),
                    "Ycoord": Number(this.lat).toFixed(5)
                };
                return attr;
            },
            getConteudo: function(){
                var conteudo = "Latitude: <b>${Ycoord}</b><br>  Longitude: <b>${Xcoord}</b>" +
                    '<div id="janela_ponto" class="form-group">' +
                    /*'<br>' +
                     '<label>Consulta Informações do Trecho:<br>(<i>Hidrorreferenciamento</i>)</label>' +
                    '<button id="pnt_bnt_hidrorref" type="button" class="btn btn-primary btn-xs">Consultar</button>' + */
                    '<br><br><label>Consulta Coordenada:<br>(<i>Domínio Interferência</i>)</label>' +
                    '<br><button id="pnt_bnt_consdomin" type="button" class="btn btn-primary btn-xs">Consultar</button>' +
                    '<div id="jan_Processando">' +
                    '<img src="img/processando_2.GIF" alt="">' +
                    '</div>' +
                    '</div>';
                    return conteudo;
            },
            getInfoTamplate: function() {
                var infoTemp = new InfoTemplate("<img src=\"img/ana90_tundra.jpg\"  width=\"45\" height=\"15\"><i>&nbspOpções de Consulta</i>", this.getConteudo());
                return infoTemp;
            },
            getSymbol: function() {
                var symbol = new PictureMarkerSymbol('https://static.arcgis.com/images/Symbols/Shapes/BlueCircleLargeB.png', 30, 30);
                return symbol;
            },
            setInfoWindow: function() {
                app.map.infoWindow.setTitle(this.graph_pnt.getTitle());
                app.map.infoWindow.setContent(this.graph_pnt.getContent());
                app.map.infoWindow.resize(300, 350); //resize(width, height)
                app.map.infoWindow.show(this.pnt, app.map.getInfoWindowAnchor(this.pnt));
            }

        });
    }
);