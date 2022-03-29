const { selectArticles } = require('../models/articles.model.js');

exports.getArticles = (req, res, next) => {
	selectArticles()
		.then((articles) => {
			res.send({ articles });
		})
		.catch(next);
};
