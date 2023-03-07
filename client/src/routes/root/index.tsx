import Container from "./container";
import MainContent from "./main-content";
import Sidebar from "./sidebar";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadNotes } from "../../features/notes";

const Root: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadNotes());
  }, [dispatch]);
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
