sap.ui.define([
	"sap/ui/core/routing/History",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (History, Controller,UIComponent) {
	"use strict";

	return Controller.extend("pinaki.sap.com.ApiClient.controller.SplitApp", {
		navBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("Home");
			}
		},
		navToHome : function(){
			var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("Home");
		}
	});
});