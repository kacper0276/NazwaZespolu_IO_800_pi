import "./App.scss";
import Layout from "./layout/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// import TreeService from "./services/treeService";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ChallengeCreation from "./pages/ChallengeCreation/ChallengeCreation";
import MainPage from "./pages/MainPage";
import Sidebar from "./layout/Sidebar/Sidebar";
import { UserProvider } from "./context/UserContext";
import AuthenticatedRoute from "./hoc/AuthenticatedRoute";
import NoAuthenticatedRoute from "./hoc/NoAuthenticatedRoute";
import ActivateAccount from "./pages/ActivateAccount/ActivateAccount";
import Messages from "./pages/Messages/Messages";
import Settings from "./pages/Settings/Settings";
import { isMobile, isTablet } from "react-device-detect";

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
      <Route
        path="/welcome-page"
        element={
          <NoAuthenticatedRoute>
            <WelcomePage />
          </NoAuthenticatedRoute>
        }
      />
      <Route
        path="/create-challenge"
        element={
          <NoAuthenticatedRoute>
            <ChallengeCreation />
          </NoAuthenticatedRoute>
        }
      />
      <Route
        path="/register-page"
        element={
          <NoAuthenticatedRoute>
            <RegisterPage />
          </NoAuthenticatedRoute>
        }
      />
      <Route
        path="/profile-page"
        element={
          <AuthenticatedRoute>
            <ProfilePage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <AuthenticatedRoute>
            <Messages />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/activate-account/:userEmail"
        element={
          <NoAuthenticatedRoute>
            <ActivateAccount />
          </NoAuthenticatedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthenticatedRoute>
            <Settings />
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
    <Route path="/activate-account/:userEmail" element={<></>} />
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

  if (isMobile || isTablet) {
    return (
      <div className="mobile-placeholder">
        <h1>Skorzystaj z naszej aplikacji mobilnej</h1>
        <p>Pobierz aplikację mobilną lub odwiedź naszą stronę na komputerze.</p>
        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Pobierz aplikację
        </a>
      </div>
    );
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
