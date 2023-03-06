import React from 'react';
import { useParams } from 'react-router-dom';
import NoteEditor from '../components/NoteEditor';

const NoteRoutes: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  if (!noteId) {
    return <div>Invalid note ID</div>;
  }
  return (
    <NoteEditor noteId={parseInt(noteId)} />
  );
};

export default NoteRoutes;

