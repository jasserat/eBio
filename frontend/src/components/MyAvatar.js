// hooks
import { useSelector } from 'react-redux';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { currentUser } = useSelector((state)=>state.user);
  return (
    <Avatar src={currentUser?.image} alt={currentUser?.firstName + currentUser?.lastName} color={createAvatar(currentUser?.firstName + currentUser?.lastName).color} {...other}>
      {createAvatar(currentUser?.firstName + currentUser?.lastName).name}
    </Avatar>
  );
}
