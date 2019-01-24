import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import models from './models';
import { checkAuth } from './auth';

const IS_CORS = process.env.NODE_ENV === 'production';
const CLIENT_HOST = process.env.CLIENT_HOST || 'swoy.herokuapp.com';

const app = express();
app.use(IS_CORS ? cors(CLIENT_HOST) : cors());
app.use(bodyParser.json());
app.use((req, res, next) => checkAuth(models, req, res, next));

export default app;
