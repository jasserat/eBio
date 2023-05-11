import PropTypes from 'prop-types';
// @mui
import { Box, List } from '@mui/material';
//
import QuestionAnswerItem from './QuestionAnswerItem';

// ----------------------------------------------------------------------

QuestionAnswerList.propTypes = {
  question: PropTypes.object.isRequired,
};

export default function QuestionAnswerList({ question }) {
  console.log(question);
  return (
    <List disablePadding>
      <Box key={question._id} sx={{}}>
        {question.answer !== '' ? (
          <QuestionAnswerItem
            name={`${question?.nutritionist?.firstName} ${question?.nutritionist?.lastName}`}
            avatarUrl={
              question?.nutritionist?.image
                ? question?.nutritionist?.image
                : 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_2.jpg'
            }
            specialization={question?.nutritionist?.specialization}
            message={question.answer}
          />
        ) : (
          <>
            There is no answer yet
            <br />
            <br />
          </>
        )}
      </Box>
    </List>
  );
}
