import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    useTheme,
} from "@mui/material";
import {
    Article as ArticleIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CrossCircleIcon,
    OpenInNew as OpenInNewIcon,

} from "@mui/icons-material";
import { api } from "../utils/api";

export function Landing() {
    const theme = useTheme();
    const [serverStatus, setServerStatus] = useState("offline");
    const [loading, setLoading] = useState(true);
    const [healthTimestamp, setHealthTimestamp] = useState("");
    const docsUrl = import.meta.env.VITE_API_DOCS_URL;

    const getServerHealth = async () => {
        try {
            setLoading(true);
            const data = await api.get("/health");
            setServerStatus(data.status === "ok" ? "online" : "offline");
            setHealthTimestamp(data.timestamp);
            console.info("serverHealth: Online")
        } catch (err) {
            console.error("Failed to reach server:", err);
            setServerStatus("offline");
            console.warn("serverHealth: Offline")
        } finally {
            const delay = setTimeout(() => {
                setLoading(false);
                }, 3000);
            return () => {
                clearTimeout(delay);
            };
        };
    };
    
    useEffect(() => {
        getServerHealth();
    }, []);

    return (
        <Box sx={{ maxWidth: 1200, minHeight: "85vh", mx: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Box>
                {/* Hero Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        mb: 4,
                        borderRadius: 3,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                    }}
                >
                    <Box sx={{ maxWidth: "75%" }}>
                        <Typography variant="h1" sx={{ mb: 2, color: "inherit" }}>
                            AIESEC Exchange Analytics Platform
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 400, lineHeight: 1.6 }}>
                            An analytics platform for monitoring and analysing data related to AIESEC exchange programs.
                            Uses the same endpoints as https://expa.aiesec.org/analytics/graphical
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <Button
                                variant="contained"
                                size="large"
                                href={docsUrl}
                                target="__blank"
                                startIcon={<ArticleIcon />}
                                endIcon={<OpenInNewIcon sx={{ fontSize: 18 }} />}
                                sx={{
                                    backgroundColor: "white",
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    px: 3,
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                API Documentation
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                href="/dashboard"
                                sx={{
                                    borderColor: "white",
                                    color: "white",
                                    fontWeight: 600,
                                    px: 3,
                                    "&:hover": {
                                        borderColor: "white",
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                Go to Dashboard
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Project Information */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor:`${theme.palette.secondary.dark}10`,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                AIESEC GST 2026.1  - GID Project Manager Application
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This project was made by Armaan Jhanji as part of the functional questions for the Project Manager Application.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* Server Status Card */}
            {(loading ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: `${theme.palette.secondary.dark}10`,
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <CircularProgress sx={{ color: theme.palette.primary.main }} />
                    </Paper>
                ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: `${serverStatus === "online" ? `${theme.palette.success.main}15` : `${theme.palette.error.main}15`}`,
                            boxShadow: "none",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                            {(serverStatus === "online" ? <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 40 }} /> : <CrossCircleIcon sx={{ color: theme.palette.error.main, fontSize: 40 }} />)}
                            <Box>
                                <Box sx={{ display: "flex" }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {serverStatus === "online" ? `Server is online` : "Unable to reach server"}
                                    </Typography>
                                    {(serverStatus === "online" ? (
                                        <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.8, ml: 2 }}>
                                            {healthTimestamp}
                                        </Typography>
                                        ) : (<></>)
                                    )}
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Protection against production Render instance spinning down. If server is offline, please wait 30s and refresh the page, or reload status from the navbar.
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                )
            )}
        </Box>
    );
}
