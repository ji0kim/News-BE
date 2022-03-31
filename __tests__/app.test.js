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

describe('GET /api/topics', () => {
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
describe('GET /api/articles', () => {
	test('200 - Success : respond with an array of obj', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then((response) => {
				expect(response.body.articles).toBeInstanceOf(Array);
				expect(response.body.articles.length).toBe(12);
				response.body.articles.forEach((article) => {
					expect(article).toMatchObject({
						article_id: expect.any(Number),
						created_at: expect.any(String),
						votes: expect.any(Number),
						body: expect.any(String),
						author: expect.any(String),
						title: expect.any(String),
						topic: expect.any(String),
					});
				});
			});
	});
});
describe('GET /api/articles/article_id', () => {
	test('200 - Success : respond with an obj', () => {
		return request(app)
			.get('/api/articles/1')
			.expect(200)
			.then((response) => {
				expect(response.body.article).toMatchObject({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: '2020-07-09T20:11:00.000Z',
					votes: 100,
				});
			});
	});
	test('400 - Bad request : When article_id is not an integer', () => {
		return request(app)
			.get('/api/articles/:not_an_integer')
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Bad request');
			});
	});
	test("404 - Not found : When article_id doesn't exist", () => {
		return request(app)
			.get('/api/articles/10000000')
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe('Not found');
			});
	});
});
describe('PATCH /api/articles/article_id', () => {
	test('200 - Success : increment votes', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ inc_votes: 1 })
			.expect(200)
			.then((response) => {
				expect(response.body.article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: '2020-07-09T20:11:00.000Z',
					votes: 101,
				});
			});
	});
	test('200 - Success : decrement votes', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ inc_votes: -100 })
			.expect(200)
			.then((response) => {
				expect(response.body.article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: '2020-07-09T20:11:00.000Z',
					votes: 0,
				});
			});
	});
	test('400 - Bad Request : Invalid format', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ inc_votes: 'aaa' })
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Bad request');
			});
	});
	test('400 - Bad Request : Empty request', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({})
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Bad request');
			});
	});
	test('404 - Not found : article not found with a proper request body', () => {
		return request(app)
			.patch('/api/articles/999')
			.send({ inc_votes: 1 })
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe('Not found');
			});
	});
	test('400 - Bad Request : Invalid format of article id with a proper request body', () => {
		return request(app)
			.patch('/api/articles/not_a_integer')
			.send({ inc_votes: 1 })
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Bad request');
			});
	});
});