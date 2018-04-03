sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"pinaki/sap/com/ApiClient/controller/BaseController",
	"pinaki/sap/com/ApiClient/util/Formatter"
], function(Controller, JSONModel, BaseController, oFormatter) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.ApiClient.controller.EntitySetData", {
		oFormatter: oFormatter,
		onInit: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("EntitySetData").attachMatched(this._onAssociationRouteMatched, this);
		},
		_onAssociationRouteMatched: function(oEvent) {
			var entitySetName = oEvent.getParameters().arguments.entitySet;
			this.getView().getModel('idConfigModel').setProperty("/currentEntitySetData", {
				"name": entitySetName
			});
			this.buildSmartTable(entitySetName,this.fetchRelatedProperties(entitySetName));
		},
		fetchRelatedProperties: function(entitySetName) {
			var aEntityType = this.getView().getModel('idConfigModel').getData().metadata.entityType;
			var oProperty;
			var aProperty = [];
			aEntityType.forEach(function(e) {
				if (e.name === entitySetName || e.name === (entitySetName + "Type")) {
					oProperty = e.property;
				}
			});
			oProperty.forEach(function(e) {
				aProperty.push(e.name);
			});
			return aProperty;
		},
		buildSmartTable: function(entitySetName,aProperty) {
			if(this.getView().byId('idEntitySetDataSmartTable') !== undefined){
				this.getView().byId('idEntitySetDataSmartTable').destroy();
			}
			var smartTable =  new sap.ui.comp.smarttable.SmartTable(this.createId("idEntitySetDataSmartTable"),{
				entitySet: entitySetName,
				tableType: "ResponsiveTable",
				useTablePersonalisation: true,
				showRowCount : true,
				enableAutoBinding : true,
				backgroundDesign : "Transparent",
				demandPopin : true,
				initiallyVisibleFields : aProperty.join(',')
			});
			this.getView().byId('idEntitySetDataPage').addContent(smartTable);
		}
	});
});