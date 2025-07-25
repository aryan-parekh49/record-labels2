process.env.DB_FILE = ':memory:';
const request = require('supertest');
const app = require('../src/index');
let token;

beforeAll(async () => {
  const res = await request(app).post('/api/login').send({ username: 'admin', password: 'password' });
  token = res.body.token;
});

function authed(req) {
  return req.set('Authorization', `Bearer ${token}`);
}

afterEach(() => {
  app.resetData();
});

describe('Crime API', () => {
  it('should create a crime with default deadline and mark it resolved', async () => {
    const crimeData = { type: 'theft', description: 'stolen phone' };
  const postRes = await authed(request(app).post('/api/crimes')).send(crimeData);
    expect(postRes.status).toBe(201);
    const created = postRes.body;
    expect(created.type).toBe('theft');
    expect(created.status).toBe('pending');

    const deadline = new Date(created.deadline);
    const reported = new Date(created.reportedAt);
    const diffDays = Math.round((deadline - reported) / (24 * 60 * 60 * 1000));
    expect(diffDays).toBe(60);

    const resolveRes = await authed(request(app).post(`/api/crimes/${created.id}/resolve`));
    expect(resolveRes.status).toBe(200);
    expect(resolveRes.body.status).toBe('resolved');
  });

  it('should list overdue crimes', async () => {
    const crimeData = { type: 'burglary', description: 'house break-in' };
    const postRes = await authed(request(app).post('/api/crimes')).send(crimeData);
    expect(postRes.status).toBe(201);
    const created = postRes.body;

    // Manually set deadline in the past to simulate overdue case
    await authed(request(app).put(`/api/crimes/${created.id}`)).send({ deadline: new Date(Date.now() - 1).toISOString() });

    const overdueRes = await authed(request(app).get('/api/crimes/overdue'));
    expect(overdueRes.status).toBe(200);
    expect(overdueRes.body.length).toBeGreaterThan(0);
  });

  it('should mark reminders when due', async () => {
    const postRes = await authed(request(app).post('/api/crimes')).send({ type: 'fraud' });
    const crime = postRes.body;

    const past = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
    await authed(request(app).put(`/api/crimes/${crime.id}`)).send({ reportedAt: past });

    const dueRes = await authed(request(app).get('/api/crimes/reminders-due'));
    expect(dueRes.body.find(c => c.id === crime.id)).toBeTruthy();

    const remindRes = await authed(request(app).post(`/api/crimes/${crime.id}/remind`));
    expect(remindRes.status).toBe(200);
    expect(remindRes.body.reminderLevel).toBe(1);

    const notDue = await authed(request(app).post(`/api/crimes/${crime.id}/remind`));
    expect(notDue.status).toBe(400);
  });

  it('should escalate overdue crimes with reason', async () => {
    const postRes = await authed(request(app).post('/api/crimes')).send({ type: 'robbery' });
    const crime = postRes.body;
    await authed(request(app).put(`/api/crimes/${crime.id}`)).send({ deadline: new Date(Date.now() - 1).toISOString() });

    const escBad = await authed(request(app).post(`/api/crimes/${crime.id}/escalate`)).send({});
    expect(escBad.status).toBe(400);

    const escRes = await authed(request(app).post(`/api/crimes/${crime.id}/escalate`)).send({ reason: 'delay explained' });
    expect(escRes.status).toBe(200);
    expect(escRes.body.escalated).toBe(true);

    const list = await authed(request(app).get('/api/crimes/escalated'));
    expect(list.body.find(c => c.id === crime.id)).toBeTruthy();
  });

  it('should filter crimes by station and report statistics', async () => {
    await authed(request(app).post('/api/crimes')).send({ type: 'theft', station: 'StationA' });
    await authed(request(app).post('/api/crimes')).send({ type: 'fraud', station: 'StationB' });

    const stationRes = await authed(request(app).get('/api/crimes/station/StationA'));
    expect(stationRes.body.length).toBe(1);

    await authed(request(app).post(`/api/crimes/${stationRes.body[0].id}/resolve`));

    const statsRes = await authed(request(app).get('/api/stats'));
    expect(statsRes.body.total).toBe(2);
    expect(statsRes.body.resolved).toBe(1);
    expect(statsRes.body.pending).toBe(1);
  });

  it('should filter crimes by officer and provide station stats', async () => {
    await authed(request(app).post('/api/crimes')).send({ type: 'theft', officer: 'Alice', station: 'StationA' });
    await authed(request(app).post('/api/crimes')).send({ type: 'fraud', officer: 'Alice', station: 'StationB' });
    await authed(request(app).post('/api/crimes')).send({ type: 'assault', officer: 'Bob', station: 'StationA' });

    const officerRes = await authed(request(app).get('/api/crimes/officer/Alice'));
    expect(officerRes.body.length).toBe(2);

    const stationStats = await authed(request(app).get('/api/stats/station/StationA'));
    expect(stationStats.body.station).toBe('StationA');
    expect(stationStats.body.total).toBe(2);
    expect(stationStats.body.pending).toBe(2);
  });

  it('should provide statistics for a specific officer', async () => {
    await authed(request(app).post('/api/crimes')).send({ type: 'theft', officer: 'Alice' });
    await authed(request(app).post('/api/crimes')).send({ type: 'fraud', officer: 'Alice' });
    await authed(request(app).post('/api/crimes')).send({ type: 'assault', officer: 'Bob' });

    const res = await authed(request(app).get('/api/stats/officer/Alice'));
    expect(res.body.officer).toBe('Alice');
    expect(res.body.total).toBe(2);
    expect(res.body.pending).toBe(2);
  });

  it('should filter crimes by category and provide category stats', async () => {
    await authed(request(app).post('/api/crimes')).send({ type: 'theft', category: 'Major' });
    await authed(request(app).post('/api/crimes')).send({ type: 'fraud', category: 'Minor' });
    await authed(request(app).post('/api/crimes')).send({ type: 'assault', category: 'Major' });

    const catRes = await authed(request(app).get('/api/crimes/category/Major'));
    expect(catRes.body.length).toBe(2);

    await authed(request(app).post(`/api/crimes/${catRes.body[0].id}/resolve`));

    const catStats = await authed(request(app).get('/api/stats/category/Major'));
    expect(catStats.body.category).toBe('Major');
    expect(catStats.body.total).toBe(2);
    expect(catStats.body.resolved).toBe(1);
    expect(catStats.body.pending).toBe(1);
  });

  it('should list crimes that are due soon', async () => {
    const res1 = await authed(request(app).post('/api/crimes')).send({ type: 'pendingCase' });
    const id = res1.body.id;
    // set deadline 5 days from now
    const deadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    await authed(request(app).put(`/api/crimes/${id}`)).send({ deadline });

    const dueList = await authed(request(app).get('/api/crimes/due-soon?days=7'));
    expect(dueList.body.find(c => c.id === id)).toBeTruthy();
  });

  it('should delete a crime record', async () => {
    const res = await authed(request(app).post('/api/crimes')).send({ type: 'deleteMe' });
    const id = res.body.id;
    const delRes = await authed(request(app).delete(`/api/crimes/${id}`));
    expect(delRes.status).toBe(200);
    const list = await authed(request(app).get('/api/crimes'));
    expect(list.body.find(c => c.id === id)).toBeUndefined();
  });

  it('should allow adding and removing notes for a crime', async () => {
    const create = await authed(request(app).post('/api/crimes')).send({ type: 'note' });
    const id = create.body.id;

    const addRes = await authed(request(app).post(`/api/crimes/${id}/notes`)).send({ text: 'first note' });
    expect(addRes.status).toBe(201);
    expect(addRes.body.text).toBe('first note');

    const list1 = await authed(request(app).get(`/api/crimes/${id}/notes`));
    expect(list1.body.length).toBe(1);

    const noteId = addRes.body.id;
    const delRes = await authed(request(app).delete(`/api/crimes/${id}/notes/${noteId}`));
    expect(delRes.status).toBe(200);

    const list2 = await authed(request(app).get(`/api/crimes/${id}/notes`));
    expect(list2.body.length).toBe(0);
  });
});
