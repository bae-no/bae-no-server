import * as express from 'express';
import { Express } from 'express';

const app: Express = express();

app.all('/api', (_, res) => res.send('response'));

app.get('/timeout', (_, res) => setTimeout(() => res.send('response'), 15000));

export default app;
