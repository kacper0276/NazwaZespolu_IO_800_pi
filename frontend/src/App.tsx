import "./App.scss";
import Layout from "./layout/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// import TreeService from "./services/treeService";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import MainPage from "./pages/MainPage";
import Sidebar from "./layout/Sidebar/Sidebar";
import { UserProvider } from "./context/UserContext";

const user = {
  name: "Louis Carter",
  profilePicture: "https://via.placeholder.com/80",
  profileLink: "/profile",
};
const content = (
  <>
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<MainPage />} />
      <Route path="/welcome-page" element={<WelcomePage />} />
      <Route path="/register-page" element={<RegisterPage />} />
    </Routes>
  </>
);

const header = (
  <>
    <Routes>
      <Route path="/welcome-page" element={<></>} />
      <Route path="/register-page" element={<></>} />
      <Route path="*" element={<></>} />
    </Routes>
  </>
);
const sidebar = (
  <Routes>
    <Route path="/welcome-page" element={<></>} />
    <Route path="/register-page" element={<></>} />
    <Route path="*" element={<Sidebar user={user} />} />
  </Routes>
);

const footer = (
  <>
    <Routes>
      <Route path="/welcome-page" element={<></>} />
      <Route path="/register-page" element={<></>} />
      <Route path="*" element={<></>} />
    </Routes>
  </>
);

function App() {
  // const treeService = TreeService.getInstance();

  {
    /*
      <div
        dangerouslySetInnerHTML={{
          __html: treeService.generateTreeSapling(),
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: treeService.generateTreeWithLeaves(),
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: treeService.generateTreeWithoutLeaves(),
        }}
      />
      */
  }

  return (
    <UserProvider>
      <Router>
        <Layout
          header={header}
          content={content}
          sidebar={sidebar}
          footer={footer}
        />
      </Router>
    </UserProvider>
  );
}

export default App;
