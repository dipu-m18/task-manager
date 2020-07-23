const express = require('express');
const app = express();
const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser')

//load in the mongoose models
const { List, Task} = require('./db/models');

//load middleware
app.use(bodyParser.json());
//This middleware will parse the request body of http


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


//get lists------ get all lists
app.get('/lists', (req, res) => {
    //we want to return an array of all the lists in the database
    List.find().then((lists) => {
        res.send(lists);
    }) 
})

//post /lists-----create a list
app.post('/lists', (req, res) => {
    //we want to create a new list and return the new list document back to the user (which includes the id)
    //the list information will be passed via the request json body
    let title = req.body.title;
    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        // the full list document is returned (incl. id)
        res.send(listDoc)
    })
});

//patch/lists/:id----uodate the specified list
app.patch('/lists/:id', (req, res) => {
    // we want to update the specified list ( list document with id in the url) with the new values specified in the JSON body of the request
    List.findOneAndUpdate({_id: req.params.id},{
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

// app.patch('/lists/:id', (req, res) => {
//     // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
//     List.findOneAndUpdate({ _id: req.params.id }, {
//         $set: req.body
//     }).then(() => {
//         res.send({ 'message': 'updated successfully'});
//     });
// });

app.delete('/lists/:id', (req, res) => {
    //we want to delete the specified list ( list document with id in the url)
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removeListDoc) => {
        res.send(removeListDoc)
    })
})



//GET tasks-----to get all the tasks in a specified list
app.get('/lists/:listId/tasks', (req, res) => {
    //we want to return all the tasks that belong to specific list (specified by listId)
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
})

//GET Tasks specified by task id
app.get('/lists/:listId/tasks/:taskId', (req,res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
})

//POST tasks----create a new task in a specified list
app.post('/lists/:listId/tasks', (req, res)=> {
    //we want to create a new task in list specified by listId
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc)
    })
})

//PATCH tasks-----update an existing list
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    //we want to update an existing task (specified by taskId)
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
     }
    ).then(() => {
        res.send({message: 'Updated successfully.'})
    })
});

//DELETE tasks----delete a task
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
});

app.listen(3000, () => {
    console.log("server is lisentening on port 3000");
})