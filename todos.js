
Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'loading'
});

if(Meteor.isClient){
// client code goes here

// Meteor.subscribe('lists');

// Meteor.subscribe('todos');


Template.lists.onCreated(function () {
	this.subscribe('lists');
});



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
		var validator = $('.login').validate({
				submitHandler: function(event){
					var email = $('[name=email]').val();
					var password = $('[name=password]').val(); 
					Meteor.loginWithPassword(email, password, function(error){
							if(error){
								if(error.reason == "User not found"){
									validator.showErrors({
											email: "That email doesn't belong to a registered user."
									}); 
								}
								if(error.reason == "Incorrect password"){ validator.showErrors({
										password: "You entered an incorrect password."
									});
								} 
			
							} else {
								var currentRoute = Router.current().route.getName(); 
								if(currentRoute == "login"){
									Router.go("home");
								}
							} 
					});
				} 
		});
});





Template.login.onDestroyed(function(){
		console.log("The 'login' template was just destroyed.");
});


Template.register.onRendered(function(){
		var validator = $('.register').validate({
				submitHandler: function(event){
					var email = $('[name=email]').val();
					var password = $('[name=password]').val(); Accounts.createUser({
					email: email,
					password: password 
					}, function(error){
						if(error){ 
						
							
					if(error){
					if(error.reason == "Email already exists."){
						validator.showErrors({
						email: "That email already belongs to a registered user."
						});
					}
					}
							
							
						} else { 
						Router.go("home");
						} 
					});
				}
		});
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
	Meteor.call('createListItem', todoName, currentList, function(error){
			if(error){ 
				console.log(error.reason);
			} else { 
				$('[name="todoName"]').val('');
	} });	
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
			//var currentUser = Meteor.userId();
			//Lists.insert({
			//		name: listName,
			//		createdBy: currentUser
			//}, function(error, results){
			//	// console.log(results);
			//	Router.go('listPage', { _id: results });
			//});
			//$('[name=listName]').val('');
			// El createNewList termina con un return en el insert que 
			// devuelve el doc creado a este call y los datos de ese
			// doc se procesan desde el function acá, es un callback
			Meteor.call('createNewList', listName, function(error, results){
				if(error) { 
					console.log(error.reason);
				} else { 
					Router.go('listPage', { _id: results });
					$('[name=listName]').val('');
				}
			});
		}
});








Template.register.events({
		'submit form': function(event){
			event.preventDefault();
			/*
			Estos se copian la funci�n submitHandler del form respectivo (login o register)
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

function defaultName(currentUser) {
	var nextLetter = 'A'
	var nextName = 'List ' + nextLetter;
	while (Lists.findOne({ name: nextName, createdBy: currentUser })) {
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
        nextName = 'List ' + nextLetter;
    }
return nextName; 
}

Meteor.methods({
	'createNewList': function(listName){
        // code goes here
        var currentUser = Meteor.userId();
        check(listName, String);
        if(listName == ""){ 
        	listName = defaultName(currentUser);
        	}
        var data = {
        	name: listName,
        	createdBy: currentUser
        	}
        	if(!currentUser){
        		throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        		} else {
        	return Lists.insert(data);
        			}
        		},
        		
        		
        'createListItem': function(todoName, currentList){ 
        	check(todoName, String);
        	check(currentList, String);
        	var currentUser = Meteor.userId();
        	var data = {
        		name: todoName,
        		completed: false, 
        		createdAt: new Date(), 
        		createdBy: currentUser, 
        		listId: currentList
        		} 
        		if(!currentUser){
        		throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        		}
        return Todos.insert(data); 
        }
        		
        		
		
        
});

Meteor.publish('lists', function(){
		var currentUser = this.userId;
		return Lists.find({ createdBy: currentUser });
});

Meteor.publish('todos', function(currentList){
		var currentUser = this.userId;
		return Todos.find({ createdBy: currentUser, listId: currentList })
});

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
			var currentList = this.params._id;
			var currentUser = Meteor.userId();
			return Lists.findOne({ _id: currentList, createdBy: currentUser });
		},
		onBeforeAction: function(){
			var currentUser = Meteor.userId(); if(currentUser){
			this.next(); } else {
			this.render("login"); }
		},
		waitOn: function(){
			var currentList = this.params._id;
			return Meteor.subscribe('todos', currentList);
		}
});		
		
//Router.route('/', {
//    name: 'home',
//    template: 'home', 
//    subscriptions: function(){	    
//    	    var currentList = this.params._id;
//    	    return [ Meteor.subscribe('lists'), Meteor.subscribe('todos', currentList) ]	      	    
//   }
//});



//Router.route('/list/:_id', { 
//		name: 'listPage', 
//		template: 'listPage', 
//		data: function(){
//			// console.log(this.params._id);
//			var currentList = this.params._id;
//			var currentUser = Meteor.userId();
//			return Lists.findOne({ _id: currentList, createdBy: currentUser });
//		},
//		onRun: function(){
//			console.log("You triggered 'onRun' for 'listPage' route.");
//			this.next();
//		},
//		onRerun: function(){
//			console.log("You triggered 'onRerun' for 'listPage' route.");
//		},
//		onBeforeAction: function(){
//			var currentUser = Meteor.userId(); if(currentUser){
//			this.next(); 
//			} else {
//			this.render("login");
//		}
//		},
//		onAfterAction: function(){
//			console.log("You triggered 'onAfterAction' for 'listPage' route.");
//		},
//		onStop: function(){
//			console.log("You triggered 'onStop' for 'listPage' route.");
//		},
//		subscriptions: function(){
//			var currentList = this.params._id;
//			return Meteor.subscribe('todos', currentList)
//		}
//});









