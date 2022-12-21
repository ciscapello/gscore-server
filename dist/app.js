import express from 'express';
import productsRouter from './routes/products.route.js';
import usersRouter from './routes/users.route.js';
import subscribesRouter from './routes/subscribes.route.js';
import morgan from 'morgan';
import globalErrorHandler from './controllers/error.controller.js';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cors from 'cors';
const app = express();
app.use;
helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false
});
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(express.static('public'));
app.use(morgan('dev'));
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 100,
    message: 'Too many requests from this IP, please try again in an hour.'
});
app.use('/api', limiter);
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use('/api', productsRouter);
app.use('/api', usersRouter);
app.use('/api', subscribesRouter);
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map