const db = require('../db/connection');

exports.selectArticles = () => {
	const queryTxt = 'SELECT * FROM articles ORDER BY created_at DESC;';
	return db.query(queryTxt).then((result) => {
		return result.rows;
	});
};

exports.selectArticleById = (article_id) => {
	const queryTxt = `
    SELECT articles.*, COUNT(comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
  `;
	return db.query(queryTxt, [article_id]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found' });
		}
		return result.rows[0];
	});
};

exports.updateVoteById = (inc_votes, article_id) => {
	const queryTxt = `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id=$2
  RETURNING *;
    `;
	return db.query(queryTxt, [inc_votes, article_id]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found' });
		} else {
			return result.rows[0];
		}
	});
};
