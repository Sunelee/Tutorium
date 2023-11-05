import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:3001'); // Replace with your server URL

export default socket;
