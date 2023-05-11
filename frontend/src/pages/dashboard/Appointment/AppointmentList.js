import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// routes
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';

// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../components/table';
// sections
import { AppointmentTableRow, AppointmentTableToolbar } from '../../../sections/@dashboard/appointment/list';

// redux
import { fetchAppointmentByClient, removeAppointmentFromList } from '../../../redux/slices/appointmentSlice';
import { AppointmentApi } from '../../../actions/appointmentAction';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'pending', 'accepted', 'declined'];

const TABLE_HEAD = [
  { id: 'nutritionist', label: 'Nutritionist', align: 'left' },
  { id: 'dateApt', label: 'Date', align: 'left' },
  { id: 'timeApt', label: 'Time', align: 'left' },
  { id: 'locationApt', label: 'Location', align: 'left' },
  { id: 'statusApt', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function AppointmentList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { currentUser, step } = useSelector((state) => state.user);

  const { appointments } = useSelector((state) => state.appointment);

  const { themeStretch } = useSettings();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchAppointmentByClient(currentUser?._id));
    }
  }, [dispatch, currentUser]);

  console.log(appointments);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleScheduleRow = (id) => {
    const deleteRow = appointments?.filter((row) => row.id !== id);
    setSelected([]);
    // setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = appointments?.filter((row) => !selected.includes(row.id));
    setSelected([]);
    // setTableData(deleteRows);
  };

  const handleCancelRow = async (row) => {
    // navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
    await AppointmentApi.deleteAppointment(row._id);
    dispatch(removeAppointmentFromList(row));
    enqueueSnackbar('Appointment have been cancelled', { autoHideDuration: 3000, variant: 'info' });
    // toast.success('Appointment have been cancelled');
  };

  useEffect(() => {
    try {
      const dataFiltered = applySortFilter({
        appointments,
        comparator: getComparator(order, orderBy),
        filterName,
        filterStatus,
      });
      setTableData(dataFiltered);
    } catch (error) {
      console.error(error);
    }
  }, [appointments, order, orderBy, filterName, filterStatus]);
  console.log(tableData);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!appointments?.length && !!filterName) || (!appointments?.length && !!filterStatus);

  return (
    <Page title="Appointment: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Appointment List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Appointment', href: PATH_DASHBOARD.appointment.list },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.appointment.book}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Book Appointment
            </Button>
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <AppointmentTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData?.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {tableData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <AppointmentTableRow
                      keyRow={row._id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onScheduleRow={() => handleScheduleRow(row)}
                      onCancelRow={() => handleCancelRow(row)}
                      refRole={'clientRole'}
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData?.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tableData?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ appointments, comparator, filterName, filterStatus }) {
  const stabilizedThis = appointments?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredAppointments = stabilizedThis?.map((el) => el[0]);

  if (filterName) {
    filteredAppointments = filteredAppointments?.filter((item) => {
      const fullName = `${item.nutritionist.firstName} ${item.nutritionist.lastName}`.toLowerCase();
      const filterValue = filterName.toLowerCase();
      return fullName.indexOf(filterValue) !== -1;
    });
  }

  if (filterStatus !== 'all') {
    filteredAppointments = filteredAppointments?.filter((item) => item.statusApt === filterStatus.toLowerCase());
  }

  return filteredAppointments;
}
