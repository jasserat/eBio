import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Avatar, Divider, Typography, Stack, Button } from '@mui/material';
// utils
import { useNavigate } from 'react-router';
import { paramCase } from 'change-case';
import cssStyles from '../../../../utils/cssStyles';
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import SocialsButton from '../../../../components/SocialsButton';
import SvgIconStyle from '../../../../components/SvgIconStyle';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

// ----------------------------------------------------------------------

DoctorCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default function DoctorCard({ user }) {

  const navigate = useNavigate();

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Avatar
          alt={user.firstName + user.lastName}
          src={user.image ? user.image : 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_2.jpg'}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />
        <OverlayStyle />
        <Image src={user.image ? user.image : 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_2.jpg'} alt={user.firstName + user.lastName} ratio="16/9" />
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 6 }}>
        {user.firstName + user.lastName}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {user.specialization}
      </Typography>

      <Stack alignItems="center">
        <SocialsButton initialColor sx={{ my: 2.5 }} />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ py: 3,pl:2, display: 'grid' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button variant="contained"  size="medium">
            {'Send private msg'}
          </Button>
        
        <Button variant="contained" onClick={()=>navigate(PATH_DASHBOARD.appointment.bookFromDoctor(paramCase(user._id)))}  size="medium">
            {'Book appointment'}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
