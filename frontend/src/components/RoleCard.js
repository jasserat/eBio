import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Typography, Box } from '@mui/material';
// utils

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  padding: theme.spacing(2, 2, 2, 3),
  border: '2px solid transparent',
  '&:hover': {
    borderColor: 'green',
  },
}));

// ----------------------------------------------------------------------

RoleCard.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string,
  onClick: PropTypes.any,
};

export default function RoleCard({ title, icon, onClick }) {
  return (
    <RootStyle onClick={onClick}>
      <div>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
      </div>
      <Box
        component="img"
        src={icon}
        sx={{
          width: '80px',
          height: '80px',
          lineHeight: 0,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
        }}
      />
    </RootStyle>
  );
}
