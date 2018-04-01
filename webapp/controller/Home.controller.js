sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"pinaki/sap/com/ApiClient/controller/BaseController"
], function(Controller, JSONModel, BaseController) {
	"use strict";
	var oData = {
		// Crenentials- HCP Credentials
		"mainUrl": "htt" + "ps://hcpms-p1942051505trial.hanatrial.ondemand.com/SampleServices/ESPM.svc",
		"metaDataLoaded": false
	};
	var oConfigModel = new JSONModel(oData);
	return BaseController.extend("pinaki.sap.com.ApiClient.controller.Home", {
		onInit: function() {
			this.initializeLocalData(this);
		},
		onAfterRendering: function() {
			this.getView().setModel(oConfigModel, 'idConfigModel');
			this.loadJSFile("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js");
		},
		toggleMasterPanelVisibility: function(oEvent) {
			var app = oEvent.getSource().getParent().getParent().getParent().getParent().getParent();
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
				oConfigModel.setProperty("/metaDataLoaded", true);
				this.initAnalytics();
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
				"datetime": new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
				"url": oConfigModel.getProperty('/mainUrl')
			});
			localStorage.setItem('analytics', JSON.stringify(this.getView().getModel('idLocalStoreModel').getData()));
		},
		initAnalytics: function() {
			var aHistory = this.getView().getModel('idLocalStoreModel').getProperty('/metadataLoad/history');
			var aMeasures=[] , aDimension=[];
			for(var i=aHistory.length - 1;i>-1;i--){
				if(aHistory[i].url === oConfigModel.getProperty('/mainUrl')){
					aMeasures.push(aHistory[i].duration);
					aDimension.push(aHistory[i].datetime);
				}
				if( aDimension.length === 20){
					break;
				}
			}
			this.loadChart('line',aMeasures.reverse(),aDimension.reverse());
		},
		loadChart: function(type,aMeasures,aDimension) {
			var ctx = document.getElementById(this.getView().byId('metaLoadJSChart').getId()).getContext('2d');
			var chart = new Chart(ctx, {
				type: type,
				data: {
					labels: aDimension,
					datasets: [{
						label: "History of metadata load time(Miliseconds) for "+oConfigModel.getProperty('/mainUrl'),
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						data: aMeasures
					}]
				},
				options: {}
			});
		}
	});
});