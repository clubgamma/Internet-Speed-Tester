import { ThemeProvider } from "./components/theme-provider"
import SpeedTest from "./components/SpeedTest"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SpeedTest />
    </ThemeProvider>
  )
}

export default App