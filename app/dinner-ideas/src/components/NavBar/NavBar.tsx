import { Link } from 'react-router-dom';
import './NavBar.css';

export interface NavBarProps
{
  username: string;
  signout?: () => void;
}

export default function NavBar(props: NavBarProps) {
  return (
    <nav className="navbar">
      <div className="navbar bg-base-100">
        <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>Hello, {props.username}</li>
        </ul>
        </div>
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
    </nav>
  );
}
