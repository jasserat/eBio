import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { orderApi } from '../../actions/basketAction';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getAllOrders();
        setOrders(response);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Order Number</TableCell>
          <TableCell>State</TableCell>
          <TableCell>Total Price</TableCell>
          <TableCell>Consumption Date</TableCell>
          <TableCell>Members</TableCell>
          <TableCell />
          <TableCell />
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>{order.orderNumber}</TableCell>
            <TableCell>{order.state}</TableCell>
            
            <TableCell>{order.somme}</TableCell>
            <TableCell>{order.consumptionDate}</TableCell>
            <TableCell>{order.members}</TableCell>
            <TableCell>
              <Button variant="contained" onClick={() => navigate(`/dashboard/e-commerce/showProducts/${order._id}`)}>
                Products
              </Button>
            </TableCell>
            <TableCell>
              <Button variant="contained" onClick={() => navigate(`/dashboard/cxpForm/addCxpForm/${order._id}`)}>
                Comment
              </Button>
            </TableCell>
            <TableCell>
              {!order.done && <Button variant="contained" onClick={() => navigate(`/dashboard/cxpForm/wasteForm/${order._id}`)}>
                Waste Food
              </Button>}
              
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderList;