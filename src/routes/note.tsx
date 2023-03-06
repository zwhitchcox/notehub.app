import React from 'react';
import { useParams } from 'react-router-dom';
import NoteEditor from '../components/NoteEditor';

const NoteRoutes: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  return (
    <NoteEditor noteId={parseInt(noteId || '-1')} />
  );
};

export default NoteRoutes;

