import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Skeleton,
} from '@mui/material';
// mocks_
import account from '../../../_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    link: '/dashboard',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    link: '/dashboard/user-profile',
  },
];
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  const [accountData, setAccountData] = useState();

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`http://localhost:1704/api/user/details`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.status) {
          setAccountData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (link) => () => {
    setOpen(null);
    if (link) {
      navigate(`${link}`, { replace: true });
    }
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
    setOpen(null);
  };

  const handleCancelDialog = () => {
    setOpenDialog(false);
  };

  const handleLogoutDialog = () => {
    setOpenDialog(false);

    localStorage.setItem('token', '');
    navigate('/login');
    // navigate('/login', { replace: true });
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        {accountData ? (
          <Avatar src={accountData.photo} alt="photoURL" />
        ) : (
          <Skeleton variant="circular" width={40} height={40} />
        )}
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          {accountData ? (
            <>
              <Typography variant="subtitle2" noWrap>
                {accountData.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {accountData.email}
              </Typography>
            </>
          ) : (
            <Skeleton variant="rounded" width={140} height={44} />
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose(option.link)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleClickOpen} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Do you want to log out from this account?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending anonymous location data to Google, even when no
            apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialog}>Cancel</Button>
          <Button onClick={handleLogoutDialog} variant="outlined" color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
