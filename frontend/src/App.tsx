import "./App.css";
import TreeService from "./services/treeService";

function App() {
  // Przykład użycia
  const treeService = TreeService.getInstance();

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
    </>
  );
}

export default App;
