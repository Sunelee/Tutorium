// This code is part of your WebSocket server logic
// Import the createThread function
const threadController = require('../controllers/ThreadController'); // Replace with the correct path to your controller module

const WebSocket = require('ws');

const createWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  // Store connected clients in a Set for easy management
  const clients = new Set();

  // ... (other imports and code)

wss.on('connection', (ws) => {
  // Handle new WebSocket connections
  clients.add(ws);

  // Handle incoming messages from clients
  ws.on('message', async (message) => {
    console.log('Received WebSocket message:', message);
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === 'new_thread') {
        const newThreadData = parsedMessage.data;

        // Make sure newThreadData contains the expected properties
        if (
          typeof newThreadData.title === 'string' &&
          typeof newThreadData.content === 'string' &&
          typeof newThreadData.category === 'string' &&
          Array.isArray(newThreadData.tags)
        ) {
          // Call the createThread function with the correct data
          await threadController.createThread({
            title: newThreadData.title,
            content: newThreadData.content,
            category: newThreadData.category,
            tags: newThreadData.tags,
          });

          // Broadcast the new thread to other connected clients if needed
          broadcastMessage(message);
        } else {
          console.error('Invalid WebSocket message data:', newThreadData);
        }
      }
    // Inside the 'try' block for message parsing
} catch (error) {
  console.error('Error parsing WebSocket message:', error);
  // Send an error response to the client if needed
  ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
}

  });


    
    

    ws.on('close', () => {
      // Handle WebSocket connection closure
      clients.delete(ws);
    });
  });

  // Broadcast a message to all connected clients
  const broadcastMessage = (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  return wss;
};

module.exports = createWebSocketServer;
