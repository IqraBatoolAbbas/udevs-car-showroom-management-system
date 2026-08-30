import { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  Grid,
  Avatar,
  Fade,
  InputAdornment,
} from "@mui/material";

import {
  DirectionsCar,
  Lock,
  Email,
  AdminPanelSettings,
  PointOfSale,
  Inventory2,
  Person,
  ArrowForward,
  Verified,
} from "@mui/icons-material";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/auth/authSlice";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================================================
  // ROLE / DEMO CREDENTIALS
  // =========================================================

  const roles = {
    admin: {
      label: "Admin",
      title: "Admin Portal",
      description: "Complete showroom management and business control.",
      email: "admin@udevs.com",
      password: "Admin@123",
      icon: <AdminPanelSettings />,
    },

    sales: {
      label: "Sales Manager",
      title: "Sales Portal",
      description: "Manage showroom sales, customers and applications.",
      email: "sales@udevs.com",
      password: "Sales@123",
      icon: <PointOfSale />,
    },

    inventory: {
      label: "Inventory",
      title: "Inventory Portal",
      description: "Control vehicles, suppliers, stock and purchase data.",
      email: "inventory@udevs.com",
      password: "Inventory@123",
      icon: <Inventory2 />,
    },

    customer: {
      label: "Customer",
      title: "Customer Portal",
      description: "Explore vehicles and track your applications.",
      email: "customer@udevs.com",
      password: "Customer@123",
      icon: <Person />,
    },
  };

  const currentRole = roles[selectedRole];

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // =========================================================
  // ROLE CHANGE
  // =========================================================

  const handleRoleChange = (role) => {
    setSelectedRole(role);

    setFormData({
      email: roles[role].email,
      password: roles[role].password,
    });

    setError("");
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await dispatch(login({
        email: formData.email.trim(),
        password: formData.password
      })).unwrap();
      const destinations = { admin: '/admin/dashboard', sales: '/sales/dashboard', inventory: '/inventory/dashboard', customer: '/customer/dashboard' };
      navigate(destinations[result.role] || '/');
    } catch (err) {
      console.error(err);
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-container">

      {/* =====================================================
          MAIN LOGIN CARD
          ===================================================== */}

      <Paper
        elevation={0}
        className="login-paper"
      >

        {/* ===================================================
            SLIDER PANEL
            =================================================== */}

        <Box className="login-slider">

          <div className="slider-content">

            {/* Brand */}
            <div className="slider-brand">
              <div className="slider-brand-icon">
                <DirectionsCar />
              </div>

              <div>
                <span className="slider-brand-name">
                  UDEVS
                </span>

                <span className="slider-brand-subtitle">
                  AUTOMOTIVE
                </span>
              </div>
            </div>

            {/* Main heading */}
            <Typography
              component="h2"
              className="slider-heading"
            >
              Drive Your
              <br />

              <span>Business Forward.</span>
            </Typography>

            <Typography className="slider-description">
              A smarter showroom platform for managing
              vehicles, inventory, suppliers, customers
              and applications from one powerful workspace.
            </Typography>

            {/* Feature list */}
            <div className="slider-features">

              <div className="slider-feature">
                <div className="feature-icon">
                  <Verified />
                </div>

                <div>
                  <strong>Smart Inventory</strong>
                  <span>
                    Real-time vehicle stock management
                  </span>
                </div>
              </div>

              <div className="slider-feature">
                <div className="feature-icon">
                  <Verified />
                </div>

                <div>
                  <strong>Sales Management</strong>
                  <span>
                    Track customers and applications
                  </span>
                </div>
              </div>

              <div className="slider-feature">
                <div className="feature-icon">
                  <Verified />
                </div>

                <div>
                  <strong>Profit Insights</strong>
                  <span>
                    Monitor pricing and business performance
                  </span>
                </div>
              </div>

            </div>

            {/* Slider dots */}
            <div className="slider-dots">
              <span className="slider-dot active"></span>
              <span className="slider-dot"></span>
              <span className="slider-dot"></span>
            </div>

          </div>

          {/* Decorative circle */}
          <div className="slider-circle circle-one"></div>
          <div className="slider-circle circle-two"></div>

        </Box>


        {/* ===================================================
            FORM PANEL
            =================================================== */}

        <Box className="login-form-area">

          <Fade
            key={selectedRole}
            in={true}
            timeout={400}
          >

            <div>

              {/* Header */}
              <div className="login-header">

                <Avatar className="login-avatar">
                  {currentRole.icon}
                </Avatar>

                <Typography
                  variant="h4"
                  component="h1"
                >
                  Welcome Back
                </Typography>

                <Typography className="login-subtitle">
                  Sign in to your {currentRole.label.toLowerCase()} portal
                </Typography>

              </div>


              {/* =================================================
                  ROLE SELECTOR
                  ================================================= */}

              <div className="role-section">

                <Typography className="role-label">
                  SELECT PORTAL
                </Typography>

                <div className="role-switcher">

                  {Object.entries(roles).map(
                    ([role, data]) => (

                      <button
                        key={role}
                        type="button"
                        className={
                          selectedRole === role
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          handleRoleChange(role)
                        }
                      >
                        <span className="role-icon">
                          {data.icon}
                        </span>

                        <span className="role-name">
                          {data.label}
                        </span>
                      </button>

                    )
                  )}

                </div>

              </div>


              {/* Current role information */}

              <div className="selected-role-info">

                <div className="selected-role-icon">
                  {currentRole.icon}
                </div>

                <div>
                  <strong>
                    {currentRole.title}
                  </strong>

                  <span>
                    {currentRole.description}
                  </span>
                </div>

              </div>


              <Divider className="login-divider" />


              {/* =================================================
                  LOGIN FORM
                  ================================================= */}

              <form onSubmit={handleSubmit}>

                <Box className="input-wrapper">

                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />

                </Box>


                <Box className="input-wrapper">

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                    }}
                  />

                </Box>


                {/* Error */}

                {error && (
                  <Alert
                    severity="error"
                    variant="filled"
                    className="login-alert"
                  >
                    {error}
                  </Alert>
                )}


                {/* Submit */}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  className="login-button"
                  endIcon={
                    !loading && <ArrowForward />
                  }
                >
                  {loading
                    ? "Signing In..."
                    : `Sign In as ${currentRole.label}`}
                </Button>

              </form>


              {/* =================================================
                  DEMO ACCESS
                  ================================================= */}

              <div className="demo-section">

                <div className="demo-heading">
                  <span></span>

                  <Typography>
                    QUICK DEMO ACCESS
                  </Typography>

                  <span></span>
                </div>

                <Grid
                  container
                  spacing={1.2}
                >

                  {Object.entries(roles).map(
                    ([role, data]) => (

                      <Grid
                        item
                        xs={6}
                        key={role}
                      >

                        <Button
                          fullWidth
                          variant="outlined"
                          className={
                            selectedRole === role
                              ? "demo-button selected"
                              : "demo-button"
                          }
                          onClick={() =>
                            handleRoleChange(role)
                          }
                        >
                          {data.label}
                        </Button>

                      </Grid>

                    )
                  )}

                </Grid>

              </div>


              <div className="login-footer">

                <span>
                  UDEVS CAR SHOWROOM MANAGEMENT SYSTEM
                </span>

                <span>
                  Frontend • LocalStorage
                </span>

              </div>

            </div>

          </Fade>

        </Box>

      </Paper>

    </Box>
  );
};

export default Login;
