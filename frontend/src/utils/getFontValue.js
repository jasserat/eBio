// @mui
import { useTheme } from '@mui/material/styles';
// hooks
import useResponsive from '../hooks/useResponsive';

// ----------------------------------------------------------------------

export default function GetFontValue(variant) {
  const theme = useTheme();
  const breakpoints = useWidth();

  const key = theme.breakpoints.up(breakpoints === 'xl' ? 'lg' : breakpoints);

  const hasResponsive =
    variant === 'h1' ||
    variant === 'h2' ||
    variant === 'h3' ||
    variant === 'h4' ||
    variant === 'h5' ||
    variant === 'h6';

  const getFont =
    hasResponsive && theme.typography[variant][key] ? theme.typography[variant][key] : theme.typography[variant];

  const fontSize = remToPx(getFont.fontSize);
  const lineHeight = Number(theme.typography[variant].lineHeight) * fontSize;
  const { fontWeight } = theme.typography[variant];
  const { letterSpacing } = theme.typography[variant];

  return { fontSize, lineHeight, fontWeight, letterSpacing };
}

// ----------------------------------------------------------------------

export function remToPx(value) {
  return Math.round(parseFloat(value) * 16);
}

export function validateToGenerateRecommandation(age, height, weight, gender, activity, numberofmeals, goal) {
  console.log('age    ', age);
  console.log('height    ', height);
  console.log('weight    ', weight);
  console.log('gender    ', gender);
  console.log('numberofmeals    ', numberofmeals);
  console.log('goal    ', goal);
  if (age === undefined || age === '' || age === null) return false;
  if (height === undefined || height === '' || height === null) return false;
  if (weight === undefined || weight === '' || weight === null) return false;
  if (gender === undefined || gender === '' || gender === null) return false;
  if (activity === undefined || activity === '' || activity === null) return false;
  if (numberofmeals === undefined || numberofmeals === '' || numberofmeals === null) return false;
  if (goal === undefined || goal === '' || goal === null) return false;

  return true;
}

export function pxToRem(value) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

export function capitalizeFirstLetter(string) {
  return string?.charAt(0).toUpperCase() + string.slice(1);
}

export function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    // eslint-disable-next-line no-plusplus
    age--;
  }
  return age;
}

// ----------------------------------------------------------------------

function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useResponsive('up', key);
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}
