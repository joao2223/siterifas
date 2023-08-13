import React from 'react';
import { AuthProvider } from './authContext';
import Admin from './pages/Admin';
import Inicio from './pages/Inicio';
import PedidosAdmin from './pages/PedidosAdmin';
import RifasAdmin from './pages/RifasAdmin';

function App() {
    return (
        <AuthProvider>
            <Admin/>
        </AuthProvider>
    );
}

export default App;
