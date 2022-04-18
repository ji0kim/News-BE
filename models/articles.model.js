const db = require('../db/connection');

exports.selectArticles = (sort_by = 'created_at', order_by = 'DESC', topic) => {
	const validColumn = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes'];
	if (!validColumn.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'Invalid sort by' });
	}
	let queryTxt = `SELECT articles.*,
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;
	dbQueryParams = [];

	if (topic) {
		queryTxt += ` WHERE articles.topic ILIKE $1`;
		dbQueryParams.push(topic);
	}

	queryTxt += `
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order_by};
  `;

	return db.query(queryTxt, dbQueryParams).then((result) => {
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
