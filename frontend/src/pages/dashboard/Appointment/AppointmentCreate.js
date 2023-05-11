import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getProducts } from '../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import AppointmentBookingForm from '../../../sections/@dashboard/appointment/create/AppointmentBookingForm';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isFromDoctorList = pathname.includes('doctorList');


  return (
    <Page title="Appointment: Book an Appointment">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Book an Appointment'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Appointment',
              href: PATH_DASHBOARD.appointment.list,
            },
            { name: 'New Appointment' },
          ]}
        />

        <AppointmentBookingForm isFromDoctorList={isFromDoctorList} id={id}  />
      </Container>
    </Page>
  );
}
