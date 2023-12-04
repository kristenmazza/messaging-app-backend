import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import corsOptions from './setup/corsOptions';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import path, { join } from 'path';
import dotenv from 'dotenv';
import initializeMongoDB from './setup/mongoConfig';
import credentials from './middleware/credentials';
import { userRouter } from './routes/user';
import { channelRouter } from './routes/channel';
import { registerRouter } from './routes/register';
import { authRouter } from './routes/auth';
import { refreshTokenRouter } from './routes/refresh';
import { logoutRouter } from './routes/logout';
import verifyJWT from './middleware/verifyJWT';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import sockets from './socket/sockets';

dotenv.config();

const port = process.env.PORT || 3000;
const app: Application = express();
const server = createServer(app);

initializeMongoDB();

// Initialize middleware
app.use(logger('dev'));
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

// Socket.io
const io = new Server(server, {
  cors: corsOptions,
});
io.on('connection', sockets);

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Index');
});
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/refresh', refreshTokenRouter);
app.use('/logout', logoutRouter);
app.use(verifyJWT); // Everything after this line will use the verifyJWT middleware
app.use('/users', userRouter);
app.use('/channels', channelRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).send(err.message);
});

app.all('*', (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json;
    ({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
