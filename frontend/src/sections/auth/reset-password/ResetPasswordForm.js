import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

import { PassApi } from '../../../actions/userAction';


// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
};

export default function ResetPasswordForm({ onSent, onGetEmail }) {
  const isMountedRef = useIsMountedRef();
  const [alertMessage, setAlertMessage] = useState('');

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: 'demo@minimals.cc' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log('email:', methods.getValues().email);
      const response = await PassApi.forgetPassword({ email: methods.getValues().email });
      console.log('response:', response);
      setAlertMessage(`Email sent successfully. Check your inbox for a password reset link.`);
      if (onSent) {
        onSent();
      }
      if (onGetEmail) {
        onGetEmail(methods.getValues().email);
      }
    } catch (error) {
      console.log('error:', error);
      setAlertMessage(`Failed to send email. Please try again later.`);
    }
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   if (isMountedRef.current) {
    //     onSent();
    //     onGetEmail(data.email);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
