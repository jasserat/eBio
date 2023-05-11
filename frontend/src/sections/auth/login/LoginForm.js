/* eslint-disable */
import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import axios from 'axios';
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { toast } from 'react-toastify';
import { UserApi } from 'src/actions/userAction';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    const bodyToSend = {
      email,
      password,
    };
  
    try {
      const result = await axios.post('https://ebio-backend.onrender.com/user/login', bodyToSend);
      console.log(result.data);
      localStorage.setItem('token', JSON.stringify(result.data.token));
      localStorage.setItem('email', JSON.stringify(result.data.email));
      const currentUser = await UserApi.getUserById(result.data.token);
      console.log(currentUser);
      if (currentUser.role === 'farmer') {
        navigate('/dashboard/e-commerce/list');
      }
      if (currentUser.role === 'user') {
        navigate('/dashboard/e-commerce/shop');
      }
      if (currentUser.role === 'deliverer') {
        navigate('/dashboard/e-commerce/delivery');
      }
      location.reload();
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        toast.error(err.response.data.error);
      } else {
        console.log(err);
        toast.error('An error occurred');
      }
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" onChange={onEmailChange} label="Email address" />

        <TextField
          name="password"
          label="Password"
          onChange={onPasswordChange}
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
        Login
      </LoadingButton>
    </>
  );
}
