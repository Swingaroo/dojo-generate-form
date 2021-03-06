define([ "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dijit/_WidgetBase", "dijit/_Container","dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin", "dojo/text!./attribute_list.html",
		"./_GroupMixin"//
], function(declare, lang, array,_WidgetBase, _Container,_TemplatedMixin, _WidgetsInTemplateMixin,
		template,_GroupMixin) {
// module:
//		gform/AttributeListWidget
	

	return declare("gform.AttributeListWidget",[ _WidgetBase,_Container, _TemplatedMixin, _WidgetsInTemplateMixin ,_GroupMixin], {
		// summary:
		//		A group widget displaying a list of attributes.
		constructor: function(kwArgs) {
			lang.mixin(this,kwArgs);
			this.description=this.meta.description||"";
		},
		templateString : template,
		
		startup:function(){		
			this.inherited(arguments);
			array.forEach(this.getChildren(),function(child) {
				if (child.startup)
					child.startup();
			});
		},
		
		destroy: function() {
			array.forEach(this.getChildren(),function(child) {
				child.destroy();
			});
			this.inherited(arguments);
		}
	});

});
