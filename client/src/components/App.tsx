import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./ThemeProvider";
import { ConnectionProvider } from "./ConnectionProvider";
import { Layout } from "./Layout";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ConnectionProvider>
          <Layout />
        </ConnectionProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
