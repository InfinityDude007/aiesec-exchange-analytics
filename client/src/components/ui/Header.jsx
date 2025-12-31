import {
    Box,
    Typography,
    useTheme,
} from "@mui/material";

export function Header({ title, subtitle }) {
    const theme = useTheme();
    
    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", display: "flex", flexDirection: "column", mb: 4, px: 0.5 }}>
            <Box>
                <Typography
                    variant="h2"
                    color={theme.palette.text.primary}
                    mb={0.5}
                >
                    {title}
                </Typography>
                <Typography
                    variant="h5"
                    color={theme.palette.text.secondary}
                >
                    {subtitle}
                </Typography>
            </Box>
        </Box>
    );
}
