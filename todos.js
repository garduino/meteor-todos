Router.configure({
		layoutTemplate: 'main'
});

if(Meteor.isClient){
// client code goes here

	$.validator.setDefaults({
			rules: {
				email: {
					required: true,
					email: true
				},
				password: {
					required: true,
					minlength: 6
				}
			},
			messages: {
				email: {
					required: "You must enter an email address.",
					email: "You've entered an invalid email address."
				},
				password: {
					required: "You must enter a password.",
					minlength: "Your password must be at least {0} characters."
				}
			}
	});

Template.login.onCreated(function(){
		console.log("The 'login' template was just created.");
});

Template.login.onRendered(function(){
		$('.login').validate();
});


Template.login.onDestroyed(function(){
		console.log("The 'login' template was just destroyed.");
});


// Helpers

Template.todos.helpers({
		'todo': function(){
			var currentList = this._id;
			var currentUser = Meteor.userId();
			return Todos.find({ listId: currentList, createdBy: currentUser }, {sort: {createdAt: -1}})
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
			var currentList = this._id;
			return Todos.find({ listId: currentList }).count();
		},
		'completedTodos': function(){
			var currentList = this._id;
			return Todos.find({ listId: currentList, completed: true }).count();
		}
});

Template.lists.helpers({
		'list': function(){
			var currentUser = Meteor.userId();
			return Lists.find({ createdBy: currentUser }, {sort: {name: 1}})
		} 
});

//Events
Template.addTodo.events({
// events go here

'submit form': function(event){
	event.preventDefault();
	// uso de jQuery para recuperar el valor del nombre, ver página 18
	var todoName = $('[name="todoName"]').val();
	var currentUser = Meteor.userId();
	var currentList = this._id;
		Todos.insert({
				name: todoName,
				completed: false,
				createdAt: new Date(),
				createdBy: currentUser,
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
			var listName = $('[name=listName]').val();
			var currentUser = Meteor.userId();
			Lists.insert({
					name: listName,
					createdBy: currentUser
			}, function(error, results){
				// console.log(results);
				Router.go('listPage', { _id: results });
			});
			$('[name=listName]').val('');
		}
});

Template.register.events({
		'submit form': function(event){
			event.preventDefault();
			/*
			var email = $('[name=email]').val();
			var password = $('[name=password]').val();

			Accounts.createUser({
				email: email,
				password: password }, function(error){
				if(error){
				console.log(error.reason); // Output error if registration fails
				} else {
				Router.go("home"); // Redirect user if registration succeeds
				} 
				});
				*/
			}	
				});

Template.register.onRendered(function(){
		$('.register').validate();
});
			
Template.navigation.events({
		'click .logout': function(event){
			event.preventDefault();
			Meteor.logout();
			Router.go('login');
		}
});

Template.login.events({
		'submit form': function(event){
			event.preventDefault();
			/*
			var email = $('[name=email]').val();
			var password = $('[name=password]').val();
			Meteor.loginWithPassword(email, password, function(error){
					if(error){
						console.log(error.reason);
					} else {
						var currentRoute = Router.current().route.getName();
						if(currentRoute == "login"){
							Router.go("home");
						}
					}
			});
			*/
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
		name: 'listPage', 
		template: 'listPage', 
		data: function(){
			// console.log(this.params._id);
			var currentList = this.params._id;
			var currentUser = Meteor.userId();
			return Lists.findOne({ _id: currentList, createdBy: currentUser });
		},
		onRun: function(){
			console.log("You triggered 'onRun' for 'listPage' route.");
			this.next();
		},
		onRerun: function(){
			console.log("You triggered 'onRerun' for 'listPage' route.");
		},
		onBeforeAction: function(){
			var currentUser = Meteor.userId(); if(currentUser){
			this.next(); 
			} else {
			this.render("login");
		}
		},
		onAfterAction: function(){
			console.log("You triggered 'onAfterAction' for 'listPage' route.");
		},
		onStop: function(){
			console.log("You triggered 'onStop' for 'listPage' route.");
		}
});









