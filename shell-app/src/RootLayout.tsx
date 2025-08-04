// src/RootLayout.tsx
import { BrowserRouter, Link } from 'react-router-dom';

export const RootLayout = () => (
    <BrowserRouter>
        <header>
            <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>
                <Link to="/campus">Campus (Angular)</Link>
                <Link to="/admin">Administración (React)</Link>
            </nav>
        </header>
        {/* single-spa montará las aplicaciones aquí abajo */}
        <main id="single-spa-application"></main>
    </BrowserRouter>
);