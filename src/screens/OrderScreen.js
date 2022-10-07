import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder, detailsOrder, payOrder } from '../actions/orderActions';
import { PaystackButton } from 'react-paystack'

function OrderScreen(props) {
  const orderDetails = useSelector(state => state.orderDetails);
  const user = useSelector(state => state.userSignin);
  const cart = useSelector(state => state.cart);
   const orderPay = useSelector(state => state.orderPay);

  const { loading, order, error } = orderDetails;
  const { cartItems, shipping, payment } = cart;
  const { loading: loadingPay, success: successPay, error: errorPay } = orderPay;

  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;

 
  const totalPrice = itemsPrice + shippingPrice + taxPrice ;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successPay) {
      props.history.push("/profile");
    } else {
      dispatch(detailsOrder(props.match.params.id));
    }
    return () => {
    };
  }, [successPay]);

  const publicKey = "pk_test_ebe630f107b9c2959dc3cfd24c1e6de3ee12e202"
  const amount = totalPrice * 100;
  
  const componentProps = {
  email:user.userInfo.email,
     metadata: {
     name:user.userInfo.name,
     phone:cart.shipping.phone,
   },
   amount,
   publicKey,
   text: "Pay Now",
   onSuccess: () =>
   handleSuccessPayment()
   ,
   onClose: () => alert("Wait! don't go!!!!"),
 }
  const handleSuccessPayment = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  }

 

  return loading ? <div>Loading ...</div> : error ? <div>{error}</div> :

    <div>
      <div className="placeorder">
        <div className="placeorder-info">
          <div>
            <h3>
              Order Id - {order._id}
            </h3>
          </div>
          
          <div>
            <h3>
                Delivering To
            </h3>
          <div>
              {order.shipping.address}, {order.shipping.city},
              {order.shipping.phone}, {order.shipping.country},
            </div>
            <div>
              {order.isDelivered ? "Delivered at " + order.deliveredAt : "Not Delivered."}
            </div>
          </div>
          <div>
            <h3>Payment</h3>
            <div>
              Payment Method: {order.payment.paymentMethod}
            </div>
            <div>
              {order.isPaid ? "Paid at " + order.paidAt : "Not Paid."}
            </div>
          </div>
          <div>
            <ul className="cart-list-container">
              <li>
                <h3>
                  Shopping Cart
                </h3>
                      <div>
                        Price
                </div>
              </li>
              {
                order.orderItems.length === 0 ?
                  <div>
                    Cart is empty
          </div>
                  :
                  order.orderItems.map(item =>
                    <li key={item._id}>
                      <div className="cart-image">
                        <img src={item.image} alt="product" />
                      </div>
                      <div className="cart-name">
                        <div>
                          <Link to={"/product/" + item.product}>
                            {item.name}
                          </Link>

                        </div>
                        <div>
                          Qty: {item.qty}
                        </div>
                      </div>
                      <div className="cart-price">
                      ₦{item.price}
                      </div>
                    </li>
                  )
              }
            </ul>
          </div>


        </div>
        <div className="placeorder-action">
          <ul>
            <li className="placeorder-actions-payment">
            {loadingPay && <div>Finishing Payment...</div>}
              {!order.isPaid &&
                 <PaystackButton className="paystack-button button primary" {...componentProps} />
              }
            </li>
            <li>
              <h3>Order Summary</h3>
            </li>
            <li>
              <div>Items</div>
              <div>₦{order.itemsPrice}</div>
            </li>
            <li>
              <div>Shipping</div>
              <div>₦{order.shippingPrice}</div>
            </li>
            <li>
              <div>Tax</div>
              <div>₦{order.taxPrice}</div>
            </li>
            <li>
              <div>Order Total</div>
              <div>₦{order.totalPrice}</div>
            </li>
          </ul>



        </div>

      </div>
    </div>

}

export default OrderScreen;