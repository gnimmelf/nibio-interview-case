import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./ThemeProvider";
import { Layout } from "./Layout";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
