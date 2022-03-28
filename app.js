const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');

app.use(express.json());

app.get('/api/topics', getTopics);

app.use((req, res, next) => {
	res.status(404).send({ msg: 'Not found' });
});

module.exports = app;
