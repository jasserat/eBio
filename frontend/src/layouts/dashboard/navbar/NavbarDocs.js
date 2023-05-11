// @mui
import { Stack, Button, Typography } from '@mui/material';
// hooks
import { useSelector } from 'react-redux';
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_DASHBOARD, PATH_DOCS } from '../../../routes/paths';
// assets
import { DocIllustration } from '../../../assets';

// ----------------------------------------------------------------------

export default function NavbarDocs() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      {currentUser?.role === 'user' && (
        <Stack spacing={3} sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center', display: 'block' }}>
          <DocIllustration sx={{ width: 1 }} />

          <div>
            <Typography gutterBottom variant="subtitle1">
              Hi, {`${currentUser?.firstName} ${currentUser?.lastName}`}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Need help?
              <br /> Please set your question right here, to get answred by a nutritionist
            </Typography>
          </div>

          <Button href={PATH_DASHBOARD.question.new} rel="noopener" variant="contained">
            Ask Question
          </Button>
        </Stack>
      )}
    </>
  );
}
