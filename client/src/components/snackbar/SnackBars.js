import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

// const SnackBars = ({ snackBarData }) => {
//   const [open, setOpen] = React.useState(true);

//   const handleClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }

//     setOpen(false);
//   };

//   return (
//     <Snackbar
//       open={snackBarData.open && open}
//       autoHideDuration={6000}
//       onClose={handleClose}
//       anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       TransitionComponent={Slide}
//     >
//       <Alert
//         onClose={handleClose}
//         severity={snackBarData.type === '' ? 'success' : snackBarData.type}
//         elevation={6}
//         variant="filled"
//         sx={{ width: '100%' }}
//       >
//         {snackBarData.body}
//       </Alert>
//     </Snackbar>
//   );
// };

// export default SnackBars;

const SnackbarComponent = ({ snackBarData, handleClose }) => {
  const { type, body } = snackBarData;

  // const Alert = (props) => {
  //   return <MuiAlert elevation={6} variant="filled" {...props} />;
  // };

  return (
    <Snackbar open={Boolean(body)} autoHideDuration={4000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type}>
        {body}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
