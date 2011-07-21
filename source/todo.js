enyo.kind( { 
	name: "Velvetcache.Todo",
	kind: enyo.VFlexBox,
	create: function() {
	  this.inherited(arguments);
		this.tasks = [];
	},
	components: 
	[
		{ kind: "PageHeader", content: "Todo List" },
		{ kind: "RowGroup", caption: "Add Item", components:
			[
				{ kind: "Input", name: "newItem", hint: "Clean garage" },
				{ kind: "Button", caption: "Add", onclick: "addItem" }
			]
		},
		{ kind: "Scroller", flex: 1, components:
			[
      	{ name: "list", kind: "VirtualRepeater", onSetupRow: "getListItem",
          components: [
            { kind: "SwipeableItem", onConfirm: "removeTask", layoutKind: "VFlexLayout", components:
							[
                 { name: "task" }
             	]
						}
          ]
      	}
  		]
		},
		{ name: "db", kind: "onecrayon.Database", database: 'ext:todo_list', version: '', debug: false }
	],

	ready: function () {
		this.$.db.setSchemaFromURL('schemas/schema-1.json', {
    	onSuccess: enyo.bind(this, this.showTasks)
		});
		this.$.list.render();
	},

	showTasks: function () {
		var app = this;
		this.$.db.query( 'SELECT * FROM tasks', { onSuccess: function ( data ) { app.tasks = data; app.$.list.render(); } } ); 
	},

	addItem: function () {
		var item  = this.$.newItem.getValue();

		this.$.newItem.setValue(null);

		if( '' == item.trim() ) { return; }

		this.$.db.query( 'INSERT INTO tasks ( task ) VALUES ( ? )', { values: [ item ] } );  

		this.showTasks();
	},

	getListItem: function(inSender, inIndex) {
  	var r = this.tasks[inIndex];
  	if (r) {
      this.$.task.setContent( r.task );
      return true;
  	}
	},

	removeTask: function( inSender, inIndex) {
		this.$.db.query( 'DELETE FROM tasks WHERE rowID = ?', { values: [ this.tasks[inIndex]['rowID'] ] } );
		this.tasks.splice(inIndex, 1);
		this.$.list.render();
	}

} );
