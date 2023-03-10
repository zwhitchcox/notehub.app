import Container from "./container";
import MainContent from "./main-content";
import Sidebar from "./sidebar";
import { Outlet } from "react-router";
import { useDispatch } from "react-redux";
import { loadNotes } from "../../features/notes";

const Root: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(loadNotes());
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
