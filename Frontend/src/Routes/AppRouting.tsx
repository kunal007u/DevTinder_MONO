import { createBrowserRouter, RouterProvider } from "react-router";
import { Routing } from "./Routing";
import Login from "../Pages/Login";
import PublicLayout from "../Layout/PublicLayout";
import { PrivateRoute } from "../Layout/PrivateRoute";

const routesConfig = [
    // --- PUBLIC ROUTES LAYER ---
    {
        element: <PublicLayout />, // Acts as a parent layout component housing an <Outlet />
        children: [
            { path: Routing.Login, element: <Login /> },
        ],
    },

    // --- PROTECTED ROUTES LAYER ---

    {
        element: <PrivateRoute />,
        children: [
            // { path: Routing.EmployeeDashboard, element: <EmployeeDashboard /> },

        ],
    }

];


const routes = createBrowserRouter(routesConfig);

const AppRouting = () => {
    return <RouterProvider router={routes} />;
};

export default AppRouting;