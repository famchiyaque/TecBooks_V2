import React from "react";
import {
  Alert,
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Divider,
  Stack,
} from "@mui/material";
import { useCreateGame } from "../hooks/useCreateGame";

export default function CreateGame() {
  const {
    form,
    errors,
    submitting,
    submitError,
    projects,
    loadingProjects,
    projectsError,
    handleChange,
    handleSubmit,
  } = useCreateGame();

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
        sx={{ p: 4, width: "100%", maxWidth: 450, borderRadius: 4 }}
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

        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              name="name"
              label="Game Name"
              variant="outlined"
              size="small"
              value={form.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />

            <FormControl
              fullWidth
              size="small"
              error={Boolean(errors.selectedTags)}
            >
              <InputLabel id="tags-select-label">Select project</InputLabel>
              <Select
                multiple
                name="selectedTags"
                value={form.selectedTags}
                onChange={handleChange}
                disabled={loadingProjects}
                input={<OutlinedInput label="Select project" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={projects[value - 1].name}
                        size="small"
                        color="primary"
                      />
                    ))}
                  </Box>
                )}
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
              {projectsError && (
                <FormHelperText error>{projectsError}</FormHelperText>
              )}
            </FormControl>

            <Divider />

            <Typography variant="subtitle1" fontWeight="bold">
              Settings
            </Typography>

            <TextField
              fullWidth
              type="number"
              name="numTeams"
              label="Number of teams"
              variant="outlined"
              size="small"
              value={form.numTeams}
              onChange={handleChange}
              error={Boolean(errors.numTeams)}
              helperText={errors.numTeams}
            />

            <TextField
              fullWidth
              type="number"
              name="timePerRound"
              label="Time per round (seconds)"
              variant="outlined"
              size="small"
              value={form.timePerRound}
              onChange={handleChange}
              error={Boolean(errors.timePerRound)}
              helperText={errors.timePerRound}
            />

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Button
              id="add-project-btn"
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{
                mt: 1,
                bgcolor: "#1e90ff",
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 2,
                py: 1.2,
                "&:hover": { bgcolor: "#1c86ee" },
              }}
            >
              {submitting ? "Creating..." : "Create"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
