$(function() {

    $("#menu").draggable();
    // $("#hidro_janela").draggable();
    // $("#nomes_janela").draggable();
    // $("#dominio_janela").draggable();

    var altura_max_menu = 460;
    var altura_min_menu = 48;
    var altura_legenda_menu = 670;

    $("#bnt_minimiza").click(function() {
        if ($("#txt_minimiza").html() === '-') {
            $("#txt_minimiza").text('+');
            $("#elementos_menu").hide();
            $("#menu").css("height", altura_min_menu);
            $("#txt_minimiza").css("font-size", 20);
            $("#hidro_janela").css("display", 'none');
            $("#hidro_bnt > span").text('>');
            $("#otto_janela").css("display", 'none');
            $("#otto_bnt > span").text('>');
            $("#nomes_janela").css("display", 'none');
            $("#nomes_bnt > span").text('>');
            $("#dominio_bnt > span").text('>');
            $("#dominio_janela").css("display", 'none');
            $("#features_bnt > span").text('>');
            $("#features_janela").css("display", 'none');
            $("#con_feat_bnt > span").text('>');
            $("#con_feat_janela").css("display", 'none');
        } else if ($("#txt_minimiza").html() === '+') {
            $("#txt_minimiza").text('-');
            $("#elementos_menu").show();
            $("#menu").css("height", altura_max_menu);
            $("#txt_minimiza").css("font-size", 25);
        }
    });
    $("#hidro_bnt").click(function() {
        if ($("#hidro_janela").css("display") == 'none') {
            $("#hidro_bnt > span").text('<');
            $("#hidro_janela").css("display", 'block');
            $("#otto_janela").css("display", 'none');
            $("#otto_bnt > span").text('>');
            $("#nomes_janela").css("display", 'none');
            $("#nomes_bnt > span").text('>');
            $("#dominio_bnt > span").text('>');
            $("#dominio_janela").css("display", 'none');
            $("#features_bnt > span").text('>');
            $("#features_janela").css("display", 'none');
            $("#con_feat_bnt > span").text('>');
            $("#con_feat_janela").css("display", 'none');
        } else if ($("#hidro_janela").css("display") == 'block') {
            $("#hidro_bnt > span").text('>');
            $("#hidro_janela").css("display", 'none');
        }
    });
    $("#otto_bnt").click(function() {
        if ($("#otto_janela").css("display") == 'none') {
            $("#otto_bnt > span").text('<');
            $("#otto_janela").css("display", 'block');
            $("#hidro_janela").css("display", 'none');
            $("#hidro_bnt > span").text('>');
            $("#nomes_janela").css("display", 'none');
            $("#nomes_bnt > span").text('>');
            $("#dominio_bnt > span").text('>');
            $("#dominio_janela").css("display", 'none');
            $("#features_bnt > span").text('>');
            $("#features_janela").css("display", 'none');
            $("#con_feat_bnt > span").text('>');
            $("#con_feat_janela").css("display", 'none');
        } else if ($("#otto_janela").css("display") == 'block') {
            $("#otto_bnt > span").text('>');
            $("#otto_janela").css("display", 'none');
        }
    });
    $("#nomes_bnt").click(function() {
        if ($("#nomes_janela").css("display") == 'none') {
            $("#nomes_bnt > span").text('<');
            $("#nomes_janela").css("display", 'block');
            $("#hidro_janela").css("display", 'none');
            $("#hidro_bnt > span").text('>');
            $("#otto_janela").css("display", 'none');
            $("#otto_bnt > span").text('>');
            $("#dominio_bnt > span").text('>');
            $("#dominio_janela").css("display", 'none');
            $("#features_bnt > span").text('>');
            $("#features_janela").css("display", 'none');
            $("#con_feat_bnt > span").text('>');
            $("#con_feat_janela").css("display", 'none');
        } else if ($("#nomes_janela").css("display") == 'block') {
            $("#nomes_bnt > span").text('>');
            $("#nomes_janela").css("display", 'none');
        }
    });
    $("#tab_Nome_Rios").click(function() {
        if ($("#nomes_janela").css("display") == 'none') {
            $("#nomes_bnt > span").text('<');
            $("#nomes_janela").css("display", 'block');
            $("#hidro_janela").css("display", 'none');
            $("#hidro_bnt > span").text('>');
            $("#otto_janela").css("display", 'none');
            $("#otto_bnt > span").text('>');
            $("#dominio_bnt > span").text('>');
            $("#dominio_janela").css("display", 'none');
        } else if ($("#nomes_janela").css("display") == 'block') {
            $("#nomes_bnt > span").text('>');
            $("#nomes_janela").css("display", 'none');
        }
    });
    $("#dominio_bnt").click(function() {
        if ($("#dominio_janela").css("display") == 'none') {
            $("#dominio_bnt > span").text('<');
            $("#dominio_janela").css("display", 'block');
            $("#nomes_janela").css("display", 'none');
            $("#nomes_bnt > span").text('>');
            $("#hidro_janela").css("display", 'none');
            $("#hidro_bnt > span").text('>');
            $("#otto_janela").css("display", 'none');
            $("#otto_bnt > span").text('>');
            $("#features_bnt > span").text('>');
            $("#features_janela").css("display", 'none');
            $("#con_feat_bnt > span").text('>');
            $("#con_feat_janela").css("display", 'none');
        } else if ($("#dominio_janela").css("display") == 'block') {
            $("#dominio_bnt > span").text('>');
            $("#dominio_janela").css("display", 'none');
        }
    });
    $("#features_bnt").click(function() {
        if ($("#features_janela").css("display") == 'none') {
            $("#features_bnt > span").text('<');
            $("#features_janela").css("display", 'block');
            $("#nomes_janela").css("display", 'none');
            $("#nomes_bnt > span").text('>');
            $("#hidro_janela").css("display", 'none');
            $("#hidro_bnt > span").text('>');
            $("#otto_janela").css("display", 'none');
            $("#otto_bnt > span").text('>');
            $("#dominio_bnt > span").text('>');
            $("#dominio_janela").css("display", 'none');
            $("#con_feat_bnt > span").text('>');
            $("#con_feat_janela").css("display", 'none');
        } else if ($("#features_janela").css("display") == 'block') {
            $("#features_bnt > span").text('>');
            $("#features_janela").css("display", 'none');
        }
    });
    $("#con_feat_bnt").click(function() {
        if ($("#con_feat_janela").css("display") == 'none') {
            $("#con_feat_bnt > span").text('<');
            $("#con_feat_janela").css("display", 'block');
            $("#nomes_janela").css("display", 'none');
            $("#nomes_bnt > span").text('>');
            $("#hidro_janela").css("display", 'none');
            $("#hidro_bnt > span").text('>');
            $("#otto_janela").css("display", 'none');
            $("#otto_bnt > span").text('>');
            $("#features_bnt > span").text('>');
            $("#features_janela").css("display", 'none');
            $("#dominio_bnt > span").text('>');
            $("#dominio_janela").css("display", 'none');
        } else if ($("#con_feat_janela").css("display") == 'block') {
            $("#con_feat_bnt > span").text('>');
            $("#con_feat_janela").css("display", 'none');
        }
    });
    $("#legendas_bnt").click(function() {
        if ($("#legendiv").css("display") == 'none') {
            $("#legendas_bnt > span").text('-');
            $("#legendiv").css("display", 'block');
            $("#menu").css("height", altura_legenda_menu);
        } else if ($("#legendiv").css("display") == 'block') {
            $("#legendas_bnt > span").text('+');
            $("#legendiv").css("display", 'none');
            $("#menu").css("height", altura_max_menu);
        }
    });
});