const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


//https://www.mongodb.com/ko-kr/docs/guides/crud/insert/

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://yangwonder1017:0KffJ8dB5DIWmZeP@cluster-planyway.dou1w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-planyway";

// MongoClientOptions 객체를 사용하여 안정적인 API 버전을 설정한 MongoClient 생성
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tlsAllowInvalidCertificates: true // 자체 서명된 인증서를 허용
});

async function connectToDatabase() {
  try {
    // 클라이언트를 서버에 연결
    await client.connect();
    // 성공적인 연결을 확인하기 위해 ping 전송
    // await client.db("planywayApp").command({ ping: 1 });
    // console.log("배포를 ping했습니다. MongoDB에 성공적으로 연결되었습니다!");

    const db = client.db("planywayApp");
    const coll = db.collection("events");
    const docs = [
      { id: '1', title: '[메인] Event 1', description: '내용 1', start: '2024-09-01', end: '2024-09-03', backgroundColor: 'green', label: '풀샵', completed: false },
      { id: '2', title: '[퍼블] Event 2', description: '내용 2', start: '2024-09-02', end: '2024-09-04', backgroundColor: 'blue', label: '올가', completed: false }
    ];
    const result = await coll.insertMany(docs);
    console.log(result.insertedIds);

  } finally {
    await client.close();
  }
  // } catch (error) {
  //   console.error('MongoDB 연결에 실패했습니다', error);
  // }
}
connectToDatabase();



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
  console.log(`포트 http://localhost:${port} 에 서버 가동중입니다`);
});
