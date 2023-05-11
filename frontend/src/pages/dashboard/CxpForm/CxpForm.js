import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet-async';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
// @mui

import { Grid, Button, Container, Stack, Typography, Box, Link, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { fToNow } from "../../../utils/formatTime";
import { CxpApi } from "../../../actions/cxpAction";
import { UserApi } from "../../../actions/userAction";
import Iconify from '../../../components/Iconify';
import { fetchReviews, deleteReview } from "../../../redux/slices/cxpSlice";
import { addUserList } from "../../../redux/slices/userSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  reviewContainer: {
    marginBottom: theme.spacing(2),
  },
  rating: {
    fontWeight: "bold",
    marginRight: theme.spacing(1),
  },
  reviewer: {
    fontWeight: "bold",
  },
}));


const labels = {
  1: 'Useless',
  2: 'Useless+',
  3: 'Poor',
  4: 'Poor+',
  5: 'Ok',
  6: 'Ok+',
  7: 'Good',
  8: 'Good+',
  9: 'Excellent',
  10: 'Excellent+',
};
const GetUserById = (id, users) => {
  const user = users.find(user => user._id === id);
  return user;
}

export default function CxpForm() {
  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviews);
  const users = useSelector(state => state.user.users);
  const { currentUser } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  const fetchReviewsData = async () => {
    try {
      const data = await CxpApi.getCxp();
      dispatch(fetchReviews(data));
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => { fetchUser(); fetchReviewsData() }, [dispatch]);



  const fetchUser = async () => {
    const data = await UserApi.getUsers();
    dispatch(addUserList(data));
  };

  const HandleDelete = async (id) => {
    try {
      await CxpApi.deleteCxp(id);
      const data = await CxpApi.getCxp();
      dispatch(fetchReviews(data));
      enqueueSnackbar('Your review has been deleted successfully!', { variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  const [selectedTypeForm, setSelectedTypeForm] = useState("");


  const filteredReviews = selectedTypeForm === ""
    ? reviews.filter(review => review.userId === currentUser._id || currentUser.role === "admin")
    : reviews.filter(review => review.typeForm === selectedTypeForm && (review.userId === currentUser._id || currentUser.role === "admin"));


  return (
    <>
      <Helmet>
        <title> Dashboard: Blog | Minimal UI </title>
      </Helmet>

      <Container className={classes.root}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Reviews : List
          </Typography>
          <Button onClick={() => navigate(`/dashboard/cxpForm/addCxpForm/${10}`)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Review
          </Button>

          




        </Stack>



        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Form Type</InputLabel>
          <Select
            labelId="typeForm-select-label"
            id="typeForm-select"
            value={selectedTypeForm}
            label="TypeForm"
            onChange={(e) => setSelectedTypeForm(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="avis">simple reviews</MenuItem>
            <MenuItem value="reclamation">reclamations</MenuItem>

          </Select>
        </FormControl>
        <br />
        <br />
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {
            filteredReviews.length > 0
              ? filteredReviews.map((review, index) => {
                const user = GetUserById(review.userId, users);

                return (
                  <ListItem alignItems="flex-start" key={review._id} index={index} sx={{ height: 'auto' }}>
                    <ListItemAvatar>
                      <Avatar alt={user ? user.firstName : "unknown "} src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="h5"
                        color="text.primary"
                      >       {user ? user.firstName : "unknown "} {user ? user.lastName : "unknown"} </Typography>}
                      secondary={
                        <>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body1"
                            color="text.primary"
                          >
                            {review.comment}
                          </Typography>
                          <br />

                          <Grid container justifyContent="space-between">
                            <Grid item>
                              <Box
                                sx={{
                                  width: 200,
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Rating
                                  name="text-feedback"
                                  value={review.note / 2}
                                  readOnly
                                  precision={0.5}
                                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                                <Box sx={{ ml: 2 }}>{labels[review.note]}</Box>
                              </Box>

                            </Grid>
                            <Grid item>
                              <Typography variant="caption" sx={{ pr: 3, flexShrink: 100, color: 'text.secondary', align: 'right' }}>
                                {fToNow(review.date)}
                              </Typography>
                            </Grid>
                          </Grid>
                          {currentUser._id === review.userId &&
                            <Button onClick={() => HandleDelete(review._id)}> Delete</Button>

                          }
                          {currentUser._id === review.userId &&
                            <Button onClick={() => navigate(`/dashboard/cxpForm/updateCxpForm/${review._id}`)}>Update</Button>
                          }

                          {currentUser._id === review.userId &&
                            <Button onClick={() => navigate(`/dashboard/e-commerce/showProducts/${review.refOrder}`) }> Show Order </Button>

                          }


                        </>
                      }
                    />
                  </ListItem>
                );
              }) : "There are no reviews"}
          <Divider variant="inset" component="li" />
        </List>
      </Container>
    </>
  );
}