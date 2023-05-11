import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Divider,
  Button,
  MenuItem,
  Container,
  styled,
  TextareaAutosize,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Iconify from '../../../components/Iconify';
import { UserApi } from '../../../actions/userAction';
import { PATH_AUTH } from '../../../routes/paths';

// sharedsharedComponents
//

const genderType = ['male', 'female'];
const specializationType = [
  'sports nutrition',
  'pediatric nutrition',
  'Geriatric nutrition',
  'Oncology nutrition',
  'Eating disorder nutrition',
  'Diabetes nutrition',
  'Weight management nutrition',
  'Cardiovascular nutrition',
];
const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function RegisterNutrition({ setTap, role }) {
  console.log('setTap:', setTap);
  console.log('role:', role);
  const navigate = useNavigate();

  // function to handle click event of the button

  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      cin: '',
      role: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      certification: '',
      specialization: '',
      experience: '',
      bio: '',
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required('firstName is required'),
      lastName: Yup.string().required('lastName is required'),
      address: Yup.string().required('address is required'),
      gender: Yup.string().required('gender is required'),
      email: Yup.string().email('please verify your email format').required('email is required'),
      password: Yup.string().required('Password is required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
      phoneNumber: Yup.number().required('PhoneNumber is required'),
      cin: Yup.number().required('PhoneNumber is required'),
      certification: Yup.string().required('certification is required'),
      specialization: Yup.string().required('specialization is required'),
      experience: Yup.string().required('experience is required'),
      bio: Yup.string().required('bio is required'),
    }),

    onSubmit: async (formData) => {
      delete formData.confirmPassword;
      try {
        const result = await UserApi.register({ ...formData, role });
        toast.success('Your account has been successfully created');
        navigate(PATH_AUTH.login);
      } catch (err) {
        toast.error(err.response.data.message);
      }
    },
  });

  return (
    <>
      <Container maxWidth="sm">
        <StyledContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3} sx={{ my: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
              </Stack>
              <TextField
                name="email"
                label="Email"
                placeholder="enter your email adress"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.errors.email}
                helperText={formik.errors.email}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
              </Stack>

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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  name="dateOfBirth"
                  type="date"
                  fullWidth
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  error={formik.errors.dateOfBirth}
                  helperText={formik.errors.dateOfBirth}
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
              <TextField
                name="certification"
                label="certification"
                placeholder="enter your certification"
                value={formik.values.certification}
                onChange={formik.handleChange}
                error={formik.errors.certification}
                helperText={formik.errors.certification}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  name="experience"
                  label="experience"
                  placeholder="enter your experience"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  error={formik.errors.experience}
                  helperText={formik.errors.experience}
                />
                <TextField
                  name="specialization"
                  select
                  value={formik.values.specialization}
                  onChange={formik.handleChange}
                  error={formik.errors.specialization}
                  helperText={formik.errors.specialization}
                  variant="outlined"
                  label="Specialization"
                  fullWidth
                  placeholder="enter your specialization"
                  style={{ textAlign: 'start' }}
                >
                  {specializationType.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  name="password"
                  placeholder="enter your password"
                  label="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.errors.password}
                  helperText={formik.errors.password}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  name="confirmPassword"
                  placeholder="enter your confirm password"
                  label="Confirm Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={formik.errors.confirmPassword}
                  helperText={formik.errors.confirmPassword}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <TextareaAutosize
                name="bio"
                label="bio"
                placeholder="enter your bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                error={formik.errors.bio}
                helperText={formik.errors.bio}
                aria-label="minimum height"
                minRows={3}
              />
            </Stack>

            <LoadingButton type="submit" fullWidth size="large" variant="contained">
              register
            </LoadingButton>
          </form>
        </StyledContent>
      </Container>
    </>
  );
}
