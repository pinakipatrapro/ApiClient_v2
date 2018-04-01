sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	var baseController = Controller.extend("pinaki.sap.com.ApiClient.controller.BaseController", {});
	baseController.pressShareButton = function(oEvent) {
		console.log('hi');
	};
	return baseController;
});