const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000', // 로컬 개발 환경
    'https://yl1017-yang.github.io' // GitHub Pages
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
  credentials: true // 쿠키와 인증 정보를 포함할 수 있도록 설정
}));

app.use(bodyParser.json());

// const uri = "mongodb+srv://yangwonder1017:0KffJ8dB5DIWmZeP@cluster-planyway.dou1w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-planyway";
const uri = process.env.MONGODB_URI || "mongodb+srv://yangwonder1017:0KffJ8dB5DIWmZeP@cluster-planyway.dou1w.mongodb.net/planyway?retryWrites=true&w=majority";
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
  completed: Boolean,
  // allDay: { type: Boolean, default: true }
});

const Event = mongoose.model('Event', eventSchema);

// GET 라우트 수정 (종료 날짜를 다시 원래대로 조정)
app.get('/events', async (req, res) => {
  const limit = parseInt(req.query.limit) || 300;
  try {
    const events = await Event.find().limit(limit);
    const adjustedEvents = events.map(event => ({
      ...event.toObject(),
      end: event.end ? new Date(new Date(event.end).setDate(new Date(event.end).getDate() - 1)).toISOString().split('T')[0] : null
    }));
    res.json(adjustedEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 날짜를 조정하는 유틸리티 함수
function adjustDate(dateString) {
  if (!dateString) return dateString;
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

// POST 라우트 수정
app.post('/events', async (req, res) => {
  const eventData = {
    ...req.body,
    end: adjustDate(req.body.end)
  };
  const event = new Event(eventData);
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT 라우트 수정
app.put('/events/:id', async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      end: adjustDate(req.body.end)
    };
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
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
