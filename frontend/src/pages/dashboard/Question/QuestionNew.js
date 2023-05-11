// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import QuestionForm from '../../../sections/@dashboard/question/create/QuestionForm';
// sections

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Question: New Question">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new question"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Question', href: PATH_DASHBOARD.question.forum },
            { name: 'New Question' },
          ]}
        />

        <QuestionForm />
      </Container>
    </Page>
  );
}
