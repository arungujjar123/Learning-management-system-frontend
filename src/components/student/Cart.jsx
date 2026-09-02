import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../../features/cart/cartSlice";
import { setAuthToken } from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import { FaTrashAlt, FaShoppingCart, FaArrowRight, FaShieldAlt } from "react-icons/fa";

const Cart = () => {
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useAuth();

  useEffect(() => {
    setAuthToken(token);
    if (token) dispatch(fetchCart(calculateTotal));
  }, [dispatch, token]);

  const cartItems = useSelector((state) => state.cart.items) || [];
  const loading = useSelector((state) => state.cart.loading);

  useEffect(() => {
    calculateTotal(cartItems);
  }, [cartItems]);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.price || 0), 0);
    setTotal(sum);
  };

  const handleRemoveFromCart = async (courseId) => {
    try {
      await dispatch(removeFromCart(courseId)).unwrap();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error removing course:", err);
    }
  };

  const handleCheckout = async () => {
    navigate("/checkout", { state: { cartItems, total } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Shopping Cart ({cartItems.length})
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Review your selected courses before proceeding to checkout
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-5 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mx-auto text-2xl">
            <FaShoppingCart />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Your cart is currently empty</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Looks like you haven't added any courses to your cart yet.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-600/20 transition-all"
          >
            <span>Browse Courses</span>
            <FaArrowRight size={12} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xs hover:shadow-md transition-all"
              >
                <img
                  src={
                    item.thumbnail ||
                    `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60`
                  }
                  alt={item.title}
                  className="w-full sm:w-36 h-24 rounded-xl object-cover shrink-0 bg-slate-100"
                />

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    By <span className="font-semibold text-slate-700">{item.instructor || "Expert Mentor"}</span>
                  </p>
                  <p className="text-lg font-extrabold text-cyan-700 pt-1">
                    {item.price ? `₹${item.price}` : "Free"}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove course"
                >
                  <FaTrashAlt size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total Courses:</span>
                <span className="font-bold text-slate-900">{cartItems.length}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">₹{total}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-cyan-700">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-600/20 transition-all active:scale-[0.99]"
            >
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <FaShieldAlt className="text-emerald-500" />
              <span>Safe & Secure Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

