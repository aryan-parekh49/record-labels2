const request = require('supertest');
const app = require('../src/index');

afterEach(() => {
  app.resetData();
});

describe('Crime API', () => {
  it('should create a crime with default deadline and mark it resolved', async () => {
    const crimeData = { type: 'theft', description: 'stolen phone' };
    const postRes = await request(app).post('/api/crimes').send(crimeData);
    expect(postRes.status).toBe(201);
    const created = postRes.body;
    expect(created.type).toBe('theft');
    expect(created.status).toBe('pending');

    const deadline = new Date(created.deadline);
    const reported = new Date(created.reportedAt);
    const diffDays = Math.round((deadline - reported) / (24 * 60 * 60 * 1000));
    expect(diffDays).toBe(60);

    const resolveRes = await request(app).post(`/api/crimes/${created.id}/resolve`);
    expect(resolveRes.status).toBe(200);
    expect(resolveRes.body.status).toBe('resolved');
  });

  it('should list overdue crimes', async () => {
    const crimeData = { type: 'burglary', description: 'house break-in' };
    const postRes = await request(app).post('/api/crimes').send(crimeData);
    expect(postRes.status).toBe(201);
    const created = postRes.body;

    // Manually set deadline in the past to simulate overdue case
    await request(app)
      .put(`/api/crimes/${created.id}`)
      .send({ deadline: new Date(Date.now() - 1).toISOString() });

    const overdueRes = await request(app).get('/api/crimes/overdue');
    expect(overdueRes.status).toBe(200);
    expect(overdueRes.body.length).toBeGreaterThan(0);
  });

  it('should mark reminders when due', async () => {
    const postRes = await request(app)
      .post('/api/crimes')
      .send({ type: 'fraud' });
    const crime = postRes.body;

    const past = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
    await request(app)
      .put(`/api/crimes/${crime.id}`)
      .send({ reportedAt: past });

    const dueRes = await request(app).get('/api/crimes/reminders-due');
    expect(dueRes.body.find(c => c.id === crime.id)).toBeTruthy();

    const remindRes = await request(app).post(`/api/crimes/${crime.id}/remind`);
    expect(remindRes.status).toBe(200);
    expect(remindRes.body.reminderLevel).toBe(1);

    const notDue = await request(app).post(`/api/crimes/${crime.id}/remind`);
    expect(notDue.status).toBe(400);
  });

  it('should escalate overdue crimes with reason', async () => {
    const postRes = await request(app).post('/api/crimes').send({ type: 'robbery' });
    const crime = postRes.body;
    await request(app)
      .put(`/api/crimes/${crime.id}`)
      .send({ deadline: new Date(Date.now() - 1).toISOString() });

    const escBad = await request(app).post(`/api/crimes/${crime.id}/escalate`).send({});
    expect(escBad.status).toBe(400);

    const escRes = await request(app)
      .post(`/api/crimes/${crime.id}/escalate`)
      .send({ reason: 'delay explained' });
    expect(escRes.status).toBe(200);
    expect(escRes.body.escalated).toBe(true);

    const list = await request(app).get('/api/crimes/escalated');
    expect(list.body.find(c => c.id === crime.id)).toBeTruthy();
  });

  it('should filter crimes by station and report statistics', async () => {
    await request(app)
      .post('/api/crimes')
      .send({ type: 'theft', station: 'StationA' });
    await request(app)
      .post('/api/crimes')
      .send({ type: 'fraud', station: 'StationB' });

    const stationRes = await request(app).get('/api/crimes/station/StationA');
    expect(stationRes.body.length).toBe(1);

    await request(app)
      .post(`/api/crimes/${stationRes.body[0].id}/resolve`);

    const statsRes = await request(app).get('/api/stats');
    expect(statsRes.body.total).toBe(2);
    expect(statsRes.body.resolved).toBe(1);
    expect(statsRes.body.pending).toBe(1);
  });
});
