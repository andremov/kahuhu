import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import onSocketConnection from '../socket-events/on-socket-connection';
import { connectDB } from './db';
import endpointRouter from '../rest-endpoints/endpoint-routes';
import { Temporal } from '@js-temporal/polyfill';

export default function createKahuhuServer() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({
      message: 'Kahuhu server is running.',
      timestamp: Temporal.Now.instant().toString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      connections: io.engine.clientsCount,
      connectedSockets: Array.from(io.sockets.sockets.keys()),
    });
  });

  // app.use('/api', endpointRouter);

  io.on('connection', (socket) => onSocketConnection(io, socket));

  // connectDB();

  return server;
}
