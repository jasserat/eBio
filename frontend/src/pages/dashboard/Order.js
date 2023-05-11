import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import { Link as RouterLink, Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, Typography, TextField } from '@mui/material';
import { OneKPlusOutlined } from '@mui/icons-material';

import Basket from './Basket';

import { orderApi } from '../../actions/basketAction';
import { CxpApi } from '../../actions/cxpAction';
import { PATH_DASHBOARD } from '../../routes/paths';

const styles = {
  card: {
    padding: '16px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  product: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  quantity: {
    fontSize: '16px',
    marginBottom: '16px',
  },
};

const RootStyle = styled(RouterLink)(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(16),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
  borderBottomLeftRadius: Number(theme.shape.borderRadius) * 2,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 },
}));
const Order = () => {
  const [wasteForm, setWasteForm] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser._id;
  const [products, setProducts] = useState([]);

  const fetchBasket = async () => {
    try {
      const response = await orderApi.showBasket(userId);
      // console.log(response)
      setProducts(response);
    } catch (error) {
      console.error('Failed to fetch basket:', error);
    }
  };

  const fetchWasteForm = async () => {
    try {
      const response = await CxpApi.displayWasteForm(userId)
      setWasteForm(response.products);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };
  useEffect(() => {
    fetchWasteForm();
    console.log("wasteform products", wasteForm)
    fetchBasket();

  }, []);

  const dispatch = useDispatch();
  const [consumptionDate, setConsumptionDate] = useState(new Date());
  const [members, setMembers] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [deliverySpot, setDeliverySpot] = useState(' ');
  

  const totalPrice = products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const handleCreateOrder = async ( ) => {
    try {

      console.log(deliverySpot);
      const response = await orderApi.createOrder(currentUser._id,consumptionDate,members,deliverySpot);
        console.log(deliverySpot);

      setAlertMessage(`Order submitted successfuly !  Thank you !! `);
      if (response.success) {
        OneKPlusOutlined.log(response);
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Checkout</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order 
              </Typography>
              {products.map((product) => (
                <Box key={product._id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>
                    <img src={product.image} alt={product.name} width={50} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2">
                      {product.quantity} x {product.price} = {product.quantity * product.price}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Total:
                {totalPrice}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom value={deliverySpot}
                  onChange={(e) => setDeliverySpot(e.target.value)}>
                  Delivery Spot
                </Typography>


                <TextField
                  id="delivery-place"
                  type="string"
                  value={deliverySpot}
                  onChange={(e) => setDeliverySpot(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom value={consumptionDate}
                  onChange={(e) => setConsumptionDate(e.target.value)}>
                  Consumption date
                </Typography>


                <TextField
                  id="date-input"
                  label="Select a date"
                  type="date"
                  value={consumptionDate}
                  onChange={(e) => setConsumptionDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom 
                  >
                  Members
                </Typography>
                <TextField
                  id="number-input"
                  label="Enter a number"
                  type="number"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>



        <Grid item xs={12}>
          <Card style={styles.card}>
            <Typography variant="h1" style={styles.title}>To fight against food waste, please:</Typography>
            {products.map(product => {
              const foundWasteForm = wasteForm.find(wasteForm => wasteForm.product === product.productId);
              if (foundWasteForm) {
                return (
                  <div key={product.productId}>
                    <Typography variant="h2" style={styles.product}>
                      The quantity of {product.name}
                    </Typography>
                    <Typography variant="body1" style={styles.quantity}>
                      {foundWasteForm.quantityPerPerson === 0
                        ? ' Try using up leftovers or buying smaller quantities'
                        : `should not exceed ${Math.ceil(foundWasteForm.quantityPerPerson * members)} for all members`}
                    </Typography>
                  </div>
                );
              }
              return null;
            })}
            <Button variant="contained" color="primary" onClick={handleCreateOrder} >
              Place order
            </Button>
            {alertMessage && (
              <div className="alert">{alertMessage}</div>
            )}
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}

export default Order;
