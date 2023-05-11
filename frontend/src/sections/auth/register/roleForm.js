import { Container, Grid, Link, Stack, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RoleCard from '../../../components/RoleCard';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));
export default function RoleForm({ setTap, setRole }) {
  const goTo = useNavigate();
  return (
    <>
      <Container maxWidth="xl">
        <StyledContent>
          <Container maxWidth="xl" style={{ width: '970px', position: 'relative', right: '250px', bottom: '250px' }}>
            <Grid container spacing={3} direction="row" justifyContent="center" alignItems="center">
              <Grid item xs={3}>
                <RoleCard
                  title="Farmer"
                  icon={'/illustrations/undraw_blooming_re_2kc4.svg'}
                  onClick={() => {
                    setTap('RegistrationSection');
                    setRole('farmer');
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <RoleCard
                  title="Delivrer"
                  icon={'/illustrations/undraw_on_the_way_re_swjt.svg'}
                  onClick={() => {
                    setTap('RegistrationSection');
                    setRole('deliverer');
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <RoleCard
                  title="User"
                  icon={'/illustrations/undraw_mobile_user_re_xta4.svg'}
                  onClick={() => {
                    setTap('RegistrationSection');
                    setRole('user');
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <RoleCard
                  title="Nutritionist"
                  icon={'/illustrations/undraw_medicine_b-1-ol.svg'}
                  onClick={() => {
                    setTap('NutritionistSection');
                    setRole('nutritionist');
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </StyledContent>
      </Container>
    </>
  );
}
