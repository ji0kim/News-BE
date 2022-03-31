const db = require('../db/connection');
const format = require('pg-format');
const { lastIndexOf } = require('../db/data/test-data/articles');

exports.selectArticles = () => {
	const queryTxt = 'SELECT * FROM articles';
	return db.query(queryTxt).then((result) => {
		return result.rows;
	});
};

exports.selectArticleById = (article_id) => {
	const queryTxt = format('SELECT * FROM articles WHERE article_id = $1');
	const commentCountQueryTxt = format('SELECT * FROM comments WHERE article_id=$1');

	return db
		.query(queryTxt, [article_id])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Not found' });
			}
			return result;
		})
		.then((result) => {
			return db.query(commentCountQueryTxt, [article_id]).then((commentById) => {
				const commentCount = commentById.rows.length;
				result.rows[0].comment_count = commentCount;
				return result.rows[0];
			});
		});
};

exports.updateVoteById = (inc_votes, article_id) => {
  const queryTxt = format(`
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id=$2
  RETURNING *;
    `);
	return db.query(queryTxt, [inc_votes, article_id]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found' });
		} else {
			return result.rows[0];
		}
	});
};
