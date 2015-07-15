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
}


});



}






if(Meteor.isServer){
// server code goes here
}

Todos = new Meteor.Collection('todos');