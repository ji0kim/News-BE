const { response, request } = require('../app');
const { selectCommentsById, InsertNewCommentById, removeCommentById } = require('../models/comments.model');

exports.getCommentsById = (req, res, next) => {
	const { article_id } = req.params;
	selectCommentsById(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postCommentById = (req, res, next) => {
	const { body, username } = req.body;
	const { article_id } = req.params;
	InsertNewCommentById(article_id, username, body)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch((err) => {
			next(err);
		});
};

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentById(comment_id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch((err) => {
			next(err);
		});
};
