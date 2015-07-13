if(Meteor.isClient){
// client code goes here

// Helpers
Template.todos.helpers({ 'todo': function(){
return Todos.find({}, {sort: {createdAt: -1}}); }
});


//Events
Template.addTodo.events({
// events go here

'submit form': function(event){ 
	event.preventDefault();
	// uso de jQuery para recuperar el valor del nombre, ver página 18
	var todoName = $('[name="todoName"]').val(); Todos.insert({
		name: todoName, completed: false, createdAt: new Date()
		});
	// reset del campo después del insert.
	$('[name="todoName"]').val('');
	}


});



}






if(Meteor.isServer){
// server code goes here
}

Todos = new Meteor.Collection('todos');