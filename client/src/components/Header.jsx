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

export function Header({ title, subtitle }) {
    const theme = useTheme();
    
    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", display: "flex", flexDirection: "column", mb: 2, px: 0.5 }}>
            <Box>
                <Typography
                    variant="h2"
                    color={theme.palette.text.primary}
                >
                    {title}
                </Typography>
                <Typography
                    variant="h5"
                    color={theme.palette.text.secondary}
                    mb={2}
                >
                    {subtitle}
                </Typography>
            </Box>
        </Box>
    );
}
