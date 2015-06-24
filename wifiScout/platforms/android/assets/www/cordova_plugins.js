cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-wifi/www/WifiAdmin.js",
        "id": "cordova-plugin-wifi.WifiAdmin",
        "clobbers": [
            "window.plugins.WifiAdmin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-wifi": "0.5.0"
}
// BOTTOM OF METADATA
});