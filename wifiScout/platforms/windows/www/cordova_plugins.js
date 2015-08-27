cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
        "id": "cordova-plugin-globalization.GlobalizationError",
        "clobbers": [
            "window.GlobalizationError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/globalization.js",
        "id": "cordova-plugin-globalization.globalization",
        "clobbers": [
            "navigator.globalization"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/src/windows/GlobalizationProxy.js",
        "id": "cordova-plugin-globalization.GlobalizationProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/windows/SplashScreenProxy.js",
        "id": "cordova-plugin-splashscreen.SplashScreenProxy",
        "merges": [
            ""
        ]
    },
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
    "cordova-plugin-globalization": "1.0.1",
    "cordova-plugin-splashscreen": "2.1.0",
    "cordova-plugin-wifi": "0.5.0"
}
// BOTTOM OF METADATA
});