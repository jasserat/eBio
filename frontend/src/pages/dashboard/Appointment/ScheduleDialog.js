/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller } from 'react-hook-form';
import { DatePicker, TimePicker } from '@mui/lab';
import { FormControl, FormLabel, Stack } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import Iconify from '../../../components/Iconify';
import { AppointmentApi } from '../../../actions/appointmentAction';
import { updateAppointmentFromList } from '../../../redux/slices/appointmentSlice';

export default function ScheduleDialog({ row, handleCloseMenuItem }) {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log(row);

  const formik = useFormik({
    initialValues: {
      dateApt: Date.parse(row.dateApt),
      timeApt: parseInt(row.timeApt, 10),
    },
    validationSchema: Yup.object({
      dateApt: Yup.number().required('Date is required'),
      timeApt: Yup.number().required('Time is required'),
    }),
    onSubmit: async (formData) => {
      try {
        const result = await AppointmentApi.updateAppointment(row._id, { ...row, ...formData });
        // toast.success('Your appointment has been successfully updated');
        dispatch(updateAppointmentFromList({ ...row, ...formData }));
        enqueueSnackbar('Your appointment has been successfully updated', {
          autoHideDuration: 3000,
          variant: 'warning',
        });
      } catch (err) {
        //  toast.error(err.response.data.message);
        enqueueSnackbar(err.response.data.message, { autoHideDuration: 3000, variant: 'error' });
      }
    },
  });

  return (
    <div>
      <div onClick={handleClickOpen}>
        <Stack direction={{ xs: 'column', sm: 'row' }}>
          <Iconify icon={'eva:clock-outline'} />
          <div>Schedule</div>
        </Stack>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Schedule an appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>To schedule your appointment, please choose the date and the time.</DialogContentText>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 2 }} spacing={2}>
              <DatePicker
                label="Date"
                value={formik.values.dateApt}
                onChange={(date) => formik.setFieldValue('dateApt', Date.parse(date))}
                renderInput={(params) => (
                  <TextField {...params} fullWidth error={formik.errors.dateApt} helperText={formik.errors.dateApt} />
                )}
              />

              <TimePicker
                label="Time"
                value={formik.values.timeApt}
                onChange={(time) => formik.setFieldValue('timeApt', Date.parse(time))}
                renderInput={(params) => (
                  <TextField {...params} fullWidth error={formik.errors.timeApt} helperText={formik.errors.timeApt} />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
                handleCloseMenuItem();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" sx={{ color: 'warning.main' }}>
              Schedule
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
