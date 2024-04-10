console.log('May node be with you');

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb+srv://cdognovak:beepBoop@cluster0.qwtoxef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// mongo username: cdognovak
// mongo password: beepBoop

// MongoClient.connect(connectionString, {useUnifiedTopology: true }, (err, client) => {
//     if (err) return console.error(err);
//     console.log('Connected to Database');
// })

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('star-wars-quotes');
        const quotesCollection = db.collection('quotes');

        app.set('view engine', 'ejs');

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.static('public'));
        app.use(bodyParser.json());

        app.get('/', (req, res) => {
            const cursor = quotesCollection.find().toArray()
            .then(results => {
                console.log(results);
                res.render('index.ejs', { quotes: results });
            })
            .catch(error => console.error(error));
            
            
        });

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
            .then(result => {
                console.log(result);
                res.redirect('/')
            })
            .catch(error => console.error(error));
        });

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: "Yoda" },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => {
                console.log(result)
                res.json('Success!')
            })
            .catch(error => console.error(error));
        });

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
            .then(result => {
                res.json("Deleted Vader's quote.")
            })
            .catch(error => console.error(error));
        });

        app.listen(3000, () => {
            console.log('listening on 3000');
        });


    })
    .catch(error => console.error(error));