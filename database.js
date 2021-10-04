const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/initbot_mongodb', {useNewUrlParser: true, useUnifiedTopology:true});

// verify connection successful or console log error
let con = mongoose.connection;

con.on('connected', function() {
    console.log('db connected');
});

con.on('disconnected',function() {
    console.log('db disconnected');
})

con.on('error', console.error.bind(console, 'connection error:'));

module.exports = con;