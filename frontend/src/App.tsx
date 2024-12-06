import "./App.scss";
import Layout from "./layout/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
// import TreeService from "./services/treeService";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

export const API_URL = "http://localhost:3001";

const content = (
  <>
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<h1>Czesc</h1>} />
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
      <Route path="*" element={<h1>Header</h1>} />
    </Routes>
  </>
);

const footer = (
  <>
    <Routes>
      <Route path="/welcome-page" element={<></>} />
      <Route path="/register-page" element={<></>} />
      <Route path="*" element={<h1>Footer</h1>} />
    </Routes>
  </>
);

function App() {
  // const treeService = TreeService.getInstance();

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
        <Layout header={header} content={content} footer={footer} />
      </Router>
    </>
  );
}

export default App;
