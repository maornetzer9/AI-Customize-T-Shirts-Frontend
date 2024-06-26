import Home from './pages/Home';
import CanvasModel from './canvas/index';
import Customizer from './pages/Customizer';
import './index.css'

function App() {
    return (
        <main className="app transition-all ease-in">
            <Home />
            <CanvasModel />
            <Customizer />
        </main>
    );
}

export default App;
