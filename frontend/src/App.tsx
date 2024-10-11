import "./App.css";
import TreeService from "./services/treeService";

function App() {
  // Przykład użycia
  const treeService = TreeService.getInstance();

  return (
    <>
      <div>{treeService.generateTreeSapling()}</div>
    </>
  );
}

export default App;
