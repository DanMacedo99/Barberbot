import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (

        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/perfil">Perfil</Link></li>
                <li><Link to="/configuracoes">Configurações</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;