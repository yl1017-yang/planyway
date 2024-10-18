const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://yl1017-yang.github.io'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

const uri = process.env.MONGODB_URI || "mongodb+srv://yangwonder1017:0KffJ8dB5DIWmZeP@cluster-planyway.dou1w.mongodb.net/planyway?retryWrites=true&w=majority";
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  backgroundColor: String,
  label: String,
  completed: Boolean,
  allDay: { type: Boolean, default: false }
});

const Event = mongoose.model('Event', eventSchema);

app.get('/events', async (req, res) => {
  const limit = parseInt(req.query.limit) || 300;
  try {
    const events = await Event.find().limit(limit);
    res.json(events.map(event => ({
      ...event.toObject(),
      start: event.start.toISOString(),
      end: event.end.toISOString()
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/events', async (req, res) => {
  const eventData = {
    ...req.body,
    start: new Date(req.body.start),
    end: new Date(req.body.end)
  };
  const event = new Event(eventData);
  try {
    const newEvent = await event.save();
    res.status(201).json({
      ...newEvent.toObject(),
      start: newEvent.start.toISOString(),
      end: newEvent.end.toISOString()
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/events/:id', async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      start: new Date(req.body.start),
      end: new Date(req.body.end)
    };
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({
      ...updatedEvent.toObject(),
      start: updatedEvent.start.toISOString(),
      end: updatedEvent.end.toISOString()
    });
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
