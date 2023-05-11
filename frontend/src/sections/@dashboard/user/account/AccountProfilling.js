import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker, LoadingButton } from '@mui/lab';
// hooks
import { Box, Grid, Card, Stack, Typography, TextField, FormHelperText, Switch, MenuItem, Slider } from '@mui/material';

import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik/dist';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { UserApi } from '../../../../actions/userAction';
import { addUser, updateUserProfilling } from '../../../../redux/slices/userSlice';
import PointsCard from '../../../../components/PointsCard';
import { UploadAvatar } from '../../../../components/upload';

// ----------------------------------------------------------------------
const genderType = ['male', 'female', 'non-binary'];
const goalTypes = ['Maintain weight', 'Mild weight loss', 'Weight loss', 'Extreme weight loss'];
const activityTypes = [
  'Little/no exercise',
  'Light exercise',
  'Moderate exercise (3-5 days/wk)',
  'Very active (6-7 days/wk)',
  'Extra active (very active & physical job)',
];

export default function AccountProfilling() {
  const { enqueueSnackbar } = useSnackbar();

  const { currentUser, step } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [activityType, setActivityType] = useState(activityTypes[0]);
  const handleSliderChange = (event, newValue) => {
    setActivityType(activityTypes[newValue]);
  };
  const formik = useFormik({
    initialValues: {
      height: currentUser?.height || null,
      weight: currentUser?.weight || null,
      dateOfBirth: currentUser?.dateOfBirth || null,
      gender: currentUser?.gender || '',
      activity: activityTypes.indexOf(currentUser?.activity) || null,
      goal: currentUser?.goal || '',
      number_of_meals: currentUser?.number_of_meals || '',
    },
    validationSchema: Yup.object({
      height: Yup.number(),
      weight: Yup.number(),
      gender: Yup.string(),
      activity: Yup.string(),
      goal: Yup.string(),
      number_of_meals: Yup.number(),
    }),
    onSubmit: async (formData) => {
      const data = formData;
      try {
        dispatch(
          updateUserProfilling(currentUser?._id, {
            ...data,
            activity: activityTypes[formData.activity],
            height: parseInt(formData.height, 10),
            weight: parseInt(formData.weight, 10),
          })
        );
        enqueueSnackbar('Your user profilling has been successfully updated', {
          autoHideDuration: 3000,
          variant: 'info',
        });
      } catch (err) {
        toast.error(err.response.data.message);
      }
    },
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3} sx={{ my: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  name="height"
                  placeholder="enter your height"
                  label="Height"
                  fullWidth
                  value={formik.values.height}
                  onChange={formik.handleChange}
                  error={formik.errors.height}
                  helperText={formik.errors.height}
                />
                <TextField
                  name="weight"
                  placeholder="enter your weight"
                  label="Weight"
                  fullWidth
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  error={formik.errors.weight}
                  helperText={formik.errors.weight}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <DatePicker
                  label="Date"
                  value={formik.values.dateOfBirth}
                  onChange={(date) => formik.setFieldValue('dateOfBirth', Date.parse(date))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.errors.dateOfBirth}
                      helperText={formik.errors.dateOfBirth}
                    />
                  )}
                />
                <TextField
                  name="gender"
                  select
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  error={formik.errors.gender}
                  helperText={formik.errors.gender}
                  variant="outlined"
                  label="Gender"
                  fullWidth
                  placeholder="enter your gender"
                  style={{ textAlign: 'start' }}
                >
                  {genderType.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <br />
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" spacing={2}>
                <Slider
                  aria-label="Activity Type"
                  defaultValue={0}
                  step={1}
                  marks={activityTypes.map((type, index) => ({ value: index, label: '' }))}
                  onChange={(e, v) => formik.setFieldValue('activity', v)}
                  sx={{ width: '70%', margin: 'auto' }}
                  valueLabelDisplay="auto"
                  value={formik.values.activity}
                  valueLabelFormat={(value) => (
                    <Typography variant="subtitle2" color="primary">
                      {activityTypes[value]}
                    </Typography>
                  )}
                  max={activityTypes.length - 1}
                />
                <Typography variant="subtitle1" sx={{ width: '20%' }}>
                  {activityTypes[formik.values.activity]}
                </Typography>
              </Stack>

              <TextField
                name="goal"
                label="weight loss plan"
                placeholder="Choose your weight loss plan:"
                value={formik.values.goal}
                onChange={formik.handleChange}
                error={formik.errors.goal}
                helperText={formik.errors.goal}
                select
              >
                {goalTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" spacing={2}>
                <Slider
                  aria-label="Meals"
                  defaultValue={3}
                  step={1}
                  marks
                  value={formik.values.number_of_meals}
                  onChange={(e, v) => formik.setFieldValue('number_of_meals', v)}
                  sx={{ width: '70%', margin: 'auto' }}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => (
                    <Typography variant="subtitle2" color="primary">
                      {value} meals per day
                    </Typography>
                  )}
                  min={3}
                  max={5}
                />
                <Typography variant="subtitle1" sx={{ width: '20%' }}>
                  {formik.values.number_of_meals} meals per day
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={step}>
                Save Changes
              </LoadingButton>
            </Stack>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
}
