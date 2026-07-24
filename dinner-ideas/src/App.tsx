import DinnerList from 'components/DinnerList/DinnerList';
import './App.css';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import Navbar from 'components/Navbar/Navbar';
import { DinnerItemContext, useDiinnerItemListContext } from 'hooks/useDinnerItemListContext';
import DinnerItemEditor from 'components/DinnerItemEditor/DinnerItemEditor';
import Generate from 'components/Generate/Generate';
import Login from 'components/Login/Login';
import { AuthProvider, useAuth } from 'hooks/useAuth';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div className="loading-screen">Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <Outlet />;
};

const AppRoutes = () => {
    const context = useDiinnerItemListContext();

    const NavbarWrapper = () => (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );

    const router = createBrowserRouter([
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/",
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/",
                    element: <NavbarWrapper />,
                    children: [
                        {
                            path: "/",
                            element: <DinnerList />
                        },
                        {
                            path: "/create",
                            element: <DinnerItemEditor create={true} />
                        },
                        {
                            path: "/generate",
                            element: <Generate />
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

const App = () => (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
);

export default App;
