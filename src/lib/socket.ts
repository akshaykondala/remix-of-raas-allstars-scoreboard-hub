// src/lib/socket.ts

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initiateSocketConnection = () => {
  if (!socket) {
    // Replace this URL with your backend server URL
    socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
};

export const getSocket = () => socket;

export const emitScoreUpdate = (teamId: string, newScore: number) => {
  if (socket) {
    socket.emit('scoreUpdate', {
      teamId,
      newScore,
      timestamp: Date.now(),
    });
  }
};
