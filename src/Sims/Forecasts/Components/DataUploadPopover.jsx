import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Popover from '@mui/material/Popover';
import Loader from "@/Global Components/Loader";
import { Box, Typography } from "@mui/material";
import { parseUploadedCSVData, parseUploadedJSONData, parseUploadedXLSXData } from '../Calcs/parseUploadData';
import { useSelector, useDispatch } from "react-redux";
import { 
  setDataSouce, setSalesData, 
  setUploadedFileType, setStartDate, 
  setDetectedInterval, setEffectiveInterval,
  setPastTimelineDates, setFutureTimelineDates,
  setEffectivePastDate, setEffectiveFutureDate
} from "../store";
import { processUploadedData } from "../Calcs/processUploadData";
import { getPastTimelineDates, getFutureTimelineDates } from "../Calcs/timelines";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

function DataUploadPopover({ anchorEl, open, onClose }) {
  // console.log("rendering data upload popover");
  const dispatch = useDispatch();
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);

  const resetReduxStore = () => {

  }

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Max size is 3MB.");
      return;
    }

    setIsValidating(true);

    const ext = file.name.split('.').pop().toLowerCase();

    const reader = new FileReader();

    reader.onerror = () => {
      setError("Failed to read file.");
      setIsValidating(false);
    };

    reader.onload = (e) => {
      try {
        let parsedData = null;

        if (ext === 'csv') {
          const text = e.target.result;
          parsedData = parseUploadedCSVData(text);
        } else if (ext === 'json') {
          const text = e.target.result;
          parsedData = parseUploadedJSONData(text);
        } else if (ext === 'xlsx') {
          const arrayBuffer = e.target.result;
          parsedData = parseUploadedXLSXData(arrayBuffer);
        } else {
          throw new Error("Unsupported file type.");
        }

        if (!parsedData || !Array.isArray(parsedData) || parsedData.length === 0) {
          throw new Error("Parsed data is empty or invalid.");
        }

        const approxSize = new Blob([JSON.stringify(parsedData)]).size;
        if (approxSize > 3 * 1024 * 1024) {
          throw new Error("Parsed data exceeds 3MB size limit.");
        }

        console.log("parsedData: ", parsedData);
        const { normalizedData, detectedInterval, startDate } = processUploadedData(parsedData);

        if (normalizedData) {
          dispatch(setSalesData(null));
          dispatch(setStartDate(null));
          dispatch(setDetectedInterval(null));
          dispatch(setEffectiveInterval(null));

          dispatch(setDataSouce('uploaded'));
          dispatch(setUploadedFileType(ext));

          dispatch(setStartDate(startDate));
          dispatch(setDetectedInterval(detectedInterval));
          dispatch(setEffectiveInterval(detectedInterval));

          const pastTimelineDates = getPastTimelineDates(startDate);
            if (pastTimelineDates) {
              console.log("setting pastTimelineDates in redux", pastTimelineDates);
              dispatch(setPastTimelineDates(pastTimelineDates));
              dispatch(setEffectivePastDate(pastTimelineDates[0].date));
            }
          
            console.log("about to call futureTimelineDates func");
          const futureTimelineDates = getFutureTimelineDates(pastTimelineDates);
            if (futureTimelineDates) {
              dispatch(setFutureTimelineDates(futureTimelineDates));
              dispatch(setEffectiveFutureDate(futureTimelineDates[futureTimelineDates.length - 1].date));
            }

            dispatch(setSalesData(normalizedData));
        }

        alert("File uploaded and parsed successfully!");
      } catch (err) {
        setError(err.message || "Error parsing file.");
      } finally {
        setIsValidating(false);
      }
    };

    // Read file with appropriate method
    if (ext === 'xlsx') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
    maxFiles: 1,
  });

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ textAlign: 'center', borderRadius: '20px' }}
    >
      <Typography sx={{ p: 1, fontWeight: 'bold' }}>Upload your data here...</Typography>
      <Typography sx={{ p: 1 }}>
        Supported: <b>.json</b>, <b>.csv</b>, <b>.xlsx</b> <br />
        Max file size: 3MB
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #073a5a",
          borderRadius: "20px",
          padding: 4,
          width: "150px",
          height: "100px",
          textAlign: "center",
          cursor: "pointer",
          margin: "0 auto 1rem auto",
          backgroundColor: isDragActive ? "#f0f8ff" : "transparent",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: 'relative',
        }}
      >
        <input {...getInputProps()} />
        {isValidating ? (
          <Loader />
        ) : (
          <img src="/imgs/upload_temp_img.png" alt="upload icon" style={{ width: "60%", margin: "0 auto" }} />
        )}
        <Typography sx={{ mt: 1, fontSize: '0.6rem' }}>
          {isValidating
            ? "Validating and parsing the file..."
            : isDragActive
            ? "Drop the file here..."
            : "Drag & drop your file, or click to select"}
        </Typography>
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 1, px: 2 }}>
          {error}
        </Typography>
      )}
      {/* <Typography sx={{ mt: 2, fontSize: '0.5rem', opacity: 0.6 }}>
        <a
          className="credits-a text-sm"
          href="https://www.flaticon.com/free-icons/upload"
          target="_blank"
          rel="noopener noreferrer"
          title="upload icons"
        >
          icon by chehuna - Flaticon
        </a>
      </Typography> */}
    </Popover>
  );
}

export default DataUploadPopover;
