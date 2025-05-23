import React, { useState } from 'react';
import { CreditCard, Package, Plane, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderInvoice from '@/pages/Orders/OrderDetail/OrderInvoice';

const CustomerOrderDetails = ({ order }) => {
    const [showInvoice, setShowInvoice] = useState(false);
    const navigate = useNavigate();

    if (!order) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }
    

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Calculate estimated delivery (5 days from order date)
    const getEstimatedDelivery = () => {
        const orderDate = new Date(order.created_at);
        const estimatedDate = new Date(orderDate);
        estimatedDate.setDate(orderDate.getDate() + 5);
        return estimatedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get current status
    const getCurrentStatus = () => {
        if (order.order_tracking && order.order_tracking.length > 0) {
            return order.order_tracking[order.order_tracking.length - 1].status;
        }
        return "Pending";
    };

    const handleInvoiceClick = () => {
        setShowInvoice(true);
    };

    if (showInvoice) {
        return <OrderInvoice order={order} onBack={() => setShowInvoice(false)} />;
    }

    const orderStatus = getCurrentStatus();
    const orderDate = formatDate(order.created_at);
    const estimatedDelivery = getEstimatedDelivery();
    const orderTotal = parseFloat(order.total_price).toFixed(2);
    const orderId = order.id.toString().padStart(6, "0");
    const orderUuid = order.order_uuid;

    // Calculate order progress based on status
    const getOrderProgress = () => {
        const statuses = ["Order Placed", "Processing", "Shipped", "Delivered", "Completed"];
        if (orderStatus === "Cancelled") return 0;
        const currentIndex = statuses.findIndex(status => status === orderStatus);
        return currentIndex >= 0 ? ((currentIndex + 1) / statuses.length) * 100 : 20;
    };

    return (
        <div className="w-full ">
            <div className="min-h-screen mt-6 flex bg-[#F2F7FB] flex-col gap-6 px-4 md:px-8">
                {/* Header - Order Title and Email Button */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <h2 className="text-pinkclr text-xl md:text-2xl font-bold">Order Details</h2>
                    <button
                   
                    className="bg-teelclr px-4 py-2 text-white shadow-md rounded-xl font-bold transition hover:bg-teal-600 w-full sm:w-auto">
                        Back
                    </button>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:items-center gap-4">
                        {/* Order ID Section */}
                        <div className="flex  sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-0">
                            <Package className="text-pinkclr" />
                            <p className="text-sm sm:text-base">Order</p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 hidden sm:block"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="bg-gray-50 text-gray-800 text-sm py-1 font-bold border-2 px-3 rounded-2xl">
                                #{orderId}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 items-center flex-wrap w-full sm:w-auto">
                            <button
                                onClick={handleInvoiceClick}
                                className="bg-blue-50 border text-teal-500 px-4 py-2 rounded-md text-sm md:px-5 md:py-2 hover:bg-blue-100 transition-colors w-full sm:w-auto"
                            >
                                Invoice
                            </button>
                            <button 
                                className="bg-teelclr text-white px-4 py-2 rounded-md text-sm md:px-5 md:py-2 hover:bg-teal-600 transition-colors w-full sm:w-auto">
                                Send Email
                            </button>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex flex-col sm:flex-row  items-start sm:items-center gap-4 mb-4">
                        <h2 className="text-gray-800 text-lg md:text-xl font-bold">
                            Order <span className="text-gray-800">Order Id: #{orderId}</span>
                        </h2>
                        <div className="flex gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm text-pinkclr font-bold border-pinkclr border-2 bg-amber-50 px-3 py-1 rounded-full">
                                {order.fulfillment_type === "delivery" ? "Shipping" : "Pickup"}
                            </span>
                            <span className={`text-xs sm:text-sm ${orderStatus === "Cancelled" ? "text-red-500 bg-red-50 border-red-500" :
                                orderStatus === "Completed" ? "text-green-500 bg-green-50 border-green-500" :
                                    "text-green-500 bg-green-50 border-green-500"
                                } px-3 py-1 font-bold border-2 rounded-full`}>
                                {orderStatus === "Order Placed" ? "No Action Needed" : orderStatus}
                            </span>
                        </div>
                    </div>

                    {/* Order Date & Estimated Delivery */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                        <p className="text-gray-500 text-xs sm:text-sm">Order Date: {orderDate}</p>
                        <Plane size={16} className="text-green-500" />
                        <p className="text-green-500 text-xs sm:text-sm">Estimated delivery: {estimatedDelivery}</p>
                    </div>
                </div>

                {/* Status Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Tracking Card */}
                    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            {/* SVG placeholder preserved as requested */}
                            <svg width="32" height="32" className='bg-gray-100 rounded-lg mb-2 p-1 w-10 h-10' viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.91693 7.74944C3.95094 7.62686 4.00877 7.51217 4.08713 7.41195C4.16549 7.31173 4.26283 7.22794 4.3736 7.16536C4.48436 7.10279 4.60637 7.06266 4.73266 7.04727C4.85894 7.03188 4.98702 7.04153 5.10957 7.07568L7.30769 7.68491C7.89008 7.84347 8.42154 8.15003 8.85037 8.5748C9.2792 8.99956 9.59082 9.52806 9.75493 10.1089L12.5313 20.1586L12.7352 20.8646C13.5584 21.168 14.2521 21.7455 14.6997 22.5L15.0999 22.3761L26.5487 19.4009C26.6718 19.3689 26.7999 19.3614 26.9259 19.3789C27.0518 19.3964 27.1731 19.4385 27.2828 19.5029C27.3924 19.5673 27.4884 19.6526 27.5651 19.754C27.6417 19.8555 27.6977 19.971 27.7297 20.0941C27.7618 20.2171 27.7693 20.3453 27.7518 20.4712C27.7343 20.5972 27.6921 20.7184 27.6278 20.8281C27.5634 20.9378 27.4781 21.0337 27.3766 21.1104C27.2752 21.1871 27.1597 21.243 27.0366 21.2751L15.6304 24.2386L15.2044 24.3703C15.1967 26.0095 14.0647 27.5093 12.3519 27.9534C10.2996 28.4877 8.18927 27.3054 7.63941 25.3151C7.08956 23.3248 8.30802 21.2764 10.3603 20.7433C10.4627 20.7175 10.5647 20.6951 10.6662 20.6762L7.88853 10.6239C7.81341 10.3658 7.67296 10.1315 7.48076 9.9436C7.28856 9.75569 7.05112 9.62057 6.7914 9.55131L4.59198 8.94079C4.46942 8.90692 4.35473 8.84922 4.25447 8.77101C4.15421 8.6928 4.07034 8.5956 4.00765 8.48497C3.94496 8.37433 3.90468 8.25243 3.88912 8.12623C3.87355 8.00003 3.883 7.87199 3.91693 7.74944Z" fill="#03A7A7" />
                                <path opacity="0.5" d="M13.322 12.2455L13.9868 14.6502C14.6128 16.9154 14.9251 18.0487 15.8454 18.5637C16.7657 19.08 17.9339 18.7754 20.2701 18.1687L22.7483 17.5234C25.0845 16.9167 26.2527 16.6134 26.7844 15.7215C27.3162 14.8283 27.0039 13.695 26.3766 11.4298L25.7131 9.02645C25.0871 6.75992 24.7735 5.62665 23.8545 5.11165C22.9329 4.59535 21.7648 4.89997 19.4285 5.5079L16.9503 6.15069C14.6141 6.75734 13.446 7.06195 12.9155 7.95514C12.3837 8.84704 12.696 9.98031 13.322 12.2455Z" fill="#03A7A7" />
                            </svg>

                            <button className="bg-teelclr text-white px-4 py-2 text-sm rounded-md hover:bg-teal-600 transition-colors">
                                Track Order
                            </button>
                        </div>
                        <div className="flex items-center justify-between mt-auto text-gray-400 text-sm">
                            <span>Estimated Arrival</span>
                            <span>Tracker ID</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-800 font-medium">
                            <span>{estimatedDelivery}</span>
                            <span>#{orderUuid.substr(0, 6).toUpperCase()}</span>
                        </div>
                    </div>

                    {/* Payment Card */}
                    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <CreditCard className="text-teelclr" size={28} />
                            <span className={`${order.payment_status === "paid" ?
                                "text-green-500 bg-green-50 border-green-500" :
                                "text-yellow-500 bg-yellow-50 border-yellow-500"
                                } border-2 px-4 py-1 rounded-2xl text-sm`}>
                                {order.payment_status === "paid" ? "Paid" : "Pending"}
                            </span>
                        </div>
                        <div className="flex mt-auto justify-between text-gray-400 text-sm">
                            <span>Transaction ID</span>
                            <span>Payment Method</span>
                        </div>
                        <div className="text-gray-800 flex justify-between font-medium">
                            <span>TR-{orderUuid.substr(0, 6)}</span>
                            <span>{order.payment_method || "Standard"}</span>
                        </div>
                    </div>

                    {/* Delivery Status Card */}
                    <div className="bg-white p-4 rounded-xl shadow-md md:col-span-2">
                        <div className="rounded-xl mx-auto">
                            {/* SVG placeholder preserved as requested */}
                            <svg width="32" className='bg-gray-100 rounded-lg mb-2 p-1 w-10 h-10' height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.5" d="M9.36733 25.5017C10.3943 25.5017 11.3792 25.0937 12.1054 24.3675C12.8316 23.6414 13.2395 22.6564 13.2395 21.6295H5.49512C5.49512 22.6564 5.90308 23.6414 6.62926 24.3675C7.35544 25.0937 8.34035 25.5017 9.36733 25.5017ZM25.2744 14.5278L24.2108 15.1758L22.0901 10.6582H24.003C24.8007 10.6582 25.1995 10.6582 25.4964 10.8286C25.6964 10.9429 25.8622 11.1087 25.9765 11.3087C26.1469 11.6056 26.1469 12.0057 26.1469 12.8021C26.1469 13.2229 26.1469 13.4346 26.0862 13.6256C26.0444 13.756 25.9821 13.8788 25.9017 13.9896C25.7842 14.1522 25.6138 14.2774 25.2744 14.5278Z" fill="#03A7A7" />
                                <path d="M18.8736 8.44208C18.4696 8.40078 17.9443 8.39948 17.1492 8.39948H16.4677C16.211 8.39948 15.9647 8.29749 15.7832 8.11595C15.6016 7.9344 15.4997 7.68818 15.4997 7.43143C15.4997 7.17469 15.6016 6.92846 15.7832 6.74691C15.9647 6.56537 16.211 6.46338 16.4677 6.46338H17.197C17.9327 6.46338 18.5574 6.46338 19.0737 6.5163C19.6223 6.57309 20.1308 6.697 20.6097 6.99387C21.0911 7.29074 21.428 7.68958 21.7249 8.15553C22.0037 8.59439 22.2825 9.15198 22.6116 9.81026L26.6749 17.938C27.3172 18.142 27.8953 18.51 28.3519 19.0058C28.8085 19.5015 29.1278 20.1078 29.2783 20.7648C29.4288 21.4217 29.4054 22.1066 29.2102 22.7517C29.015 23.3968 28.6549 23.9798 28.1654 24.4431C27.6759 24.9064 27.074 25.234 26.4191 25.3934C25.7643 25.5529 25.0792 25.5387 24.4315 25.3524C23.7838 25.166 23.1959 24.8138 22.726 24.3307C22.2561 23.8476 21.9204 23.2502 21.752 22.5976H4.92851C4.84247 22.5985 4.75771 22.5963 4.67424 22.5911C4.08899 22.5458 3.54437 22.2744 3.15575 21.8345C2.76713 21.3946 2.56504 20.8206 2.59228 20.2343V20.1607C2.59228 19.7283 2.59228 19.4534 2.61164 19.212C2.72775 17.7404 3.37091 16.3601 4.42298 15.3246C5.47505 14.2892 6.86539 13.668 8.33864 13.5753C8.57079 13.5641 8.80323 13.5598 9.03564 13.5624H10.0811C11.2402 13.5624 12.2083 13.5624 12.975 13.6657C13.7856 13.7741 14.5174 14.0142 15.1047 14.6028C15.6933 15.1901 15.9333 15.9219 16.0418 16.7325C16.145 17.4992 16.145 18.4672 16.145 19.6263V20.6615H21.7533C21.924 19.9994 22.267 19.3944 22.7474 18.9079C23.2278 18.4213 23.8285 18.0707 24.4883 17.8916L20.9001 10.7189C20.5451 10.0065 20.3102 9.53791 20.0908 9.19587C19.8843 8.8706 19.7371 8.72991 19.5926 8.64085C19.4493 8.5505 19.257 8.48209 18.8736 8.44208Z" fill="#03A7A7" />
                            </svg>

                            <div className="flex items-center mb-4 mt-4">
                                <span className="ml-2 text-lg md:text-2xl text-gray-800">
                                    {orderStatus === "Cancelled" ? "Order has been cancelled" :
                                        orderStatus === "Completed" ? "Package delivered successfully!" :
                                            "Be patient, package on deliver!"}
                                </span>
                            </div>

                            <div className="text-sm text-gray-800 flex items-center gap-4 mb-4 flex-wrap">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
                                    <span className="text-gray-800 border-2 rounded-full bg-gray-50 px-3 py-2 border-gray-200 w-full sm:w-auto text-center sm:text-left">
                                        {order.service_provider_name !== "N/A" ? order.service_provider_name : "Standard Shipping"}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-auto sm:mx-0">
                                        <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-bold border-2 rounded-full px-3 py-2 w-full sm:w-auto text-center sm:text-left">
                                        {order.user_address ?
                                            `${order.user_address.address}, ${order.user_address.city}, ${order.user_address.country}` :
                                            "Pickup from store"}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full bg-gray-300 rounded-full h-2">
                                <div
                                    className={`${orderStatus === "Cancelled" ? "bg-red-500" : "bg-pinkclr"} h-2 rounded-full`}
                                    style={{ width: `${getOrderProgress()}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {/* Timeline Card */}
                    <div className="bg-white rounded-xl shadow-md">
                        <h4 className="font-bold text-pinkclr p-4">Timeline</h4>
                        <hr className="text-gray-300" />
                        <div className="p-4 text-[#2B3674]">
                            {order.order_tracking && order.order_tracking.length > 0 ? (
                                order.order_tracking.map((tracking, index) => (
                                    <div key={tracking.id} className={index < order.order_tracking.length - 1 ? 'text-[#9BA6B7]' : ''}>
                                        <div className='flex gap-4'>
                                            <p>{formatDate(tracking.update_time)}</p>
                                            <p>{tracking.status}</p>
                                        </div>
                                        <div className='flex gap-4 mb-4'>
                                            <p>{new Date(tracking.update_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p>{tracking.details}</p>
                                        </div>
                                    </div>
                                )).reverse()
                            ) : (
                                <div className='flex gap-4'>
                                    <p>{orderDate}</p>
                                    <p>Order has been placed</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipment Details Card */}
                    <div className="bg-white rounded-xl flex-wrap shadow-md">
                        <h4 className="font-bold text-pinkclr p-4">Shipment & Details</h4>
                        <hr className="text-gray-300" />
                        <div className="p-4">
                            <div className="bg-white rounded-xl max-w-md">
                                <div className="flex items-center mb-6">
                                    {/* icon later */}
                                    <div>
                                        <p className="text-gray-800 font-medium">{order.user?.name || `Customer #${order.user_id}`}</p>
                                        <p className="text-blue-600 text-sm sm:text-xs">{order.user?.email || "customer@example.com"}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Recipient</p>
                                        <p className="text-gray-800 font-medium">{order.user?.name || `Customer #${order.user_id}`}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Delivery Address</p>
                                        <p className="text-gray-800 font-medium">
                                            {order.user_address ?
                                                `${order.user_address.address}, ${order.user_address.city}, ${order.user_address.country}` :
                                                "Pickup from store"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                                        <p className="text-gray-800 font-medium">{order.user?.phone || "Not provided"}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Payment ID</p>
                                        <div className="inline-block bg-gray-100 border-2 rounded-full px-3 py-1">
                                            <p className="text-gray-800 font-medium text-sm">#{orderUuid.substr(0, 8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items and Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Order Items Card */}
                    <div className="bg-white rounded-xl shadow-md md:col-span-2">
                        <h4 className="font-bold text-pinkclr p-4">Order Items</h4>
                        <hr className="text-gray-300 mb-4" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
                            {order.order_details && order.order_details.length > 0 ? (
                                order.order_details.map((item) => (
                                    <div key={item.id} className="text-sm">
                                        <img src="/api/placeholder/80/80" alt={item.product_name} className="rounded-md mb-2 w-full object-cover" />
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-gray-600">Price: ${parseFloat(item.price).toFixed(2)}</p>
                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-4 text-center text-gray-500">No items found in this order</div>
                            )}
                        </div>
                    </div>

                    {/* Purchase Summary Card */}
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <h4 className="font-bold text-pinkclr mb-4">Purchase Summary</h4>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li className="flex justify-between">
                                <span>Sub Total:</span>
                                <span>${orderTotal}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Discount:</span>
                                <span>-$0.00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Delivery Charge:</span>
                                <span>{order.fulfillment_type === "delivery" ? "$5.00" : "Free"}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Estimated Tax (18.5%):</span>
                                <span>${(parseFloat(orderTotal) * 0.185).toFixed(2)}</span>
                            </li>
                            <li className="font-bold text-gray-800 mt-4 pt-2 border-t flex justify-between">
                                <span>Grand Amount:</span>
                                <span>${(parseFloat(orderTotal) + (order.fulfillment_type === "delivery" ? 5 : 0) + (parseFloat(orderTotal) * 0.185)).toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex-wrap justify-end flex mb-4 gap-4'>
                    <button className="bg-[#03A7A7] text-white shadow-lg py-2 px-4 rounded-md hover:bg-teal-700 transition-colors">
                        Contact To Seller
                    </button>
                    <button className='border-2 px-4 rounded-xl py-1 text-[#03A7A7] border-[#03A7A7]'>Invoice</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderDetails;