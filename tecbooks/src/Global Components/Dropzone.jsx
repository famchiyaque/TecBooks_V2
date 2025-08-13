import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import Loader from "../HomePage/Comps/Loader";

function ExcelDropzone() {
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    setIsValidating(true);
    const file = acceptedFiles[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
  
        // Required sheet names
        const requiredSheets = ['Instructions', 'Overview', 'Revenue', 'Costs', 'Expenses', 'OwnedAssets', 'Accounts'];
  
        // Compare sheet names
        const uploadedSheets = workbook.SheetNames;
        const sortedUploaded = [...uploadedSheets].sort();
        const sortedRequired = [...requiredSheets].sort();
  
        const isExactMatch =
          sortedUploaded.length === sortedRequired.length &&
          sortedUploaded.every((sheet, i) => sheet === sortedRequired[i]);
  
        if (!isExactMatch) {
          alert("The Excel file must contain exactly these sheets:\n\n" + requiredSheets.join(", "));
          setIsValidating(false);
          return;
        }
  
        // Parse all valid sheets into a structured object
        // Parse all valid sheets into a structured object
        const parsedData = {};
        const maxRows = 250;
        const maxCols = 40;

        for (const sheetName of requiredSheets) {
          const sheet = workbook.Sheets[sheetName];

          // Get the range of the sheet (e.g. 'A1:D25')
          const range = XLSX.utils.decode_range(sheet['!ref']);
          const numRows = range.e.r - range.s.r + 1;
          const numCols = range.e.c - range.s.c + 1;

          if (numRows > maxRows || numCols > maxCols) {
            alert(`Sheet "${sheetName}" is too large. Limit is ${maxRows} rows and ${maxCols} columns.`);
            setIsValidating(false);
            return;
          }

          parsedData[sheetName] = XLSX.utils.sheet_to_json(sheet, {
            header: 1, // << key fix: tells XLSX to return rows as arrays
            // blankrows: false
          });
        }


        // console.log("Parsed Data: ")
        // console.log(parsedData)
  
        setTimeout(() => {
          navigate("/tecbooks", { state: { excelData: parsedData } });
        }, 2500);
      };
  
      reader.readAsArrayBuffer(file);
    }
  }, [navigate]);
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.ms-excel": [],
    },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #073a5a",
        borderRadius: "20px",
        padding: 4,
        width: "30%",
        minWidth: '200px',
        height: "50%",
        minHeight: '200px',
        textAlign: "center",
        cursor: "pointer",
        margin: "0 auto",
        backgroundColor: isDragActive ? "#f0f8ff" : "transparent",
        position: 'relative'
      }}
    >
      <input {...getInputProps()} />
      {isValidating ? <Loader /> : <img src={"/imgs/upload_temp_img.png"} style={{ width: "60%", margin: "0 auto" }} />}
      <Typography>
        {isValidating ? "Making sure the excel file matches the given template..." : "Drag or drop your Excel file here.."}
        {/* {isDragActive ? "Drop your Excel file here..." : "Drag & drop an Excel file, or click to select one"} */}
      </Typography>
      <div>
        <a className='credits-a' href="https://www.flaticon.com/free-icons/uplaod" title="uplaod icons">icon by chehuna - Flaticon</a>
      </div>
    </Box>
  );
}

export default ExcelDropzone;
