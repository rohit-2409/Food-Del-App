import { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Orders
  const fetchOrders = async () => {

    try {

      const response = await axios.get(`${url}/api/order/list`);

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Update Order Status in Backend
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating status");
    }
  };

  // Load Orders on Page Load
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">

      <div className="orders-header">
        <h2>Customer Orders</h2>
        <p>Manage and track all food orders easily.</p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="orders-loading">
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (

        /* Empty State */
        <div className="orders-empty">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
            alt="No Orders"
          />

          <h3>No Orders Yet</h3>

          <p>
            Orders from customers will appear here once they place an order.
          </p>
        </div>

      ) : (

        /* Orders List */
        <div className="orders-container">

          {orders.map((order, index) => (

            <div className="order-card" key={index}>

              <div className="order-top">

                <div>
                  <h3>{order.address?.firstName} {order.address?.lastName}</h3>

                  <p className="order-items">
                    {order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return item.name + " x " + item.quantity;
                      } else {
                        return item.name + " x " + item.quantity + ", ";
                      }
                    })}
                  </p>
                </div>

                <div className="order-price">
                  ₹{order.amount}
                </div>

              </div>

              <div className="order-details">

                <p>
                  <strong>Address:</strong>{" "}
                  {order.address?.street},
                  {" "}
                  {order.address?.city},
                  {" "}
                  {order.address?.state}
                </p>

                <p>
                  <strong>Phone:</strong> {order.address?.phone}
                </p>

                <p>
                  <strong>Items:</strong> {order.items.length}
                </p>

              </div>

              <div className="order-status">

                <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                  <option value="Food Processing">
                    Food Processing
                  </option>

                  <option value="Out for Delivery">
                    Out for Delivery
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>
                </select>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Orders;