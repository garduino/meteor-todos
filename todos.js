if(Meteor.isClient){
// client code goes here

Template.todos.helpers({ 'todo': function(){
return Todos.find({}, {sort: {createdAt: -1}}); }
});

}
if(Meteor.isServer){
// server code goes here
}

Todos = new Meteor.Collection('todos');