import "./App.scss";
import Layout from "./layout/Layout";
import 'bootstrap/dist/css/bootstrap.min.css';
import TreeService from "./services/treeService";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Header from "./layout/Header/Header";
import Footer from "./layout/Footer/Footer";
import WelcomePage from "./pages/WelcomePage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import Navigation from "./layout/UI/Navigation";

export const API_URL = "http://localhost:3001";

const header = (
  <Header>
    <Routes>
      <Route path="/Register-Page" element={<></>} />
      <Route path="/Welcome-Page" element={<></>} />
      <Route path="*" element={<Navigation />} />
    </Routes>
  </Header>
);

const content = (
  <>
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/Welcome-Page" element={<WelcomePage />} />
      <Route path="/Register-Page" element={<RegisterPage />}/>
    </Routes>
  </>
)

const footer=(
  <Routes>
    <Route path="/Register-Page" element={<></>} />
    <Route path="/Welcome-Page" element={<></>} />
    <Route path="*" element={<Footer />} />
  </Routes>
);
const App = () => {
  const treeService = TreeService.getInstance();

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
      <DataProvider>
        <Router>
            <Layout header={header} content={content} footer={footer}/>
        </Router>
      </DataProvider>
    </>
  );
};


export default App;
