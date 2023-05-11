import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Typography } from '@mui/material';
// import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
// import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { orderApi } from '../../actions/basketAction';

const ShowProducts = () => { 
  const { id } = useParams()
  const [order, setOrder] = useState();
  const navigate = useNavigate();

  
  useEffect(( ) => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getOrderById(id);
        setOrder(response);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
  }, [ ]);


  return (
     <div>
    <ul>
      {order && order.ref && order.ref.map((product,index) => (
        <li key={index} product={product} > 
        <h1>{product[0].name}</h1>
        <h1>{product[0].price}</h1>
        <h1>{product[0].quantity}</h1>
        </li>
      ))}
    </ul>
      </div>
    

  );
};


export default ShowProducts;