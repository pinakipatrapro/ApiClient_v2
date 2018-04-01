sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"pinaki/sap/com/ApiClient/controller/BaseController"
], function(Controller, JSONModel, BaseController) {
	"use strict";
	var oData = {
		// Crenentials- HCP Credentials
		"mainUrl": "htt" + "ps://hcpms-p1942051505trial.hanatrial.ondemand.com/SampleServices/ESPM.svc"
	};
	var oConfigModel = new JSONModel(oData);
	return BaseController.extend("pinaki.sap.com.ApiClient.controller.Home", {
		onInit: function() {
			this.initializeLocalData(this);
		},
		onAfterRendering: function() {
			this.getView().setModel(oConfigModel, 'idConfigModel');
		},
		toggleMasterPanelVisibility: function() {
			var app = sap.ui.getCore().byId('__xmlview0--idSplitApp');
			var mode = app.getMode();
			if (mode === 'HideMode') {
				app.setMode('PopoverMode');
			} else {
				app.setMode('HideMode');
			}
		},
		onLoadUrlPress: function() {
			var url = oConfigModel.getProperty('/mainUrl');
			performance.mark("requestSent");
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, {
				headers: {
					"sap-stastics": "true"
				}
			});
			oModel.attachMetadataLoaded(this.serviceInitialized(oModel));
			this.getView().setModel(oModel);
		},
		serviceInitialized: function(oMainModel) {
			oMainModel.attachMetadataLoaded(function() {
				this.metaLoadPerformance();
				oConfigModel.setData({
					metadata: oMainModel.getServiceMetadata().dataServices.schema[0].entityContainer[0]
				}, true);
			}.bind(this));
		},
		metaLoadPerformance: function() {
			performance.mark("requestCompleted");
			performance.measure(
				"metadataLoad",
				"requestSent",
				"requestCompleted"
			);
			var measures = performance.getEntriesByName("metadataLoad");
			this.getView().getModel('idLocalStoreModel').setProperty('/metadataLoad/current', {
				"duration": measures[measures.length - 1].duration
			}, true);
			var aHistory = this.getView().getModel('idLocalStoreModel').getProperty('/metadataLoad/history');
			aHistory.push({
				"duration": measures[measures.length - 1].duration,
				"datetime": new Date().toLocaleTimeString(),
				"url": oConfigModel.getProperty('/mainUrl')
			});
			localStorage.setItem('analytics', JSON.stringify(this.getView().getModel('idLocalStoreModel').getData()));
		}
	});
});