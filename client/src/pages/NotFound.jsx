import { Box, Typography, Button } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                textAlign: "center",
            }}
            >
            <Typography variant="h1" sx={{ mb: 2, fontSize: "6rem", fontWeight: 700, opacity: 0.3 }}>
                404
            </Typography>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                The page you're looking for doesn't exist or has been moved.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
            >
                Go to Home
            </Button>
        </Box>
    );
}
