sap.ui.define([], function() {
	"use strict";
	return {
		formatEntitySetDesc: function(value, entityType) {
			var aString = [];
			if (value) {
				value.forEach(function(e) {
					aString.push(e.name + " : " + e.value);
				});
			}
			aString.push("Entity Type : " + entityType);
			var string = aString.join(', ');
			return string;
		},
		formatFunctionImportDesc: function(value, entityType) {
			var aString = [];
			if (value) {
				value.forEach(function(e) {
					aString.push("Parameter Name : " + e.name + " | type " + e.type + " | mode " + e.mode);
				});
			}
			var string = aString.join(',  ');
			return string;
		},
		formatAssociationSetDesc: function(value, entityType, assocName) {
			var aString = [];
			if (value) {
				value.forEach(function(e) {
					aString.push(e.name + " : " + e.value);
				});
			}
			aString.splice(0, 0, "Association Name : " + assocName);
			var string = aString.join(',  ');
			return string;
		},
		formatCreateEntitySetData: function(value) {
			return '{'+value+'}';
		}
	};

});