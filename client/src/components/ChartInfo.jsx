import {
    Box,
    Tooltip,
    useTheme
} from "@mui/material";
import { InfoOutline as InfoIcon } from '@mui/icons-material';

export const ChartInfo = ({ detail, position = "bottom-end" }) => {
    const theme = useTheme();

    return (
        <Tooltip
            title={detail}
            placement={position}
            leaveDelay={500}
            arrow
        >
            <InfoIcon
                sx={{
                    fontSize: "30px",
                    color: theme.palette.primary.main
                }}
            />
        </Tooltip>
    );
};
