import Note from './routes/note';
import Root from './routes/root/root';
import Error from './routes/error';
import Home from './routes/home';

export const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/notes/:noteId',
        element: <Note />,
      },
    ],
  },
];

