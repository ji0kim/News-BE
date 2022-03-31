const res = require('express/lib/response');
const db = require('../db/connection');

exports.selectCommentsById = (article_id) => {
	const queryTxt = `SELECT * FROM comments WHERE article_id=$1;`;
	return db.query(queryTxt, [article_id]).then((result) => {
		return result.rows;
	});
};
