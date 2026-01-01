import { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Tabs,
    Tab,
    Alert,
    Grid,
    useTheme
} from "@mui/material";
import { 
    PersonAddAlt as SignUpIcon,
    DocumentScanner as ApplicationIcon,
    Public as HostIcon,
    Approval as ApprovalIcon,
    Event as RealiseIcon,
    RssFeed as RemoteIcon,
    SportsScore as FinishedIcon,
    FactCheck as CompletedIcon
} from "@mui/icons-material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
    FunnelChart,
    Funnel,
    LabelList
} from "recharts";
import { Header } from "../components/ui/Header";
import { Filters } from "../components/ui/Filters";
import { ChartInfo } from "../components/ChartInfo";
import { CustomTooltip } from "../components/CustomTooltip";
import { useAnalytics } from "../utils/hooks/fetchAnalytics";
import { formatNumber } from "../utils/formatNumber";
import { calculatePercentage } from "../utils/calculatePercentage";

export function KPIs() {
    const theme = useTheme();
    const [filters, setFilters] = useState({});
    const [tab, setTab] = useState(0);
    const { data, loading, error, fetchAnalytics } = useAnalytics();

    const metrics = data ? [
            { label: "Sign Ups", value: data.total_signup.doc_count, fontColor: "#a47d7c", icon: <SignUpIcon sx={{ color: "#a47d7c", fontSize: "2rem" }} /> },
            { label: "Applications", value: data.total_applications.doc_count, fontColor: "#4671a6", icon: <ApplicationIcon sx={{ color: "#4671a6", fontSize: "2rem" }} />  },
            { label: "Accepted by Host", value: data.total_matched.doc_count, fontColor: "#92a8cc", icon: <HostIcon sx={{ color: "#92a8cc", fontSize: "2rem" }} />  },
            { label: "Approvals", value: data.total_approvals.doc_count, fontColor: "#aa4643", icon: <ApprovalIcon sx={{ color: "#aa4643", fontSize: "2rem" }} />  },
            { label: "Realizations", value: data.total_realized.doc_count, fontColor: "#89a44f", icon: <RealiseIcon sx={{ color: "#89a44f", fontSize: "2rem" }} />  },
            { label: "Remote Realizations", value: data.total_remote_realized.doc_count, fontColor: "#81699b", icon: <RemoteIcon sx={{ color: "#81699b", fontSize: "2rem" }} />  },
            { label: "Finished", value: data.total_finished.doc_count, fontColor: "#3d96ad", icon: <FinishedIcon sx={{ color: "#3d96ad", fontSize: "2rem" }} />  },
            { label: "Completed", value: data.total_completed.doc_count, fontColor: "#0b352a", icon: <CompletedIcon sx={{ color: "#0b352a", fontSize: "1.8rem" }} />  },
        ] : [];
    
    const chartData = metrics.map(metric => ({
        name: metric.label,
        value: metric.value,
        color: metric.fontColor
    }));

    const totalApplications = data?.total_applications?.doc_count ?? 0;
    const funnelData = [
        {
            name: "Sign Ups",
            value: data?.total_signup?.doc_count ?? 0,
            color: "#a47d7c",
            ...calculatePercentage()
        },
        {
            name: "Applications",
            value: data?.total_applications?.doc_count ?? 0,
            color: "#4671a6",
            ...calculatePercentage(
                totalApplications,
                data?.total_signup?.doc_count ?? 0,
                "total sign ups"
            )
        },
        {
            name: "Accepted by Host",
            value: data?.total_matched?.doc_count ?? 0,
            color: "#92a8cc",
            ...calculatePercentage(
                data?.total_matched?.doc_count ?? 0,
                totalApplications,
                "total applications"
            )
        },
        { 
            name: "Approvals",
            value: data?.total_approvals?.doc_count ?? 0,
            color: "#aa4643",
            ...calculatePercentage(
                data?.total_approvals?.doc_count ?? 0,
                totalApplications,
                "total applications",
                data?.total_matched?.doc_count ?? 0,
                "applications accepted by host",
            )
        },
        { 
            name: "Realizations",
            value: data?.total_realized?.doc_count ?? 0,
            color: "#89a44f" ,
            ...calculatePercentage(
                data?.total_realized?.doc_count ?? 0,
                totalApplications,
                "total applications",
                data?.total_approvals?.doc_count ?? 0,
                "approved applications"
            )
        },
        { 
            name: "Remote Realizations",
            value: data?.total_remote_realized?.doc_count ?? 0,
            color: "#81699b",
            ...calculatePercentage(
                data?.total_remote_realized?.doc_count ?? 0,
                totalApplications,
                "total applications",
                data?.total_approvals?.doc_count ?? 0,
                "approved applications",
            )
        },
        { 
            name: "Finished",
            value: data?.total_finished?.doc_count ?? 0,
            color: "#3d96ad",
            ...calculatePercentage(
                data?.total_finished?.doc_count ?? 0,
                totalApplications,
                "total applications",
                data?.total_realized?.doc_count ?? 0,
                "total applications realized"
            )

        },
        { 
            name: "Completed",
            value: data?.total_completed?.doc_count ?? 0,
            color: "#0b352a" ,
            ...calculatePercentage(
                data?.total_completed?.doc_count ?? 0,
                totalApplications,
                "total applications",
                data?.total_realized?.doc_count ?? 0,
                "total applications realized"
            )
        }
    ];
    const filteredFunnelData = funnelData.filter(item => item.value > 0);
    const skippedFunnelData = funnelData.filter(item => item.value === 0);

    const FunnelTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;
        const { name, color, percentage1, label1, percentage2, label2 } = payload[0].payload;
        return (
            <Box
                sx={{
                    backgroundColor: "background.paper",
                    p: 2,
                    borderRadius: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5
                }}
            >
                <Typography fontSize="1rem" fontWeight={600}>{name}</Typography>
                <Typography fontSize="0.95rem">
                    <span style={{ fontWeight: 600, color }}>
                        {percentage1}
                    </span>
                    {" "} {label1}
                </Typography>
                <Typography fontSize="0.95rem">
                    <span style={{ fontWeight: 600, color }}>
                        {percentage2}
                    </span>
                    {" "} {label2}
                </Typography>
            </Box>
        );
    };

    const KpiCard = ({ label, value, icon, fontColor }) => (
        <Box
            sx={{
                bgcolor: "white",
                borderRadius: "12px",
                p: 3,
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                minWidth: "17rem",
                gap: 2
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Typography 
                    variant="body2"
                    sx={{
                        fontSize: "16.5px",
                        fontWeight: 600,
                    }}
                >
                    {label}
                </Typography>
                {icon}
            </Box>
                <Typography
                    variant="h5" 
                    fontWeight="bold"
                    sx={{
                        fontSize: "24px",
                        fontWeight: 600,
                        color: fontColor
                    }}
                >
                    {formatNumber(value)}
                </Typography>
        </Box>
    );
    
    return (
        <Box sx={{ maxWidth: 1200, minHeight: "85vh", mx: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", mb: 4 }}>
            <Box>

                <Header title={"KPIs Dashboard"} subtitle={"Understand the performance of an entity through an overview of various metrics and success indicators"} />
                <Filters
                    isLoading={loading}
                    onChange={(filters) => {
                        setFilters(filters);
                        fetchAnalytics(filters);
                    }}
                />

                <Paper elevation={0} sx={{ mt: 4, boxShadow: "none", backgroundColor: theme.palette.background.default, justifyContent: "center" }}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} >
                        <Tab label="Overview" />
                        <Tab label="KPI Distribution" />
                        <Tab label="Conversion Funnel" />
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
                                    Select Entity and Time Period to view the Overview.
                                </Typography>
                            </Paper>
                        )}

                        {!loading && !error && tab === 0 && data && (
                            <Box>
                                <Grid container spacing={3} justifyContent={"center"}>
                                    {metrics.map((metric) => (
                                        <Grid key={metric.label}>
                                            <KpiCard label={metric.label} value={metric.value} fontColor={metric.fontColor} icon={metric.icon} />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", mt: 3, mx: 2 }}>
                                    <ChartInfo
                                        detail="Displays total counts for each stage in the exchange process for the selected time range. Each value represents the total number of records associated with that metric."
                                        position="left"
                                    />
                                </Box>
                            </Box>
                        )}

                        {!loading && !error && tab === 1 && data && (
                            <Box>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                                        <YAxis />
                                        <Tooltip 
                                            cursor={{ fill: "#cccccc58" }} 
                                            content={<CustomTooltip />} 
                                        />
                                        <Bar dataKey="value">
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", mt: 1, mx: 2 }}>
                                    <ChartInfo
                                        detail="This chart displays the volume of each metric within the selected time period. Useful for understanding how activity is distributed across the exchange process, relative to each metric."
                                        position="left"
                                    />
                                </Box>
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
                                    Select Entity and Time Period to view the KPI Distribution.
                                </Typography>
                            </Paper>
                        )}

                        {!loading && !error && tab === 2 && data && (
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <ResponsiveContainer width="100%" height={600}>
                                    <FunnelChart margin={{ right: 120, left: 120, bottom: 10 }}>
                                        <Tooltip content={<FunnelTooltip />} />
                                        <Funnel
                                            dataKey="value"
                                            data={filteredFunnelData}
                                            isAnimationActive
                                            stroke="#fff"
                                        >
                                            {filteredFunnelData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}

                                            <LabelList
                                                position="left"
                                                dataKey="name"
                                                fill={theme.palette.text.primary}
                                                offset={50} 
                                                fontSize={16}
                                                fontWeight={600}
                                            />

                                            <LabelList
                                                position="right"
                                                dataKey="value"
                                                formatter={(val) => formatNumber(val)}
                                                offset={50}
                                                fontSize={16}
                                                fontWeight={600}                       
                                            />
                                        </Funnel>
                                    </FunnelChart>
                                </ResponsiveContainer>
                                <Box sx={{ display: "flex", minWidth: "100%", justifyContent: "space-between", mx: 2 }}>
                                    {skippedFunnelData.length > 0 ? (
                                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                            <Typography variant="body1" justifySelf={"start"}>Omitted metrics:</Typography>
                                            {skippedFunnelData.map((entry, index) => (
                                                <Typography variant="body2" key={index}>
                                                    {index+1}. {entry.name} : {entry.value}
                                                </Typography>))}
                                        </Box>
                                    ) : (<></>)}
                                    <Typography variant="body1">
                                        <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", mb: 1 }}>
                                            <ChartInfo
                                                detail="Visualizes how entities progress through each stage of the exchange process, showing drop-offs and conversion efficiency between steps."
                                                position="left"
                                            />
                                        </Box>
                                        Hover section for % breakdowns.
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {!loading && !error && tab === 2 && !data && (
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
                                    Select Entity and Time Period to view the Conversion Funnel.
                                </Typography>
                            </Paper>
                        )}


                    </Paper>
                </Paper>

            </Box>
        </Box>
    );
}
