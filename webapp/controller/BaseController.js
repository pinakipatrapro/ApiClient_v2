sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("pinaki.sap.com.ApiClient.controller.BaseController", {
		
		callFuncImp : function(oModel,method,path,urlParameters){
			return new Promise(function(resolve,reject){
				oModel.callFunction(path, {
							method: method,
							urlParameters: urlParameters,
							success: function(oData, response) {
								resolve(oData,response);
							},
							error: function(oError) {
								reject(oError);
							}
						});
			}.bind(this));
		}
	});
});
