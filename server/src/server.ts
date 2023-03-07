import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.get('/ping', (_req, res) => {
  res.send('pong');
});

const server = app.listen(4000, () => {
  console.log('Server started on port 4000');
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Initialize in-memory notes database
const notes: {
  [noteId: string]: {
    content: string,
    title: string,
  }
} = {};

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New user connected');


  // Listen for join note event
  socket.on('join', (noteId: string) => {
    if (noteId === 'NaN') {
      return;
    }
    console.log(`User joined note ${noteId}`);
    // Join the note room
    socket.join(noteId);

    // Send current note content to the new user
    if (notes[noteId]) {
      socket.emit('noteContent', notes[noteId].content);
      socket.emit('noteTitle', { noteId, title: notes[noteId].title });
    } else {
      console.log("no note content found");
    }
  });

  // Listen for note content updates
  socket.on('noteContent', (data: {noteId: string, content: string}) => {
    console.log(`Note content updated: ${data.noteId}`);
    if (!notes[data.noteId]) {
      notes[data.noteId] = { content: '', title: '' };
    }
    if (data.content === notes[data.noteId].content) {
      return;
    }
    // Update note content in memory
    notes[data.noteId].content = data.content

    // Broadcast the update to all other users in the same note room
    socket.to(String(data.noteId)).emit('noteContent', data.content);
  });

  // Listen for note title updates
  socket.on('noteTitle', (data: {noteId: string, title: string}) => {
    console.log(`Note title updated: ${data.noteId}`);
    if (!notes[data.noteId]) {
      notes[data.noteId] = { content: '', title: '' };
    }
    // Update note title in memory
    notes[data.noteId].title = data.title;

    // Broadcast the update to all other users in the same note room
    socket.to('' + data.noteId).emit('noteTitle', data);
  });


  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('message', (message) => {
    console.log('message', message);
  });

  socket.on('error', (error) => {
    console.log('Socket error', error);
  });
});

