/* eslint-disable no-unused-expressions */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// form
// @mui
import { styled } from '@mui/material/styles';
import { DatePicker, LoadingButton, TimePicker } from '@mui/lab';
import { Autocomplete, Box, Card, FormHelperText, Grid, Stack, TextField, Typography } from '@mui/material';
// routes
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Editor from '../../../../components/editor';
import { UserApi } from '../../../../actions/userAction';
import { AppointmentApi } from '../../../../actions/appointmentAction';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

AppointmentBookingForm.propTypes = {
  isFromDoctorList: PropTypes.bool,
  id: PropTypes.string,
};

export default function AppointmentBookingForm({ isFromDoctorList, id }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const [isloading, setIsLoading] = useState(false);
  const [listofNutritionist, setListofNutritionist] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const formik = useFormik({
    initialValues: {
      dateApt: '',
      timeApt: '',
      nutritionist: null,
      locationApt: '',
      reasonApt: '',
      statusApt: 'pending',
    },
    validationSchema: Yup.object({
      dateApt: Yup.number().required('Date is required'),
      locationApt: Yup.string().required('Location is required'),
      reasonApt: Yup.string().required('Reason is required'),
      nutritionist: Yup.object().required('nutrition is required'),
      timeApt: Yup.number().required('Time is required'),
    }),

    onSubmit: async (formData) => {
      try {
        //  const result = await AppointmentApi.updateAppointment(formData);
        const result = await AppointmentApi.createAppointment({
          ...formData,
          dateApt: new Date(formData.dateApt).setHours(0, 0, 0, 0),
          user: currentUser,
        });
        // toast.success('Your appointment has been successfully created');
        enqueueSnackbar('Your appointment has been successfully created', {
          autoHideDuration: 3000,
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.appointment.list);
      } catch (err) {
        // toast.error(err.response.data.message);
        enqueueSnackbar(err.response.data.message, { autoHideDuration: 3000, variant: 'error' });
      }
    },
  });

  useEffect(() => {
    UserApi.getUserByRole('nutritionist').then((r) => {
      setListofNutritionist(r);
      isFromDoctorList &&
        formik.setFieldValue(
          'nutritionist',
          r.find((item) => item._id === id)
        );
    });
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Autocomplete
                id="nutritionist-select-demo"
                // sx={{ width: 300 }}
                value={formik.values.nutritionist}
                onChange={(e, v) => formik.setFieldValue('nutritionist', v)}
                disabled={!!isFromDoctorList}
                options={listofNutritionist}
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
                noOptionsText={'No nutritionist found , Please try to search again !!'}
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
                    label="Choose a nutritionist"
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
          </Card>

          <LoadingButton type="submit" variant="contained" sx={{ mt: 3 }} size="large" loading={isloading}>
            {'Book Appointment'}
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
}
