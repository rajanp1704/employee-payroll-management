import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Switch,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  // { id: 'salary-type', label: 'Salary Type', alignRight: false },
  // { id: 'base-pay', label: 'Base Pay', alignRight: false },
  { id: 'attendance', label: 'Attendance', alignRight: false },
  { id: 'current-salary', label: 'Current Salary', alignRight: false },
  { id: 'debit', label: 'Debit (Upad)', alignRight: false },
  { id: 'credit', label: 'Credit (Jama)', alignRight: false },
  { id: 'gross-salary', label: 'Gross Salary', alignRight: false },
  //   { id: 'company', label: 'Company', alignRight: false },
  //   { id: 'role', label: 'Role', alignRight: false },
  //   { id: 'isVerified', label: 'Verified', alignRight: false },
  //   { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function PayrollDetails() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dateRange, setDateRange] = useState({ from: dayjs(), to: dayjs() });

  const [employeeDetails, setEmployeeDetails] = useState('');

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const handleChangeDateRange = (props) => (newDate) => {
    if (props === 'from') {
      // console.log(1);
      setDateRange({ [props]: newDate, to: newDate });
    }
    if (props === 'to' && dateRange.from <= newDate) {
      // console.log(2);
      setDateRange({ ...dateRange, [props]: newDate });
    }
    if (props === 'to' && dateRange.from > newDate) {
      // console.log(3);
      alert(`"To" DATE should be less than "from" DATE`);
      setDateRange({ ...dateRange, [props]: dateRange.from });
    }
  };

  const handleSubmitDate = async (e) => {
    e.preventDefault();
    console.log(`${dateRange.from.$D}/${dateRange.from.$M + 1}/${dateRange.from.$y}`);
    console.log(dateRange.to);
    const dateData = new FormData();
    dateData.append('from', '15/05/2021');
    dateData.append('to', '15/08/2023');
    try {
      const fetchDetails = await axios.post('http://localhost:1704/api/employee/details', dateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (fetchDetails.data.status) {
        setEmployeeDetails(fetchDetails.data.data);
      }
      console.log(fetchDetails.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Payroll Details | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </Stack>

        <Card>
          <Stack direction="row" alignItems="center" justifyContent="center" mb={5} spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="From"
                  format="DD/MM/YYYY"
                  value={dateRange.from}
                  onChange={handleChangeDateRange('from')}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="To"
                  format="DD/MM/YYYY"
                  value={dateRange.to}
                  onChange={handleChangeDateRange('to')}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Button variant="contained" onClick={handleSubmitDate}>
              Submit
            </Button>
          </Stack>
        </Card>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, role, status, company, avatarUrl, isVerified } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell padding="checkbox">
                          <Typography variant="subtitle2" noWrap>
                            {id}
                          </Typography>
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="column" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} sx={{ width: 80, height: 80 }} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" spacing={1}>
                            <Stack direction="column" spacing={1}>
                              <Typography variant="subtitle2" noWrap align="right">
                                Full Day : {}
                              </Typography>
                              <Typography variant="subtitle2" noWrap align="right">
                                Working Hours : {}
                              </Typography>
                              <Typography variant="subtitle2" noWrap align="right">
                                Over Time : {}
                              </Typography>
                            </Stack>
                            <Stack direction="column" alignItems="left" spacing={1}>
                              <Typography variant="subtitle2" noWrap align="left">
                                1
                              </Typography>
                              <Typography variant="subtitle2" noWrap align="left">
                                3
                              </Typography>
                              <Typography variant="subtitle2" noWrap align="left">
                                2
                              </Typography>
                            </Stack>
                          </Stack>
                        </TableCell>

                        <TableCell align="right">
                          <Typography variant="subtitle2" noWrap>
                            ₹ 35000
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Typography variant="subtitle2" noWrap>
                            ₹ 3500
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Typography variant="subtitle2" noWrap>
                            ₹ 500
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Typography variant="subtitle2" noWrap>
                            ₹ 32000
                          </Typography>
                        </TableCell>

                        {/* <TableCell align="left">
                          <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue="fixed"
                              name="radio-buttons-group"
                            >
                              <FormControlLabel value="fixed" control={<Radio />} label="Fixed" />
                              <FormControlLabel value="wage/day" control={<Radio />} label="Wage/Day" />
                            </RadioGroup>
                          </FormControl>
                        </TableCell> */}

                        {/* <TableCell align="left">
                          <Stack direction="column" alignItems="center" spacing={2}>
                            <TextField
                              id="fixed-salary"
                              label="Fixed-Salary(monthly)"
                              variant="outlined"
                              size="small"
                            />
                            <TextField id="wages" label="Per Day Wages" variant="outlined" size="small" />
                          </Stack>
                        </TableCell> */}

                        {/* <TableCell align="left">{company}</TableCell>

                        <TableCell align="left">{role}</TableCell>

                        <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>

                        <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
