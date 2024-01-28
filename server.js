const dotenv = require('dotenv')
dotenv.config();

const express = require('express')
const body_parser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = process.env.MONGODB_URI

MongoClient.connect(connectionString, {tls: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db("crud")
    const collection = db.collection("contacts")

    app.use(body_parser.urlencoded({ extended: true}))

    app.get('/contacts', (req, res) => {
      db.collection('contacts')
        .find()
        .toArray()
        .then(quotes => {
          res.json(quotes);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    })

    app.post('/contacts/:id', (req, res) => {
      const contactId = req.params._id
      console.log(contactId)
      db.collection('contacts')
      .findOne({ _id: new ObjectId(contactId) })
      .then(contact => {
        if (!contact) {
          return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    })

    app.post('/contacts', (req, res) => {
      const newContact = req.body;

      collection
        .insertOne(newContact)
        .then(result => {
          res.status(201).json(result.ops[0]);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    });

    //Update contacts
    app.put('/contacts/:id', (req, res) => {
      const contactId = req.params.id;
      const updatedContact = req.body;

      if (!ObjectId.isValid(contactId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      db.collection('contacts')
        .updateOne({ _id: new ObjectId(contactId) }, { $set: updatedContact })
        .then(result => {
          if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
          }
          res.json({ message: 'Contact updated successfully' });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    });

    //Delete contacts
    app.delete('/contacts/:id', (req, res) => {
      const contactId = req.params.id;

      if (!ObjectId.isValid(contactId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      db.collection('contacts')
        .deleteOne({ _id: new ObjectId(contactId) })
        .then(result => {
          if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Contacts not found' });
          }
          res.json({ message: 'Contacts deleted successfully' });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    });

    app.listen(3000, function () {
      console.log('listening on 3000')
    })
  })
  .catch(error => console.error(error))