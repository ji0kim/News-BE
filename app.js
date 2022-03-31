const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getArticles, getArticleById, patchArticleVoteById } = require('./controllers/articles.controller.js');
const { getUsers } = require('./controllers/users.controller.js');
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleVoteById);
app.get('/api/users', getUsers);

app.use((req, res, next) => {
	res.status(404).send({ msg: 'Not found' });
});

app.use((err, req, res, next) => {
	if (err.msg && err.status) {
		res.status(err.status).send({ msg: err.msg });
		//send with the form of obj
	} else {
		next(err);
	}
});

app.use((err, req, res, next) => {
	const sqlErrCodes = ['22P02', '23502'];
	if (sqlErrCodes.includes(err.code)) {
		res.status(400).send({ msg: 'Bad request' });
	} else {
		next(err);
	}
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;
