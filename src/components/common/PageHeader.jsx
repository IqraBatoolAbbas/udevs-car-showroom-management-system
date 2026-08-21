import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumbs, action }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              component="button"
              variant="body2"
              onClick={() => handleBreadcrumbClick(crumb.path)}
              underline="hover"
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {action && <Box>{action}</Box>}
      </Box>
    </Box>
  );
};

export default PageHeader;
