import { Box, Grid, Slider, Typography } from '@mui/material';
import React, { useState } from 'react';
import Cube from './Cube';

const App: React.FC = () => {
  const [rotation, setRotation] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [selectedColor, setSelectedColor] = useState<string>('');

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setRotation((prevRotation) => ({ ...prevRotation, [axis]: value }));
  };

  const handleFaceClick = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <Box padding={5}>
      <Typography variant="h4" mb={5}>3D Cube</Typography>
      <Grid container justifyContent="center" spacing={5}>
        <Grid item xs={6}>
          <Cube rotation={rotation} onFaceClick={handleFaceClick} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Rotate Cube:</Typography>
          <Slider
            value={rotation.x}
            onChange={(e, value) => handleRotationChange('x', value as number)}
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            valueLabelDisplay="auto"
            aria-labelledby="x-rotation-slider"
          />
          <Slider
            value={rotation.y}
            onChange={(e, value) => handleRotationChange('y', value as number)}
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            valueLabelDisplay="auto"
            aria-labelledby="y-rotation-slider"
          />
          <Slider
            value={rotation.z}
            onChange={(e, value) => handleRotationChange('z', value as number)}
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            valueLabelDisplay="auto"
            aria-labelledby="z-rotation-slider"
          />
          {selectedColor && (
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              You clicked on the color: {selectedColor}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;