const db = require('../db/connection');

exports.selectCommentsById = (article_id) => {
  const queryTxt = `SELECT * FROM comments WHERE article_id=$1;`;
	return db.query(queryTxt, [article_id]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found' });
		} else {
			return result.rows;
		}
	});
};

exports.InsertNewCommentById = (article_id, username, body) => {
	const queryTxt = `
	INSERT INTO comments
	(article_id, author, body)
	VALUES
	($1, $2, $3)
	RETURNING *;
	`;
  if (body.length === 0) {
		return Promise.reject({ status: 400, msg: 'Bad request' });
	}	
  return db.query(queryTxt, [article_id, username, body]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found' });
		} else {
			return result.rows[0];
		}
	});
};

exports.removeCommentById = (comment_id) => {
	const queryTxt = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `;
	return db.query(queryTxt, [comment_id]).then((result) => {
		return result.rowCount;
		// if (!result.rowCount) {

		// }
	});
};