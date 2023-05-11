import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
// hooks
import { Box, Grid, Card, Stack, Typography, TextField, FormHelperText, Switch, MenuItem } from '@mui/material';

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
import { addUser } from '../../../../redux/slices/userSlice';
import PointsCard from '../../../../components/PointsCard';
import { UploadAvatar } from '../../../../components/upload';

// ----------------------------------------------------------------------
const genderType = ['male', 'female', 'non-binary'];

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      cin: currentUser?.cin || '',
      role: currentUser?.role || '',
      address: currentUser?.address || '',
      dateOfBirth: currentUser?.dateOfBirth || '',
      gender: currentUser?.gender || '',
      points: currentUser?.points ? currentUser?.points : 0,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('firstName is required'),
      lastName: Yup.string().required('lastName is required'),
      address: Yup.string().required('address is required'),
      gender: Yup.string().required('gender is required'),
      email: Yup.string().email('please verify your email format').required('email is required'),
      phoneNumber: Yup.number().required('PhoneNumber is required'),
      cin: Yup.number().required('PhoneNumber is required'),
    }),
    onSubmit: async (formData) => {
      const data = formData;
      try {
        const result = await UserApi.editUserProfile(currentUser?._id, { ...data, role: currentUser.role });
        console.log(result);
        dispatch(addUser(result));
        toast.success('Your account has been successfully updated');
      } catch (err) {
        toast.error(err.response.data.message);
      }
    },
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
          <div>
            <UploadAvatar
              // error={checkError}
              name="image"
              accept="image/*"
              maxSize={3145728}
              // onDrop={handleDrop}
              // file={field.value}
            />

            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif
                <br /> max size of {fData(3145728)}
              </Typography>
            </FormHelperText>
          </div>

          <Switch
            name="isPublic"
            labelPlacement="start"
            label="Public Profile"
            sx={{ mt: 5 }}
            // checked={field.value}
          />
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <TextField
                name="firstName"
                placeholder="enter your firstName"
                label="First Name"
                fullWidth
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.errors.firstName}
                helperText={formik.errors.firstName}
              />
              <TextField
                name="lastName"
                placeholder="enter your lastName"
                label="Last Name"
                fullWidth
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.errors.lastName}
                helperText={formik.errors.lastName}
              />
              <TextField
                name="email"
                label="Email"
                placeholder="enter your email adress"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.errors.email}
                helperText={formik.errors.email}
              />
              <TextField
                name="cin"
                label="CIN"
                placeholder="enter your cin"
                type="number"
                fullWidth
                value={formik.values.cin}
                onChange={formik.handleChange}
                error={formik.errors.cin}
                helperText={formik.errors.cin}
              />
              <TextField
                name="phoneNumber"
                label="Phone Number"
                placeholder="enter your phoneNumber"
                fullWidth
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={formik.errors.phoneNumber}
                helperText={formik.errors.phoneNumber}
              />
              <TextField
                name="address"
                label="Address"
                placeholder="enter your address"
                fullWidth
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.errors.address}
                helperText={formik.errors.address}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <PointsCard total={formik.values.points} color="success" icon={'octicon:trophy-24'} />

              <LoadingButton type="submit" variant="contained">
                Save Changes
              </LoadingButton>
            </Stack>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
}
