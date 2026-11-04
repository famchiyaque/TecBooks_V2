import { useState } from "react";
import { createGame } from "../api/createGame.api";

export const AVAILABLE_TAGS = ["Dron", "F1", "Dron Militar"];

const INITIAL_FORM = {
  name: "",
  selectedTags: [],
  numTeams: 2,
  timePerRound: 60,
};

export function useCreateGame() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Returns an object like { name: "message" } (empty object = valid)
  function validate(form) {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Game name is required";
    }

    if (form.selectedTags.length === 0) {
      errors.selectedTags = "Select at least one project";
    }

    if (form.numTeams === "" || form.numTeams === null) {
      errors.numTeams = "Number of teams is required";
    } else if (!Number.isInteger(form.numTeams) || form.numTeams < 2) {
      errors.numTeams = "There must be at least 2 teams";
    }

    if (form.timePerRound === "" || form.timePerRound === null) {
      errors.timePerRound = "Time per round is required";
    } else if (form.timePerRound < 10) {
      errors.timePerRound = "Minimum time is 10 seconds";
    }

    return errors;
  }

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    let newValue = value;
    if (name === "selectedTags") {
      newValue = typeof value === "string" ? value.split(",") : value;
    } else if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));

    // Clear the error of the field being edited
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSubmitting(true);
      const res = await createGame(form);
      console.log(res);
      // TODO: navigate somewhere or reset the form, e.g.
    } catch (err) {
      setSubmitError(err?.message || "Could not create the game. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return { form, errors, submitting, submitError, handleChange, handleSubmit };
}
