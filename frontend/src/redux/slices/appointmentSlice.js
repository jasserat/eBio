/* eslint-disable no-return-await */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppointmentApi } from '../../actions/appointmentAction';
import { dispatch } from '../store';

export const fetchAppointmentByClient = createAsyncThunk('appointment/fetchAppointment', async (clientId) => {
  try {
    const result = await AppointmentApi.getAppointmentsByClient(clientId);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
});
export const fetchAppointmentByNutritionist = createAsyncThunk('appointment/fetchAppointmentN', async (nutId) => {
  try {
    const result = await AppointmentApi.getAppointmentsByNutritionist(nutId);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
});

const initialState = {
  appointments: [],
  error: null,
  loading: false,
  isLoading: false,
  events: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null,
};
const appointmentSlice = createSlice(
  {
    name: 'appointment',
    initialState,
    reducers: {
      createAppointmentList: (state, action) => {
        state.appointments.push(action.payload);
      },

      updateAppointmentFromList: (state, action) => {
        state.appointments = state.appointments.map((item) => {
          if (item._id === action.payload._id) {
            return action.payload;
          }
          return item;
        });
      },
      removeAppointmentFromList: (state, action) => {
        state.appointments = state.appointments.filter((item) => item._id !== action.payload._id);
      },
      // START LOADING
      startLoading(state) {
        state.isLoading = true;
      },

      // HAS ERROR
      hasError(state, action) {
        state.isLoading = false;
        state.error = action.payload;
      },

      // GET EVENTS
      getEventsSuccess(state, action) {
        state.isLoading = false;
        state.events = action.payload;
      },

      // CREATE EVENT
      createEventSuccess(state, action) {
        const newEvent = action.payload;
        state.isLoading = false;
        state.events = [...state.events, newEvent];
      },

      // UPDATE EVENT
      updateEventSuccess(state, action) {
        const event = action.payload;
        const updateEvent = state.events.map((_event) => {
          if (_event.id === event.id) {
            return event;
          }
          return _event;
        });
        state.isLoading = false;
        state.events = updateEvent;
      },

      // DELETE EVENT
      deleteEventSuccess(state, action) {
        const { AppointmentId } = action.payload;
        const deleteEvent = state.events.filter((event) => event.id !== AppointmentId);
        state.events = deleteEvent;
        state.isLoading = false;
      },

      // SELECT EVENT
      selectEvent(state, action) {
        const eventId = action.payload;
        state.isOpenModal = true;
        state.selectedEventId = eventId;
      },

      // SELECT RANGE
      selectRange(state, action) {
        const { start, end } = action.payload;
        state.isOpenModal = true;
        state.selectedRange = { start, end };
      },

      // OPEN MODAL
      openModal(state) {
        state.isOpenModal = true;
      },

      // CLOSE MODAL
      closeModal(state) {
        state.isOpenModal = false;
        state.selectedEventId = null;
        state.selectedRange = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAppointmentByClient.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAppointmentByClient.fulfilled, (state, action) => {
          state.appointments = action.payload;
          state.loading = false;
        })
        .addCase(fetchAppointmentByClient.rejected, (state, action) => {
          state.error = action.error.message;
        })
        .addCase(fetchAppointmentByNutritionist.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAppointmentByNutritionist.fulfilled, (state, action) => {
          state.appointments = action.payload;
          state.loading = false;
        })
        .addCase(fetchAppointmentByNutritionist.rejected, (state, action) => {
          state.error = action.error.message;
        });
    },
  },
  { immer: true }
);

export const {
  createAppointmentList,
  updateAppointmentFromList,
  removeAppointmentFromList,
  openModal,
  closeModal,
  selectEvent,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;

// ----------------------------------------------------------------------

export function getAppointmentsFromCalendar(id) {
  return async () => {
    dispatch(appointmentSlice.actions.startLoading());
    try {
      const response = await AppointmentApi.getAppointmentsByNutritionistCalendar(id);
      dispatch(
        appointmentSlice.actions.getEventsSuccess(response.map((appointment) => convertAppointmentToEvent(appointment)))
      );
    } catch (error) {
      dispatch(appointmentSlice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createAppointmentFromCalendar(newAppointment) {
  return async () => {
    dispatch(appointmentSlice.actions.startLoading());
    try {
      const response = await AppointmentApi.createAppointment(newAppointment);
      dispatch(appointmentSlice.actions.createEventSuccess(convertAppointmentToEvent(response)));
    } catch (error) {
      dispatch(appointmentSlice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateAppointmentFromCalendar(AppointmentId, updatedAppointment) {
  return async () => {
    dispatch(appointmentSlice.actions.startLoading());
    try {
      const response = await AppointmentApi.updateAppointment(AppointmentId, updatedAppointment);
      dispatch(appointmentSlice.actions.updateEventSuccess(convertAppointmentToEvent(response)));
    } catch (error) {
      dispatch(appointmentSlice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteAppointmentFromCalendae(AppointmentId) {
  return async () => {
    dispatch(appointmentSlice.actions.startLoading());
    try {
      await AppointmentApi.deleteAppointment(AppointmentId);
      dispatch(appointmentSlice.actions.deleteEventSuccess({ AppointmentId }));
    } catch (error) {
      dispatch(appointmentSlice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function selectRange(start, end) {
  return async () => {
    dispatch(
      appointmentSlice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime(),
      })
    );
  };
}

function convertAppointmentToEvent(appointment) {
  const startTime = new Date(
    `${new Date(appointment.dateApt).toISOString().substr(0, 10)}T${new Date(parseInt(appointment.timeApt, 10))
      .toISOString()
      .substr(11, 5)}:00.000Z`
  );
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
  return {
    id: appointment._id,
    title: `${appointment.client.firstName} ${appointment.client.lastName}`,
    start: startTime.toISOString(),
    end: endTime.toISOString(),
    allDay: false,
    locationApt: appointment.locationApt,
    reasonApt: appointment.reasonApt,
    statusApt: appointment.statusApt,
    dateApt: appointment.dateApt,
    timeApt: appointment.timeApt,
    textColor: convertStatusToColor(appointment.statusApt),
    client: appointment.client,
    nutritionist: appointment.nutritionist,
  };
}

function convertStatusToColor(status) {
  if (status === 'pending') return '#FFC107';
  if (status === 'accepted') return '#54D62C';
  if (status === 'declined') return '#FF4842';
  return '#00AB55';
}
