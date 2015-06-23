cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-wifi/www/WifiAdmin.js",
        "id": "cordova-plugin-wifi.WifiAdmin",
        "clobbers": [
            "window.plugins.WifiAdmin"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-wifi": "0.5.0",
    "org.apache.cordova.network-information": "0.2.15"
}
// BOTTOM OF METADATA
});