sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("pinaki.sap.com.ApiClient.controller.BaseController", {
		initializeLocalData: function(that) {
			//Initialize Local storage
			var localStoreData = {
				"metadataLoad": {
					"current": "",
					"history": []
				}
			};
			if (localStorage.getItem("analytics")) {
				var oLocalModel = new JSONModel(JSON.parse(localStorage.getItem('analytics')));
				that.getView().setModel(oLocalModel, 'idLocalStoreModel');
			} else {
				var oLocalModel = new JSONModel(localStoreData);
				that.getView().setModel(oLocalModel, 'idLocalStoreModel');
				localStorage.setItem('analytics', JSON.stringify(localStoreData));
			}
		},
		callFuncImp: function(oModel, method, path, urlParameters) {
			return new Promise(function(resolve, reject) {
				oModel.callFunction(path, {
					method: method,
					urlParameters: urlParameters,
					success: function(oData, response) {
						resolve(oData, response);
					},
					error: function(oError) {
						reject(oError);
					}
				});
			}.bind(this));
		},
		initLocalStorage: function() {

		}
	});
});