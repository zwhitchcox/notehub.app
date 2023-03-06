import Root from '../routes/root';
import Error from '../routes/error';
import Home from '../routes/home';
import Note from '../routes/note';

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
        path: '/notes/new',
        element: <Note />,
      },
      {
        path: '/notes/:noteId',
        element: <Note />,
      },
    ],
  },
];

export default routes;
