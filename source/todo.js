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

	// "ready" is always called by Enyo when everything is loaded. Think of it as domReady.
	ready: function () {
		// To initialize our database we have to give it a schema
		this.$.db.setSchemaFromURL('schemas/schema-1.json', {
    	onSuccess: enyo.bind(this, this.showTasks)
		});
		this.$.list.render();
	},

	// Gets the tasks from the database and renders them into the list 
	showTasks: function () {
		var app = this;
		this.$.db.query( 'SELECT * FROM tasks', { onSuccess: function ( data ) { app.tasks = data; app.$.list.render(); } } ); 
	},

	// Adds an item to the database, then refreshes the list
	addItem: function () {
		var item  = this.$.newItem.getValue();

		this.$.newItem.setValue(null);

		if( '' == item.trim() ) { return; }

		this.$.db.query( 'INSERT INTO tasks ( task ) VALUES ( ? )', { values: [ item ] } );  

		this.showTasks();
	},

	// This is called to set up a row in the list (build it). See line #19
	getListItem: function(inSender, inIndex) {
  	var r = this.tasks[inIndex];
  	if (r) {
      this.$.task.setContent( r.task );
      return true;
  	}
	},

	// Remove a task from the database, and splice it from the list
	removeTask: function( inSender, inIndex) {
		this.$.db.query( 'DELETE FROM tasks WHERE rowID = ?', { values: [ this.tasks[inIndex]['rowID'] ] } );
		this.tasks.splice(inIndex, 1);
		this.$.list.render();
	}

} );
