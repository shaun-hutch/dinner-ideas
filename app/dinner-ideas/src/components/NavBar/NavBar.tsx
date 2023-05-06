import { Link } from 'react-router-dom';
import './NavBar.css';
import { AuthButton } from '../Auth/AuthButton';
import { useCallback, useContext, useState } from 'react';
import { UserContext } from '../../App';

export interface NavBarProps
{
  onUserChange: (user: any) => void;
}

export default function NavBar(props: NavBarProps) {

  const user = useContext(UserContext) as any;


  const [username, setUsername] = useState<string>(user?.username);
  const userChange = useCallback((user: any) => {
    props.onUserChange(user);
    setUsername(user?.username);
  },[setUsername]); 


  return (
    <nav className="navbar">
      <div className="navbar bg-base-100">
        <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>Hello, {username}</li>
        </ul>
        </div>
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            Dinner Ideas
          </Link>
        </div>
        <div className="flex-1">
          <AuthButton onUserChange={userChange}/>
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
