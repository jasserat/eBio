import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { TextField, Button, InputLabel, Select, MenuItem, Grid, Container, Stack, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Editor from '../../../components/editor';
import { addReview } from "../../../redux/slices/cxpSlice";
import { CxpApi } from '../../../actions/cxpAction';
import useSettings from '../../../hooks/useSettings';




const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function AddCxpForm() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { id } = useParams()
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [typeForm, setTypeForm] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    comment: Yup.string()
      .required('Please enter your comment')
      .min(6, 'Minimum comment length is 6 characters'),
    typeForm: Yup.string().required('Please select a form type'),
    note: Yup.number().required('Please enter a rating').min(0, 'Minimum rating is 0').max(10, 'Maximum rating is 10')
  });

  const handleSubmit = async (values) => {
    try {
      const data = { comment: values.comment, typeForm: values.typeForm, note: values.note };

      const response = await CxpApi.addCxp(id, currentUser._id, data);

      navigate('/dashboard/cxpForm/list', { replace: true });
      enqueueSnackbar('Your review has been added successfully!', { variant: 'success' });


    } catch (error) {
      console.log(error);
      enqueueSnackbar('An error occurred while adding your review. Please try again later.', { variant: 'error' });
    }
  }

  const initialValues = {
    comment: '',
    typeForm: '',
    note: ''
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <Helmet>
        <title>Add Review | My App</title>
      </Helmet>
      <Typography variant="h4" sx={{ mb: '2rem' }}>
        Add a new Review
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={9}>
                <LabelStyle>Form Type</LabelStyle>
                <Select
                  labelId="typeForm-label"
                  id="typeForm"
                  name="typeForm"
                  value={values.typeForm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.typeForm && Boolean(errors.typeForm)}
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="avis">simple review</MenuItem>
                  <MenuItem value="reclamation">reclamation</MenuItem>
                </Select>
                {errors.typeForm && touched.typeForm && (
                  <Typography variant="caption" color="red">
                    {errors.typeForm}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={3}>
                <LabelStyle>Rating</LabelStyle>
                <Select
                  label="Comment"
                  labelId="note"
                  id="demo-simple-select"
                  name="note"
                  fullWidth
                  type="number"
                  value={values.note}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.note && Boolean(errors.note)}
                  helpertext={touched.note && errors.note}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={7}>7</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={9}>9</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>

                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  id="comment"
                  name="comment"
                  label="Comment"
                  variant="outlined"
                  value={values.comment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.comment && Boolean(errors.comment)}
                  helpertext={touched.comment && errors.comment}
                />
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  Add Review
                </LoadingButton>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  )
}