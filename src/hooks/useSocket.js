import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (busId, userId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!busId) return;

    const socketUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5001'
      : pro;
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
    //   console.log('Socket connected');
      setIsConnected(true);
      setError(null);
      
      // Join bus room
      newSocket.emit('join-bus', { 
        busId,
        userId: userId || 'anonymous'
      });
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Connection failed. Please refresh the page.');
      setIsConnected(false);
    });

    newSocket.on('disconnect', (reason) => {
    //   console.log('Socket disconnected:', reason);
      setIsConnected(false);
      
      // Attempt reconnection
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      reconnectTimeoutRef.current = setTimeout(() => {
        newSocket.connect();
      }, 3000);
    });

    return () => {
      if (newSocket) {
        newSocket.emit('leave-bus', { busId });
        newSocket.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [busId, userId]);

  return { socket, isConnected, error };
};