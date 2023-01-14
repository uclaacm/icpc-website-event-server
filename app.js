const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Event = require('./schemas/Event');

require('dotenv/config');

// enable all CORS requests
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/test', (req, res) => {
    res.send('Hello, World!');
});

app.get('/events', async (req, res) => {
    try {
        let events = await Event.find();
        let temp = []
        for (e of events) {
            const {__v, _id, ...other} = e._doc;
            temp.push(other)
        }
        console.log(temp);
        console.log("events accessed");
        res.status(200).json(temp);
    } catch (error) {
        res.status(500);
    }
});

app.post('/create', async (req, res) => {
    const {pkey, ...other} = req.body;
    const event = new Event(other);
    try {
        const data = await event.save();
        console.log("created a new event!");
        res.status(200).json({message: "Created"});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

app.post('/update', async (req, res) => {
    try {
        console.log(req.body.updated);
        console.log(req.body.originalName);
        await Event.findOneAndReplace({name: req.body.originalName}, req.body.updated);
        console.log('event updated');
        res.status(200).json({message: "Updated"});
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/delete', async (req, res) => {
    try {
        await Event.deleteOne({name: req.body.name});
        console.log('event deleted');
        res.status(200).json({message: "Deleted"});
    } catch (error) {
        res.status(500).json({'error': error});
    }
});

// Connect to MongoDB
mongoose.set('strictQuery', true);
db_password = process.env.db_password
db_url = `mongodb+srv://ICPCAdmin:${db_password}@cluster0.3hntxbk.mongodb.net/?retryWrites=true&w=majority`;
try {
    mongoose.connect(db_url);
    console.log('connected to db!');
} catch (error) {
    console.log(error);
}

app.listen(3000);
