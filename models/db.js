const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true,useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log("Err in Database Connection : " + JSON.stringify(err, undefined, 2))
    } else {
        console.log('Database Connected successfully');
    }
})