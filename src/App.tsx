import { TemaProvider } from './temaContext';
import Inicio from './pages/Inicio';

function App() {
    return (
        <TemaProvider>
            <Inicio />
        </TemaProvider>
    );
}

export default App;
