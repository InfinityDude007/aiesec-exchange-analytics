import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
    palette: {
        general: {
            white: "#ffffff",
            gray: "#f5f5f5",
            lightGrey: "#cccccc",
        },
        background: {
            default: "#f9fafb",
            paper: "#ffffff",
            primary: "#f9fafb",
            secondary: "#ffffff",
            tertiary: "#cccccc",
        },
        text: {
            primary: "#333333",
            secondary: "#666666",
            tertiary: "#cccccc",
            contrast: "#000000",
        },
        brand: {
            light: "#027ff2",
            dark: "#006ed5",
        },
        primary: {
            main: "#027ff2",
            dark: "#006ed5",
            light: "#4da6ff",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#666666",
            light: "#999999",
            dark: "#333333",
            contrastText: "#ffffff",
        },
        success: {
            main: "#22c55e",
            light: "#4ade80",
            dark: "#16a34a",
        },
        error: {
            main: "#ef4444",
            light: "#f87171",
            dark: "#dc2626",
        },
        warning: {
            main: "#f59e0b",
            light: "#fbbf24",
            dark: "#d97706",
        },
    },

    typography: {
        fontFamily: ["-apple-system", "BlinkMacSystemFont", "'Helvetica Neue'", "sans-serif"].join(","),
        h1: {
            fontSize: "2rem",
            fontWeight: 700,
            textDecoration: "none",
        },
        h2: {
            fontSize: "1.75rem",
            fontWeight: 600,
            textDecoration: "none",
        },
        h3: {
            fontSize: "1.5rem",
            fontWeight: 600,
            textDecoration: "none",
        },
        h4: {
            fontSize: "1.25rem",
            fontWeight: 600,
            textDecoration: "none",
        },
        h5: {
            fontSize: "1rem",
            fontWeight: 600,
            textDecoration: "none",
        },
        body1: {
            fontSize: "1rem",
            fontWeight: 400,
            textDecoration: "none",
        },
        body2: {
            fontSize: "0.875rem",
            fontWeight: 400,
            textDecoration: "none",
        },
    },

    shape: {
        borderRadius: 8,
    },

    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                    backgroundImage: "none",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 500,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: "1px solid #e5e7eb",
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    borderBottom: `2px solid #cccccc90`,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: "600",
                    fontSize: "1rem",
                },
            },
        },
    },
});
