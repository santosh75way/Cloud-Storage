import { Pagination, Stack, Typography } from "@mui/material";

type DrivePaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  onChange: (page: number) => void;
};

export function DrivePagination({
  page,
  totalPages,
  total,
  onChange,
}: DrivePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Stack spacing={1} alignItems="flex-end">
      <Typography variant="body2" color="text.secondary">
        Total items: {total}
      </Typography>

      <Pagination
        page={page}
        count={totalPages}
        onChange={(_event, nextPage) => onChange(nextPage)}
      />
    </Stack>
  );
}