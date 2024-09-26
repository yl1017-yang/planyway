const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Event.findByIdAndDelete(id);
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// MongoDB connection
mongoose.connect('mongodb+srv://yangwonder1017:0KffJ8dB5DIWmZeP@cluster-planyway.dou1w.mongodb.net/planywayApp');

const db = mongoose.connection;

db.on('error', () => {
  console.log('Connection Failed!');
});

db.once('open', () => {
  console.log('Connected!');
});

// Define Event schema and model
const eventSchema = mongoose.Schema({
  title: String,
  description: String,
  start: String,
  end: String,
  backgroundColor: String,
  label: String,
  completed: Boolean,
});

const Event = mongoose.model('Event', eventSchema);
