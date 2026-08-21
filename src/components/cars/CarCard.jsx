import { Card, CardMedia, CardContent, CardActions, Typography, Chip, Box, Button, IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder, CompareArrows, Visibility, Edit } from '@mui/icons-material';
import { formatCurrency, formatCarName } from '../../utils/formatters';
import StatusChip from '../common/StatusChip';

const CarCard = ({ 
  car, 
  onViewDetails, 
  onEdit, 
  showActions = true,
  isFavorite = false,
  onToggleFavorite,
  isComparing = false,
  onToggleCompare,
  showStaffMargin = false
}) => {
  const mainImage = car.images?.[0] || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800';

  const getColorCode = (colorName) => {
    const colorMap = {
      'White': '#FFFFFF',
      'Black': '#111827',
      'Silver': '#9CA3AF',
      'Gray': '#4B5563',
      'Red': '#DC2626',
      'Blue': '#2563EB',
      'Green': '#16A34A',
      'Brown': '#78350F',
      'Beige': '#D1D5DB',
      'Gold': '#D97706',
      'Orange': '#EA580C',
      'Yellow': '#CA8A04'
    };
    return colorMap[colorName] || '#6B7280';
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { 
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 35px rgba(21, 101, 192, 0.12)'
        },
        borderRadius: 3.5,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.06)',
        bgcolor: '#ffffff'
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="210"
          image={mainImage}
          alt={formatCarName(car)}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.06)'
            }
          }}
        />

        {/* Gradient Overlay */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Top Badges */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 0.8, alignItems: 'center' }}>
          <StatusChip status={car.status} />
          {car.profitMargin >= 15 && (
            <Chip 
              label="High Margin" 
              size="small" 
              sx={{ 
                bgcolor: '#10B981', 
                color: 'white',
                fontWeight: 700,
                fontSize: '0.68rem',
                height: 22,
                boxShadow: '0 2px 6px rgba(16,185,129,0.4)'
              }} 
            />
          )}
        </Box>

        {/* Action icons on image */}
        <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 0.5 }}>
          {onToggleFavorite && (
            <Tooltip title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}>
              <IconButton
                size="small"
                onClick={() => onToggleFavorite(car)}
                sx={{
                  bgcolor: isFavorite ? '#EF4444' : 'rgba(255,255,255,0.85)',
                  color: isFavorite ? '#ffffff' : '#4B5563',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    bgcolor: isFavorite ? '#DC2626' : 'white',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}

          {onToggleCompare && (
            <Tooltip title={isComparing ? "Remove from Compare" : "Compare Vehicle"}>
              <IconButton
                size="small"
                onClick={() => onToggleCompare(car)}
                sx={{
                  bgcolor: isComparing ? '#1565C0' : 'rgba(255,255,255,0.85)',
                  color: isComparing ? '#ffffff' : '#4B5563',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    bgcolor: isComparing ? '#0D47A1' : 'white',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <CompareArrows fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Bottom Stock Badge on Image */}
        <Box sx={{ position: 'absolute', bottom: 10, left: 12 }}>
          <Chip
            label={car.stock > 0 ? `${car.stock} In Stock` : 'Out of Stock'}
            size="small"
            sx={{
              bgcolor: car.stock <= 3 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.7rem',
              backdropFilter: 'blur(4px)'
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#00ACC1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {car.make}
          </Typography>
          <Typography variant="h6" component="div" sx={{ 
            fontWeight: 700, 
            fontSize: '1.15rem',
            color: '#071321',
            lineHeight: 1.3
          }}>
            {formatCarName(car)}
          </Typography>
        </Box>

        {/* Spec tags */}
        <Box sx={{ mb: 1.5, display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
          <Chip 
            label={`${car.year}`} 
            size="small" 
            sx={{ fontSize: '0.72rem', height: 22, bgcolor: '#F3F4F6', color: '#374151', fontWeight: 600 }}
          />
          <Chip 
            label={car.fuel} 
            size="small" 
            sx={{ fontSize: '0.72rem', height: 22, bgcolor: '#F3F4F6', color: '#374151', fontWeight: 600 }}
          />
          <Chip 
            label={car.transmission} 
            size="small" 
            sx={{ fontSize: '0.72rem', height: 22, bgcolor: '#F3F4F6', color: '#374151', fontWeight: 600 }}
          />
          {car.engine && (
            <Chip 
              label={car.engine} 
              size="small" 
              sx={{ fontSize: '0.72rem', height: 22, bgcolor: '#F3F4F6', color: '#374151', fontWeight: 600 }}
            />
          )}
        </Box>

        {/* Color Dots */}
        {car.availableColors?.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.7rem', mr: 0.5 }}>
              Colors:
            </Typography>
            {car.availableColors.slice(0, 5).map((color) => (
              <Tooltip key={color} title={color}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: getColorCode(color),
                    border: '1.5px solid rgba(0,0,0,0.15)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
              </Tooltip>
            ))}
            {car.availableColors.length > 5 && (
              <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.7rem', fontWeight: 600 }}>
                +{car.availableColors.length - 5}
              </Typography>
            )}
          </Box>
        )}

        {/* Pricing Area */}
        <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', fontSize: '0.7rem', fontWeight: 500 }}>
              Selling Price
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1565C0', fontSize: '1.25rem', lineHeight: 1.1 }}>
              {formatCurrency(car.sellingPrice)}
            </Typography>
          </div>

          {showStaffMargin && car.profit !== undefined && (
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, display: 'block', fontSize: '0.78rem' }}>
                Profit: {formatCurrency(car.profit)}
              </Typography>
              <Typography variant="caption" sx={{ color: car.profitMargin >= 10 ? '#10B981' : '#F59E0B', fontWeight: 600, fontSize: '0.7rem' }}>
                {car.profitMargin}% margin
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {showActions && (
        <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, gap: 1 }}>
          <Button 
            fullWidth
            variant="contained" 
            size="small" 
            onClick={() => onViewDetails(car)}
            startIcon={<Visibility />}
            sx={{ 
              fontWeight: 600, 
              borderRadius: 2, 
              textTransform: 'none',
              background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)'
            }}
          >
            View Details
          </Button>
          {onEdit && (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => onEdit(car)}
              startIcon={<Edit />}
              sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none', minWidth: 80 }}
            >
              Edit
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default CarCard;
