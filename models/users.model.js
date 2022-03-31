const db = require('../db/connection');

exports.selectUsers = () => {
	return db.query('SELECT * FROM users').then((result) => {
		const users = result.rows.map((user) => {
			return { username: user.username };
		});
		return users;
	});
};
