import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const AlertSnackbar = ({ open, onClose, message, duration,colorValue  }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Snackbar
    ContentProps={{
      sx: {
        background: colorValue 
      }
    }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      message={message}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
};

export default AlertSnackbar;
