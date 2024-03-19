var baseUrl = location.toString().replace(/[^\s\/]+$/, '') + 'js/';
// alert(baseUrl);
dojoConfig = {
    // baseUrl: "js",
    isDebug: true, // enables debug
    async: true, // enables AMD loader
    packages: [
    {
        "name": "widgets",
        "location": baseUrl + "widgets"
    }
    ]
};