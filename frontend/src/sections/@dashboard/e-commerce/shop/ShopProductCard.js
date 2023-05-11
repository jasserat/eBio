import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

// @mui
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
// routes
import { orderApi } from '../../../../actions/basketAction';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
// import { ColorPreview } from '../../../../components/color-utils';

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { _id, name, image, price, status, priceSale, description, quantity } = product;

  const linkTo = PATH_DASHBOARD.eCommerce.view(paramCase(name));

  const { currentUser } = useSelector((state) => state.user);

  const [products, setProducts] = useState([]);

  const addToBasket = async (productId) => {
    console.log(productId);
    try {
      const userId = currentUser._id;
      const response = await orderApi.addToBasket(userId, productId);
      const updatedProduct = response.data.updatedProduct;
      // Find the index of the old product in the products array
      const index = products.findIndex((product) => product._id === updatedProduct._id);
      // Replace the old product with the updated one in the products array
      setProducts((prevProducts) => [
        ...prevProducts.slice(0, index),
        updatedProduct,
        ...prevProducts.slice(index + 1),
      ]);

      console.log(productId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            // color={(status === 'sale' && 'error') || 'info'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <Image alt={name} src={image.url} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}

          <Stack direction="row" spacing={0.5}>
            {priceSale && (
              <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {fCurrency(priceSale)}
              </Typography>
            )}

            <Typography variant="subtitle1">{fCurrency(price)}</Typography>
            <p style={{ position: 'absolute', right: '20px', fontSize: '12px' }}>quantity : {quantity}</p>
          </Stack>
        </Stack>
        <Button onClick={() => addToBasket({ _id })} disabled={{ quantity } === 0}>
          Add to basket
        </Button>
      </Stack>
    </Card>
  );
}
