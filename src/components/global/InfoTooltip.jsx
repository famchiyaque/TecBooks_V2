import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

function InfoTooltip({ title }) {
  if (!title) return null;

  return (
    <Tooltip
      title={title}
      arrow
      placement="top"
      slotProps={{ tooltip: { sx: { maxWidth: 360, fontSize: 12 } } }}
    >
      <IconButton
        size="small"
        aria-label="More information"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        sx={{ p: 0.25, ml: 0.5, color: "text.secondary" }}
      >
        <InfoOutlined sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  );
}

export default InfoTooltip;
