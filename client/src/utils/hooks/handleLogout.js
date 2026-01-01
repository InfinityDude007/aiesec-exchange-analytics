import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";

export function useLogout({ redirectTo = "/" } = {}) {
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const logout = useCallback(async () => {
        try {
            setLoggingOut(true);
            await api.post("/auth/logout");

            localStorage.clear();
            sessionStorage.clear();

            navigate(redirectTo, { replace: true });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setLoggingOut(false);
        }
    }, [navigate, redirectTo]);

    return {
        logout,
        loggingOut,
    };
}
