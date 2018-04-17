sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"pinaki/sap/com/ApiClient/controller/BaseController",
	"pinaki/sap/com/ApiClient/util/Formatter"
], function(Controller, JSONModel, BaseController, oFormatter) {
	"use strict";
	return BaseController.extend("pinaki.sap.com.ApiClient.controller.CreateEntitySetRecord", {
		oFormatter: oFormatter,
		onInit: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("CreateEntitySetRecord").attachMatched(this._onCreateEntitySetRecordRouteMatched, this);
		},
		_onCreateEntitySetRecordRouteMatched: function(oEvent) {
			var entitySetName = oEvent.getParameters().arguments.entitySet;
			var mode = oEvent.getParameters().arguments.mode;
			var path = oEvent.getParameters().arguments.path;
			var entityType = this.getEntityTypeFromEntitySet(entitySetName);
			this.getView().getModel('idConfigModel').setProperty('/currentEntitySetData/entityType', entityType);

			this.getView().byId('idCreateEntrySF').removeAllGroups();
			this.getView().byId('idCreateEntrySF').addGroup(this.createSmartFormGroupElements(entityType));

			if (mode === 'Create') {
				var newBinding = this.getView().getModel().createEntry('/' + entitySetName);
				this.getView().byId('idCreateEntrySF').setBindingContext(newBinding);
			} else if (mode === 'Edit') {
				var editBinding = sap.ui.getCore().byId(atob(path)).getSelectedItem().getBindingContext();
				this.getView().byId('idCreateEntrySF').setBindingContext(editBinding);
			} else if (mode === 'CopyCreate') {
				var editBinding = sap.ui.getCore().byId(atob(path)).getSelectedItem().getBindingContext();
				var newBinding = this.getView().getModel().createEntry('/' + entitySetName);
				this.getView().getModel().setProperty(newBinding.spath, editBinding.getObject());
				this.getView().byId('idCreateEntrySF').setBindingContext(newBinding);
			}

			sap.ushell.Container.setDirtyFlag(true);
		},
		createSmartFormGroupElements: function(entityType) {
			var aGroupElements = [];
			var aProperties = entityType.property;
			for (var i = 0; i < aProperties.length; i++) {
				var groupElement = new sap.ui.comp.smartform.GroupElement({
					elements: [
						new sap.ui.comp.smartfield.SmartField({
							value: '{' + aProperties[i].name + '}',
							placeholder: aProperties[i].name
						})
					]
				});
				aGroupElements.push(groupElement);
			}
			return new sap.ui.comp.smartform.Group({
				label: 'Create Data: ' + entityType.name,
				groupElements: aGroupElements
			});
		},
		onCreateSave: function() {

			if (this.getView().getModel().hasPendingChanges()) {
				this.getView().setBusy(true);
				this.getView().getModel().submitChanges({
					success: function(data) {
						this.getView().setBusy(false);
						var oForm = this.getView().byId('idCreateEntrySF');
						oForm.setEditable(false);
						oForm.setEditTogglable(true);
						sap.m.MessageToast.show('Data saved successfully');
					}.bind(this),
					error: function(e) {
						this.getView().setBusy(false);
						sap.m.MessageToast.show('Error Saving Data' + e.responseText);
					}
				});
			}
			sap.ushell.Container.setDirtyFlag(false);
			// this.getView().getModel().resetChanges();
		}
	});
});