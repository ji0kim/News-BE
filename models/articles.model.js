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
		return result.rows[0];
	});
};
