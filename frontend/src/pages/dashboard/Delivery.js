import { Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import LeafletGeocoder from "./LeafletGeocoder";
import LeafletRoutingMachine from "./LeafletRoutingMachine";
import { orderApi } from '../../actions/basketAction';

const Delivery = () => {


    
    const [position, setPosition] = useState([36.8065, 10.1815]); 
    
    const [orders, setOrders] = useState([]);


    useEffect(() => {

        // Get the user's current location using the Geolocation API
     navigator.geolocation.getCurrentPosition(
         (position) => {
           setPosition([position.coords.latitude, position.coords.longitude]);
         },
         (error) => {
           console.error(error);
         }
       );
 
     
         
         
     }, []);

    
        const fetchOrders = async () => {
            try {
                const response = await orderApi.getAllOrders();
                setOrders(response);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };
    useEffect(() => {
        fetchOrders();
    }, []);

    
        const updateState = async (id) => {
        try {
          console.log(id);
          const response = await orderApi.updateState(id);
          fetchOrders();
          console.log(response)
        } catch (error) {
          console.error('Failed to update state:', error);
        }
      };
      
    
    


    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order Number</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Delivery Spot</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell>{order.orderNumber}</TableCell>
                            <TableCell>{order.state}</TableCell>
                            <TableCell>{order.somme}</TableCell>
                            <TableCell>{order.deliverySpot} {console.log(order.deliverySpot)}</TableCell>
                            <TableCell>
                                <Button variant="contained" onClick={() => updateState(order._id) }>
                                 Delivered
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="App">
                <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "58vh", width: "100%", display: 'flex', marginTop: '200px' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LeafletRoutingMachine  />
                    <LeafletGeocoder />
                </MapContainer>
            </div>
        </div>
    );
}

export default Delivery;