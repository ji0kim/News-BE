const db = require('../db/connection.js');
const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

beforeEach(() => {
	return seed(testData);
});
afterAll(() => {
	return db.end();
});

describe('topics', () => {
	test('200 /api/topics responds with an array of topics', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then((response) => {
				expect(response.body.topics.length).toBe(3);
				expect(response.body.topics).toBeInstanceOf(Object);
				response.body.topics.forEach((topic) => {
					expect(topic).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
	test('404 /api/* when user requested non-existing path, respond with Not found ', () => {
		return request(app)
			.get('/api/not_a_path')
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe('Not found');
			});
	});
});