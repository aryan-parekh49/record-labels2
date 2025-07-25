const request = require('supertest');
const app = require('../src/index');

beforeEach(() => app.reset());

describe('auth service', () => {
  it('issues a token with valid credentials', async () => {
    const res = await request(app).post('/login').send({ username: 'admin', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/users').send({ username: 'pi1', password: 'pwd', role: 'pi' });
    expect(res.status).toBe(201);
    const list = await request(app).get('/users');
    expect(list.body.find(u => u.username === 'pi1')).toBeTruthy();
  });
});
