import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {

    return (
        <nav className="navbar">
            <div className="navbar-nav-list">
                <button className="btn btn-sm">
                    <Link to='/' className="navbar-nav-list-link">Home</Link>
                </button>
                <button className="btn btn-sm">
                    <Link to='/create' className="navbar-nav-list-link">Create</Link>
                </button>
            </div>
        </nav>
    )
}
