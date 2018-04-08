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
			var contextPath = oEvent.getParameters().arguments.path;
			if(contextPath === 'default'){
				contextPath = '';
			}
			this.getView().getModel('idConfigModel').setProperty("/currentEntitySetData", {
				"name": entitySetName
			});
			this.buildSmartTable(entitySetName, this.fetchRelatedProperties(entitySetName),atob(contextPath));
			this.getView().getModel('idConfigModel').setProperty("/currentAssociation",this.getRelatedEntitySet(entitySetName));
		},
		fetchRelatedProperties: function(entitySetName) {
			var aEntityType = this.getView().getModel('idConfigModel').getData().metadata.entityType;
			var aEntitySet = this.getView().getModel('idConfigModel').getData().metadata.entitySet;
			var oProperty;
			var aProperty = [];
			for (var i = 0; i < aEntitySet.length; i++) {
				if (aEntitySet[i].name === entitySetName) {
					break;
				}
			}
			oProperty = aEntityType[i].	property;
			oProperty.forEach(function(e) {
				aProperty.push(e.name);
			});
			return aProperty;
		},
		buildSmartTable: function(entitySetName, aProperty,tableBindingPath) {
			if (this.getView().byId('idEntitySetDataSmartTable') !== undefined) {
				this.getView().byId('idEntitySetDataSmartTable').destroy();
			}
			var smartTable = new sap.ui.comp.smarttable.SmartTable(this.createId("idEntitySetDataSmartTable"), {
				entitySet: entitySetName,
				tableBindingPath : tableBindingPath,
				tableType: "ResponsiveTable",
				useTablePersonalisation: true,
				showRowCount: true,
				enableAutoBinding: true,
				backgroundDesign: "Transparent",
				width: "90%",
				demandPopin: true,
				initiallyVisibleFields: aProperty.join(','),
				items: [
					new sap.m.Table({
						growing : true,
						growingScrollToLoad : true,
						mode: "SingleSelectMaster",
						selectionChange: [this.onTableItemPress,this]
					})
				]
			});
			this.getView().byId('idEntitySetDataPage').addItem(smartTable);
		},
		onTableItemPress: function(oEvent) {
			
			var oMenu = new sap.m.Menu({
				title: 'Choose Action',
				items: [
					new sap.m.MenuItem({
						icon: 'sap-icon://edit',
						text: 'Edit'
					}),
					new sap.m.MenuItem({	
						icon: 'sap-icon://delete',
						text: 'Delete'
					}),
					new sap.m.MenuItem({
						icon: 'sap-icon://chain-link',
						text: 'Associations',
						items: {
							path : '/currentAssociation',
							template : new sap.m.MenuItem({
								text:   '{name}',
								press : [this.onAssociationPress,this]
							})
						}
					})
				]
			});
			oMenu.openBy(oEvent.getSource().getSelectedItem());
			oMenu.setModel(this.getView().getModel('idConfigModel'));
		},
		onAssociationPress : function(oEvent){
			var assocPath = oEvent.getSource().getBindingContext().getObject().name;
			var path = this.getView().byId('idEntitySetDataSmartTable').getTable().getSelectedItem().getBindingContext().sPath;
			path = path + '/' + assocPath;
			var entitySet = this.getEntitysetFromAssociationRel(oEvent.getSource().getBindingContext().getObject().relationship);
			this.getOwnerComponent().getRouter().navTo("EntitySetData", {
				entitySet :entitySet,
				path : btoa(path)
			});
		}
	});
});