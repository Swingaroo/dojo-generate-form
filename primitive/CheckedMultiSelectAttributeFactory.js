define([ "dojo/_base/array", //
"dojo/_base/lang",//
"dojo/_base/declare",//
"dojox/mvc/at",//
"dojox/form/CheckedMultiSelect",//
"../getStateful",//
"../meta",//
"../getPlainValue",//
"dojox/mvc/StatefulArray"
], function(array, lang, declare, at, CheckedMultiSelect, getStateful, meta,getPlainValue,StatefulArray) {

	return declare("gform.CheckedMultiSelectAttributeFactory", [], {

		handles : function(attribute) {
			return attribute != null && attribute.array && !attribute.validTypes && attribute.values;
		},
		
		create : function(attribute, modelHandle) {
			var options = [];
			for ( var key in attribute.values) {
				var value = attribute.values[key];
				options.push({
					label : value,
					value : value
				});
			}
			var initValue = getPlainValue(modelHandle.value);

			var valueBinding = at(modelHandle, "value").direction(at.to);

			var select = new CheckedMultiSelect({
				"value" : valueBinding		,
				options : options,
				style : "width: 200px;",
				multiple : true
			});
			
			select.set("value", initValue);
			
			return select;
		}
	});
});
