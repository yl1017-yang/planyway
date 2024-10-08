const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://yl1017-yang.github.io',  // GitHub Pages URL
}));
app.use(bodyParser.json());

// const uri = "mongodb+srv://yangwonder1017:0KffJ8dB5DIWmZeP@cluster-planyway.dou1w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-planyway";
const uri = "mongodb+srv://yangwonder1017:0KffJ8dB5DIWmZeP@cluster-planyway.dou1w.mongodb.net/planyway?retryWrites=true&w=majority";
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Event model
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  start: { type: String, required: true },
  end: { type: String, required: true },
  backgroundColor: String,
  label: String,
  completed: Boolean
});

const Event = mongoose.model('Event', eventSchema);

// Routes
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/events', async (req, res) => {
  const event = new Event(req.body);
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
