import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes, { number } from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { TextField, Button, InputLabel, Select, MenuItem, Grid, Container, Stack, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { LoadingButton } from '@mui/lab';
import Editor from '../../../components/editor';
import Iconify from '../../../components/Iconify';
import { addReview, fetchReviews } from "../../../redux/slices/cxpSlice";
import { CxpApi } from "../../../actions/cxpAction";
import useSettings from '../../../hooks/useSettings';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function AddCxpForm() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams()
  const reviews = useSelector(state => state.reviews.reviews);
  const review = reviews.find(rev => rev._id === id)
  console.log(review.typeForm)
  useEffect(() => { fetchReviewsData() }, [dispatch]);

  const fetchReviewsData = async () => {
    const data = await CxpApi.getCxp();
    dispatch(fetchReviews(data));
  };


  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = CxpApi.updateCxp(id, values)
      navigate('/dashboard/cxpForm/list', { replace: true });
      enqueueSnackbar('Review updated successfully', { variant: 'success' });
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error updating review', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    comment: review.comment,
    typeForm: review.typeForm,
    note: review.note,
  };

  const validationSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
    typeForm: Yup.string().required('Form Type is required'),
    note: Yup.number().required('Note is required').min(0).max(10),
  });

  return (<Container maxWidth={themeStretch ? false : 'lg'}>
    <Helmet>
      <title>Add Review | My App</title>
    </Helmet>
    <Typography variant="h4" sx={{ mb: '2rem' }}>
      Update Review
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
                Update Review
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  </Container>
  )
}