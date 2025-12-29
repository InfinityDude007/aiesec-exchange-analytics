import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { Header } from "../components/Header";
import { Filters } from "../components/Filters";
import { api } from "../utils/api";

export function KPIs() {
    const theme = useTheme();
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchAnalytics = async (filters) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.get("/analytics", filters);
            setData(res.analytics);

        } catch (err) {
            console.error(err);
            setError("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    const KpiCard = ({ label, value }) => (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                textAlign: "center",
                minWidth: 160,
            }}
        >
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
                {value}
            </Typography>
        </Paper>
    );
    
    return (
        <Box sx={{ maxWidth: 1200, minHeight: "85vh", mx: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Box>

                <Header title={"Key Performance Indicators"} subtitle={"Understand the performance of an entity through an overview of various metrics"} />
                <Filters
                    isLoading={loading}
                    onChange={(filters) => {
                        setFilters(filters);
                        fetchAnalytics(filters);
                    }}
                />

                {loading && (
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {data && (
                    <Paper sx={{ mt: 4, p: 3 }}>
                        <Typography variant="h6">Results</Typography>

                        <pre style={{ fontSize: 12 }}>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </Paper>
                )}

            </Box>
        </Box>
    );
}
