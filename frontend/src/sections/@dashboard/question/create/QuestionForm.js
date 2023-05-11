import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Chip, Stack, Button, TextField, Typography, Autocomplete, FormHelperText } from '@mui/material';
// routes
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createQuestion } from '../../../../redux/slices/questionSlice';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import {
  RHFSwitch,
  RHFEditor,
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
} from '../../../../components/hook-form';
//
import BlogNewPostPreview from './BlogNewPostPreview';
import Editor from '../../../../components/editor';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function QuestionForm() {
  const navigate = useNavigate();

  // const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.question);
  const { currentUser } = useSelector((state) => state.user);

  /* const handleOpenPreview = () => {
    setOpen(false);
  };

  const handleClosePreview = () => {
    setOpen(false);
  }; */

  const formik = useFormik({
    initialValues: {
      question: '',
      title: '',
      status: 'pending',
    },
    validationSchema: Yup.object({
      question: Yup.string().required('Question is required'),
      title: Yup.string().required('Title is required'),
    }),

    onSubmit: async (formData) => {
      try {
        dispatch(createQuestion({ ...formData, client: currentUser }));
        enqueueSnackbar('Your question has been successfully posted', { autoHideDuration: 3000, variant: 'success' });
        navigate(PATH_DASHBOARD.question.forum);
      } catch (err) {
        enqueueSnackbar(err.response.data.message, { autoHideDuration: 3000, variant: 'error' });
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  name="title"
                  value={formik.values.title}
                  error={formik.errors.title}
                  helperText={formik.errors.title}
                  onChange={formik.handleChange}
                  label="Question Title"
                />

                <div>
                  <LabelStyle>Content</LabelStyle>
                  <Editor
                    simple
                    id={'content'}
                    value={formik.values.question}
                    onChange={(question) => formik.setFieldValue('question', question)}
                    error={formik.errors.question}
                    helperText={
                      <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                        {formik.errors.question}
                      </FormHelperText>
                    }
                  />
                </div>
              </Stack>
            </Card>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <Button color="inherit" variant="outlined" size="large">
            Preview
          </Button>
          <LoadingButton type="submit" variant="contained" size="large" loading={loading}>
            Post
          </LoadingButton>
        </Stack>
      </form>
      {/*   <BlogNewPostPreview
        values={values}
        isOpen={open}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={handleClosePreview}
        onSubmit={handleSubmit(onSubmit)}
      />  */}
    </>
  );
}
