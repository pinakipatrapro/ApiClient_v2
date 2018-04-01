sap.ui.define([
	"sap/ushell/renderers/fiori2/RendererExtensions",
	"pinaki/sap/com/ApiClient/controller/BaseController"
], function(Renderer, BaseController) {
	"use strict";
	try{
	var renderer = sap.ushell.Container.getRenderer("fiori2"); 
	var addHeaderButtons = function() {
		var oShareButton = new sap.ushell.ui.shell.ShellHeadItem({
			icon: "sap-icon://share-2",
			press: [BaseController.pressShareButton]
		});
		renderer.showHeaderEndItem([oShareButton.getId()], false, ["home", "app"]);
	};
	addHeaderButtons();
	}catch(e){
		// Lint
	}
});