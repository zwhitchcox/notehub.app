import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Notes!</h1>
      <p className="text-lg mb-12">
        Notes is a simple and easy-to-use note-taking app. Get started by
        creating your first note.
      </p>
      <Link
        to="/notes/new"
        className="bg-blue-500 text-white text-lg font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Create a Note
      </Link>
    </div>
  );
};

export default Home;

