import { Pagination, Stack } from "@mui/material";

import styles from "./custom-pagination.module.css";
const CustomPagination = ({ paginationProps, stackProps }) => {
  return (
    <div className={styles.pagination}>
      <Stack {...stackProps}>
        <Pagination {...paginationProps} />
      </Stack>
    </div>
  );
};

export default CustomPagination;
