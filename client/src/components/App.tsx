import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./ThemeProvider";
import { GameProvider } from "./GameProvider";
import { Layout } from "./Layout";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <GameProvider>
          <Layout />
        </GameProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
