define([ "dojo/_base/array", //
"dojo/_base/lang",//
"dojo/_base/declare",//
"dojo/aspect",//
"dojox/form/CheckedMultiSelect",//
"../model/updateModelHandle",//
"./createOptions",//
"./bindWidget",//
"../model/getPlainValue",//
"dojox/mvc/StatefulArray"
], function(array, lang, declare, aspect, CheckedMultiSelect, updateModelHandle,   createOptions,bindWidget,getPlainValue,StatefulArray) {

	return declare("gform.CheckedMultiSelectAttributeFactory", [  ], {
 		
		handles : function(attribute) {
			return attribute != null && attribute.array && !attribute.validTypes && attribute.values;
		},
 		
 		create: function(meta, modelHandle) {
			var options= createOptions(meta,false);

			var clonedValues = [];
			array.forEach(modelHandle.value, function(value) {
				clonedValues.push(value);
			});
			
			var select = new CheckedMultiSelect({
				"value" : clonedValues,
				options : options,
				multiple : true
			});
			
			bindWidget(modelHandle,select,"value");
			
			return select;
		},
		
		updateModelHandle: function(meta,plainValue,modelHandle) {
			if (!plainValue) {
				plainValue=[];
			}
			modelHandle.set("value",plainValue);
			modelHandle.set("oldValue",plainValue);
		}
	});
});
