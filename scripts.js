(function($, window, document, undefined) {

'use strict';

var app = {}; // App namespace


/**
* Models
*/
app.Todo = Backbone.Model.extend({
	defaults: {
		title: {
			title: '',
			completed: false
		}
	},

	toggle: function () {
		this.save({
			completed: !this.get('completed')
		});
	}
});


/**
* Collections
*/
app.TodoList = Backbone.Collection.extend({
	model: app.Todo,
	// Using local storage to save persistent data
	localStorage: new Store('backbone-todo')
});

app.todoList = new app.TodoList();


/**
* Views
*/

// Task view
app.TodoView = Backbone.View.extend({

	tagName: 'li',

	template: _.template($('#item-template').html()),

	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		this.input = this.$('.edit');
		return this;
	},

	initialize: function () {
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	events: {
		'dblclick label': 'edit',
		'keypress .edit': 'updateOnEnter',
		'blur .edit': 'close',
		'change .toggle': 'toggleCompleted',
		'click .destroy': 'destroy'
	},

	edit: function () {
		this.$el.addClass('editing');
		this.input.focus();
	},

	close: function () {
		var value = this.input.val().trim();

		if ( value ) {
			this.model.save({title: value});
		}

		this.$el.removeClass('editing');
	},

	updateOnEnter: function (event) {
		if ( event.which === 13 ) {
			this.close();
		}
	},

	toggleCompleted: function () {
		this.$el.toggleClass('complete')
		this.model.toggle();
	},

	destroy: function () {
		this.model.destroy();
	}

});


// Main App view
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
