/* eslint-disable react/jsx-key */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Button,
  Card,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import { useSelector } from 'react-redux';
import { RecommandationApi } from '../../../actions/recommandationAction';
import { calculateAge, capitalizeFirstLetter, validateToGenerateRecommandation } from '../../../utils/getFontValue';
import { DocIllustration } from '../../../assets';
import { PATH_DASHBOARD } from '../../../routes/paths';

function RecommandationList() {
  const [recommandationlist, setRecommandationList] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { currentUser, step } = useSelector((state) => state.user);
  useEffect(() => {
    if (currentUser) {
      if (
        !validateToGenerateRecommandation(
          calculateAge(currentUser?.dateOfBirth),
          currentUser?.height,
          currentUser?.weight,
          capitalizeFirstLetter(currentUser?.gender),
          currentUser?.activity,
          currentUser?.number_of_meals,
          currentUser?.goal
        )
      ) {
        setLoading(false);
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
        setLoading(true);
        RecommandationApi.generateRecommandationList({
          age: calculateAge(currentUser?.dateOfBirth),
          height: currentUser?.height,
          weight: currentUser?.weight,
          gender: capitalizeFirstLetter(currentUser?.gender),
          activity: currentUser?.activity,
          number_of_meals: currentUser?.number_of_meals,
          option: currentUser?.goal,
        }).then((r) => {
          setRecommandationList(r);
          setLoading(false);
        });
      }
    }
  }, [currentUser]);
  console.log(recommandationlist);
  return (
    <>
      {loading && (
        <Typography>
          Generating Diet Recommendation... <CircularProgress color="primary" />
        </Typography>
      )}

      {Object.keys(recommandationlist).length !== 0 && isAuthorized && (
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Stack direction={{ xs: 'column', sm: 'column' }} spacing={2}>
                <Typography variant="h4">BMI CALCULATOR</Typography>
                <Typography variant="subtitle2">Body Mass Index (BMI)</Typography>
                <Typography variant="h6">{recommandationlist?.bmi_string}</Typography>
                <Typography variant="subtitle1" color={recommandationlist?.color}>
                  {recommandationlist?.category}
                </Typography>
                <Typography variant="subtitle2">Healthy BMI range: 18.5 kg/m² - 25 kg/m².</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={12}>
              <Stack direction={{ xs: 'column', sm: 'column' }} spacing={2}>
                <Typography variant="h4">DIET RECOMMENDATOR</Typography>
                <Typography variant="h5">Recommended recipes:</Typography>
                {recommandationlist?.output_recomm.map((recommandation, index) => (
                  <div key={index}>
                    <Typography variant="subtitle2" color={'#45D432'}>
                      {recommandation?.meal?.toUpperCase()}
                    </Typography>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                      {recommandation?.recommendation?.map((rec, i) => (
                        <Grid item xs={3} md={3} key={i}>
                          <Accordion
                            sx={{
                              border: '2px solid transparent',
                              '&:hover': {
                                borderColor: 'green',
                              },
                              '&:focus': {
                                borderColor: 'green',
                                outline: 'none',
                              },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography>{rec?.Name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                                <img alt="hello" src={rec?.image_link} style={{ width: 170, height: 120 }} />
                                <Typography variant="subtitle2">Nutritional Values (g):</Typography>
                              </Stack>
                              <div style={{ display: 'flex', overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="right">Calories</TableCell>
                                      <TableCell align="right">FatContent</TableCell>
                                      <TableCell align="right">SaturatedFatContent</TableCell>
                                      <TableCell align="right">CholesterolContent</TableCell>
                                      <TableCell align="right">SodiumContent</TableCell>
                                      <TableCell align="right">CarbohydrateContent</TableCell>
                                      <TableCell align="right">FiberContent</TableCell>
                                      <TableCell align="right">SugarContent</TableCell>
                                      <TableCell align="right">ProteinContent</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                      <TableCell align="right">{rec?.Calories}</TableCell>
                                      <TableCell align="right">{rec?.FatContent}</TableCell>
                                      <TableCell align="right">{rec?.SaturatedFatContent}</TableCell>
                                      <TableCell align="right">{rec?.CholesterolContent}</TableCell>
                                      <TableCell align="right">{rec?.SodiumContent}</TableCell>
                                      <TableCell align="right">{rec?.CarbohydrateContent}</TableCell>
                                      <TableCell align="right">{rec?.FiberContent}</TableCell>
                                      <TableCell align="right">{rec?.SugarContent}</TableCell>
                                      <TableCell align="right">{rec?.ProteinContent}</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                              <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" color={'#30D6DC'}>
                                  Ingredients:
                                </Typography>
                              </Stack>

                              <ul style={{ listStyleType: 'circle', position: 'relative', left: 25 }}>
                                {rec?.RecipeIngredientParts.map((v, j) => (
                                  <li key={j} style={{ fontSize: 13 }}>
                                    {v}
                                  </li>
                                ))}
                              </ul>

                              <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" color={'#30D6DC'}>
                                  Recipe Instructions:
                                </Typography>
                              </Stack>
                              <ul style={{ listStyleType: 'circle', position: 'relative', left: 25, width: 220 }}>
                                {rec?.RecipeInstructions.map((v, xx) => (
                                  <li key={xx} style={{ fontSize: 13 }}>
                                    {v}
                                  </li>
                                ))}
                              </ul>
                              <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" color={'#30D6DC'}>
                                  Cooking and Preparation Time:
                                </Typography>
                              </Stack>
                              <ul style={{ listStyleType: 'circle', position: 'relative', left: 25 }}>
                                <li style={{ fontSize: 13 }}>Cook Time : {rec?.CookTime}min</li>
                                <li style={{ fontSize: 13 }}>Preparation Time : {rec?.PrepTime}min</li>
                                <li style={{ fontSize: 13 }}>Total Time : {rec?.TotalTime}min</li>
                              </ul>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Card>
      )}

      {!isAuthorized && (
        <Stack spacing={3} direction="column" justifyContent="center" alignItems="center">
          <DocIllustration sx={{ width: '250px' }} />

          <div>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Please fill in the profilling form
            </Typography>
          </div>

          <Button href={PATH_DASHBOARD.user.account} rel="noopener" variant="contained">
            Profilling
          </Button>
        </Stack>
      )}
    </>
  );
}

export default RecommandationList;
