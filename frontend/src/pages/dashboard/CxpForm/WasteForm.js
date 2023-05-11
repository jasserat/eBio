import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Typography, TextField } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { orderApi } from '../../../actions/basketAction';
import { CxpApi } from '../../../actions/cxpAction'


const WasteForm = () => {
    const { id } = useParams()
    console.log(id)
    const [order, setOrder] = useState();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const { enqueueSnackbar } = useSnackbar();
    const userId = currentUser._id

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderApi.getOrderById(id);
                setOrder(response);

                const productsFromOrder = response.ref.map((product) => ({
                    product: product[0].productId,
                    name: product[0].name,
                    quantity:product[0].quantity,
                    quantityPerPerson: 0,
                    remainingQuantity: 0
                }));

                setProducts(productsFromOrder);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };
        fetchOrders();
    }, [id]);

    const handleQuantityChange = (event, index) => {
        const { value } = event.target;
        setProducts(prevState => {
            const updatedProducts = [...prevState];
            updatedProducts[index].remainingQuantity = value;
            updatedProducts[index].quantityPerPerson = (updatedProducts[index].quantity - updatedProducts[index].remainingQuantity ) /order.members;
            return updatedProducts;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (currentUser.wasteFormStatus === true) {
                const response = await CxpApi.updateWasteForm(userId,id, { products })
            }
            else {
                const response = await CxpApi.addWasteForm(userId,id, { products })
                
            }



            // Reset the form
            setProducts([]);
            navigate('/dashboard/e-commerce/orderList')
            enqueueSnackbar('Your formula has been passed successfully!', { variant: 'success' });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Remaining Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow key={product._id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>
                                <TextField
                                    required
                                    type="number"
                                    value={product.remainingQuantity}
                                    onChange={(event) => handleQuantityChange(event, index)}
                                    inputProps={{ min: "0", max: product.quantity }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button type="submit" variant="contained" color="primary">
                Submit form
            </Button>
        </form>
    );
};

export default WasteForm;