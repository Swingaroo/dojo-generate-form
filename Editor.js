define([ "dojo/_base/array", "dojo/aspect", "dojo/_base/lang", "dojo/_base/declare",
		"dojox/mvc/_Container", "dijit/layout/_LayoutWidget","dojox/mvc/at", 
		"dojo/dom-construct", "dojo/Stateful", "./model/getPlainValue","./model/updateModelHandle","./model/hasChanged","./group/_GroupMixin", "./schema/labelHelper", "dojo/query", "dijit/registry" ], function(array, aspect,  lang,
		declare, Container, _LayoutWidget,at, domConstruct,
		 Stateful,getPlainValue,updateModelHandle,hasChanged,_GroupMixin, labelHelper, query, registry) {
		// module: 
		//		gform/Editor

	// at needs to be available globally.
	window.at = at;

	return declare("gform.Editor", [ Container,_GroupMixin ], {
		// summary:
		//		this widget generates a form based on a schema.
		// description:
		//		Editor needs a schema and a gform/EditorFactory that helps creating the widget tree appropriate for the schema.
		//		| require(["gform/createStandardEditorFactory"],
		//		|					function(createStandardEditorFactory){ 
		//		| var myGformSchema= 
		//		|  {attributes:[
		//		|    {code: "name", type: "string"}
		//		|   ]}
		//		| var editorFactory= createStandardEditorFactory();
		//		| var editor= new Editor(
		//		|				{meta: myGformSchema, 
		//		|				editorFactory: editorFactory()
		//		|				});
		//		| editor.placeAt("myContainer");
		//		| }
		//

		// editorFactory:
		// 		the editorFactory is responsible for translating the schema into a widget tree.
		editorFactory : null,

		// widget:
		//		this is the single child group widget.
		widget : null,

		// modelHandle:
		// 		the data that is bound to the form.
		modelHandle : null,

		// context:
		//		the context provides extra features for this editor instance
		context : null,

		shown:true,

		// meta:
		// 		the schema describing the form.
		meta : null,

		// isLayoutContainer:
		//		Editor supports layouts by propagating the resizing to its child.
		isLayoutContainer:true,
		
		// remember all field paths where an explicit error message was added via addError()
		_explicitErrorPaths : [],

		setMetaAndPlainValue: function(meta,value) {
		// summary:
		//		Change the schema and the value simultaneously.
			if (value==null) {
				value={};
			}
			this.meta=meta;
			this.modelHandle=updateModelHandle.createMeta();
			updateModelHandle.update(this.meta,value,this.modelHandle,this.editorFactory);
			this.modelHandle.oldValue=getPlainValue(this.modelHandle);
			// send change event beause oldValue changed and hasChanged will return something new
			this.emit("value-changed");
			
			this._explicitErrorPaths = [];
			
			this._buildContained();
		},
		setPlainValue: function(/*Object*/ plainValue) {
		// summary:
		//		update the modelHandle bound to the editor
		// plainValue:
		//		the plainValue.
			this.set("plainValue",plainValue);
		},
		getPlainValue: function() {
		// summary:
		//		gets the plainValue from the current modelHandle.
		// returns: Object
		//		the plainValue.
			return this.get("plainValue");
		},
		_setPlainValueAttr: function(value) {
			if (value==null) {
				value={};
			}
			if (!this.modelHandle) {
				this.modelHandle=updateModelHandle.createMeta();
			}
			if (!this.meta) {
				throw new Error("cannot set plainValue before setting meta");
			}
			updateModelHandle.update(this.meta,value,this.modelHandle,this.editorFactory);
			this.modelHandle.oldValue=getPlainValue(this.modelHandle);
			
			this._explicitErrorPaths = [];
			// send change event because oldValue changed and hasChanged will return something new
			this.emit("value-changed");
		},
		// summary:
		//		if an input in the form still has fcus then its current value may be different from the widget's value. We force a synchronization (and validation) here.
		syncPendingChanges: function() {
			var focused = query("input:focus", this.domNode);
			if (focused && focused.length==1) {
				var dijit = registry.getEnclosingWidget(focused[0]);
				dijit._onBlur();
			}
		},
		hasChanged: function() {
		// summary:
		// 		returns true if the data was changed.
		// returns: Boolean
			return hasChanged(this.modelHandle);
		},
		addError: function(path,message) {
		// summary:
		//		add an error message to an attribute defined by the path.
		// path: String
		//		path like "addresses.0.name"
		// message: String
		//		the error message 
			this.visit(path,function(model) {
				model.set("state","Error");
				model.set("message",message);
			});
			this._explicitErrorPaths.push(path);
		},
		resetErrors: function() {
		// summary:
		//		reset all field errors that were added via addError().
			array.forEach(this._explicitErrorPaths, function(path) {
				this.visit(path,function(model) {
					model.set("state","");
					model.set("message",null);
				});
			}, this);
			this._explicitErrorPaths = [];
		},
		updateValue: function(path,value) {
		// summary:
		//		update an attribute of the data.
		// path: String
		//		path like "addresses.0.name"
		// value: String
		//		the new value 
			this.visit(path,function(model) {
				// TODO this only works for primitive types. Otherwise we need to use updateModelHandle.
				model.set("value",value);
			});
		},
		visit: function(path,cb) {
		// summary:
		//		visit the data attribute defined by the path. The path elements are separated by dots -even the indices (e.g.: "person.friends.1.name"). 
		// path: String
		//		path like "addresses.0.name"
		// cb: function
		//		callback.  
			var pathElements=path.split(".");
			var model=this.get("modelHandle");
			//TODO we need to consult the editorFactory to do this properly. 
			array.forEach(pathElements,function(pathElement){
				if (!model) {
					throw new Error("cannot resolve path "+path);
				}
				model=model.value;
				if (!model) {
					throw new Error("cannot resolve path "+path);
				}
				model=model[pathElement];
			},this);
				if (!model) {
					throw new Error("cannot resolve path "+path);
				}
			cb(model);
		},
		reset: function() {
		// summary:
		//		reset the data to its original value.
			var oldValue=this.modelHandle.oldValue;
			this.set("plainValue",oldValue);
			this.inherited(arguments);
		},	
		resize: function(dim) {
			this.dim=dim;
			if (this.widget && this.widget.resize) {
				if (dim) {
					this.widget.resize({t:0,l:0,w:dim.w,h:dim.h});
				} else {
					this.widget.resize();
				}
			}
		},
		removeChangeIndicators: function() {
			var value = this.getPlainValue();
			this.setPlainValue(value);
		},
		postCreate : function() {
			this.inherited(arguments);
			this.containerNode=this.domNode;
			this.watch("meta", lang.hitch(this, "_buildContained"));
			if (this.meta && this.shown) {
				this._buildContained();
			}
		},
		getLabel: function() {
			if (this.meta) {
				return labelHelper.getTypeLabel(this.meta, this.modelHandle);
			} else {
				return "";
			}
		},
		show: function() {
			if (!this.shown) {
				this.shown=true;
				this._buildContained();
			}
		},
		startup : function() {
			this.inherited(arguments);
			this._started=true;
			if (this.widget) {
				this.widget.startup();
			}
			this.resize();
		},
		_getPlainValueAttr: function() {
			return getPlainValue(this.modelHandle);
		},
		_setMetaUrlAttr: function(url) {
			var me = this;
			require(["dojo/text!"+url],function(metaJson) {
				me.set("meta",dojo.fromJson(metaJson));
			});
		},
		_buildContained: function() {
			if (this.modelHandle == null) {
				this.set("plainValue",{});
			}
			try {
				if (this.widget) {
					this.widget.destroy();
				}
				if (this.get("meta") && this.editorFactory) {
					this.widget = this.editorFactory.create(this.get("meta"),
							this.modelHandle, this.ctx);
					if (typeof this.get("doLayout")!="undefined") {
						this.widget.set("doLayout",this.get("doLayout"));
						var widget = this.widget;	
						if (widget.resize) {
							aspect.after(this.widget,"startup",function() {
							//	widget.resize();
							});
						}
					}
					if (this.widget && this.domNode) {
						domConstruct.place(this.widget.domNode, this.domNode);
						if (this._started) {
							this.widget.startup();
						}
					}
					if (this._started && this.dim) {
						this.resize(this.dim);
					}else if (this._started){
						this.resize();
					}
				}
			} catch (e) {
				console.log("cannot create editor. " + e.message+" "+ e.stack);
				 throw e;
			}
		},
		_destroyBody : function() {
			if (this.widget != null) {
				this.widget.destroy();
				this.widget = null;
			}
		}


	});
	
});
