import { SearchOutlined, ClearOutlined } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";

type SearchBarProps = {
    value: string;
    onChange: (val: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <TextField
            fullWidth
            placeholder="Search clouds, folders, and files..."
            variant="outlined"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchOutlined color="action" />
                    </InputAdornment>
                ),
                endAdornment: value ? (
                    <InputAdornment position="end">
                        <IconButton
                            size="small"
                            onClick={() => onChange("")}
                            edge="end"
                        >
                            <ClearOutlined fontSize="small" />
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "background.paper",
                },
            }}
        />
    );
}
