import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Stack, IconButton, InputAdornment, TextField, Container, Typography, Divider } from '@mui/material';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui

import { LoadingButton } from '@mui/lab';

import { PassApi } from '../../actions/userAction';

import Iconify from '../../components/Iconify';

import Logo from '../../components/Logo';

// hooks
import useResponsive from '../../hooks/useResponsive';










// sections
// import { ForgetForm } from '../sections/auth/forget';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ResetPassPage() {

  const [showPassword, setShowPassword] = useState(false);
  const mdUp = useResponsive('up', 'md');
  const [newPass, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');




  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const path = window.location.pathname;
      const idPattern = /\/newPass\/(\w+)\/(\w+)/;
      const match = path.match(idPattern);
      const code = match[1];
      const id = match[2];

      // password validation
      if (newPass.length < 8) {
        setAlertMessage(`Password must be at least 8 characters long ! `);
      }
      if (!/[A-Z]/.test(newPass)) {
        setAlertMessage(`Password must contain at least one uppercase letter! `);
      }
      if (!/\d/.test(newPass)) {
        setAlertMessage(`Password must contain at least one number ! `);
      }

      const response = await PassApi.newPassword({ newPass }, code, id);
      console.log(response);
      setAlertMessage(`Password reset successfully ! `);
      // setNewPassword('');
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Login | Minimal UI </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              New Password
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
              Please enter your new password
            </Typography>

            <Stack spacing={3}>
              <TextField
                name="password"
                label="Enter new password"
                onChange={handlePasswordChange} 
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

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
              submit
            </LoadingButton>

            {alertMessage && (
              <div className="alert">{alertMessage}</div>
            )}

          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
