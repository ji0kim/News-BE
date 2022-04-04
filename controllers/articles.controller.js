const { selectArticles, selectArticleById, updateVoteById } = require('../models/articles.model.js');

exports.getArticles = (req, res, next) => {
  const { sort_by, order_by } = req.query;
	selectArticles(sort_by, order_by)
		.then((articles) => {
			res.send({ articles });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			res.send({ article });
		})
		.catch((err) => {
			next(err);
		});
};

exports.patchArticleVoteById = (req, res, next) => {
	const { inc_votes } = req.body;
	const { article_id } = req.params;
	updateVoteById(inc_votes, article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};
