import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStickyNote,
  faBars,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const Container = ({ children }) => (
  <div className="flex h-screen">{children}</div>
);

const Sidebar = ({ children, collapsed, setCollapsed }) => (
  <div
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
        <button onClick={() => setCollapsed(!collapsed)}>
          <FontAwesomeIcon icon={faBars} size="2x" />
        </button>
        {collapsed ? "" : (
          <Link to={`/`} className="block text-3xl font-bold text-white no-underline mr-auto ml-auto w-full text-center uppercase font-handwritten px-4">
              Notes
          </Link>
        )}
      </div>
    </div>
    {children}
    <div className={`mt-auto`}>
      <NewNoteButton collapsed={collapsed} />
    </div>
  </div>
);


const SidebarLink = ({ to, children }) => (
  <Link
    to={to}
    className="block w-full text-lg text-white no-underline py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition duration-300"
  >
    {children}
  </Link>
);

const SidebarList = ({ children }) => (
  <ul className="list-none m-0 p-0">{children}</ul>
);

const SidebarListItem = ({ children }) => (
  <li className="w-full mb-4">{children}</li>
);

const MainContent = ({ children }) => (
  <main className="flex-1 p-4">{children}</main>
);

const NewNoteButton = ({collapsed}) => (
  <button className="bg-blue-500 text-white text-lg w-full font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
    <FontAwesomeIcon icon={faPlus} />
    {collapsed ? "" : <span className="ml-2">New Note</span>}
  </button>
);

const Root: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Container>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
        <nav>
          <SidebarList>
            <SidebarListItem>
              <SidebarLink to={`/note`}>Note</SidebarLink>
            </SidebarListItem>
          </SidebarList>
        </nav>
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </Container>
  );
};

export default Root;


