define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/aspect",
	"dojo/json",
	"../util/restHelper",
	"../createLayoutEditorFactory",	
	"../schema/labelHelper",
	"dijit/registry",
	"../controller/TabCrudController",	
	"dojo/store/JsonRest",
	"gform/util/restHelper",
	"dijit/form/Button",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"dijit/ProgressBar",
	"dijit/Dialog",
], function(declare, lang, array, aspect, json, restHelper, createLayoutEditorFactory, labelHelper, registry, TabCrudController, Store){
//  module:
//		gform/opener/SingleEditorTabOpener

	
return declare([], {
	// summary:
	//		Opener that opens the new editor in a tab.

		// tabContainer:
		//		the tabContainer
		tabContainer:null,

		url2widget: {},

		controllerConfig:null,

		// editorFactory:
		//		the default editorFactory. Can be overriden by th eoptions passes to open/create methods.
		editorFactory:null,
	
		//  schemaRegistry:
		//		The schemaRegistry used to access the resources handled by the editor.
		ctx:null,
		// confirmDialog:
		//		the confirmDialog is used to display a message if the user aborts an editing session by closing the tab.
		confirmDialog:null,
		constructor: function(kwArgs) {
			lang.mixin(this, kwArgs);
		},
		createSingle: function(options) {
			// summary:
			//		open the dialog to create a new resource.
			//  options:
			//		must provide the schemaUrl to load the gform schema from. 
			//		Must also provide the url to the resource's collection. 
			//		A callback which gets passed the new id may also be specified.  Options may provide EditorFactory.
			var props ={};
			var url = options.url;
			var store = this.ctx.getStore(url, {target: url});
			props.closable=true;
			props.editorFactory=this.editorFactory || options.editorFactory || createLayoutEditorFactory();
			props.store=store;
			props.container= this.tabContainer;	
			props.dialog= this.confirmDialog;	
			//props.ctx = this.ctx;
			var controller = new TabCrudController(props);
			lang.mixin(controller, this.controllerConfig); 
			controller.setCtx(this.ctx);
			this.tabContainer.addChild(controller);
			this.tabContainer.selectChild(controller);
			var me = this;
			aspect.after(controller, "onCreated", function(result, args) {
				var singleUrl = restHelper.compose(url, args[0]);
				me.url2widget[singleUrl] = controller;
			});
			controller.createNew(options.schemaUrl, options.callback);
		},
		openSingle: function(options) {
			// summary:
			//		open the dialog to edit an existing resource.
			//  options:
			//		must provide the schemaUrl to load the gform schema from. 
			//		Must also provide the url to the resource edited. Options may provide EditorFactory.
			var wid ="tab_editor_"+options.url;
			var controller =registry.byId(wid);
			if (controller!=null) {
				this.tabContainer.selectChild(controller);
			} else if (this.url2widget[options.url]!=null) {
				this.tabContainer.selectChild(this.url2widget[options.url]);
			} else {
				var props ={};
				var restUrl = restHelper.decompose(options.url);
				var url = restUrl.url;
				var id = restUrl.id
				var store = this.ctx.getStore(url, {target: url, idProperty: options.idProperty || "id"});
				props.id=wid;
				props.closable=true;
				props.editorFactory=this.editorFactory || options.editorFactory || createLayoutEditorFactory();
				props.store=store;
				props.container= this.tabContainer;	
				props.dialog= this.confirmDialog;	
				//props.ctx = this.ctx;
				var controller = new TabCrudController(props);
				lang.mixin(controller, this.controllerConfig); 
				controller.setCtx(this.ctx);
				this.tabContainer.addChild(controller);
				this.tabContainer.selectChild(controller);
				controller.edit(id, options.schemaUrl);
			}
		}
	});


});
