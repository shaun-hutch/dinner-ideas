import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

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

    return (
        <div className="nav">
            <h1>Dinner Ideas</h1>
            <Menubar model={items}  />
        </div>
    )
};


export default Navbar;