const request = require('supertest');
const app = require('../src/index');

afterEach(() => {
  app.resetData();
});

describe('Evidence API', () => {
  it('should create and list evidence for a crime', async () => {
    const create = await request(app)
      .post('/api/evidence')
      .send({ crimeId: 1, type: 'photo' });
    expect(create.status).toBe(201);
    const id = create.body.id;

    const list = await request(app).get('/api/evidence/crime/1');
    expect(list.body.find(e => e.id === id)).toBeTruthy();
  });

  it('should delete evidence item', async () => {
    const create = await request(app)
      .post('/api/evidence')
      .send({ crimeId: 2, type: 'video' });
    const id = create.body.id;

    const del = await request(app).delete(`/api/evidence/${id}`);
    expect(del.status).toBe(200);

    const list = await request(app).get('/api/evidence/crime/2');
    expect(list.body.length).toBe(0);
  });
});
