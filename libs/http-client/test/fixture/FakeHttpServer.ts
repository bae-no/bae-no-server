import * as express from 'express';
import type { Express } from 'express';

const app: Express = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/api', (_, res) => res.send('response'));

app.get('/timeout', (_, res) => setTimeout(() => res.send('response'), 10000));

app.all('/param', (req, res) => res.json({ query: req.query, body: req.body }));

export default app;
