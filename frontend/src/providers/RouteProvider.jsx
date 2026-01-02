import { RouterProvider } from "react-aria-components";
import { useHref, useNavigate } from "react-router-dom";

export const RouteProvider = ({ children }) => {
    const navigate = useNavigate();

    return (
        <RouterProvider navigate={navigate} useHref={useHref}>
            {children}
        </RouterProvider>
    );
};