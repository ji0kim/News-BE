const db = require('../db/connection');
const format = require('pg-format');

exports.selectArticles = () => {
	const queryTxt = 'SELECT * FROM articles';
	return db.query(queryTxt).then((result) => {
		return result.rows;
	});
};

exports.selectArticleById = (article_id) => {
	const queryTxt = format('SELECT * FROM articles WHERE article_id = $1');
	return db.query(queryTxt, [article_id]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found' });
			// return the promise
		} else {
			return result.rows[0];
		}
	});
};
