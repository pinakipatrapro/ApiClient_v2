sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"pinaki/sap/com/ApiClient/model/models",
	"pinaki/sap/com/ApiClient/util/launchpad/LaunchpadConfiguration",
	"pinaki/sap/com/ApiClient/controller/BaseController"
], function(UIComponent, Device, models,LaunchpadConfiguration,BaseController) {
	"use strict";

	return UIComponent.extend("pinaki.sap.com.ApiClient.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			//
		}
	});
});