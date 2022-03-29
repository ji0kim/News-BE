const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getArticles } = require('./controllers/articles.controller.js');

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.use((req, res, next) => {
	res.status(404).send({ msg: 'Not found' });
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;
