/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Button,
  Tooltip,
  TextField,
  IconButton,
  DialogActions,
  Autocomplete,
  FormHelperText,
  styled,
  Typography,
} from '@mui/material';
import { DatePicker, LoadingButton, MobileDateTimePicker, TimePicker } from '@mui/lab';
// redux
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from '../../../../redux/store';
import {
  createAppointmentFromCalendar,
  updateAppointmentFromCalendar,
  deleteAppointmentFromCalendae,
} from '../../../../redux/slices/appointmentSlice';
// components
import Iconify from '../../../../components/Iconify';
import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch } from '../../../../components/hook-form';
import { AppointmentApi } from '../../../../actions/appointmentAction';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Editor from '../../../../components/editor';
import { UserApi } from '../../../../actions/userAction';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const DateFix = (date) => new Date(date).setDate(new Date(date).getDate() + 1);
const DateUpdate = (date) => new Date(date).setDate(new Date(date).getDate() - 1);

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function CalendarForm({ event, range, onCancel }) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const isCreating = Object.keys(event).length === 0;

  const [listofClient, setListofClient] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const isLoading = useSelector((state) => state.appointment.isLoading);

  const formik = useFormik({
    initialValues: {
      dateApt: !isCreating ? DateUpdate(event?.dateApt) : range ? range?.start : '',
      timeApt: isCreating ? '' : parseInt(event?.timeApt, 10),
      user: isCreating ? null : event?.client,
      locationApt: isCreating ? '' : event?.locationApt,
      reasonApt: isCreating ? '' : event?.reasonApt,
      statusApt: 'accepted',
    },
    validationSchema: Yup.object({
      dateApt: Yup.number().required('Date is required'),
      locationApt: Yup.string().required('Location is required'),
      reasonApt: Yup.string().required('Reason is required'),
      user: Yup.object().required('Client is required'),
      timeApt: Yup.number().required('Time is required'),
    }),

    onSubmit: async (formData) => {
      try {
        if (event.id) {
          dispatch(
            updateAppointmentFromCalendar(event.id, {
              ...formData,
              dateApt: DateFix(formData.dateApt),
              nutritionist: currentUser,
            })
          );
          enqueueSnackbar('Your appointment has been successfully updated!', {
            autoHideDuration: 3000,
            variant: 'warning',
          });
        } else {
          enqueueSnackbar('Your appointment has been successfully created!', {
            autoHideDuration: 3000,
            variant: 'success',
          });
          dispatch(
            createAppointmentFromCalendar({
              ...formData,
              dateApt: DateFix(formData.dateApt),
              nutritionist: currentUser,
            })
          );
        }
        formik.handleReset();
        onCancel();
      } catch (err) {
        // toast.error(err.response.data.message);
        enqueueSnackbar(err.response.data.message, { autoHideDuration: 3000, variant: 'error' });
      }
    },
  });

  const handleDelete = async () => {
    if (!event.id) return;
    try {
      onCancel();
      dispatch(deleteAppointmentFromCalendae(event.id));
      enqueueSnackbar('Your appointment has been successfully deleted!', { autoHideDuration: 3000, variant: 'info' });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    UserApi.getUserByRole('user').then((r) => {
      setListofClient(r);
    });
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Autocomplete
          id="client-select-demo"
          // sx={{ width: 300 }}
          value={formik.values.user}
          onChange={(e, v) => formik.setFieldValue('user', v)}
          options={listofClient}
          autoHighlight
          fullWidth
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          filterOptions={(options, { inputValue }) => {
            const filter = inputValue.toLowerCase();
            return options.filter((option) => {
              const fullName = `${option.firstName} ${option.lastName}`.toLowerCase();
              const filterValue = filter.toLowerCase();
              return fullName.indexOf(filterValue) !== -1;
            });
          }}
          noOptionsText={'No client found , Please try to search again !!'}
          renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <img
                loading="lazy"
                width="20"
                src={
                  option.image
                    ? option.image
                    : 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_2.jpg'
                }
                srcSet={
                  option.image
                    ? option.image
                    : 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_2.jpg'
                }
                alt=""
              />
              {option.firstName} {option.lastName}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Choose a client"
              error={formik.errors.nutritionist}
              helperText={formik.errors.nutritionist}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
          )}
        />

        <TextField
          name="locationApt"
          label="Location"
          value={formik.values.locationApt}
          onChange={formik.handleChange}
          error={formik.errors.locationApt}
          helperText={formik.errors.locationApt}
        />
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

        <div>
          <LabelStyle>Reason</LabelStyle>
          <Editor
            simple
            id={'reason'}
            value={formik.values.reasonApt}
            onChange={(reason) => formik.setFieldValue('reasonApt', reason)}
            error={formik.errors.reasonApt}
            helperText={
              <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                {formik.errors.reasonApt}
              </FormHelperText>
            }
          />
        </div>
      </Stack>

      <DialogActions>
        {!isCreating && (
          <Tooltip title="Delete Appointment">
            <IconButton onClick={handleDelete}>
              <Iconify icon="eva:trash-2-outline" width={20} height={20} />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" color={isCreating ? 'success' : 'warning'} variant="contained" loading={isLoading}>
          {isCreating ? 'Add' : 'Update'}
        </LoadingButton>
      </DialogActions>
    </form>
  );
}
