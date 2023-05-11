import * as Yup from 'yup';
// form
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { AnswerQuestion } from '../../../../redux/slices/questionSlice';

// ----------------------------------------------------------------------

const RootStyles = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------

QuestionAnswerForm.propTypes = {
  question: PropTypes.object.isRequired,
};

export default function QuestionAnswerForm({ question }) {
  const loading = useSelector((state) => state.question.loading);
  const currentUser = useSelector((state) => state.user.currentUser);
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      answer: '',
    },
    validationSchema: Yup.object({
      answer: Yup.string().required('Answer is required'),
    }),

    onSubmit: async (formData) => {
      try {
        dispatch(AnswerQuestion(question?._id, { ...formData, nutritionist: currentUser }));
        enqueueSnackbar('you have been answered the question', { autoHideDuration: 3000, variant: 'success' });
      } catch (err) {
        enqueueSnackbar(err.response.data.message, { autoHideDuration: 3000, variant: 'error' });
      }
    },
  });

  return (
    <RootStyles>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Add reply
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="answer"
            label="Answer *"
            fullwidth
            value={formik.values.answer}
            error={formik.errors.answer}
            helperText={formik.errors.answer}
            onChange={formik.handleChange}
            multiline
            rows={3}
          />

          <LoadingButton type="submit" variant="contained" loading={loading}>
            Post reply
          </LoadingButton>
        </Stack>
      </form>
    </RootStyles>
  );
}
