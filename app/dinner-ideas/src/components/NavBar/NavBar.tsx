import { Link } from "react-router-dom";
import "./NavBar.scss";

export default function NavBar() {

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href='/create'>Create</a>
                </li>
            </ul>
        </nav>
    )
}
