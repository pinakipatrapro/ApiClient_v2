sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"pinaki/sap/com/ApiClient/controller/BaseController"
], function(Controller,BaseController) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.ApiClient.controller.Slider", {
		onInit: function() {
			this.initializeLocalData(this);
		}
	});
});