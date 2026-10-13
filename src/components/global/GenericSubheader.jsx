import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { Typography } from "@mui/material";

/**
 * @param {string}   subheader        Título mostrado a la derecha.
 * @param {() => void} [onOpenSidebar] Handler externo. Si se pasa, tiene prioridad
 *                                     sobre el drawer interno.
 * @param {React.ReactNode | ({ close }) => React.ReactNode} [navigation]
 *        Contenido del panel de navegación interna. Puede ser un nodo o una función
 *        que recibe `close` para cerrar el panel (útil al elegir un item).
 *        Si se omite, el componente se comporta como antes.
 */
function GenericSubheader({ subheader, onOpenSidebar, navigation = null }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const handleMenuClick = () => {
    if (onOpenSidebar) onOpenSidebar();
    else if (navigation) setOpen(true);
  };

  return (
    <Box>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#0077b6",
          height: "5vh",
          boxShadow: "none",
          color: "white",
        }}
      >
        <Toolbar style={{ justifyContent: "space-between", minHeight: "5vh" }}>
          <div className="header-icon-flex">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
          </div>

          <Typography variant="body2">{subheader}</Typography>
        </Toolbar>
      </AppBar>

      {navigation && !onOpenSidebar && (
        <Drawer anchor="left" open={open} onClose={close}>
          <Box sx={{ width: 260 }} role="presentation">
            {typeof navigation === "function"
              ? navigation({ close })
              : navigation}
          </Box>
        </Drawer>
      )}
    </Box>
  );
}

export default GenericSubheader;
