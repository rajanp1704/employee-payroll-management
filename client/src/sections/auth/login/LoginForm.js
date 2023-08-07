import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: '', password: '' });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
      const fetch = async () => {
        const response = await axios.get('http://localhost:1704/api/user/authentication', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.status) {
          alert(`${response.data.message} with User ID: ${response.data.data.user_id}`);
          navigate('/dashboard', { replace: true });
        }
        if (!response.data.status) {
          alert(response.data.message);
        }
      };
      fetch();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleClick = () => {
    try {
      const fetch = async () => {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        const response = await axios.post('http://localhost:1704/api/user/login', formData);
        // console.log(response);
        if (!response.data.status) {
          alert(response.data.message);

          window.location.reload();
        }
        if (response.data.status) {
          alert(response.data.message);
          alert(response.data.data[0].token);
          localStorage.setItem('token', response.data.data[0].token);
          navigate('/dashboard', { replace: true });
        }
      };
      fetch();
    } catch (error) {
      console.log(error);
    }
    // window.location.reload();
    // navigate('/dashboard', { replace: true });
  };

  const handleChange = (prop) => (e) => {
    e.preventDefault();
    setData({ ...data, [prop]: e.target.value });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" value={data.email} onChange={handleChange('email')} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={data.password}
          onChange={handleChange('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
