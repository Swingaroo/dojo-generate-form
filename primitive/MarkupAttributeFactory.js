define([ "dojo/_base/array", //
"dojo/_base/lang",//
"dojo/_base/declare",//
"dojox/mvc/at",//
"dijit/form/Textarea",//
"dijit/Editor",
"../schema/meta",//
"./mixinTextboxBindings",
"./dijitHelper"
], function(array, lang, declare, at, Textarea, 
dEditor,
meta, mixinTextboxBindings, dijitHelper) {

	return declare("gform.TextareaAttributeFactory", [], {
		handles : function(attribute) {
			return meta.isType(attribute, "string") && !attribute.array;
		},
		
		create : function(attribute, modelHandle) {
			var props = {};
			mixinTextboxBindings(modelHandle,props);
			dijitHelper.copyDijitProperties(attribute,props);
			//dijitHelper.copyProperty("cols", attribute, props);
			return  new dEditor(props);			
		},
		getSchema:function(){
			var schema={};
			schema["id"]="string";
			schema["description"]="This is a markup based on 'dijit.Editor'";
			schema["example"]=dojo.toJson({editor: 'markup',code:'name',type:'string'},true);
			var properties={};
			properties.type={type:"string",required:true,"enum":["string"]};
			properties.cols={type:"number",places:0,description:"the number of characters per line"}
			dijitHelper.addSchemaProperties(properties);
			dijitHelper.addSchemaProperty("required",properties);
			dijitHelper.addSchemaProperty("maxLength",properties);
			dijitHelper.addSchemaProperty("missingMessage",properties);
			dijitHelper.addSchemaProperty("promptMessage",properties);
			dijitHelper.addSchemaProperty("placeHolder",properties);

			schema.properties=properties;
			return schema;
		}
	});
});
