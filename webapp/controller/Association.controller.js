sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"pinaki/sap/com/ApiClient/controller/BaseController",
	"pinaki/sap/com/ApiClient/util/Formatter"
], function(Controller, JSONModel, BaseController, oFormatter) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.ApiClient.controller.Association", {
		oFormatter: oFormatter,
		onInit: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("Association").attachMatched(this._onAssociationRouteMatched, this);
		},
		onPanelSearch : function(oEvent){
			var searchValue = oEvent.getSource().getValue();
			oEvent.getSource().getParent().getParent().getBinding('items').filter(new sap.ui.model.Filter('name','Contains',searchValue));
		},
		_onAssociationRouteMatched: function(oEvent) {
			var entitySetName = oEvent.getParameters().arguments.entitySet;
			var aRelatedEntitySet = this.getRelatedEntitySet(entitySetName);
			if (aRelatedEntitySet.length > 0) {
				this.filterRelatedEntitySet(aRelatedEntitySet);
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
		},
		filterRelatedEntitySet: function(aRelatedEntitySet) {
			var aRelatedEntitySet = aRelatedEntitySet;
			var oData = this.getView().getModel('idConfigModel').getData();
			var aEntitySets = [];
			var aEntitySet = oData.metadata.entitySet;
			aEntitySet.forEach(function(e) {
				aRelatedEntitySet.forEach(function(f) {
					if (f.entitySet === e.name) {
						var dataSet = e;
						dataSet.associationName = f.associationName;
						aEntitySets.push(dataSet);
					}
				});
			});
			this.getView().getModel('idConfigModel').setProperty('/currentAssociation', aEntitySets);
		}

	});
});