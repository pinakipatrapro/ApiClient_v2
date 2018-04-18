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
			if (contextPath === 'default') {
				contextPath = '';
			}
			this.getView().getModel().resetChanges();
			this.getView().getModel('idConfigModel').setProperty("/currentEntitySetData", {
				"name": entitySetName,
				"properties" : this.getEntitySetExtensions(entitySetName)
			});
			this.buildSmartTable(entitySetName, this.fetchRelatedProperties(entitySetName), atob(contextPath));
			this.getView().getModel('idConfigModel').setProperty("/currentAssociation", this.getRelatedEntitySet(entitySetName));
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
			oProperty = aEntityType[i].property;
			oProperty.forEach(function(e) {
				aProperty.push(e.name);
			});
			return aProperty.splice(0,5);  //Return initial 5 fields only
		},
		buildSmartTable: function(entitySetName, aProperty, tableBindingPath) {
			if (this.getView().byId('idEntitySetDataSmartTable') !== undefined) {
				this.getView().byId('idEntitySetDataSmartTable').destroy();
			}
			var smartTable = new sap.ui.comp.smarttable.SmartTable(this.createId("idEntitySetDataSmartTable"), {
				entitySet: entitySetName,
				tableBindingPath: tableBindingPath,
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
						growing: true,
						growingScrollToLoad: true,
						mode: "SingleSelectMaster",
						selectionChange: [this.onTableItemPress, this]
					})
				],
				customToolbar: new sap.m.OverflowToolbar({
					content: [
						new sap.m.ToolbarSpacer(),
						new sap.m.Button({
							text: 'Measure Performance',
							icon: 'sap-icon://performance',
							press: [this.calculatePerformance, this]
						}),
						new sap.m.Button({
							icon: 'sap-icon://add',
							press: [this.createRecord, this]
						})
					]
				})
			});
			this.getView().byId('idEntitySetDataPage').addItem(smartTable);
		},
		onTableItemPress: function(oEvent) {

			var oMenu = new sap.m.Menu({
				title: 'Choose Action',
				// closed : function(e){
				// 	setTimeout(function(){this.getView().byId('idEntitySetDataSmartTable').getTable().removeSelections(true)}.bind(this),100);
				// }.bind(this),
				items: [
					new sap.m.MenuItem({
						icon: 'sap-icon://edit',
						text: 'View / Edit',
						press: [this.editRecord, this]
					}),
					// new sap.m.MenuItem({
					// 	icon: 'sap-icon://add',
					// 	text: 'Copy and Create',
					// 	press: [this.copyCreate, this]
					// }),
					new sap.m.MenuItem({
						icon: 'sap-icon://delete',
						text: 'Delete',
						press: [this.deleteRecordFromTable, this]
					}),
					new sap.m.MenuItem({
						icon: 'sap-icon://chain-link',
						text: 'Associations',
						items: {
							path: '/currentAssociation',
							template: new sap.m.MenuItem({
								text: '{name}',
								press: [this.onAssociationPress, this]
							})
						}
					})
				]
			});
			oMenu.openBy(oEvent.getSource().getSelectedItem());
			oMenu.setModel(this.getView().getModel('idConfigModel'));
		},
		onAssociationPress: function(oEvent) {
			var assocPath = oEvent.getSource().getBindingContext().getObject().name;
			var path = this.getView().byId('idEntitySetDataSmartTable').getTable().getSelectedItem().getBindingContext().sPath;
			path = path + '/' + assocPath;
			var entitySet = this.getEntitysetFromAssociationRel(oEvent.getSource().getBindingContext().getObject().relationship);
			this.getOwnerComponent().getRouter().navTo("EntitySetData", {
				entitySet: entitySet,
				path: btoa(path)
			});
		},
		calculatePerformance: function(oEvent) {
			var that  = this;
			var source = oEvent.getSource();
			var entitySet = source.getParent().getParent().getTableBindingPath();
			if (entitySet.length <= 0) {
				entitySet = '/' + source.getParent().getParent().getEntitySet();
			}
			var oConfigModel = this.getView().getModel('idConfigModel');
			source.setBusy(true);
			$.ajax({
				url: source.getModel().sServiceUrl + entitySet +
					'?sap-statistics=true&$format=json',
				type: 'GET',

				success: function(data, textStatus, jqXHR) {
					var resultSet = [];
					var headerData = jqXHR.getResponseHeader('sap-statistics');
					headerData = headerData.split(',');
					headerData.forEach(function(e) {
						resultSet.push({
							key: e.split('=')[0],
							value: e.split('=')[1]
						});
					});
					oConfigModel.setProperty('/entitySetPerformance', {
						entityPerformanceLoaded: "true",
						data: resultSet,
						count: data.d.results.length
					});
					var oPerformanceDialogFragment = sap.ui.xmlfragment("pinaki.sap.com.ApiClient.fragments.EntitySetPerformance");
					that.getView().addDependent(oPerformanceDialogFragment);
					oPerformanceDialogFragment.openBy(source);
					source.setBusy(false);
				},
				error: function() {

				}
			});
		},
		createRecord : function(){
			this.getOwnerComponent().getRouter().navTo("CreateEntitySetRecord", {
				entitySet : this.getView().getModel('idConfigModel').getData().currentEntitySetData.name,
				mode:'Create',
				path : 'New'
			});
		},
		editRecord : function(){
			this.getOwnerComponent().getRouter().navTo("CreateEntitySetRecord", {
				entitySet : this.getView().getModel('idConfigModel').getData().currentEntitySetData.name,
				mode:'Edit',
				path:btoa(this.getView().byId('idEntitySetDataSmartTable').getTable().getId())
			});
		},
		copyCreate : function(){
			this.getOwnerComponent().getRouter().navTo("CreateEntitySetRecord", {
				entitySet : this.getView().getModel('idConfigModel').getData().currentEntitySetData.name,
				mode:'CopyCreate',
				path:btoa(this.getView().byId('idEntitySetDataSmartTable').getTable().getId())
			});
		},
		deleteRecordFromTable : function(){
			var path = this.getView().byId('idEntitySetDataSmartTable').getTable().getSelectedItem().getBindingContext().sPath;
			this.getView().getModel().remove(path,{
				success : function(data){
					sap.m.MessageToast.show('Record Deleted Successfully');
				},error : function(e){
					sap.m.MessageToast.show('Error deleting record :'  +e.responseText);
				}
			});
		}
	});
});