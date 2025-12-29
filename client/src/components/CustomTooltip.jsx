import { Box, Typography, useTheme } from "@mui/material";
import { formatNumber } from "../utils/formatNumber";

export const CustomTooltip = ({ active, payload, label }) => {
    const theme = useTheme();

    if (!active || !payload || !payload.length) return null;

    const value = payload[0].value;
    const fontColor = payload[0].payload.color;

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                p: 2,
                borderRadius: "6px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                textAlign: "center"
            }}
        >
            <Typography
                sx={{
                    fontSize: "1rem",
                    color: "#555",
                }}
            >
                {label} : <span style={{ fontWeight: 600, color: fontColor, fontSize: "1rem" }}>{formatNumber(value)}</span>
            </Typography>
        </Box>
    );
};