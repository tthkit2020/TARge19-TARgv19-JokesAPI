const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/jokesDB', 
{useNewUrlParser: true, useUnifiedTopology: true});

const jokeSchema = {
    title: String,
    content: String
};

const Joke = mongoose.model('Joke', jokeSchema);

//chained route handlers
app.route('/jokes')
.get((req, res) => {
    Joke.find((error, jokes) => {
        if(!error){
            res.send(jokes);
        } else {
            res.send(error);
        }
    });
})
.post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);
    let newJoke = new Joke({
        title: req.body.title,
        content: req.body.content
    });

    newJoke.save((error) => {
        if(!error) {
            res.send('Data sent.');
        } else {
            res.send(error);
        }
    });
})
.delete((req, res) => {
    Joke.deleteMany((error) => {
        if(!error){
            res.send("Successfully deleted all records.");
        } else {
            res.send(error);
        }
    })
});

//to get a specific joke

app.route("/jokes/:jokeTitle")
.get(
    (req, res) => {
        Joke.findOne({title: req.params.jokeTitle}, (error, jokeFound) =>{
            if(jokeFound){
                res.send(jokeFound);
            } else {
                res.send("No document found");
            }
        });
    }
)
.put(
    (req, res) => {
        Joke.updateOne(
            {title: req.params.jokeTitle}, //the document to update
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (error) => {
                if(!error){
                    res.send('Document updatd!');
                } else {
                    res.send(error);
                }
            });
    }
)
.delete(
    (req, res) => {
        Joke.deleteOne(
            {title: req.params.jokeTitle},
            (error) => {
                if(!error){
                    res.send("Document deleted.");
                } else {
                    res.send(error);
                }
            });
    }
);



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});