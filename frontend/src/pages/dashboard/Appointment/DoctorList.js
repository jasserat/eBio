// @mui
import { Container, Box } from '@mui/material';
// routes
import { useState,useEffect } from 'react';
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import DoctorCard from '../../../sections/@dashboard/appointment/list/DoctorCard';
import { UserApi } from '../../../actions/userAction';
// ----------------------------------------------------------------------

export default function DoctorList() {
  const { themeStretch } = useSettings();
  const [listofNutritionist, setListofNutritionist] = useState([]);
  useEffect(()=>{
    UserApi.getUserByRole('nutritionist').then((r=>setListofNutritionist(r)))
      },[])

  return (
    <Page title="User: Cards">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User Cards"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.appointment.doctors },
            { name: 'Cards' },
          ]}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {listofNutritionist?.map((user) => (
            <DoctorCard key={user._id} user={user} />
          ))}
        </Box>
      </Container>
    </Page>
  );
}
