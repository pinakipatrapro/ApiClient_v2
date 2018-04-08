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
			if (!aRelatedEntitySet){
				this.getView().getModel('idConfigModel').setProperty('/currentAssociation', []);
			}else if (aRelatedEntitySet.length > 0) {
				this.filterRelatedEntitySet(aRelatedEntitySet);
			}
		},
		navToEntitySetData : function(oEvent){
			this.getOwnerComponent().getRouter().navTo("EntitySetData", {
				entitySet : oEvent.getSource().getProperty('title'),
				path:'default'
			});
		},
		filterRelatedEntitySet: function(aRelatedEntitySet) {
			var aRelatedEntitySet = aRelatedEntitySet;
			var oData = this.getView().getModel('idConfigModel').getData();
			var aEntitySets = [];
			var aEntitySet = oData.metadata.entitySet;
			aEntitySet.forEach(function(e) {
				aRelatedEntitySet.forEach(function(f) {
					if (this.getEntitysetFromAssociationRel(f.relationship) === e.name) {
						var dataSet = e;
						dataSet.associationName = f.associationName;
						aEntitySets.push(dataSet);
					}
				}.bind(this));
			}.bind(this));
			this.getView().getModel('idConfigModel').setProperty('/currentAssociation', aEntitySets);
		}

	});
});