import "./App.scss";
import Layout from "./layout/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// import TreeService from "./services/treeService";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MainPage from "./pages/MainPage";
import Sidebar from "./layout/Sidebar/Sidebar";
import { UserProvider } from "./context/UserContext";
import AuthenticatedRoute from "./hoc/AuthenticatedRoute";

const user = {
  name: "Louis Carter",
  profilePicture: "https://via.placeholder.com/80",
  profileLink: "/profile",
};
const content = (
  <>
    <Routes>
      {/* Home Page */}
      <Route
        path="/"
        element={
          <AuthenticatedRoute>
            <MainPage />
          </AuthenticatedRoute>
        }
      />
      <Route path="/welcome-page" element={<WelcomePage />} />
      <Route path="/register-page" element={<RegisterPage />} />
      <Route
        path="/profile-page"
        element={
          <AuthenticatedRoute>
            <ProfilePage />
          </AuthenticatedRoute>
        }
      />
    </Routes>
  </>
);

const header = (
  <>
    <Routes>
      <Route path="/welcome-page" element={<></>} />
      <Route path="/register-page" element={<></>} />
      <Route path="/profile-page" element={<></>} />
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
      <Route path="/profile-page" element={<></>} />
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
