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
	test("200 - Success : respond with an array of obj, Order by default by 'created_at'", () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then((response) => {
				expect(response.body.articles).toBeInstanceOf(Array);
				expect(response.body.articles).toBeSorted({
					key: 'created_at',
					descending: true,
				});
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
describe('GET /api/articles?queries', () => {
	test('200 - /api/articles?sort_by=votes : respond with an array of articles object order by votes', () => {
		return request(app)
			.get('/api/articles?sort_by=votes')
			.expect(200)
			.then((response) => {
				expect(response.body.articles).toBeSorted({
					key: 'votes',
					descending: true,
				});
			});
	});
	test('200 - /api/articles?sort_by=title : respond with an array of articles object ordered by title in descending order', () => {
		return request(app)
			.get('/api/articles?sort_by=title&&order_by=DESC')
			.expect(200)
			.then((response) => {
				expect(response.body.articles).toBeSorted({ key: 'title', descending: true });
			});
	});
  test.only('200 - /api/articles?topic=cats : should be able to filter topics', () => {
		return request(app)
			.get(`/api/articles?topic=cats`)
			.expect(200)
			.then((res) => {
				expect(res.body.articles).toBeInstanceOf(Array);
				expect(res.body.articles.length).toBe(1);
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
describe('GET /api/users', () => {
	test('200 - Success : Get users from the users table', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then((response) => {
				expect(response.body.users).toBeInstanceOf(Array);
				expect(response.body.users).toEqual([
					{ username: 'butter_bridge' },
					{ username: 'icellusedkars' },
					{ username: 'rogersop' },
					{ username: 'lurker' },
				]);
				response.body.users.forEach((user) => {
					expect(user).toMatchObject({
						username: expect.any(String),
					});
				});
			});
	});
	test('404 - Not found', () => {
		return request(app)
			.get('/api/unexisting_path')
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe('Not found');
			});
	});
});
describe('GET /api/articles/:article_id (comment count)', () => {
	test('200 - Success : get the number of comment /api/articles/1 has', () => {
		return request(app)
			.get('/api/articles/1')
			.expect(200)
			.then((response) => {
				expect(response.body.article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					created_at: '2020-07-09T20:11:00.000Z',
					body: 'I find this existence challenging',
					votes: 100,
					comment_count: 11,
				});
			});
	});
	test('200 - Success : When article has no comment, show comment_count 0', () => {
		return request(app)
			.get('/api/articles/2')
			.expect(200)
			.then((response) => {
				expect(response.body.article).toEqual({
					article_id: 2,
					title: 'Sony Vaio; or, The Laptop',
					topic: 'mitch',
					author: 'icellusedkars',
					created_at: '2020-10-16T05:03:00.000Z',
					body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
					votes: 0,
					comment_count: 0,
				});
			});
	});
});
describe('GET /api/articles/:article_id/comments', () => {
	test('200 - Success : get an array of comments objects with article_id', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then((response) => {
				expect(response.body.comments).toBeInstanceOf(Array);
				response.body.comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
					});
				});
			});
	});
	test("404 - Not Found : When article_id doesn't exist", () => {
		return request(app)
			.get('/api/articles/99999/comments')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe('Not found');
			});
	});
	test('400 - Bad request: When article_id is in invalid format', () => {
		return request(app)
			.get('/api/articles/invalid_article_id/comments')
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe('Bad request');
			});
	});
	test('404 - Not Found : When an article has no comment', () => {
		return request(app)
			.get('/api/articles/2/comments')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe('Not found');
			});
	});
});
describe('POST /api/articles/:article_id/comments', () => {
	test('201 - Created : Add a new comment', () => {
		return request(app)
			.post('/api/articles/2/comments')
			.send({ username: 'icellusedkars', body: 'New comment' })
			.expect(201)
			.then((res) => {
				expect(res.body.comment).toEqual({
					article_id: 2,
					author: 'icellusedkars',
					body: 'New comment',
					comment_id: 19,
					created_at: expect.any(String),
					votes: 0,
				});
			});
	});
	test('400 - Bad request : When invalid article_id is given', () => {
		return request(app)
			.post('/api/articles/invalid_id/comments')
			.send({ username: 'icellusedkars', body: 'New comment' })
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe('Bad request');
			});
	});
	test('400 - Bad request : Request with empty comment', () => {
		return request(app)
			.post('/api/articles/2/comments')
			.send({ username: 'icellusedkars', body: '' })
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe('Bad request');
			});
	});
	test('400 - Bad request : Request with empty comment', () => {
		return request(app)
			.post('/api/articles/2/comments')
			.send({ username: 'icellusedkars', body: '' })
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe('Bad request');
			});
	});
});