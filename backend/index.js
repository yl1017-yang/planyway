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
  start: { 
    type: String, 
    required: true,
    set: date => new Date(date).toISOString().split('T')[0] // 'YYYY-MM-DD' 형식으로 저장
  },
  end: { 
    type: String, 
    required: true,
    set: date => new Date(date).toISOString().split('T')[0] // 'YYYY-MM-DD' 형식으로 저장
  },
  backgroundColor: String,
  label: String,
  completed: Boolean,
});

const Event = mongoose.model('Event', eventSchema);

// Routes
app.get('/events', async (req, res) => {
  const limit = parseInt(req.query.limit) || 300; // 쿼리 파라미터에서 limit 값을 가져오고, 기본값은 300으로 설정
  try {
    const events = await Event.find().limit(limit); // limit을 사용하여 가져오는 이벤트 수를 제한
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
