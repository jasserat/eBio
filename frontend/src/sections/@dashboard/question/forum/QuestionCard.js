/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Link,
  Card,
  Avatar,
  Typography,
  CardContent,
  Stack,
  ButtonBase,
  Button,
  AccordionDetails,
  Accordion,
  AccordionSummary,
} from '@mui/material';
// routes
import { useState } from 'react';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import TextMaxLine from '../../../../components/TextMaxLine';
import TextIconLabel from '../../../../components/TextIconLabel';
import SvgIconStyle from '../../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.8),
}));

// ----------------------------------------------------------------------

QuestionCard.propTypes = {
  question: PropTypes.object.isRequired,
  Urole: PropTypes.string,
  index: PropTypes.number,
};

export default function QuestionCard({ question, index, Urole }) {
  const isDesktop = useResponsive('up', 'md');

  const latestPost = index === 0 || index === 1 || index === 2;

  return (
    <Card>
      <Box sx={{ position: 'relative', mt: 3 }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Avatar
          alt={`${question?.client?.firstName} ${question?.client?.lastName}`}
          src={
            question?.client?.image
              ? question?.client?.image
              : 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_1.jpg'
          }
          sx={{
            left: 24,
            zIndex: 9,
            width: 50,
            height: 50,
            bottom: -40,
            position: 'absolute',
          }}
        />
        <Typography
          variant={'subtitle1'}
          sx={{
            left: 90,
            zIndex: 9,
            width: 1,
            height: 50,
            bottom: -50,
            position: 'absolute',
          }}
        >{`${question?.client?.firstName} ${question?.client?.lastName}`}</Typography>
      </Box>

      <PostContent
        question={question?.question}
        title={question?.title}
        answer={question?.answer}
        createdAt={question?.createdAt}
        Urole={Urole}
        id={question._id}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

PostContent.propTypes = {
  createdAt: PropTypes.string,
  index: PropTypes.number,
  question: PropTypes.string,
  answer: PropTypes.string,
  title: PropTypes.string,
  Urole: PropTypes.string,
  id: PropTypes.string,
};

export function PostContent({ question, title, answer, createdAt, Urole, id, index }) {
  const isDesktop = useResponsive('up', 'md');

  // const linkTo = PATH_DASHBOARD.blog.view(paramCase(question));

  const latestPostLarge = index === 0;
  const latestPostSmall = index === 1 || index === 2;

  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      sx={{
        boxShadow: 'none',

        border: 'none',
        '& .MuiAccordionSummary-root': {
          borderBottom: 'none',
        },
        '&:before': {
          display: 'none',
        },
        '& .MuiExpansionPanelSummary-root:hover': {
          cursor: 'default',
        },
        '& .MuiAccordion-root': {
          cursor: 'default',
        },
      }}
    >
      <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header" sx={{ cursor: 'default' }}>
        <CardContent
          sx={{
            pt: 4.5,
            width: 1,
            ...(latestPostSmall && {
              pt: 0,
              zIndex: 9,
              bottom: 0,
              position: 'absolute',
              color: 'common.white',
            }),
          }}
        >
          <Typography
            gutterBottom
            variant="caption"
            component="div"
            sx={{
              color: 'text.disabled',
              ...(latestPostSmall && {
                opacity: 0.64,
                color: 'common.white',
              }),
            }}
          >
            {fDate(createdAt)}
          </Typography>

          <TextMaxLine variant={isDesktop ? 'h5' : 'subtitle2'} sx={{ color: 'red' }} line={1.5} persistent>
            Title : {title}?
          </TextMaxLine>
          <TextMaxLine variant={isDesktop ? 'subtitle2' : 'subtitle1'} line={2} persistent>
            Question:{' '}
            <div
              dangerouslySetInnerHTML={{
                __html: question,
              }}
            />
          </TextMaxLine>

          <Stack
            flexWrap="wrap"
            direction="row"
            justifyContent="flex-end"
            sx={{
              mt: 3,
              color: 'text.disabled',
              ...(latestPostSmall && {
                opacity: 0.64,
                color: 'common.white',
              }),
            }}
          >
            {Urole === 'nutritionist' ? (
              <Button variant="contained" onClick={() => navigate(PATH_DASHBOARD.question.detail(id))}>
                Reply
              </Button>
            ) : (
              <Button variant="contained" onClick={() => handleChange()}>
                Response
              </Button>
            )}
          </Stack>
        </CardContent>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{answer}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}
