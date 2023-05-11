import orderBy from 'lodash/orderBy';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';
// @mui
import { Grid, Button, Container, Stack } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
import useSettings from '../../../hooks/useSettings';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// utils
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import { SkeletonPostItem } from '../../../components/skeleton';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import QuestionCard from '../../../sections/@dashboard/question/forum/QuestionCard';
import { fetchForumQuestion } from '../../../redux/slices/questionSlice';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }
  if (sortBy === 'popular') {
    return orderBy(posts, ['view'], ['desc']);
  }
  return posts;
};

export default function QuestionForum() {
  const { themeStretch } = useSettings();

  const isMountedRef = useIsMountedRef();

  const { questions } = useSelector((state) => state.question);

  const [filters, setFilters] = useState('latest');

  const sortedPosts = applySort(questions, filters);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchForumQuestion());
  }, [dispatch]);

  const handleChangeSort = (value) => {
    if (value) {
      setFilters(value);
    }
  };

  return (
    <Page title="Blog: Posts">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Blog"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Question', href: PATH_DASHBOARD.question.forum },
            { name: 'Forum' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.question.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Question
            </Button>
          }
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          {/*
          <BlogPostsSearch />
          <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
          */}
        </Stack>

        <Grid container spacing={3}>
          {(!questions.length ? [...Array(12)] : questions).map((question, index) =>
            question ? (
              <Grid key={question._id} item xs={12} sm={6} md={6}>
                <QuestionCard question={question} index={index} Urole={'client'} />
              </Grid>
            ) : (
              <SkeletonPostItem key={index} />
            )
          )}
        </Grid>
      </Container>
    </Page>
  );
}
