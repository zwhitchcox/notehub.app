import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { NewNoteButton } from "./new-note-button";
import { RootState } from "../../store/root";
import { useDispatch, useSelector } from "react-redux";
import { setCollapsed } from "../../features/sidebar";
import { maximizeCanvas } from "../../features/canvas";
import Link from "../../components/Link";


const SidebarLink = ({ to, children, collapsed }) => (
  (collapsed ? null : <Link
    to={to}
    className="block w-full text-lg text-white no-underline py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition duration-300"
  >
    {children}
  </Link>)
);

const SidebarList = ({ children }) => (
  <ul className="list-none m-0 p-0">{children}</ul>
);

const SidebarListItem = ({ children }) => (
  <li className="w-full mb-4">{children}</li>
);

const SidebarContainer = ({ children, collapsed, toggleCollapsed }) => (
  <div
    id="sidebar"
    className={`${
      collapsed ? "w-16" : "min-w-240"
    } bg-gray-900 text-white h-full flex flex-col justify-start items-left py-2 px-4 transition-all duration-300`}
  >
    <div
      className={`flex justify-between items-center mb-8 ${
        collapsed ? "w-full" : ""
      }`}
    >
      <div className="flex items-center w-full">
        <button onClick={toggleCollapsed}>
          <FontAwesomeIcon icon={faBars} size="2x" />
        </button>
        {collapsed ? "" : (
          <Link to={`/`} className="block text-3xl font-bold text-white no-underline mr-auto ml-auto w-full text-center font-handwritten px-4">
              NoteHub
          </Link>
        )}
      </div>
    </div>
    {children}

      <div className={`mt-auto`}>
      </div>
      <div className={`mt-auto`}>
      <Link to={`/notes/` + Date.now()}>
        <NewNoteButton collapsed={collapsed} />
      </Link>
      </div>
  </div>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.sidebar.collapsed);
  const notes = useSelector((state: RootState) => state.notes);

  const handleToggle = () => {
    dispatch(setCollapsed(!collapsed));
    setTimeout(() => {
      dispatch(maximizeCanvas());
    }, 0);
  }
  return (
    <SidebarContainer collapsed={collapsed} toggleCollapsed={handleToggle}>
      <nav>
        <SidebarList>
          {notes.notes.map((note) => (
            <SidebarListItem key={note.id}>
              <SidebarLink collapsed={collapsed} to={`/notes/${note.id}`}>{note.title}</SidebarLink>
            </SidebarListItem>
          ))}
        </SidebarList>
      </nav>
    </SidebarContainer>
  )
}

export default Sidebar;
