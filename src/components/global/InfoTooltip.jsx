import React from "react";
import Tooltip from "@mui/material/Tooltip";
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
      <span
        aria-label="More information"
        className="ml-1 inline-flex cursor-help items-center text-slate-500"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <InfoOutlined sx={{ fontSize: 16 }} />
      </span>
    </Tooltip>
  );
}

export default InfoTooltip;
