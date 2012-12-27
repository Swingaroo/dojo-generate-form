define([ "dojo/_base/lang", "dojo/_base/array", "dojo/_base/declare",
		"dijit/_WidgetBase", "dijit/_Container", "dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin","dojo/Stateful","./PolymorphicMemberWidget","../Editor",
		"dojo/text!./repeated_embedded_attribute.html", "dijit/form/TextBox"//
], function(lang, array, declare, _WidgetBase, _Container, _TemplatedMixin,
		_WidgetsInTemplateMixin, Stateful,PolymorphicMemberWidget,Editor,template, TextBox) {

	return declare("app.RepeatedEmbeddedWidget", [ _WidgetBase, _Container,
			_TemplatedMixin, _WidgetsInTemplateMixin ], {
		templateString : template,
		postCreate : function() {
			var attribute=this.get("meta");
			var panelModel = new dojo.Stateful();
			panelModel.set("title", "");
			var me=this;
			var modelHandle = this.get("modelHandle");
			var editor;
			if (modelHandle.get(attribute.code)) {
				var model = modelHandle.get(attribute.code);
			}else{
				var model = new Stateful();
				modelHandle.set(attribute.code,model);
			}
			if (this.meta.validTypes) {
				editor = new PolymorphicMemberWidget({"modelHandle":this.modelHandle,"meta":this.meta,nullable:false,editorFactory:this.editorFactory});
			}else{
				editor = new Editor({"modelHandle":this.modelHandle,"meta":this.meta,editorFactory:this.editorFactory});
			}
			this.addChild(editor);
			this.set("target", panelModel);

			this.deleteButton.set("onClick", lang.hitch(this, "_delete"));
		},
		_delete : function(e) {
			var index = this.indexAtStartup;
			if (index >= 0) {
				this.parent.children.splice(index, 1);
			}
		}
	});

});
