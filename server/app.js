import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import models from './models';
import { checkAuth } from './auth';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => checkAuth(models, req, res, next));

export default app;
