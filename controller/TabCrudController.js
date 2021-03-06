define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/request",
	"dojo/promise/all",	
	"dojo/when",
	"gform/Editor",	
	"gform/createLayoutEditorFactory",	
	"./_CrudMixin",
  "dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./tabCrudController.html",
	"../schema/labelHelper",
	"dojo/dom-style",
	"dojo/dom-geometry",
	"./actions/Save",
	"./actions/Discard",
	"./actions/Delete",
	"./createActions",	
	"dojo/i18n!../nls/messages",
	"dijit/form/Button",
	"dijit/layout/StackContainer",
	"dijit/ProgressBar",
	"dijit/Dialog",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
], function(declare, lang, array, domClass, request, all, when, Editor, createEditorFactory, _CrudMixin, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, labelHelper, domStyle, domGeometry, Save, Discard, Delete, createActions, messages, Button	){
// module:
//		gform/controller/TabCrudController

	
return declare( [  _CrudMixin,_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
	// summary:
	//		This crudController should be usd as a direct child of a TabContainer. The title of the tab is the label of the entity.
		baseClass : "gformEditorController",
		templateString : template,
		// borderContainer: dijit/layout/BorderContainer
		//		direct child of this widget that supports layouting
		borderContainer: null,
		// container: dijit/layout/TabContainer
		//		the tabContainer this tabController is added to
		container:null,
		// actonContainer:
		//		the html element where the buttons go.
		actionContainer:null,
		// closing:
		//		the user has initiated the closing of the tab. If closing is true, then we don't intercept.
		closing: false,
		// actionClasses: array
		//		an array of ActionClasses used to populate the actionCOntainer with buttons.
		actionClasses:[Save, Discard, Delete],
		constructor: function(props) {
			lang.mixin(this, props);
			this.inherited(arguments);
		},
		_onValueChange: function(e) {
			this.set("title", this.editor.getLabel());
		},
		_onStateChange: function(e) {
			this.progressBar.hide();
			array.forEach(["create","edit","loading"], function(e) {
				domClass.toggle(this.domNode,e,this.state==e);
			},this);
		},
		showProgressBar: function(message) {
			this.progressBar.show();
			this.progressMessage.innerHTML=message; 
		},
		hideProgressBar: function() {
			this.progressBar.hide();
		},
		postCreate: function() {
			this.inherited(arguments);
			array.forEach(createActions(this.actionClasses, this), function(button) {
				this.actionContainer.containerNode.appendChild(button.domNode);
			}, this);
			this.watch("state", lang.hitch(this, "_onStateChange"));
			this.editor.set("editorFactory",this.editorFactory);
			this.editor.set("meta",{});
			this.editor.on("value-changed",lang.hitch(this,"_onValueChange"));
			this.on("editor-changed",lang.hitch(this,"_onEditorChange"));
			this._onStateChange();
		},
		_onEditorChange: function() {
			this.borderContainer.layout();
		},
		onClose: function() {
			// danger w. robinson: possibly endless recursion ahead
			if (this.closing) {
				// closing and discarding as confirmed in dialog
				return true;
			}
			this.closing=true;
			var me =this;
			var openDialog = this._checkState(
				function(close){
					if (close && openDialog)  {
						me.container.closeChild(me);
					} else {
						// closing was cancelled 
						me.closing = false;
					}
				}
			);
			return !openDialog;
		},		
		resize: function(dim) {
			this.dim=dim;
			if (this.borderContainer && this.borderContainer.resize) {
				if (dim) {
					this.borderContainer.resize({t:0,l:0,w:dim.w,h:dim.h});
				} else {
					this.borderContainer.resize();
				}
			}
		},

	});


});
