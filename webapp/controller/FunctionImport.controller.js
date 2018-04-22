sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"pinaki/sap/com/ApiClient/controller/BaseController",
	"pinaki/sap/com/ApiClient/util/Formatter"
], function(Controller, JSONModel, BaseController, oFormatter) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.ApiClient.controller.FunctionImport", {
		oFormatter: oFormatter,
		onInit: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("FunctionImport").attachMatched(this._onFunctionImportRouteMatched, this);
		},
		_onFunctionImportRouteMatched: function(oEvent) {
			var functionImportName = oEvent.getParameters().arguments.functionImportName;
			var oConfigModel = this.getView().getModel('idConfigModel');

			var aFunctionImport = oConfigModel.getData().metadata.functionImport;
			aFunctionImport.forEach(function(e) {
				if (e.name === functionImportName) {
					oConfigModel.setProperty('/currentFunctionImport', e);
				}
			});
			var preId = this.getView().byId('idFIJsonResponse').getId();
			$('#' + preId).html('');
		},
		onExecute: function() {
			var oList = this.getView().byId('idFuncImpParamerters');
			var aItems = oList.getItems();
			var data = {};
			aItems.forEach(function(e) {
				data[e.getLabel()] = e.getContent()[0].getValue();
			});
			var oConfigModel = this.getView().getModel('idConfigModel');
			var functionImportName = oConfigModel.getData().currentFunctionImport.name;
			this.getView().setBusy(true);
			this.getView().getModel().callFunction('/' + functionImportName, {
				method: oConfigModel.getData().currentFunctionImport.httpMethod,
				urlParameters: data,
				success: function(oData, response) {
					this.handleResponse(response,"Success");
				}.bind(this),
				error: function(oError) {
					this.handleResponse(oError,"Error");
				}.bind(this)
			});
		},
		handleResponse: function(response, status) {
			this.getView().setBusy(false);
			var preId = this.getView().byId('idFIJsonResponse').getId();
			$('#' + preId).html(this.prettyPrint(response));
			if(status === 'Success'){
				$('#' + preId).css("background-color", "#1bff0029");
			}else{
				$('#' + preId).css("background-color", "#ff000029");
			}
		},
		replacer: function(match, pIndent, pKey, pVal, pEnd) {
			var key = '<span class=json-key>';
			var val = '<span class=json-value>';
			var str = '<span class=json-string>';
			var r = pIndent || '';
			if (pKey)
				r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
			if (pVal)
				r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
			return r + (pEnd || '');
		},
		prettyPrint: function(obj) {
			var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
			return JSON.stringify(obj, null, 3)
				.replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
				.replace(/</g, '&lt;').replace(/>/g, '&gt;')
				.replace(jsonLine, this.replacer);
		}
	});
});