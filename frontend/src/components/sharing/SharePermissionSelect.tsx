import { Select, MenuItem, type SelectChangeEvent, FormControl } from "@mui/material";
import type { SharePermission } from "../../types/sharing";

type SharePermissionSelectProps = {
    value: SharePermission;
    onChange: (newPermission: SharePermission) => void;
    disabled?: boolean;
};

export function SharePermissionSelect({ value, onChange, disabled = false }: SharePermissionSelectProps) {
    const handleChange = (e: SelectChangeEvent) => {
        onChange(e.target.value as SharePermission);
    };

    return (
        <FormControl size="small" disabled={disabled}>
            <Select
                value={value}
                onChange={handleChange}
                sx={{ minWidth: 120 }}
            >
                <MenuItem value="VIEW">Viewer</MenuItem>
                <MenuItem value="EDIT">Editor</MenuItem>
            </Select>
        </FormControl>
    );
}
