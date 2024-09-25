// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let events = [
  { id: '1', title: '[메인] Event 1', description: '내용 1', start: '2024-09-01', end: '2024-09-03', backgroundColor: 'green', label: '풀샵', completed: false },
  { id: '2', title: '[퍼블] Event 2', description: '내용 2', start: '2024-09-02', end: '2024-09-04', backgroundColor: 'blue', label: '올가', completed: false },
];

app.get('/events', (req, res) => {
  res.json(events);
});

app.post('/events', (req, res) => {
  const newEvent = { ...req.body, id: (events.length + 1).toString() };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/events/:id', (req, res) => {
  const { id } = req.params;
  const updatedEvent = req.body;
  events = events.map(event => (event.id === id ? updatedEvent : event));
  res.json(updatedEvent);
});

app.delete('/events/:id', (req, res) => {
  const { id } = req.params;
  events = events.filter(event => event.id !== id);
  res.json({ id });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
