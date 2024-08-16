import DinnerList from 'components/DinnerList/DinnerList';
import './App.css';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Navbar from 'components/Navbar/Navbar';
import { DinnerItemContext, useDiinnerItemListContext } from 'hooks/useDinnerItemListContext';
import DinnerItemEditor from 'components/DinnerItemEditor/DinnerItemEditor';

const App = () => {

    const NavbarWrapper = () => {
        return (
            <div>
                <Navbar />
                <Outlet />
            </div>
        )
    };

    const context = useDiinnerItemListContext();
    

    const router = createBrowserRouter([
        {
            path: "/",
            element: <NavbarWrapper/>,
            children: [
                {
                    path: "/",
                    element: <DinnerList/>
                },
                {
                    path: "/create",
                    element: <>create page</>
                },
                {
                    path: "/generate",
                    element: <>generate page</>
                },
                {
                    path: "/edit/:dinnerItemId",
                    element: <DinnerItemEditor />
                },
                {
                    path: "/view/:dinnerItemId",
                    element: <DinnerItemEditor readOnly={true} />
                }
            ]
        }
    ]);


    return (
        <DinnerItemContext.Provider value={context}>
            <div className="body">
                <RouterProvider router={router} />
            </div>
        </DinnerItemContext.Provider>
    );
};

export default App;
