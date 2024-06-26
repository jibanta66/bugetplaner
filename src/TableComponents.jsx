import React, { useState } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TableComponent = ({ rows, cols, data, colNames, onChange, onEvaluate, onColNameChange }) => {
  const [editColIndex, setEditColIndex] = useState(null);

  const handleDoubleClick = (colIndex) => {
    setEditColIndex(colIndex);
  };

  const handleBlur = () => {
    setEditColIndex(null);
  };

  const handleKeyPress = (e, rowIndex, colIndex) => {
    if (e.key === 'Enter') {
      onEvaluate(e.target.value, rowIndex, colIndex);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {colNames.map((name, colIndex) => (
              <TableCell key={colIndex} onDoubleClick={() => handleDoubleClick(colIndex)}>
                {editColIndex === colIndex ? (
                  <TextField
                    variant="outlined"
                    size="small"
                    value={colNames[colIndex]}
                    onChange={(e) => onColNameChange(e.target.value, colIndex)}
                    onBlur={handleBlur}
                    autoFocus
                  />
                ) : (
                  colNames[colIndex]
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, colIndex) => (
                <TableCell key={colIndex}>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={cell}
                    onChange={(e) => onChange(e.target.value, rowIndex, colIndex)}
                    onKeyPress={(e) => handleKeyPress(e, rowIndex, colIndex)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
