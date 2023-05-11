/* eslint-disable */
import { useEffect } from 'react';
import React from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductEditForm from '../../sections/@dashboard/e-commerce/ProductEditForm';
import axios from 'axios';
import { current } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

export default function EcommerceProductEdit() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  //const { products } = useSelector((state) => state.product);
  const isEdit = pathname.includes('edit');
 // const currentProduct = products.find((product) => paramCase(product.name) === name);
    
    const param = useParams();
    const [product,setProduct]=React.useState({
        "_id":param.id,
        "name":"",
        "description":"",
        "quantity":0,
        "price":0
    })
    const {_id, name, description, quantity, price} = product;



    const getProductFunction = async () => {
      const response = await axios.get(`https://ebio-backend.onrender.com/product/getProduct/${param.id}`);
      setProduct(response.data);
      console.log(response.data);
    }

    

    useEffect(() => {
      getProductFunction();
  }, []);

  // useEffect(() => {
  //   dispatch(getProducts());
  // }, [dispatch]);

  return (
    <Page title="Ecommerce: Create a new product">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product' : 'Edit product'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: !isEdit ? 'Update' : name },
          ]}
        />

        <ProductEditForm isEdit={isEdit} currentProduct={product} />
        {/* currentProduct={currentProduct} */}
      </Container>
    </Page>
  );
}
