import locations from './location.json';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function LocationFields() {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setState(selectedState);
    setCity('');
    setZipCode('');
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
    setZipCode('');
  };

  const handleZipChange = (event) => {
    setZipCode(event.target.value);
  };

  const cities = state ? locations.states.find(s => s.name === state).cities : [];
  const zipCodes = city ? cities.find(c => c.name === city).zipCodes : [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
      }}
    >
        <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ marginBottom: '3rem', fontWeight: 'bold', color: '#000' }}
          >
            Location Details
          </Typography>
      <Card sx={{ width: '70%', bgcolor: '#90caf9', borderRadius: '25px', padding: '3rem',marginBottom:'3rem' }}>
        <CardContent>
    
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 3,
            
            }}
          >
            {['State', 'City', 'Zip Code'].map((label, index) => (
              <TextField
                fullWidth
                select
                key={label}
                label={label}
                value={index === 0 ? state : index === 1 ? city : zipCode}
                onChange={index === 0 ? handleStateChange : index === 1 ? handleCityChange : handleZipChange}
                variant="outlined"
                sx={{
                  backgroundColor: '#fff',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white'
                  }
                }}
              >
                {(index === 0 ? locations.states : index === 1 ? cities : zipCodes).map((option) => (
                  <MenuItem key={option.name || option} value={option.name || option}>
                    {option.name || option}
                  </MenuItem>
                ))}
              </TextField>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 3
            }}
          >
          </Box>
        </CardContent>
    
      </Card>
      <Button variant="contained" color="secondary">Submit</Button>
    </Box>
  );
}
