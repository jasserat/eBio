import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import { format } from 'date-fns';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import ScheduleDialog from '../../../../pages/dashboard/Appointment/ScheduleDialog';

// ----------------------------------------------------------------------

AppointmentTableRow.propTypes = {
  keyRow: PropTypes.any,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onScheduleRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onCancelRow: PropTypes.func,
  refRole: PropTypes.string,
};

export default function AppointmentTableRow({
  keyRow,
  row,
  selected,
  onScheduleRow,
  onSelectRow,
  onCancelRow,
  refRole,
}) {
  const theme = useTheme();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected} key={keyRow}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {refRole === 'nutritionistRole' ? (
          <>
            <Avatar
              alt={row.client.firstName + row.client.lastName}
              src={
                row.client.image
                  ? row.client.image
                  : 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_1.jpg'
              }
              sx={{ mr: 2 }}
            />
            <Typography variant="subtitle2" noWrap>
              {`${row.client.firstName} ${row.client.lastName}`}
            </Typography>
          </>
        ) : (
          <>
            <Avatar
              alt={row.nutritionist.firstName + row.nutritionist.lastName}
              src={
                row.nutritionist.image
                  ? row.nutritionist.image
                  : 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_1.jpg'
              }
              sx={{ mr: 2 }}
            />
            <Typography variant="subtitle2" noWrap>
              {`${row.nutritionist.firstName} ${row.nutritionist.lastName}`}
            </Typography>
          </>
        )}
      </TableCell>

      <TableCell align="left">{format(new Date(row.dateApt), 'yyyy/MM/dd')}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {format(new Date(parseInt(row.timeApt, 10)), 'h:mm a')}
      </TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {row.locationApt}
      </TableCell>

      {refRole === 'clientRole' && (
        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={(row.statusApt === 'declined' && 'error') || (row.statusApt === 'pending' && 'warning') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {row.statusApt}
          </Label>
        </TableCell>
      )}

      {row.statusApt === 'pending' && refRole === 'clientRole' ? (
        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    // onScheduleRow();
                    // handleCloseMenu();
                  }}
                  sx={{ color: 'secondary.main' }}
                >
                  <ScheduleDialog row={row} handleCloseMenuItem={handleCloseMenu} />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onCancelRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:close-circle-outline'} />
                  Cancel
                </MenuItem>
              </>
            }
          />
        </TableCell>
      ) : (
        <TableCell align="right"> </TableCell>
      )}
      {refRole === 'nutritionistRole' && (
        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    onScheduleRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'success.main' }}
                >
                  <Iconify icon={'eva:checkmark-outline'} />
                  Accept
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onCancelRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:slash-outline'} />
                  Decline
                </MenuItem>
              </>
            }
          />
        </TableCell>
      )}
    </TableRow>
  );
}
