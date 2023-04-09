import './NavBar.scss';

const NavBar: React.FC<any> = () => {
    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Dinner Ideas</a>
            </div>
        </nav>
    )
};

export default NavBar;