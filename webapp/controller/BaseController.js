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
		loadJSFile : function(filename) {
			var fileref = document.createElement('script');
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", filename);
			if (typeof fileref != "undefined"){
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
		},
		getRelatedEntitySet: function(entitySetName) {
			var oData = this.getView().getModel('idConfigModel').getData();
			this.getView().getModel('idConfigModel').setProperty("/assocForEntitySet",{"name":entitySetName});
			var aAssociationSet = oData.metadata.associationSet;
			var aRelatedAssociation = [];
			aAssociationSet.forEach(function(e) {
				var aNodes = e.end;
				for (var i = 0; i < aNodes.length; i++) { 
					if (aNodes[i].entitySet === entitySetName) {
						aRelatedAssociation.push({
							"entitySet": aNodes[Math.abs(i - 1)].entitySet,
							"associationName": e.name
						});
					}
				}
			});
			return aRelatedAssociation;
		}
	});
});