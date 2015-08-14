package com.rjfun.cordova.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

public class WifiAdmin extends CordovaPlugin {

	private static final String LOGTAG = "WifiAdmin";

  /** Cordova Actions. */
  private static final String ACTION_GET_WIFI_INFO = "getWifiInfo";
	private static final String ACTION_SCAN = "scan";

  @Override
  public boolean execute(String action, JSONArray inputs, CallbackContext callbackContext) throws JSONException {
    PluginResult result = null;

		if (ACTION_GET_WIFI_INFO.equals(action)) {
      result = executeGetWifiInfo(inputs, callbackContext);

    } else if (ACTION_SCAN.equals(action)) {
			result = executeScan(inputs, callbackContext);

		}
		else {
      Log.d(LOGTAG, String.format("Invalid action passed: %s", action));
      result = new PluginResult(Status.INVALID_ACTION);
    }

    if (result != null) {
			callbackContext.sendPluginResult( result );
		}

    return true;
  }

  private PluginResult executeGetWifiInfo(JSONArray inputs, CallbackContext callbackContext) {
  	Log.w(LOGTAG, "executeGetWifiInfo");

		Context context = cordova.getActivity().getApplicationContext();
		WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
		WifiInfo wifiInfo = wifiManager.getConnectionInfo();

		JSONObject obj = new JSONObject();

		try {
			JSONObject active = new JSONObject();

			active.put("BSSID", wifiInfo.getBSSID());
			active.put("HiddenSSID", wifiInfo.getHiddenSSID());
			active.put("SSID", wifiInfo.getSSID());
			active.put("MacAddress", wifiInfo.getMacAddress());
			active.put("IpAddress", wifiInfo.getIpAddress());
			active.put("NetworkId", wifiInfo.getNetworkId());
			active.put("RSSI", wifiInfo.getRssi());
			active.put("LinkSpeed", wifiInfo.getLinkSpeed());

			obj.put("active", active);

			JSONArray available = new JSONArray();

			for (ScanResult scanResult : wifiManager.getScanResults()) {
      	JSONObject ap = new JSONObject();

				ap.put("BSSID", scanResult.BSSID);
      	ap.put("SSID", scanResult.SSID);
      	ap.put("frequency", scanResult.frequency);
      	ap.put("level", scanResult.level);
      	ap.put("capabilities", scanResult.capabilities);

				available.put(ap);
      }

      obj.put("available", available);

		} catch (JSONException e) {
			e.printStackTrace();
			callbackContext.error("JSON Exception");
		}

		callbackContext.success(obj);

  	return null;
  }

	private PluginResult executeScan(JSONArray inputs, CallbackContext callbackContext) {
  	Log.w(LOGTAG, "executeScan");

		Context context = cordova.getActivity().getApplicationContext();
		WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);

		if (wifiManager.startScan()) {
			callbackContext.success();
		} else {
			callbackContext.error("Scan failed");
		}

  	return null;
  }

}
