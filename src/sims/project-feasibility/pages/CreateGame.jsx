import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  Divider,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

// Opciones disponibles para la selección múltiple
const AVAILABLE_TAGS = ["Dron", "F1", "Dron Militar"];

export default function CreateGame() {
  const [form, setForm] = useState({
    name: "",
    selectedTags: [],
    numTeams: 2,
    timePerRound: 60,
  });

  const handleChange = (event, field) => {
    let value = event.target.value;
    if (field == "tags") {
      value = typeof value === "string" ? value.split(",") : value;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f6f8",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 450,
          borderRadius: 4, // Margen redondo / Bordes redondeados
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          fontWeight="bold"
          align="center"
          gutterBottom
        >
          Create New Game
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2.5}>
          {/* Nombre del juego */}
          <TextField
            fullWidth
            label="Game Name"
            variant="outlined"
            size="small"
            value={form.name}
            onChange={(e) => handleChange(e, "name")}
          />

          {/* Select Múltiple que renderiza cada elemento como un Chip/Tag */}
          <FormControl fullWidth size="small">
            <InputLabel id="tags-select-label">Categories / Tags</InputLabel>
            <Select
              labelId="tags-select-label"
              multiple
              value={form.selectedTags}
              onChange={(e) => handleChange(e, "tags")}
              input={<OutlinedInput label="Categories / Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      color="primary"
                    />
                  ))}
                </Box>
              )}
            >
              {AVAILABLE_TAGS.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          <Typography variant="subtitle1" fontWeight="bold">
            Settings
          </Typography>

          {/* Ajustes de partida */}
          <TextField
            fullWidth
            type="number"
            label="Number of teams"
            variant="outlined"
            size="small"
            value={form.numTeams}
            onChange={(e) => setForm(e.target.value, "numTeams")}
          />

          <TextField
            fullWidth
            type="number"
            label="Time per round (seconds)"
            variant="outlined"
            size="small"
            value={form.timePerRound}
            onChange={(e) => setForm(e.target.value, "timePerRound")}
          />

          {/* Botón de acción */}
          <Button
            id="add-project-btn"
            component={RouterLink}
            to="newGame"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              bgcolor: "#1e90ff",
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              py: 1.2,
              "&:hover": {
                bgcolor: "#1c86ee",
              },
            }}
          >
            Create
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
