import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Slider,
  InputAdornment,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  CompareArrows,
  Favorite,
  FavoriteBorder,
  GridView,
  ViewList,
  DirectionsCar
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import CarCard from '../../components/cars/CarCard';
import CarCompareModal from '../../components/cars/CarCompareModal';
import EmptyState from '../../components/common/EmptyState';
import { FUEL_TYPES, TRANSMISSION_TYPES, CAR_COLORS, SORT_OPTIONS } from '../../utils/constants';
import { formatCurrency, formatCarName } from '../../utils/formatters';
import './Showroom.css';
import { selectCars, selectWishlist, toggleWishlist } from '../../redux/cars/carsSlice';

const Showroom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allCars = useSelector(selectCars);
  const wishlist = useSelector(selectWishlist);
  const cars = allCars.filter(car => car?.status === 'available' && (car?.stock ?? 0) > 0);
  const [filteredCars, setFilteredCars] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const loading = false;
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [makeFilter, setMakeFilter] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');
  const [transmissionFilter, setTransmissionFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [sortBy, setSortBy] = useState('price_asc');

  useEffect(() => {
    applyFilters();
  }, [cars, searchTerm, makeFilter, fuelFilter, transmissionFilter, colorFilter, priceRange, sortBy, showOnlyFavorites, favorites]);

  const favorites = wishlist;

  const uniqueMakes = [...new Set(cars.map(c => c.make))].filter(Boolean);

  const applyFilters = () => {
    let filtered = [...cars];

    // Wishlist filter
    if (showOnlyFavorites) {
      filtered = filtered.filter(car => favorites.includes(car.id));
    }

    // Search query
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(car =>
        car.make.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term) ||
        car.variant?.toLowerCase().includes(term) ||
        car.id?.toLowerCase().includes(term)
      );
    }

    // Make filter
    if (makeFilter) {
      filtered = filtered.filter(car => car.make === makeFilter);
    }

    // Fuel filter
    if (fuelFilter) {
      filtered = filtered.filter(car => car.fuel === fuelFilter);
    }

    // Transmission filter
    if (transmissionFilter) {
      filtered = filtered.filter(car => car.transmission === transmissionFilter);
    }

    // Color filter
    if (colorFilter) {
      filtered = filtered.filter(car => car.availableColors?.includes(colorFilter));
    }

    // Price range filter
    filtered = filtered.filter(car => car.sellingPrice >= priceRange[0] && car.sellingPrice <= priceRange[1]);

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.sellingPrice - b.sellingPrice;
        case 'price_desc':
          return b.sellingPrice - a.sellingPrice;
        case 'year_desc':
          return b.year - a.year;
        case 'year_asc':
          return a.year - b.year;
        case 'name_asc':
          return formatCarName(a).localeCompare(formatCarName(b));
        case 'name_desc':
          return formatCarName(b).localeCompare(formatCarName(a));
        default:
          return 0;
      }
    });

    setFilteredCars(filtered);
  };

  const handleToggleFavorite = (car) => {
    dispatch(toggleWishlist(car.id));
  };

  const handleToggleCompare = (car) => {
    const exists = compareList.some(c => c.id === car.id);
    if (exists) {
      setCompareList(compareList.filter(c => c.id !== car.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 vehicles simultaneously.');
        return;
      }
      setCompareList([...compareList, car]);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setMakeFilter('');
    setFuelFilter('');
    setTransmissionFilter('');
    setColorFilter('');
    setPriceRange([0, 20000000]);
    setSortBy('price_asc');
    setShowOnlyFavorites(false);
  };

  const location = useLocation();

  const handleViewDetails = (car) => {
    // Determine base route from current path (sales vs customer)
    const isSalesRoute = location.pathname.startsWith('/sales');
    const basePath = isSalesRoute ? '/sales' : '/customer';
    navigate(`${basePath}/cars/${car.id}`);
  };

  return (
    <div className="showroom-page">
      <PageHeader
        title="Vehicle Showroom & Catalog"
        subtitle={`Explore ${cars.length} verified vehicles with detailed specifications and live booking availability`}
        action={
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button
              variant={showOnlyFavorites ? "contained" : "outlined"}
              startIcon={<Favorite />}
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              sx={{
                borderRadius: 2,
                bgcolor: showOnlyFavorites ? '#EF4444' : 'transparent',
                borderColor: '#EF4444',
                color: showOnlyFavorites ? 'white' : '#EF4444',
                '&:hover': { bgcolor: showOnlyFavorites ? '#DC2626' : 'rgba(239,68,68,0.08)' }
              }}
            >
              Wishlist ({favorites.length})
            </Button>
            {compareList.length > 0 && (
              <Button
                variant="contained"
                startIcon={<CompareArrows />}
                onClick={() => setCompareModalOpen(true)}
                sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
              >
                Compare ({compareList.length}/3)
              </Button>
            )}
          </Box>
        }
      />

      {/* Advanced Filter Box */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)' }} elevation={0}>
        <Grid container spacing={2.5} alignItems="center">
          {/* Search Box */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by make, model, variant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Make Filter */}
          <Grid item xs={6} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Brand / Make</InputLabel>
              <Select
                value={makeFilter}
                label="Brand / Make"
                onChange={(e) => setMakeFilter(e.target.value)}
              >
                <MenuItem value="">All Brands</MenuItem>
                {uniqueMakes.map(make => (
                  <MenuItem key={make} value={make}>{make}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Fuel Filter */}
          <Grid item xs={6} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Fuel Type</InputLabel>
              <Select
                value={fuelFilter}
                label="Fuel Type"
                onChange={(e) => setFuelFilter(e.target.value)}
              >
                <MenuItem value="">All Fuels</MenuItem>
                {FUEL_TYPES.map(fuel => (
                  <MenuItem key={fuel} value={fuel}>{fuel}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Transmission */}
          <Grid item xs={6} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Transmission</InputLabel>
              <Select
                value={transmissionFilter}
                label="Transmission"
                onChange={(e) => setTransmissionFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {TRANSMISSION_TYPES.map(trans => (
                  <MenuItem key={trans} value={trans}>{trans}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort By */}
          <Grid item xs={6} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="year_desc">Year: Newest First</MenuItem>
                <MenuItem value="year_asc">Year: Oldest First</MenuItem>
                <MenuItem value="name_asc">Name: A to Z</MenuItem>
                <MenuItem value="name_desc">Name: Z to A</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Color filter chips & Reset */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, pt: 1, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#4B5563', mr: 1 }}>
                  Filter by Color:
                </Typography>
                <Chip
                  label="All Colors"
                  size="small"
                  onClick={() => setColorFilter('')}
                  color={!colorFilter ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer', fontWeight: !colorFilter ? 700 : 500 }}
                />
                {CAR_COLORS.map(color => (
                  <Chip
                    key={color}
                    label={color}
                    size="small"
                    onClick={() => setColorFilter(color === colorFilter ? '' : color)}
                    color={colorFilter === color ? 'primary' : 'default'}
                    variant={colorFilter === color ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer', fontWeight: colorFilter === color ? 700 : 500 }}
                  />
                ))}
              </Box>

              <Button
                size="small"
                variant="text"
                onClick={handleResetFilters}
                startIcon={<Clear />}
                sx={{ textTransform: 'none', color: '#6B7280' }}
              >
                Reset Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#071321' }}>
          Showing <strong>{filteredCars.length}</strong> {filteredCars.length === 1 ? 'vehicle' : 'vehicles'}
          {showOnlyFavorites && ' in Wishlist'}
        </Typography>
      </Box>

      {/* Vehicles Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }, (_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={190} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton width="70%" height={30} /><Skeleton width="45%" /><Skeleton width="85%" />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : filteredCars.length > 0 ? (
        <Grid container spacing={3}>
          {filteredCars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.id}>
              <CarCard
                car={car}
                onViewDetails={handleViewDetails}
                isFavorite={favorites.includes(car.id)}
                onToggleFavorite={handleToggleFavorite}
                isComparing={compareList.some(c => c.id === car.id)}
                onToggleCompare={handleToggleCompare}
                showActions={true}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ py: 8 }}>
          <EmptyState
            message={showOnlyFavorites ? "Your Wishlist is currently empty. Click the heart icon on any car to add it." : "No vehicles match your selected filter criteria."}
            action={handleResetFilters}
            actionLabel="Reset Filters"
          />
        </Box>
      )}

      {/* Floating Comparison Drawer */}
      {compareList.length > 0 && (
        <Box sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#071321',
          color: 'white',
          p: 2,
          borderRadius: 3.5,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          zIndex: 1000,
          border: '1px solid rgba(0, 172, 193, 0.4)'
        }}>
          <CompareArrows sx={{ color: '#00ACC1' }} />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {compareList.length}/3 Vehicles selected
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => setCompareModalOpen(true)}
            sx={{ bgcolor: '#00ACC1', color: 'white', fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
          >
            Compare Now
          </Button>
          <Button
            size="small"
            onClick={() => setCompareList([])}
            sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', minWidth: 'auto', p: 0.5 }}
          >
            Clear
          </Button>
        </Box>
      )}

      {/* Car Compare Modal */}
      <CarCompareModal
        open={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        compareCars={compareList}
        onRemoveCar={(carId) => setCompareList(compareList.filter(c => c.id !== carId))}
        onSelectCar={handleViewDetails}
      />
    </div>
  );
};

export default Showroom;
