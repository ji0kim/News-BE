const { selectArticles, selectArticleById } = require('../models/articles.model.js');

exports.getArticles = (req, res, next) => {
	selectArticles()
		.then((articles) => {
			res.send({ articles });
		})
		.catch(next);
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			res.send({ article });
		})
		.catch(next);
};
