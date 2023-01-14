const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    name: String,
    link: String,
    start_time: Date,
    end_time: Date,
    discord: String,
    location: String,
    image: String,
    description: String
});

module.exports = mongoose.model('Event', EventSchema);