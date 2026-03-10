import { Card, CardContent, Stack, Typography } from "@mui/material";

export function DriveSidebarPlaceholder() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6" fontWeight={600}>
            Explorer
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Tree view will be added in the next phase.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            This sidebar is reserved for:
          </Typography>

          <Stack component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              folder tree
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              quick navigation
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              shared items
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}