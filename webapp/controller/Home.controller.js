sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"pinaki/sap/com/ApiClient/controller/BaseController",
	"pinaki/sap/com/ApiClient/util/Formatter"
], function(Controller, JSONModel, BaseController,oFormatter) {
	"use strict";
	var oData = {
		// Crenentials- HCP Credentials
		// "mainUrl": "htt"+"ps://services.odata.org/V2/OData/OData.svc/",	
		// https://ldcisd4.wdf.sap.corp:44302/sap/opu/odata/iwfnd/CATALOGSERVICE/
		"mainUrl": "htt"+"ps://ldciz5u.wdf.sap.corp:44321/sap/opu/odata/deal/search_srv/?sap-client=200",
		// "mainUrl": "htt" + "ps://hcpms-p1942051505trial.hanatrial.ondemand.com/SampleServices/ESPM.svc",
		"metaDataLoaded": false
	};
	var oConfigModel = new JSONModel(oData);
	return BaseController.extend("pinaki.sap.com.ApiClient.controller.Home", {
		oFormatter : oFormatter,
		onInit: function() {
			this.initializeLocalData(this);
		},
		onAfterRendering: function() {
			this.getView().getParent().getParent().setModel(oConfigModel, 'idConfigModel');
			this.loadJSFile("htt"+"ps://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js");
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
			oConfigModel.setProperty("/metaDataLoaded", false);
			var url = oConfigModel.getProperty('/mainUrl');
			performance.mark("requestSent");
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, {
				headers: {
					"sap-stastics": "true"
				}
			});
			oModel.attachMetadataLoaded(this.serviceInitialized(oModel));
			this.getView().getParent().getParent().setModel(oModel);
		},
		serviceInitialized: function(oMainModel) {
			oMainModel.attachMetadataLoaded(function() {
				this.metaLoadPerformance();
				oConfigModel.setProperty("/metaDataLoaded", true);
				this.initAnalytics();
				oMainModel.getServiceMetadata().dataServices.schema[0].entityContainer[0].entityType = oMainModel.getServiceMetadata().dataServices.schema[0].entityType;
				oConfigModel.setData({
					metadata: oMainModel.getServiceMetadata().dataServices.schema[0].entityContainer[0]
				}, true);
			}.bind(this));
		},
		onPanelSearch : function(oEvent){
			var searchValue = oEvent.getSource().getValue();
			oEvent.getSource().getParent().getParent().getBinding('items').filter(new sap.ui.model.Filter('name','Contains',searchValue));
		},
		navToAsociationSet : function(oEvent){
			this.getOwnerComponent().getRouter().navTo("Association", {
				entitySet :oEvent.getSource().getParent().getParent().getProperty('title')
			});
		},
		navToEntitySetData : function(oEvent){
			this.getOwnerComponent().getRouter().navTo("EntitySetData", {
				entitySet :oEvent.getSource().getProperty('title')
			});
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