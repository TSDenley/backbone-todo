(function($, window, document, undefined) {

var app = {}; // App namespace


/**
* Model
*/
app.Todo = Backbone.Model.extend({
	defaults: {
		title: {
			title: '',
			completed: false
		}
	}
});


/**
* Collection
*/
app.TodoList = Backbone.Collection.extend({
	model: app.Todo,
	// Using local storage to save persistent data
	localStorage: new Store('backbone-todo')
});

app.todoList = new app.TodoList();


/**
* Task view
*/
app.TodoView = Backbone.View.extend({

	tagName: 'li', // Wrap in a list item

	// Grab the template from `index.html`
	template: _.template($('#item-template').html()),

	// Render the template with the data from the Model
	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});


/**
* Main App view
*/
app.AppView = Backbone.View.extend({

	el: '#todoapp',

	initialize: function () {
		this.input = this.$('#new-todo'); // Text input to add new tasks

		app.todoList.on('add', this.addOne, this);
		app.todoList.on('reset', this.addAll, this);

		// Grab tasks from local storage
		app.todoList.fetch();
	},

	events: {
		'keypress #new-todo': 'createTodoOnEnter'
	},

	createTodoOnEnter: function (event) {
		// Only create new task when enter key is pressed (value must not be empty)
		if ( event.which !== 13 || !this.input.val().trim() ) { return; }

		app.todoList.create(this.newAttributes());
		this.input.val(''); // Clear text input
	},

	addOne: function (todo) {
		var view = new app.TodoView({
			model: todo
		});

		$('#todo-list').append(view.render().el);
	},

	addAll: function () {
		this.$('#todo-list').html(''); // Clear the todo list
		app.todoList.each(this.addOne, this);
	},

	newAttributes: function () {
		return {
			title: this.input.val().trim(),
			completed: false
		}
	}

});

app.appView = new app.AppView();

})(jQuery, window, document);
