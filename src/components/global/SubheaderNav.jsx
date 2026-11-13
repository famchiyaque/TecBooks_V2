import React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

function SubheaderNav({ items = [], value, onChange, onItemClick }) {
  return (
    <List>
      {items.map(({ label, key }) => (
        <ListItemButton
          key={key}
          selected={value === key}
          onClick={() => {
            onChange?.(key);
            onItemClick?.();
          }}
        >
          <ListItemText primary={label} />
        </ListItemButton>
      ))}
    </List>
  );
}

export default SubheaderNav;
