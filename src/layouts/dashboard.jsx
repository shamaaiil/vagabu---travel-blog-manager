import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { jwtDecode } from "jwt-decode";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logout } from "@/features/AuthSlice/authSlice";

export function Dashboard() {
  const location = useLocation();
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  // const { token } = useSelector((store) => store?.auth);
  const navigate = useNavigate();
  const dispatcher = useDispatch();

  const { token, isAuthenticated } = useSelector((store) => store.auth);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // dispatcher(logout());
        }
      } catch (error) {
        // dispatcher(logout());
      }
    }
  }, [token]);

  if (!isAuthenticated || !token) {
    // Save the attempted URL
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  const renderRoutes = () => {
    return routes.map(({ layout, pages }) =>
      layout === "dashboard"
        ? pages.map(({ path, element, children }) =>
            children ? (
              children.map((child) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={child.element}
                />
              ))
            ) : (
              <Route key={path} path={path} element={element} />
            ),
          )
        : null,
    );
  };

  if (token) {
    return (
      <div className="min-h-screen bg-[#F2F7FB] ">
        <Sidenav
          brandName="Prints Rush"
          routes={routes}
          brandImg={
            sidenavType === "teelclr"
              ? "/img/logo-ct.png"
              : "/img/logo-ct-teelclr.png"
          }
        />
        <div className="xl:ml-64">
          <DashboardNavbar />
          <Configurator />
          {/* <IconButton
            size="lg"
            color="white"
            className="fixed bottom-8 right-8 z-40 rounded-full shadow-teelclr-teelclr-900/10"
            ripple={false}
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </IconButton> */}
          <Routes>{renderRoutes()}</Routes>
          <div className="text-teelclr-teelclr-600">
            {/* <Footer brandName="CodeLab" /> */}
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
