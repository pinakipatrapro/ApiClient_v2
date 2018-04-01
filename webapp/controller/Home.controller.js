sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("pinaki.sap.com.ApiClient.controller.Home", {
		onHistoryPress : function(){
			var app = sap.ui.getCore().byId('__xmlview0--idSplitApp');
			var mode = app.getMode();
			if(mode === 'HideMode'){
				app.setMode('PopoverMode');
			}else{
				app.setMode('HideMode');
			}
		}
	});
});