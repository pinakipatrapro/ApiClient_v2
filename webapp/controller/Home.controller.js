sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"pinaki/sap/com/ApiClient/controller/BaseController"
], function(Controller, JSONModel, BaseController) {
	"use strict";
	var oData = {
		// Crenentials- HCP Credentials
		"mainlUrl": "htt"+"ps://hcpms-p1942051505trial.hanatrial.ondemand.com/SampleServices/ESPM.svc"
	};
	var oConfigModel = new JSONModel(oData);
	return BaseController.extend("pinaki.sap.com.ApiClient.controller.Home", {
		onAfterRendering : function(){
			this.getView().setModel(oConfigModel,'idConfigModel');
		},
		toggleMasterPanelVisibility: function() {
			var app = sap.ui.getCore().byId('__xmlview0--idSplitApp');
			var mode = app.getMode();
			if (mode === 'HideMode') {
				app.setMode('PopoverMode');
			} else {
				app.setMode('HideMode');
			}
		}
	});
});