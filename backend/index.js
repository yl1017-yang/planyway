const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment-timezone');

const app = express();
const port = process.env.PORT || 5000;

// CORS 및 기본 설정
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://yl1017-yang.github.io'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

// MongoDB 연결
const uri = process.env.MONGODB_URI || "mongodb+srv://yangwonder1017:0KffJ8dB5DIWmZeP@cluster-planyway.dou1w.mongodb.net/planyway?retryWrites=true&w=majority";
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// 스키마 정의
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  backgroundColor: String,
  label: String,
  completed: Boolean,
  allDay: { type: Boolean, default: true }
});

// 시간대 변환 미들웨어
const convertToKST = (req, res, next) => {
  if (req.body.start) {
    // ISO 8601 문자열을 Date 객체로 변환
    req.body.start = moment(req.body.start).toDate();
  }
  if (req.body.end) {
    req.body.end = moment(req.body.end).toDate();
  }
  next();
};

const Event = mongoose.model('Event', eventSchema);

// 이벤트 조회
app.get('/events', async (req, res) => {
  const limit = parseInt(req.query.limit) || 300;
  try {
    const events = await Event.find().limit(limit);
    // ISO 8601 형식으로 응답
    const formattedEvents = events.map(event => ({
      ...event.toObject(),
      start: moment(event.start).tz('Asia/Seoul').toISOString(),
      end: moment(event.end).tz('Asia/Seoul').toISOString()
    }));
    res.json(formattedEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 이벤트 생성
app.post('/events', convertToKST, async (req, res) => {
  const event = new Event(req.body);
  try {
    const newEvent = await event.save();
    const formattedEvent = {
      ...newEvent.toObject(),
      start: moment(newEvent.start).tz('Asia/Seoul').toISOString(),
      end: moment(newEvent.end).tz('Asia/Seoul').toISOString()
    };
    res.status(201).json(formattedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 이벤트 수정
app.put('/events/:id', convertToKST, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const formattedEvent = {
      ...updatedEvent.toObject(),
      start: moment(updatedEvent.start).tz('Asia/Seoul').toISOString(),
      end: moment(updatedEvent.end).tz('Asia/Seoul').toISOString()
    };
    res.json(formattedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 나머지 코드는 동일하게 유지
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