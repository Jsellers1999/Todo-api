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

// GET  /todos?completed=true&q=work
app.get("/todos", function(req,res){
		var queryParams = req.query;
		var filteredTodos = todos;

		if(queryParams.hasOwnProperty("completed") && queryParams.completed === "true"){
		filteredTodos = _.where(filteredTodos, {completed: true });
	}else if(queryParams.hasOwnProperty("completed") && queryParams.completed === "false"){
filteredTodos = _.where(filteredTodos, {completed: false });
	}

if(queryParams.hasOwnProperty("q") && queryParams.q.trim().length >0){
	filteredTodos= _.filter(filteredTodos, function(todo){
		if(todo.description.toUpperCase().indexOf(queryParams.q.toUpperCase()) > -1){
			return true;
		}else{
			return false;
		}

	});

	
}

	res.json(filteredTodos);
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

//PUT
app.put("/todos/:id", function(req,res){
	var todoId = parseInt(req.params.id,10);
	
var matchedTodo = _.findWhere(todos, {id: todoId});
if(!matchedTodo){
	return res.status(404).send();
}

var body = req.body;
body = _.pick(body, "description", "completed");
var validAttributes = {};


if(body.hasOwnProperty("completed") && _.isBoolean(body.completed)){

	validAttributes.completed = body.completed;
}else if(body.hasOwnProperty("completed")){
// Bad
return res.status(400).send();
}else{
	//Never provided attribute, no problem here
}

if(body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0){
	validAttributes.description = body.description;
}else if(body.hasOwnProperty("description")){
// Bad
return res.status(400).send();
}else{
	//Never provided attribute, no problem here
}


_.extend(matchedTodo,validAttributes);
res.json(matchedTodo);

});

app.listen(PORT, function(){
console.log("Express listening on port " + PORT);
});




