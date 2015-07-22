Router.configure({
		layoutTemplate: 'main'
});

if(Meteor.isClient){
// client code goes here

// Helpers

Template.todos.helpers({
		'todo': function(){
			var currentList = this._id;
			return Todos.find({ listId: currentList }, {sort: {createdAt: -1}})
		}
});


Template.todoItem.helpers({
		'checked': function(){
			var isCompleted = this.completed;
			if(isCompleted){
				return "checked";
			} else {
				return "";
			}
		}
});


Template.todosCount.helpers({
// helpers go here
	'totalTodos': function(){
		// code goes here
		return Todos.find().count();
	},
	'completedTodos': function(){
		// code goes here
		return Todos.find({ completed: true }).count();
	}

});

Template.lists.helpers({
		'list': function(){
			return Lists.find({}, {sort: {name: 1}});
		} 
});

//Events
Template.addTodo.events({
// events go here

'submit form': function(event){
	event.preventDefault();
	// uso de jQuery para recuperar el valor del nombre, ver página 18
	var todoName = $('[name="todoName"]').val();
	var currentList = this._id;
		Todos.insert({
				name: todoName,
				completed: false,
				createdAt: new Date(),
				listId: currentList
		});
		$('[name="todoName"]').val('');
	}
});

Template.todoItem.events({
    // events go here
    'click .delete-todo': function(event){ 
    	    event.preventDefault();
    	    var documentId = this._id;
    	    var confirm = window.confirm("Delete this task?"); if(confirm){
    	    	    Todos.remove({ _id: documentId });
    	    }
},

'keyup [name=todoItem]': function(event){
	if(event.which == 13 || event.which == 27){
		$(event.target).blur();
	} else {
		var documentId = this._id;
		var todoItem = $(event.target).val();
		Todos.update({ _id: documentId }, {$set: { name: todoItem }});
	}
},

'change [type=checkbox]': function(){
	var documentId = this._id;
	var isCompleted = this.completed;
	if(isCompleted){
		Todos.update({ _id: documentId }, {$set: { completed: false }});
		console.log("Task marked as incomplete.");
	} else {
		Todos.update({ _id: documentId }, {$set: { completed: true }});
		console.log("Task marked as complete.");
	}
}

});

Template.addList.events({
'submit form': function(event){
event.preventDefault();
var listName = $('[name=listName]').val(); Lists.insert({
          name: listName
      });
      $('[name=listName]').val('');
    }
});

}



if(Meteor.isServer){
// server code goes here
}

Todos = new Meteor.Collection('todos');

Lists = new Meteor.Collection('lists');

Router.route('/register');

Router.route('/login');

Router.route('/', {
    name: 'home',
    template: 'home'
});

Router.route('/list/:_id', {
		template: 'listPage',
		data: function(){
			// console.log(this.params._id);
			var currentList = this.params._id;
			return Lists.findOne({ _id: currentList });
		}
});
