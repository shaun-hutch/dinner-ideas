import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            Dinner Ideas
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/create" className="menu-item">Create</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* <div className="navbar-nav-list">
                <
                <button className="btn btn-sm">
                    <Link to='/' className="navbar-nav-list-link">Home</Link>
                </button>
                <button className="btn btn-sm">
                    <Link to='/create' className="navbar-nav-list-link">Create</Link>
                </button>
            </div> */}
    </nav>
  );
}
