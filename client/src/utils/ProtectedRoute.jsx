import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { api } from "./api";

export function ProtectedRoute() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [grant, setGrant] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await api.get("/auth/status");

                if (!cancelled) {
                    setGrant(Boolean(data?.loggedIn));
                }
            } catch (err) {
                if (!cancelled) setGrant(false);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [location.pathname]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", minHeight: "80vh", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress size="60px" sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    if (!grant) {
        const next = encodeURIComponent(location.pathname);
        return <Navigate to={`/login?next=${next}`} replace />;
    }

    return <Outlet />;
}
