import React, { useState } from 'react';
import TableComponent from './TableComponents';
import { Button } from '@mui/material';
import Papa from 'papaparse';

const App = () => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [data, setData] = useState(Array.from({ length: 5 }, () => Array(5).fill('')));
  const [colNames, setColNames] = useState(Array.from({ length: 5 }, (_, i) => `Column ${i + 1}`));

  const addRow = () => {
    setRows(rows + 1);
    setData([...data, Array(cols).fill('')]);
  };

  const addCol = () => {
    setCols(cols + 1);
    setData(data.map(row => [...row, '']));
    setColNames([...colNames, `Column ${cols + 1}`]);
  };

  const deleteRow = () => {
    if (rows > 1) {
      setRows(rows - 1);
      setData(data.slice(0, -1));
    }
  };

  const deleteCol = () => {
    if (cols > 1) {
      setCols(cols - 1);
      setData(data.map(row => row.slice(0, -1)));
      setColNames(colNames.slice(0, -1));
    }
  };

  const handleChange = (value, rowIndex, colIndex) => {
    const newData = data.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? value : cell))
    );
    setData(newData);
  };

  const handleColNameChange = (value, colIndex) => {
    const newColNames = colNames.map((name, cIdx) => (cIdx === colIndex ? value : name));
    setColNames(newColNames);
  };

  const handleEvaluate = (value, rowIndex, colIndex) => {
    try {
      // Evaluate the expression and update the cell value
      const result = eval(value);
      handleChange(result, rowIndex, colIndex);
    } catch (e) {
      console.error('Invalid expression');
    }
  };

  const calculateTotal = () => {
    return data.flat().reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  };

  const downloadCSV = () => {
    const csvData = [colNames, ...data];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const [header, ...rows] = result.data;
          setColNames(header);
          setRows(rows.length);
          setCols(header.length);
          setData(rows);
        },
        header: false
      });
    }
  };

  return (
    <div>
      <h1>Excel Clone</h1>
      <Button variant="contained" color="primary" onClick={addRow}>Add Row</Button>
      <Button variant="contained" color="secondary" onClick={addCol}>Add Column</Button>
      <Button variant="contained" color="primary" onClick={deleteRow}>Delete Row</Button>
      <Button variant="contained" color="secondary" onClick={deleteCol}>Delete Column</Button>
      <Button variant="contained" color="primary" onClick={downloadCSV}>Download CSV</Button>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        id="upload-csv"
      />
      <label htmlFor="upload-csv">
        <Button variant="contained" color="primary" component="span">Upload CSV</Button>
      </label>
      <TableComponent
        rows={rows}
        cols={cols}
        data={data}
        colNames={colNames}
        onChange={handleChange}
        onEvaluate={handleEvaluate}
        onColNameChange={handleColNameChange}
      />
      <h2>Total Price: {calculateTotal()}</h2>
    </div>
  );
};

export default App;
