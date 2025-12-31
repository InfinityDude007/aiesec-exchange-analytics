import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Autocomplete,
    TextField,
    Checkbox,
    ListItemText,
    useTheme,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
    Replay as ClearIcon,
    Search as SearchIcon,
    Tune as FilterIcon,
} from "@mui/icons-material";
import { api } from "../utils/api";


export function Filters({ isLoading, onChange }) {
    const theme = useTheme();

    const [officeQuery, setOfficeQuery] = useState("");
    const [officeOptions, setOfficeOptions] = useState([]);
    const [officeLoading, setOfficeLoading] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState(null);

    const today = dayjs();
    const [timePeriod, setTimePeriod] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [exchangeType, setExchangeType] = useState("");
    const [interval, setInterval] = useState("");
    const [products, setProducts] = useState([]);
    const [aiesecer, setAiesecer] = useState("");

    const selectedFilters = {
        officeId: selectedOffice?.id || null,
        startDate: startDate?.format("YYYY-MM-DD") || null,
        endDate: endDate?.format("YYYY-MM-DD") || null,
        exchangeType: exchangeType,
        interval: interval,
        products: products.length ? products : null,
        aiesecer: aiesecer,
    };

    const handleApplyFilters = () => {
        if (onChange) {
            onChange(selectedFilters);
        }
    };

    const isApplyDisabled = !selectedOffice || !startDate || !endDate || isLoading;

    const handleClear = () => {
        setOfficeQuery("");
        setOfficeOptions([]);
        setSelectedOffice(null);

        setTimePeriod("");
        setStartDate(null);
        setEndDate(null);

        setExchangeType("");
        setInterval("");
        setProducts([]);
        setAiesecer("");
    };

    const searchOffices = async () => {
        if (!officeQuery.trim()) return;

        try {
            setOfficeLoading(true);

            const data = await api.get(`/office?q=${encodeURIComponent(officeQuery)}`);

            setOfficeOptions(data.offices || []);
        } catch (err) {
            console.error("Failed to fetch offices:", err);
            setOfficeOptions([]);
        } finally {
            setOfficeLoading(false);
        }
    };
    
    const clampToToday = (date) => {
        return date.isAfter(today) ? today : date;
    };
    const applyDatePreset = (preset) => {
        let start, end;
        switch (preset) {
            case "Today":
                start = today;
                end = today;
                break;

            case "Yesterday":
                start = today.subtract(1, "day");
                end = today.subtract(1, "day");
                break;

            case "This Week":
                start = today.startOf("week");
                end = clampToToday(today.endOf("week"));
                break;

            case "Last Week":
                start = today.subtract(1, "week").startOf("week");
                end = today.subtract(1, "week").endOf("week");
                break;

            case "This Month":
                start = today.startOf("month");
                end = clampToToday(today.endOf("month"));
                break;

            case "Last Month":
                start = today.subtract(1, "month").startOf("month");
                end = today.subtract(1, "month").endOf("month");
                break;

            case "This Year":
                start = today.startOf("year");
                end = clampToToday(today.endOf("year"));
                break;

            case "Last Year":
                start = today.subtract(1, "year").startOf("year");
                end = today.subtract(1, "year").endOf("year");
                break;

            default:
                return;
        }
        setStartDate(start);
        setEndDate(end);
    };

    const filters = [
        {
            id: "interval",
            title: "Interval",
            options: ["Monthly", "Weekly", "Daily"],
            value: interval,
            update: setInterval
        },
        {
            id: "exchange",
            title: "Exchange Type",
            options: ["Incoming", "Outgoing"],
            value: exchangeType,
            update: setExchangeType
        },
        {
            id: "products",
            title: "Products",
            options: ["Global Volunteer", "Global Talent", "Global Teacher"],
            value: products,
            update: setProducts,
            multiple: true
        },
        {
            id: "aiesecer",
            title: "AIESECer",
            options: ["Yes", "No"],
            value: aiesecer,
            update: setAiesecer
        }
    ];

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Box>
                <Paper
                    elevation={0}
                    sx={{
                        pt: 1,
                        pb: 2,
                        px: 4,
                        borderRadius: 1,
                        backgroundColor: theme.palette.background.secondary,
                        color: theme.palette.text.primary,
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between",  mb: 2 }} >
                        <Typography variant="h6" fontWeight="700">Filters</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 2,
                                gap: 2,
                            }}
                        >
                            <Tooltip title="Clear filters" arrow placement="bottom">
                                <IconButton
                                    onClick={() => handleClear()}
                                    sx={{ "&:hover": { color: theme.palette.error.dark } }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                disabled={isApplyDisabled}
                                onClick={handleApplyFilters}
                                sx={{
                                    px: 4,
                                    py: 1,
                                    fontWeight: 600,
                                }}
                            >
                                Apply Filters
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", minWidth: "100%", justifyContent: "space-between", gap: 2,  mb: 1.4 }}>

                        <FormControl key="offices" fullWidth size="small">
                            <Autocomplete
                                size="small"
                                options={officeOptions}
                                getOptionLabel={(option) => option.name}
                                value={selectedOffice}
                                loading={officeLoading}
                                onBlur={() => setOfficeOptions([])}
                                clearOnBlur
                                disableClearable
                                forcePopupIcon={false}
                                onChange={(event, newValue) => {
                                    setSelectedOffice(newValue);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        searchOffices();
                                    }
                                }}
                                sx={{
                                    backgroundColor: theme.palette.background.default,
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.background.tertiary },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.palette.primary.main}80` },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.palette.primary.main}90` },
                                }}
                                slotProps={{
                                    listbox: {
                                        sx: {
                                            "& .MuiAutocomplete-option": {
                                                "&:hover": { backgroundColor: `${theme.palette.primary.main}20` },
                                                "&.Mui-focused": { backgroundColor: `${theme.palette.primary.main}20` },
                                                "&.Mui-selected": { backgroundColor: `${theme.palette.primary.main}20` },
                                            },
                                        },
                                    },
                                }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        label="Entity"
                                        placeholder="Type and click →"
                                        value={officeQuery}
                                        onChange={(e) => setOfficeQuery(e.target.value)}
                                        sx={{
                                            backgroundColor: theme.palette.background.default,
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.background.tertiary },
                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.palette.primary.main}80` },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.palette.primary.main}90` },
                                        }}
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        <Tooltip title={officeLoading ? "Loading" : "Search"} arrow>
                                                            <IconButton
                                                                size="small"
                                                                onClick={searchOffices}
                                                                sx={{ "&:hover": { color: theme.palette.primary.main }, p: 0, mr: 0.5 }}
                                                                disabled={officeLoading}
                                                                disableRipple
                                                            >
                                                                {officeLoading ? <CircularProgress size="20px" /> : <SearchIcon sx={{ fontSize: "22px" }} />}
                                                            </IconButton>
                                                        </Tooltip>
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            },
                                        }}
                                    />
                                )}
                            />
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Time Period</InputLabel>
                                <Select
                                    label="Time Period"
                                    value={timePeriod}
                                    renderValue={() =>
                                        startDate && endDate
                                            ? `${startDate.format("DD MMM YYYY")} – ${endDate.format("DD MMM YYYY")}`
                                            : "Select"
                                    }
                                    onChange={(e) => {
                                        setTimePeriod(e.target.value);
                                        applyDatePreset(e.target.value);
                                    }}
                                    sx={{
                                        backgroundColor: theme.palette.background.default,
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.background.tertiary },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.palette.primary.main}80` },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.palette.primary.main}90` },
                                    }}
                                >
                                    {[
                                        "Today",
                                        "Yesterday",
                                        "This Week",
                                        "Last Week",
                                        "This Month",
                                        "Last Month",
                                        "This Year",
                                        "Last Year",
                                    ].map((option) => (
                                        <MenuItem
                                            key={option}
                                            value={option}
                                            sx={{
                                                "&:hover": { backgroundColor: `${theme.palette.primary.main}20` },
                                                "&.Mui-selected": { backgroundColor: `${theme.palette.primary.main}20` },
                                            }}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                    <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                                        <Typography variant="body1" sx={{ mb: 1.5, display: "block" }}>
                                            Custom Range
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            <DatePicker
                                                label="Start"
                                                value={startDate}
                                                maxDate={today}
                                                format="DD/MM/YYYY"
                                                onChange={(val) => {
                                                    if (!endDate || val <= endDate) {
                                                        setStartDate(val);
                                                        setTimePeriod("custom");
                                                    }
                                                }}
                                                slotProps={{ textField: { size: "small" } }}
                                                sx={{ backgroundColor: theme.palette.background.default }}
                                            />
                                            <DatePicker
                                                label="End"
                                                value={endDate}
                                                minDate={startDate}
                                                maxDate={today}
                                                format="DD/MM/YYYY"
                                                onChange={(val) => {
                                                    if (!startDate || val >= startDate) {
                                                        setEndDate(val);
                                                        setTimePeriod("custom");
                                                    }
                                                }}
                                                slotProps={{ textField: { size: "small" } }}
                                                sx={{ backgroundColor: theme.palette.background.default }}
                                            />
                                        </Box>
                                    </Box>
                                </Select>
                            </FormControl>
                        </LocalizationProvider>

                        {filters.map((filter) => (
                            <FormControl key={filter.id} fullWidth size="small">
                                <InputLabel labelid={`${filter.id}-label`}>{filter.title}</InputLabel>
                                <Select
                                    labelId={`${filter.id}-label`}
                                    id={`${filter.id}-select`}
                                    value={filter.value}
                                    label={filter.title}
                                    multiple={filter.multiple}
                                    onChange={(e) => filter.update(e.target.value)}
                                    renderValue={(selected) =>
                                        Array.isArray(selected) ? selected.join(", ") : selected
                                    }
                                    sx={{
                                        backgroundColor: theme.palette.background.default,
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.background.tertiary },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.palette.primary.main}80` },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.palette.primary.main}90` },
                                    }}
                                >
                                    {(filter.options).map((option => (
                                            <MenuItem 
                                                key={option}
                                                value={option}
                                                sx={{
                                                    "&:hover": { backgroundColor: `${theme.palette.primary.main}20` },
                                                    "&.Mui-selected": { backgroundColor: `${theme.palette.primary.main}20` },
                                                }}
                                            >
                                                {filter.multiple && (
                                                    <Checkbox size="small" checked={filter.value.indexOf(option) > -1} />
                                                )}
                                                <ListItemText primary={option} />
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        ))}

                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}
