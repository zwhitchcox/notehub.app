import Container from "./container";
import MainContent from "./main-content";
import Sidebar from "./sidebar";
import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { RootState } from "../../store/root";
import { useSelector } from "react-redux";

const Root: React.FC = () => {
  const location = useLocation();
  const canvas = useSelector((state: RootState) => state.canvas);

  useEffect(() => {
    try {
      canvas.canvas?.dispose();
    } catch (err) {
      console.log("couldn't dispose canvas");
      // might've already been disposed
    }
  }, [location, canvas.canvas]);

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
