import { Box, Typography, Button, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import aiesecLogo from "../assets/aiesec-logo-blue.svg";
import aiesecHuman from "../assets/aiesec-human-white.png";

export function Login() {
    const theme = useTheme();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const handleLogin = () => {
        window.location.href = `${apiUrl}/auth/login?next=/`;
    };

    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: theme.palette.background.default,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <Box
                    component="img"
                    src={aiesecLogo}
                    alt="AIESEC Logo"
                    sx={{ height: 40 }}
                />
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: 5,
                }}
            >
                <Box>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: "3rem",
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            position: "relative",
                            zIndex: 2,
                        }}
                    >
                        Exchange Analytics
                    </Typography>

                    <Box sx={{ width: 280, transform: "translateY(-15px)", zIndex: 1 }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 286 27"
                            preserveAspectRatio="none"
                            width="150%"
                            height="27"
                        >
                            <path
                                fill={theme.palette.primary.main}
                                d="M31.116 8.126C46.007 6.147 92.848-.07 143 .736c61.647.99 127.819 9.971 139.982 18.568 22.058 15.59-81.9-4.616-146.014-5.29-55.34-.58-122.233 9.755-126.063 10.885C-8.544 30.636-2.08 12.539 31.116 8.126"
                            />
                        </svg>
                    </Box>
                </Box>

                <Typography
                    variant="h3"
                    color={theme.palette.text.secondary}
                    sx={{ maxWidth: 600, fontWeight: 500 }}
                    fontStyle="italic"
                >
                    An analytics platform for monitoring and analysing data related to AIESEC exchange programs.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={
                        <Box
                            component="img"
                            src={aiesecHuman}
                            alt="AIESEC Human"
                            sx={{ height: 50 }}
                        />
                    }
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        borderRadius: 2,
                    }}
                    onClick={() => handleLogin()}
                >
                    <Typography
                        variant="h3"
                        color={theme.palette.general.white}
                        sx={{ maxWidth: 600, fontWeight: 600 }}
                    >
                        Login with AIESEC
                    </Typography>
                </Button>
            </Box>
        </Box>
    );
}
