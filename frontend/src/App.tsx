import "./App.scss";
import Layout from "./layout/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import TreeService from "./services/treeService";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import RegisterPage from "./pages/RegisterPage";

export const API_URL = "http://localhost:3001";

const content = (
  <>
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<h1>Czesc</h1>} />
      <Route path="/Welcome-Page" element={<WelcomePage />} />
      <Route path="/Register-Page" element={<RegisterPage />} />
    </Routes>
  </>
);
function App() {
  const treeService = TreeService.getInstance();

  const header = <h1>Header</h1>;
  const footer = <h1>Footer</h1>;

  return (
    <>
      {/*
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
      */}
      <Router>
        <Routes>
          {/* Strona główna z Headerem i Footerem */}
          <Route
            path="/"
            element={
              <Layout header={header} content={<h1>Main</h1>} footer={footer} />
            }
          />

          {/* Strona bez Headera i Footera */}
          <Route
            path="/welcome-page"
            element={
              <Layout
                header={header}
                content={<WelcomePage />}
                footer={footer}
                hideHeaderFooter
              />
            }
          />
          <Route
            path="/register-page"
            element={
              <Layout
                header={header}
                content={<RegisterPage />}
                footer={footer}
                hideHeaderFooter
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
