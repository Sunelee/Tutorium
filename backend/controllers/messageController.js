const Message = require('../models/MessageModel'); // Import the Message model
const Chat = require('../models/ChatModel'); // Import the Message model


const createResponse = (res, status, data, errorMessage) => {
  if (status === 200) {
    res.json(data);
  } else {
    res.status(500).json({ error: errorMessage });
  }
};

const messagesController = {
  createMessage: async (req, res) => {
    try {
      const { sender, content, recipient } = req.body;

      const newMessage = new Message({
        sender,
        content,
        recipient,
        createdAt: new Date(),
      });

      await newMessage.save();

      let chat = await Chat.findOne({
        participants: { $all: [sender, recipient] },
      });

      if (chat) {
        chat.messages.push(newMessage);
        await chat.save();
      } else {
        const newChat = new Chat({
          participants: [sender, recipient],
          messages: [newMessage],
        });
        await newChat.save();
      }

      await chat.save();

      res.status(201).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create a message or chat' });
    }
  },

  getChatMessages: async (req, res) => {
    try {
      const { sender, recipient } = req.query; // Use req.query to get parameters from the query string
  
      const chat = await Chat.findOne({
        participants: { $all: [sender, recipient] },
      }).populate('messages');
  
      if (chat) {
        const messages = chat.messages;
        res.status(200).json(messages);
      } else {
        // If chat doesn't exist, create a new conversation
        const newChat = new Chat({
          participants: [sender, recipient],
          messages: [],
        });
  
        await newChat.save();
  
        res.status(200).json([]); // Return an empty array for the new conversation
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve chat messages' });
    }
  },
  

  sendMessages: async (req, res) => {
    try {
      // Extract message data from the request body
      const { sender, content, createdAt } = req.body;
  
      // Create a new message using the Message model
      const newMessage = new Message({
        sender,
        content,
        createdAt,
      });
  
      // Save the message to the database
      const savedMessage = await newMessage.save();
  
      // Send a success response with the saved message
      res.status(201).json(savedMessage);
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).json({ error: 'Failed to send the message' });
    }
  },

  fetchMessages: async (req, res) => {
    try {
      const { userId, conversationId } = req.params;
      const messages = await Message.find({ userId, conversationId }).exec();
      createResponse(res, 200, messages, 'Failed to fetch messages.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages.' });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { userId, conversationId } = req.params;
      const { message } = req.body;

      const newMessage = new Message({
        userId,
        conversationId,
        message,
      });

      const savedMessage = await newMessage.save();

      createResponse(res, 200, savedMessage, 'Failed to send message.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message.' });
    }
  },

  updateMessage: async (req, res) => {
    try {
      const { userId, conversationId, messageId } = req.params;
      const { message: updatedMessage } = req.body;
      const updatedMessageDoc = await Message.findByIdAndUpdate(
        messageId,
        { message: updatedMessage },
        { new: true }
      ).exec();
      createResponse(res, 200, updatedMessageDoc, 'Failed to update message.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to update message.' });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const { userId, conversationId, messageId } = req.params;
      const deletedMessage = await Message.findByIdAndDelete(messageId).exec();
      createResponse(res, 200, deletedMessage, 'Failed to delete message.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete message.' });
    }
  },

  markMessageAsRead: async (req, res) => {
    try {
      const { userId, conversationId, messageId } = req.params;
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { isRead: true },
        { new: true }
      ).exec();
      createResponse(res, 200, updatedMessage, 'Failed to mark message as read.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark message as read.' });
    }
  },
};

module.exports = messagesController;
