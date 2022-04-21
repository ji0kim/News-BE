const db = require('../db/connection');

exports.selectCommentsById = (article_id, order = 'desc', sort_by = 'created_at') => {
	const lowerCaseOrder = order.toLowerCase();
	const isValidSortByColumn = ['created_at', 'votes'].includes(sort_by);
	const isValidOrder = ['asc', 'desc'].includes(lowerCaseOrder);

	if (!isValidSortByColumn) return Promise.reject({ status: 400, msg: 'Invalid sort by query' });
	if (!isValidOrder) return Promise.reject({ status: 400, msg: 'Invalid order query' });

	const queryTxt = `SELECT * FROM comments WHERE article_id=$1 ORDER BY ${sort_by} ${order}`;
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
		if (!result.rowCount) {
			return Promise.reject({ status: 404, msg: 'Comment not found' });
		}
		return result.rowCount;
	});
};