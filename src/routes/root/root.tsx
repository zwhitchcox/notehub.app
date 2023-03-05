import Container from "./container";
import MainContent from "./main-content";
import Sidebar from "./sidebar";
import { Outlet } from "react-router";

const Root: React.FC = () => {

  return (
    <Container>
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </Container>
  );
};
export default Root
