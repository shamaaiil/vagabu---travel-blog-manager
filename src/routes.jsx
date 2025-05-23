import {
  UserCircleIcon,
  ServerStackIcon,
  TableCellsIcon as ProductIcon,
} from "@heroicons/react/24/solid";
import { SignUp } from "@/pages/auth";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ProductsPage from "./pages/dashboard/Products/ProductsPage/Products";
import MainCategory from "./pages/dashboard/Products/Productcategories/MainCategories";
import SubCategories from "./pages/dashboard/Products/Productcategories/subcategory/SubCategories";
import ChildCategories from "./pages/dashboard/Products/Productcategories/childCategory/ChildCategories";
import ProductAttributesPage from "./pages/dashboard/Products/Productsattributes/ProductAttribute";
import SignIn from "./pages/auth/sign-in";
import Dashboard from "./pages/dashboard/Dashboard/Dashboard";
import { Profile } from "./pages/dashboard";
import { TbLayoutDashboard, TbCategoryPlus } from "react-icons/tb";
import {
  FaUsers,
  FaShoppingCart,
  FaHeadphones,
  FaLightbulb,
  FaCheck,
  FaAward,
  FaCoins,
} from "react-icons/fa";
import Customers from "./pages/dashboard/Customers/Customers";
import ProductLabels from "./pages/dashboard/Products/Productlabels/ProductLabels";
import ServiceProviders from "./pages/dashboard/ServiceProviders/ServiceProviders";
import { MdSettings } from "react-icons/md";
import AllOrders from "./pages/Orders/AllOrders/AllOrders";
import OrderDetails from "./pages/Orders/OrderDetail/OrderDetails";
import ResetPassword from "./pages/dashboard/profile/components/ResetPassword";
import ManageStaff from "./pages/dashboard/users/managestaff/ManageStaff";
import Quotations from "./pages/dashboard/quotations/Quotations";
import LoyaltyPoints from "./pages/dashboard/loyaltyPoints/LoyaltyPoints";
import Email from "./pages/dashboard/marketing/Email";
import Sms from "./pages/dashboard/marketing/Sms";
import Support from "./pages/dashboard/support/Support";
import ManageRoles from "./pages/dashboard/users/manageroles/ManageRoles";
import CompletedOrders from "./pages/Orders/AllOrders/CompletedOrders";
import ProcessingOrders from "./pages/Orders/AllOrders/ProcessingOrders";
import CancelledOrders from "./pages/Orders/AllOrders/CancelledOrders";
import RefundedOrders from "./pages/Orders/AllOrders/RefundedOrders";
import AppBanner from "./pages/dashboard/Settings/AppBanner/AppBanner";
import EmailTemplates from "./pages/dashboard/Settings/EmailTemplate/EmailTemplates";
import BannedCustomers from "./pages/dashboard/Customers/BannedCustomers";
import SubscriptionTransactions from "./pages/dashboard/Customers/SubscriptionTransactions";
import Transactions from "./pages/dashboard/Customers/Transactions";
import SubscriptionPlans from "./pages/dashboard/Customers/SubscriptionPlans";
import PendingOrders from "./pages/Orders/AllOrders/PendingOrders";
import Settings from "./pages/dashboard/Settings/Settings";
import CustomerDetail from "./pages/dashboard/Customers/CustomerDetail";
import CreateProduct from "./pages/dashboard/Products/components/CreateProduct";
import OrderDisputes from "./pages/Orders/AllOrders/OrderDisputes";
import OrderBids from "./pages/Orders/OrderDetail/OrderBids";
import UserCard from "./pages/dashboard/Customers/components/UserCards";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <TbLayoutDashboard {...icon} />,
        name: "Dashboard",
        path: "/",
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        name: "Product Category",
        icon: <TbCategoryPlus {...icon} />,

        dropdown: true,
        children: [
          {
            name: "Main Categories",
            path: "products/main-categories",
            element: (
              <ProtectedRoute>
                <MainCategory />
              </ProtectedRoute>
            ),
          },
          {
            name: "Sub Categories",
            path: "/product/sub-categories",
            element: (
              <ProtectedRoute>
                <SubCategories />
              </ProtectedRoute>
            ),
          },
          {
            name: "Child Categories",
            path: "/products/child-categories",
            element: (
              <ProtectedRoute>
                <ChildCategories />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        icon: <ProductIcon {...icon} />,
        name: "Products",
        dropdown: true,
        children: [
          {
            name: "All Products",
            path: "/products",
            element: (
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            ),
          },
          {
            name: "Products Labels",
            path: "/product-labels",
            element: (
              <ProtectedRoute>
                <ProductLabels />
              </ProtectedRoute>
            ),
          },

          {
            name: "Product Attributes",
            path: "/product-attributes",
            element: (
              <ProtectedRoute>
                <ProductAttributesPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
          {
            dropdown : false,
            name: "create product",
            path: "/create-product",
            element: (
              <ProtectedRoute>
                <CreateProduct/>
              </ProtectedRoute>
            ),
            showInSidenav : false
          },
          {
        dropdown: false,
        name: "edit product",
        path: "/edit-product/:uuid",
        element: (
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        ),
        showInSidenav: false,
      },
     
      {
        icon: <FaShoppingCart {...icon} />,
        name: "0rders",
        dropdown: true,
        children: [
          {
            name: "All Orders",
            path: "/orders",
            element: (
              <ProtectedRoute>
                <AllOrders />
              </ProtectedRoute>
            ),
          },
          {
            name: "Pending Orders",
            path: "/pending-orders",
            element: (
              <ProtectedRoute>
                <PendingOrders />
              </ProtectedRoute>
            ),
          },
          {
            name: "Processing Orders",
            path: "/processing-orders",
            element: (
              <ProtectedRoute>
                <ProcessingOrders />
              </ProtectedRoute>
            ),
          },
          {
            name: "Completed Orders",
            path: "/completed-orders",
            element: (
              <ProtectedRoute>
                <CompletedOrders />
              </ProtectedRoute>
            ),
          },
          {
            name: "Cancelled Orders",
            path: "/cancelled-orders",
            element: (
              <ProtectedRoute>
                <CancelledOrders />
              </ProtectedRoute>
            ),
          },
          {
            name: "Refunded Orders",
            path: "/refunded-orders",
            element: (
              <ProtectedRoute>
                <RefundedOrders />
              </ProtectedRoute>
            ),
          },
          {
            name: "Order Disputes",
            path: "/order-disputes",
            element: (
              <ProtectedRoute>
                <OrderDisputes/>
              </ProtectedRoute>
            ),
          },

          {
            icon: <FaCheck />,
            name: "Quote Requests",
            path: "/quote-requests",
            element: (
              <ProtectedRoute>
                <Quotations />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        dropdown: false,
        name: "Order Details",
        path: "/orders/:uuid",
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        ),
        showInSidenav: false,
      },
        {
        dropdown: false,
        name: "Order Bids",
        path: "/orders/:uuid/bids",
        element: (
          <ProtectedRoute>
            <OrderBids />
          </ProtectedRoute>
        ),
        showInSidenav: false,
      },
      
      {
        icon: <FaUsers {...icon} />,
        name: "Customers",
        dropdown: true,
        children: [
          {
            name: "All Customers",
            path: "/customers",
            element: (
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            ),
          },
          {
            name: "Banned Customers",
            path: "banned-customers",
            element: (
              <ProtectedRoute>
                <BannedCustomers />
              </ProtectedRoute>
            ),
          },
          {
            name: "Subscription Plans",
            path: "/subscription-plans",
            element: (
              <ProtectedRoute>
                <SubscriptionPlans />
              </ProtectedRoute>
            ),
          },
          {
            name: "Subscription Transactions",
            path: "/subscription-transactions",
            element: (
              <ProtectedRoute>
                <SubscriptionTransactions />
              </ProtectedRoute>
            ),
          },
          {
            name: "Transactions",
            path: "/transactions",
            element: (
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            ),
          },
          {
            icon: <FaAward {...icon} />,
            name: "Loyalty Points",
            path: "/customers/loyalty-points",
            element: (
              <ProtectedRoute>
                <LoyaltyPoints />
              </ProtectedRoute>
            ),
          },
        ],
      },
       
      {
        dropdown: false,
        name: "customer Details",
        path: "/customer/:uuid",
        element: (
          <ProtectedRoute>
            <CustomerDetail/>
          </ProtectedRoute>
        ),
        showInSidenav: false,
      },
       {
        dropdown: false,
        name: "user cards",
        path: "/user-card",
        element: (
          <ProtectedRoute>
            <UserCard/>
          </ProtectedRoute>
        ),
        showInSidenav: false,
      },


      {
        icon: <UserCircleIcon {...icon} />,
        name: "Users",
        dropdown: true,
        children: [
          {
            name: "Manage Staff",
            path: "/users/manage-staff",
            element: (
              <ProtectedRoute>
                <ManageStaff />
              </ProtectedRoute>
            ),
          },
          {
            name: "Manage Roles",
            path: "/users/manage-roles",
            element: (
              <ProtectedRoute>
                <ManageRoles />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        icon: <FaHeadphones {...icon} />,
        name: "Support",
        path: "/support",
        element: (
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        ),
      },
      {
        icon: <FaLightbulb {...icon} />,
        name: "Marketing",
        dropdown: true,
        children: [
          {
            name: "EMAIL",
            path: "/marketing/email",
            element: (
              <ProtectedRoute>
                <Email />
              </ProtectedRoute>
            ),
          },
          {
            name: "SMS",
            path: "/marketing/sms",
            element: (
              <ProtectedRoute>
                <Sms />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        icon: <MdSettings {...icon} />,
        name: "Settings",
        path: "/setting",
        dropdown: true,
        children: [
          {
            name: "App Banner",
            path: "/setting/app-banner",
            element: (
              <ProtectedRoute>
                <AppBanner />
              </ProtectedRoute>
            ),
          },
          {
            name: "Email Templates",
            path: "/setting/email-templates",
            element: (
              <ProtectedRoute>
                <EmailTemplates />
              </ProtectedRoute>
            ),
          },
          {
            name: "Admin Settings",
            path: "/setting/admin-settings",
            element: (
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            ),
          },
        ],
      },

      {
        icon: <UserCircleIcon {...icon} />,
        name: "Service Providers",
        path: "/service-providers",
        element: (
          <ProtectedRoute>
            <ServiceProviders />
          </ProtectedRoute>
        ),
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Profile",
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      {
        icon: <ServerStackIcon {...icon} />,
        name: "New Password",
        path: "/password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    title: "Auth Pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Sign In",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Sign Up",
        path: "",
        element: <SignUp />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Forget Password",
        path: "forgot-password",
        element: <ForgetPassword />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "New Password",
        path: "/reset-password/:token?",
        element: <ResetPassword />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "New Password",
        path: "/reset-password/:token?",
        element: <ResetPassword />,
      },
    ],
  },
];

export default routes;
