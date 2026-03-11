import { Pagination, Typography, Box } from "@mui/material";

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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: 3,
        pt: 2,
        borderTop: "1px solid #F1F5F9",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {total} item{total !== 1 ? "s" : ""} total
      </Typography>

      <Pagination
        page={page}
        count={totalPages}
        onChange={(_event, nextPage) => onChange(nextPage)}
        shape="rounded"
        color="primary"
        size="small"
      />
    </Box>
  );
}