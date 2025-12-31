import { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Tabs,
    Tab,
    Alert,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    InputLabel,
    FormControl,
    useTheme
} from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend
} from "recharts";
import { Header } from "../components/ui/Header";
import { Filters } from "../components/ui/Filters";
import { api } from "../utils/api";
import { formatNumber } from "../utils/formatNumber";

export function Graphical() {
    const theme = useTheme();
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState(0);

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

    const buildTimeSeries = (data) => {
        if (!data) return [];

        const seriesMap = {
            "Sign Ups": { color: "#a47d7c", data: data.total_signup?.people?.buckets },
            "Applications": { color: "#4671a6", data: data.total_applications?.applications?.buckets },
            "Accepted by Host": { color: "#92a8cc", data: data.total_matched?.applications?.buckets },
            "Approvals": { color: "#aa4643", data: data.total_approvals?.applications?.buckets },
            "Realizations": { color: "#89a44f", data: data.total_realized?.applications?.buckets },
            "Remote Realizations" : { color: "#81699b", data: data.total_remote_realized?.applications?.buckets },
            "Finished": { color: "#3d96ad", data: data.total_finished?.applications?.buckets },
            "Completed": { color: "#0b352a", data: data.total_completed?.applications?.buckets },
        };

        const dates = new Set();

        Object.values(seriesMap).forEach(s =>
            s.data?.forEach(d => dates.add(d.key_as_string))
        );

        const sortedDates = Array.from(dates).sort();

        return sortedDates.map(date => {
            const row = { date };
            for (const [key, value] of Object.entries(seriesMap)) {
                const match = value.data?.find(d => d.key_as_string === date);
                row[key] = match?.doc_count ?? 0;
            }
            return row;
        });
    };

    const timeSeriesData = buildTimeSeries(data);
    const [lineType, setLineType] = useState("monotone");

    const TimeSeriesTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;
        return (
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    p: 2,
                    borderRadius: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
            >
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                    {new Date(label).toLocaleDateString(undefined, { month: "long", day: "numeric" })}
                </Typography>

                {payload.map((item) => (
                    <Box
                        key={item.dataKey}
                        sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
                    >
                        <Typography
                            sx={{
                                fontSize: "1rem",
                                color: "#555",
                            }}
                        >
                            {item.dataKey} : <span style={{ fontWeight: 600, color: item.stroke, fontSize: "1rem" }}>{formatNumber(item.value)}</span>
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    };

    const seriesConfig = {
        "Sign Ups": "#a47d7c",
        "Applications": "#4671a6",
        "Accepted by Host": "#92a8cc",
        "Approvals": "#aa4643",
        "Realizations": "#89a44f",
        "Remote Realizations": "#81699b",
        "Finished": "#3d96ad",
        "Completed": "#0b352a",
    };
    const [selectedLines, setSelectedLines] = useState(Object.keys(seriesConfig));

    return (
        <Box sx={{ maxWidth: 1200, minHeight: "85vh", mx: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", mb: 4 }}>
            <Box>

                <Header title={"Graphical Analytics"} subtitle={"Visualise detailed analytics based on time periods, with flexible filtering and interval-based aggregation (daily, weekly, or monthly)"} />
                <Filters
                    isLoading={loading}
                    onChange={(filters) => {
                        setFilters(filters);
                        fetchAnalytics(filters);
                    }}
                />

                <Paper elevation={0} sx={{ mt: 4, boxShadow: "none", backgroundColor: theme.palette.background.default, justifyContent: "center" }}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} >
                        <Tab label="Time Series" />
                        <Tab label="Filtered Time Series" />
                    </Tabs>

                    <Paper elevation={0} sx={{ minWidth: "100%", boxShadow: "none", mt: 4, backgroundColor: theme.palette.background.default }}>
                        {loading && (
                            <Box sx={{ py: 10, textAlign: "center" }}>
                                <CircularProgress size={"3rem"} />
                            </Box>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ p: 3, fontSize: "1.2rem", display: "flex", alignItems: "center" }}>
                                Failed to fetch data, please refresh the page and try again. Detail: {error}
                            </Alert>
                        )}

                        {!loading && !error && tab === 0 && data && (
                            <Box>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                                    <FormControlLabel
                                        labelPlacement="start"
                                        control={
                                            <Switch
                                                size="small"
                                                checked={lineType === "monotone"}
                                                onChange={(e) =>
                                                    setLineType(e.target.checked ? "monotone" : "linear")
                                                }
                                                color="primary"
                                            />
                                        }
                                        label={lineType === "monotone" ? "Smooth" : "Linear"}
                                    />
                                </Box>

                                <ResponsiveContainer width="100%" height={600}>
                                    <LineChart data={timeSeriesData}>
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(value) =>
                                                new Date(value).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric"
                                                })
                                            }
                                        />

                                        <YAxis />
                                        <Tooltip content={<TimeSeriesTooltip />} />

                                        <Legend
                                            formatter={(value) => (
                                                <span style={{ fontSize: 14, marginRight: "15px" }}>{value}</span>
                                            )}
                                        />

                                        <Line type={lineType} dataKey="Sign Ups" stroke="#a47d7c" strokeWidth={2} />
                                        <Line type={lineType} dataKey="Applications" stroke="#4671a6" strokeWidth={2} />
                                        <Line type={lineType} dataKey="Accepted by Host" stroke="#92a8cc" strokeWidth={2} />
                                        <Line type={lineType} dataKey="Approvals" stroke="#aa4643" strokeWidth={2} />
                                        <Line type={lineType} dataKey="Realizations" stroke="#89a44f" strokeWidth={2} />
                                        <Line type={lineType} dataKey="Remote Realizations" stroke="#81699b" strokeWidth={2} />
                                        <Line type={lineType} dataKey="Finished" stroke="#3d96ad" strokeWidth={2} />
                                        <Line type={lineType} dataKey="Completed" stroke="#0b352a" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        )}

                        {!loading && !error && tab === 0 && !data && (
                            <Paper
                                elevation={0}
                                sx={{
                                    display: "flex",
                                    p: 7,
                                    border: "1px solid #e0e0e0",
                                    justifyContent: "center",
                                    boxShadow: "none"
                                }}
                                >
                                <Typography variant="h4">
                                    Select Entity and Time Period to view the Time Series.
                                </Typography>
                            </Paper>
                        )}

                        {!loading && !error && tab === 1 && data && (
                            <Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <FormControl size="small">
                                        <InputLabel>Visible Lines</InputLabel>
                                        <Select
                                            multiple
                                            value={selectedLines}
                                            onChange={(e) => setSelectedLines(e.target.value)}
                                            label="Visible Lines"
                                            renderValue={(selected) => selected.join(", ")}
                                            sx={{
                                                backgroundColor: theme.palette.background.default,
                                                "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.background.tertiary },
                                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.palette.primary.main}80` },
                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.palette.primary.main}90` },
                                            }}
                                        >
                                            {Object.keys(seriesConfig).map((key) => (
                                                <MenuItem
                                                    key={key}
                                                    value={key}
                                                    sx={{
                                                        "&:hover": { backgroundColor: `${theme.palette.primary.main}20` },
                                                        "&.Mui-selected": { backgroundColor: `${theme.palette.primary.main}20` },
                                                    }}
                                                >
                                                    <Checkbox size="small" checked={selectedLines.includes(key)} />
                                                    <ListItemText primary={key} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControlLabel
                                        labelPlacement="start"
                                        control={
                                            <Switch
                                                size="small"
                                                checked={lineType === "monotone"}
                                                onChange={(e) =>
                                                    setLineType(e.target.checked ? "monotone" : "linear")
                                                }
                                                color="primary"
                                            />
                                        }
                                        label={lineType === "monotone" ? "Smooth" : "Linear"}
                                    />
                                </Box>

                                <ResponsiveContainer width="100%" height={600}>
                                    <LineChart data={timeSeriesData}>
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(value) =>
                                                new Date(value).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric"
                                                })
                                            }
                                        />

                                        <YAxis />
                                        <Tooltip content={<TimeSeriesTooltip />} />

                                        <Legend
                                            formatter={(value) => (
                                                <span style={{ fontSize: 14, marginRight: "15px" }}>{value}</span>
                                            )}
                                        />

                                        {Object.entries(seriesConfig)
                                            .filter(([key]) => selectedLines.includes(key))
                                            .map(([key, color]) => (
                                                <Line
                                                    key={key}
                                                    type={lineType}
                                                    dataKey={key}
                                                    stroke={color}
                                                    strokeWidth={2}
                                                />
                                            ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        )}

                        {!loading && !error && tab === 1 && !data && (
                            <Paper
                                elevation={0}
                                sx={{
                                    display: "flex",
                                    p: 7,
                                    border: "1px solid #e0e0e0",
                                    justifyContent: "center",
                                    boxShadow: "none"
                                }}
                                >
                                <Typography variant="h4">
                                    Select Entity and Time Period to view the Filtered Time Series.
                                </Typography>
                            </Paper>
                        )}

                    </Paper>
                </Paper>

            </Box>
        </Box>
    );
};