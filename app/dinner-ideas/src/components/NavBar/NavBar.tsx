import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import "./NavBar.scss";

export default function NavBar() {

    return (
        <nav className="navbar">
            <div className="navbar-nav-list">
                <div className="navbar-nav-list-item">
                    <Button variant="contained">
                        <Link to='/' className="navbar-nav-list-link">Home</Link>
                    </Button>
                </div>
                <div className="navbar-nav-list-item">
                    <Button variant="contained">
                        <Link to='/create' className="navbar-nav-list-link">Create</Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}
