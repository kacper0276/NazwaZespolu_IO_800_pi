import "./App.scss";
import Layout from "./layout/Layout";
import TreeService from "./services/treeService";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export const API_URL = "http://localhost:3001";

function App() {
  // Przykład użycia
  const treeService = TreeService.getInstance();

  const header = <h1>Header</h1>;

  const content = (
    <Routes>
      <Route path="/" element={<h1>Main</h1>} />
    </Routes>
  );

  const footer = <h1>Footer</h1>;

  return (
    <>
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
      <Router>
        <Layout header={header} content={content} footer={footer} />
      </Router>
    </>
  );
}

export default App;
