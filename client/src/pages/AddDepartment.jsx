import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme, styled } from '@mui/material/styles';
// import { Grid, Container, Typography } from '@mui/material';
// components
// import { styled } from '@mui/material/styles';
import {
  Link,
  Container,
  Typography,
  Divider,
  Stack,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  Card,
  Input,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
// import {} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../components/iconify';
// components
// import Iconify from '../../../components/iconify';

// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function AddDepartment() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    navigate('/dashboard', { replace: true });
  };
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Card style={{ padding: '20px' }}>
              <Stack spacing={3}>
                <TextField type="text" name="department-name" label="Department Name" />
                <TextField type="text" name="incharge" label="Incharge" />
                {/* <TextField type="email" name="email" label="Email" />
                <TextField type="number" name="whatsapp-number" label="WhatsApp Number" />
                <TextField type="number" name="calling-number" label="Calling Number" />
                <TextField type="number" name="aadhaar-number" label="Aadhaar Number" />
                <TextField type="text" name="current-address" label="Current Address" />
                <TextField type="text" name="permanent-address" label="Permanent Address" />

                <FormControl fullWidth>
                  <InputLabel name="education" id="education">
                    Highest level of Education
                  </InputLabel>
                  <Select
                    labelId="education"
                    name="education"
                    id="education"
                    label="Highest level of Education"
                    // value={age}
                    // onChange={handleChange}
                  >
                    <MenuItem value={10}>10th</MenuItem>
                    <MenuItem value={20}>12th</MenuItem>
                    <MenuItem value={30}>Bachelor</MenuItem>
                    <MenuItem value={40}>Master</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel name="experience" id="experience">
                    Previous Experience
                  </InputLabel>
                  <Select
                    labelId="experience"
                    name="experience"
                    id="experience"
                    label="Previous Experience"
                    // value={age}
                    // onChange={handleChange}
                  >
                    <MenuItem value={10}>Fresher</MenuItem>
                    <MenuItem value={20}>0.5 to 1(year)</MenuItem>
                    <MenuItem value={30}>1 to 2(years)</MenuItem>
                    <MenuItem value={40}>2+(years)</MenuItem>
                  </Select>
                </FormControl>

                <TextField type="text" name="previous-work" label="Previous Work" />

                <FormControl fullWidth>
                  <InputLabel name="department" id="department">
                    Select Department
                  </InputLabel>
                  <Select
                    labelId="department"
                    name="department"
                    id="department"
                    label="Select Department"
                    // value={age}
                    // onChange={handleChange}
                  >
                    <MenuItem value={1}>Press</MenuItem>
                    <MenuItem value={2}>Fabrication</MenuItem>
                    <MenuItem value={3}>Laser Cutting</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel name="designation" id="designation">
                    Select Designation of Employee
                  </InputLabel>
                  <Select
                    labelId="designation"
                    name="designation"
                    id="designation"
                    label="Select Designation of Employee"
                    // value={age}
                    // onChange={handleChange}
                  >
                    <MenuItem value={1}>Owner</MenuItem>
                    <MenuItem value={2}>Incharge</MenuItem>
                    <MenuItem value={3}>Helper</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel htmlFor="photo" name="photo" id="photo">
                    Profile Photo
                  </InputLabel>
                  <TextField type="file" name="photo" id="photo" label="Profile Photo" />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel htmlFor="aadhaar" name="aadhaar" id="aadhaar">
                    Aadhaar Photo
                  </InputLabel>
                  <TextField type="file" name="aadhaar" id="aadhaar" label="Aadhaar Photo" />
                </FormControl>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    OR
                  </Typography>
                </Divider>

                <FormControl fullWidth>
                  <InputLabel name="salary-type" id="salary-type">
                    Select Salary Type
                  </InputLabel>
                  <Select
                    labelId="salary-type"
                    name="salary-type"
                    id="salary-type"
                    label="Select Salary Type"
                    // value={age}
                    // onChange={handleChange}
                  >
                    <MenuItem value={1}>Fixed</MenuItem>
                    <MenuItem value={2}>Wages/Day</MenuItem>
                  </Select>
                </FormControl>

                <TextField type="number" name="base-pay" label="Base Pay" /> */}
              </Stack>

              {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <Checkbox name="remember" label="Remember me" />
                <Link variant="subtitle2" underline="hover">
                  Forgot password?
                </Link>
              </Stack> */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
                  Login
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
