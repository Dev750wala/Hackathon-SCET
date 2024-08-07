import { WavyBackground } from "./components/ui/wavy-background";
import './App.css'

function App() {

  return (
    <>
      <div className="fixed inset-0 w-full h-full z-[-1]">
        <WavyBackground className="max-w-4xl mx-auto pb-40 overflow-x-hidden" />
        <div className="relative z-10">
          {/* Your page content */}
        </div>
      </div>
      {/* <div className="">
      </div> */}
    </>
  )
}

export default App
