var Model = require('./models/models.js');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = "mongodb://localhost:27017/SOCNET";

mongoose.connect(db, (err, response)=> {
    if (err){
        console.log('Failed to connect to ' + db);
    }
    else {
        console.log('Connected to ' + db);
    }
});

var router = express.Router();
app.use('/', router);

//GET
router.get('/api/users', (request, response) => {
    Model.find({}, (err, users) => {
        if(err) {
            response.status(404).send(err);
        }
        else {
            response.status(200).send(users);
        }
    })
});

//DELETE
router.delete('/api/users/:id', (request, response) => {
    console.log(request.params.body);
    var id = request.params.id;
    Model.remove({_id: id}, (err, res) => {
        if(err) {
            response.status(500).send(err);
        }
        else {
            response.status(200).send({message: 'Deleting user was successful'});
        }
    })
})

//PUT
router.put('/api/users', (request, response) => {
    Model.findById(request.body._id, (err, user) => {
        if (err) {
            response.status(404).send(err);
        }
        else {
            user.update(response.body, (err, success) => {
                if (err) {
                    response.send(err)
                }
                else {
                    response.status(200).send({message: 'success'})
                }
            })
        }
    });
})

//POST
router.post('/api/users', (request, response) => {
    var model = new Model();
    model.firstname = request.body.firstname;
    model.lastname = request.body.lastname;
    model.age = request.body.age;
    model.save(request.body, (err, user) => {
        if (err) {
            response.status(500).send(err);
        }
        else {
            response.status(201).send(user);
        }
    })
})


app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.listen('3000', ()=> {
    console.log('This is working on localhost 3000');
})