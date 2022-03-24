var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");


var mongojs = require('mongojs');
var  ObjectId = mongojs.ObjectId;
var db = mongojs('clientesapp', ['users']);

var app = express();



/*
// middleware
var logger = function(req, res, next){
console.log("Loggin...");
next();
}

app.use(logger);
*/



//Middleware
app.use(express.static(path.join(__dirname, 'public')));


// View Engine
app.set('views engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware para el parseo del body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}) ); 



//declaración y definición de variables globales 
app.use(function (req, res, next) {
	res.locals.errors = null;
	next();
 });

app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root=namespace.shift,
		formParam = root;
	
		while(namespace.length){
			formParam += '[' + namespace.shift() +']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value,
		};
	}
}));



var users = [ 

	{
		id: 1,
		first_name: 'John',
		last_name: 'Doe',
		email: 'johndoe@gmail.com',
	},
	{
		id: 2,
		first_name: 'Bob',
		last_name: 'Smith',
		email: 'bobsmith@gmail.com',

	},
	{
		id: 3,
		first_name: 'Jill',
		last_name: 'Jackson',
		email: 'jjackson@gmail.com',
	}
];


//enrutamiento
app.get("/", function(req, res){
	//res.send("Kaixo mundua")
	 db.users.find( function(err, docs){
         if (err){
             console.log(err);
         } else {
            //console.log(docs)

	res.render('index.ejs', {
	title:'costumers',
	//users: users,
	users: docs,
	})
	}})});


app.post('/users/add', function(req, res){
	// (*1)  console.log("recibido");
	//  (*2) console.log(req.body.first_name)
	
        // (*4)
        req.checkBody("first_name", "El nombre es obligatorio").notEmpty();
        req.checkBody("last_name", "El apellido es obligatorio").notEmpty();
        req.checkBody("email", "El email es obligatorio").notEmpty();

        var errors = req.validationErrors();
        if (errors){

		res.render('index.ejs', {
			title:'costumers',
			users: users,
			errors: errors,
		});
	 }else

	// (*3)
 	var newUser = {
		"first_name" : req.body.first_name,
		"last_name" : req.body.last_name,
		"email" : req.body.email,
	};
	console.log(newUser);
	db.users.insert(newUser, function( err, resp ){
		if (err) {
			console.log(err)
		}else {
			db.users.insert( newUser)
		}
		res.redirect('/');	});
//	console.log(newUser)
	});


app.delete('/users/delete/:id', function(req, res){
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if (err){
			console.log(err);
		}else{
			res.redirect( 303, '/');
		}
	});
});

app.get('/users/:id', function(req, res){
	db.users.findOne({_id: ObjectId(req.params.id)}, function(err, result){
		if (err){
			console.log(err);
		}else{
			res.json(result);
		}
	});
});


app.put('/users/update/:id', function(req, res){
	db.users.findAndModify(
	{
			query: {_id: ObjectId(req.params.id)},
			update: {$set: {first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email}},
			new: true
		},
		function(err, result){
			if (err){
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

app.listen(3005, function(){ //empiezo a quedarme sin puertos para lanzar cosas en el servidor
console.log("Servidor lanzado en el puerto 3000");
});
