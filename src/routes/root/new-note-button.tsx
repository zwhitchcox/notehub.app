import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

export const NewNoteButton = ({ collapsed }) => (
  <button className="bg-blue-500 text-white text-lg w-full font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
    <FontAwesomeIcon icon={faPlus} />
    {collapsed ? "" : <span className="ml-2">New Note</span>}
  </button>
);

export const SaveNoteButton = ({ collapsed }) => (
  <button className="bg-blue-500 text-white text-lg w-full font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
    <FontAwesomeIcon icon={faSave} />
    {collapsed ? "" : <span className="ml-2">New Note</span>}
  </button>
);
