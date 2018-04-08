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
		loadJSFile: function(filename) {
			var fileref = document.createElement('script');
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", filename);
			if (typeof fileref != "undefined") {
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
		},
		getRelatedEntitySet: function(entitySetName) {
			var entitySet = this.getEntityTypeFromEntitySet(entitySetName);
			return entitySet.navigationProperty;
		},
		getEntitysetFromAssociationRel : function(assocRole){
			var associationData = this.getView().getModel('idConfigModel').getData().metadata.associationSet;
			for (var i = 0; i < associationData.length; i++) {
				if(associationData[i].association === assocRole){
					break;
				}
			}
			return associationData[i].end[1].entitySet;
		},
		getEntityTypeFromEntitySet: function(entitySetName) {
			var oData = this.getView().getModel('idConfigModel').getData();
			var entitySet = oData.metadata.entitySet;
			for (var i = 0; i < entitySet.length; i++) {
				if(entitySet[i].name === entitySetName){
					break;
				}
			}
			return oData.metadata.entityType[i];

		}
	});
});