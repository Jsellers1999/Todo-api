var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var _ = require("underscore");

app.use(bodyParser.json());

var todos = [];
// var todos = [{
// 	id:1,
// 	description: "Meet mom for lunch",
// 	completed: false
// },{
// id: 2,
// description: "Go to market",
// completed: false
// },
// {
// 	id: 3,
// 	descriptino: "Meet Megan for lunch",
// 	completed: true
// }];

// app.get("/", function(req,res){
// res.send("Todo API Root");
// });

// GET  /todos
app.get("/todos", function(req,res){
	res.json(todos);
});

//GET /todos/:id
app.get("/todos/:id", function(req,res){
	var todoId = parseInt(req.params.id,10);
	//var matchedTodo;
var matchedTodo = _.findWhere(todos, {id: todoId});

	// todos.forEach(function(todo){
	// 	if(todoId === todo.id){
	// 		matchedTodo = todo;
	// 	}
	// });
//res.send("Asking for todo with id of " + req.params.id);

if(matchedTodo){
	res.json(matchedTodo);
}else{

res.status(404).send();
}
});

// POST /todos
app.post("/todos", function(req,res){
var body = req.body;
if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
	return res.status(400).send();
}
body = _.pick(body, "description", "completed");
body.description = body.description.trim();
console.log("description: " + body.description);
body.id = todoNextId;
todoNextId ++;

todos.push(body);

res.json(body);
});

//DELETE /todos
app.delete("/todos/:id", function (req,res){
var todoId = parseInt(req.params.id,10);
	
var matchedTodo = _.findWhere(todos, {id: todoId});
if(matchedTodo){
	todos = _.without(todos,matchedTodo);
	res.json(matchedTodo);
}else{
	res.status(404).json({"error": "no todo found with that id"});
}
});



app.listen(PORT, function(){
console.log("Express listening on port " + PORT);
});




