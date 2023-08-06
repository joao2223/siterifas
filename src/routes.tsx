import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Compra from './pages/Compra';
import Inicio from './pages/Inicio';
import MinhasRifas from './pages/MinhasRifas';
import Rifas from './pages/Rifas';
import Sorteios from './pages/Sorteios';

export default function AppRouter() {
    return (
        <main>
            <Router>
                <Routes>
                    <Route index path= '/' element={<Inicio/>} />
                    <Route path='/rifas' element={<Rifas/>} />
                    <Route path='/compra/:id' element={<Compra/>} />
                    <Route path='/sorteios' element={<Sorteios/>}/>
                    <Route path='/minhasrifas' element={<MinhasRifas/>}/>
                </Routes>
            </Router>
        </main>
    )
}