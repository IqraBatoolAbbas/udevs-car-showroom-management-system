import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, color = '#1565C0', trend, trendValue }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp sx={{ fontSize: 14 }} />;
    if (trend === 'down') return <TrendingDown sx={{ fontSize: 14 }} />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return '#059669';
    if (trend === 'down') return '#DC2626';
    return '#6B7280';
  };

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 130,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        backgroundColor: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.07)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(color, 0.15)}`,
          borderColor: alpha(color, 0.3),
        },
      }}
    >
      {/* Decorative background blob */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(color, 0.12)} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5 },
          '&:last-child': { pb: { xs: 2, sm: 2.5 } },
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top row: title + icon */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              color: '#6B7280',
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              lineHeight: 1.4,
              flex: 1,
              pr: Icon ? 1 : 0,
            }}
          >
            {title}
          </Typography>

          {Icon && (
            <Box
              sx={{
                background: `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.06)} 100%)`,
                border: `1px solid ${alpha(color, 0.18)}`,
                borderRadius: 2.5,
                p: { xs: 0.8, sm: 1 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                ml: 1,
              }}
            >
              <Icon sx={{ fontSize: { xs: 18, sm: 20 }, color }} />
            </Box>
          )}
        </Box>

        {/* Value — single line, auto-shrinks with viewport so long values like currency always fit */}
        <Typography
          component="div"
          title={String(value)}
          sx={{
            fontWeight: 800,
            color: '#071321',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.4rem)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            minWidth: 0,
            mb: 0.8,
          }}
        >
          {value}
        </Typography>

        {/* Trend row */}
        {trendValue && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.4,
              mt: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: getTrendColor(),
                flexShrink: 0,
              }}
            >
              {getTrendIcon()}
            </Box>
            <Typography
              sx={{
                color: getTrendColor(),
                fontWeight: 600,
                fontSize: { xs: '0.65rem', sm: '0.72rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
