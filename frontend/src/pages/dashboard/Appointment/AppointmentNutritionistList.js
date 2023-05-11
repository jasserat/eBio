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
import {
  fetchAppointmentByNutritionist,
  removeAppointmentFromList,
  updateAppointmentFromList,
} from '../../../redux/slices/appointmentSlice';
import { AppointmentApi } from '../../../actions/appointmentAction';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'client', label: 'Client', align: 'left' },
  { id: 'dateApt', label: 'Date', align: 'left' },
  { id: 'timeApt', label: 'Time', align: 'left' },
  { id: 'locationApt', label: 'Location', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function AppointmentNutritionistList() {
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

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchAppointmentByNutritionist(currentUser?._id));
      // setTableData(appointments);
    }
  }, [dispatch, currentUser]);

  console.log(appointments);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleAcceptRow = async (row) => {
    const res = await AppointmentApi.acceptOrDeclineAppointment(row._id, 'accepted');
    console.log(res);
    dispatch(removeAppointmentFromList(res));
    enqueueSnackbar('Appointment have been accepted', { autoHideDuration: 3000, variant: 'success' });
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = appointments?.filter((row) => !selected.includes(row.id));
    setSelected([]);
    // setTableData(deleteRows);
  };

  const handleDeclineRow = async (row) => {
    const res = await AppointmentApi.acceptOrDeclineAppointment(row._id, 'declined');
    dispatch(removeAppointmentFromList(res));
    enqueueSnackbar('Appointment have been declined', { autoHideDuration: 3000, variant: 'info' });
  };

  useEffect(() => {
    try {
      const dataFiltered = applySortFilter({
        appointments,
        comparator: getComparator(order, orderBy),
        filterName,
      });
      setTableData(dataFiltered);
    } catch (error) {
      console.error(error);
    }
  }, [appointments, order, orderBy, filterName]);
  console.log(tableData);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !appointments?.length && !!filterName;

  return (
    <Page title="Appointment: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Appointment List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Appointment', href: PATH_DASHBOARD.appointment.listN },
            { name: 'List' },
          ]}
        />

        <Card>
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
                      key={row._id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onScheduleRow={() => handleAcceptRow(row)}
                      onCancelRow={() => handleDeclineRow(row)}
                      refRole={'nutritionistRole'}
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

function applySortFilter({ appointments, comparator, filterName }) {
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
  return filteredAppointments;
}
