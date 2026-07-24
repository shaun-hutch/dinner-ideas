import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const items: MenuItem[] = [
        {
            label: 'Dinner Items',
            icon: 'pi pi-bars',
            command: () => navigate('/')
        },
        {
            label: 'Create',
            icon: 'pi pi-cart-plus',
            command: () => navigate('/create')
        },
        {
            label: 'Generate',
            icon: 'pi pi-sync',
            command: () => navigate('/generate')
        }
    ];

    const end = (
        <div className="nav-end">
            {user && <span className="nav-user">{user.email}</span>}
            <Button
                icon="pi pi-sign-out"
                className="p-button-text p-button-sm"
                onClick={logout}
                tooltip="Sign out"
                tooltipOptions={{ position: "left" }}
            />
        </div>
    );

    return (
        <div className="nav">
            <h1>Dinner Ideas</h1>
            <Menubar model={items} end={end} />
        </div>
    )
};

export default Navbar;
