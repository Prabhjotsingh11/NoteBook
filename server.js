// require(`./public/DB`);
const Task = require('./public/DB');
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

// const tasks = [];

// Middleware
// app.use(urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("./public"));

app.get('/getAll', async (req, res) => {
    // console.log(tasks)
    try{
        const tasks= await Task.find({});
        res.json(tasks);
    }catch(err){
        console.log(err)
    }
})

app.post('/takenote', async(req, res) => {
    // console.log(req.body);
    try{

        const { notes }  = req.body;
        const tasks=await Task.create({notes, status: false });
        res.end('DONE');
    }catch(err){
        console.log(err);
    }
    // console.log(tasks);
    // tasks.push({ notes, status:false, id: tasks.length + 1 })
})

app.delete('/deletenote/:id', async(req, res) => {
    const id = req.params.id;
    // console.log(id)
    // const index = tasks.findIndex(task => {
    //     return task.id === id;
    // })
try{
const task=await Task.findByIdAndDelete({_id:id});
res.json({task})
}catch(err){
    console.log(err)
}
    // tasks.splice(index, 1);
    // res.json({ success: true });
})

app.patch('/updatenote/:id', async (req, res) => {
    const id = req.params.id;
    const updatedNote = req.body.notes;
    try{
        const task=await Task.findByIdAndUpdate(id,{notes:updatedNote});
        res.json({task});

    }catch(err){
        console.log(err)
    }

})

app.patch('/updatestatus/:id', async(req, res) => {
    const id = (req.params.id);

    try{
        const cs = await Task.findById({_id:id});
        const st=!(cs.status);
        const task=await Task.findByIdAndUpdate(id,{status: st });
        res.json(task);

    }catch(err){
        console.log(err)
    }

    // tasks[index].status = updatedstatus;
    // res.end('DONE');

})

app.listen(8000, () => {
    console.log('Magic Note Server Started ');
})