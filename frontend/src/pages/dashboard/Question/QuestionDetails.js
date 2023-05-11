import { useEffect, useState, useCallback } from 'react';
import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
// @mui
import { Box, Card, Divider, Container, Typography, Pagination, Stack } from '@mui/material';
// routes
import { useDispatch, useSelector } from 'react-redux';
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// utils
import axios from '../../../utils/axios';
// components
import Page from '../../../components/Page';
import Markdown from '../../../components/Markdown';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { SkeletonPost } from '../../../components/skeleton';
// sections
import {
  BlogPostHero,
  BlogPostTags,
  BlogPostRecent,
  BlogPostCommentList,
  BlogPostCommentForm,
} from '../../../sections/@dashboard/blog';
import QuestionDetailHero from '../../../sections/@dashboard/question/forum/QuestionDetailHero';
import QuestionAnswerForm from '../../../sections/@dashboard/question/forum/QuestionAnswerForm';
import QuestionAnswerList from '../../../sections/@dashboard/question/forum/QuestionAnswerList';
import { getQuestionById } from '../../../redux/slices/questionSlice';

// ----------------------------------------------------------------------

export default function QuestionDetails() {
  const { themeStretch } = useSettings();

  const isMountedRef = useIsMountedRef();

  const { id } = useParams();
  const dispatch = useDispatch();

  const detailQuestion = useSelector((state) => state.question.detailQuestion);

  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getQuestionById(id));
  }, [dispatch]);

  return (
    <Page title="Question: Question Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Question Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Unanswered Question', href: PATH_DASHBOARD.question.forumN },
            { name: sentenceCase(id) },
          ]}
        />

        {detailQuestion && (
          <Stack spacing={2}>
            <Card>
              <QuestionDetailHero question={detailQuestion} />

              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Typography variant="h6" sx={{ mb: 5 }}>
                  {detailQuestion.title}
                </Typography>
                <Divider />

                <Markdown children={detailQuestion.question} />
              </Box>
            </Card>
            <Card>
              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography variant="h4">Answers</Typography>
                  {/* <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                  ({post.comments.length})
                </Typography>  */}
                </Box>
                <QuestionAnswerList question={detailQuestion} />

                {detailQuestion.answer === '' && <QuestionAnswerForm question={detailQuestion} />}
              </Box>
            </Card>
          </Stack>
        )}

        {!detailQuestion && !error && <SkeletonPost />}

        {error && <Typography variant="h6">404 {error}!</Typography>}
      </Container>
    </Page>
  );
}
