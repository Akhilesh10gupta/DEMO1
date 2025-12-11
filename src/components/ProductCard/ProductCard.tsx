import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Rating,
} from '@mui/material';
import Link from 'next/link';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    rating: number;
    thumbnail: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(({ product }: ProductCardProps) => {
  return (
    <Grid item key={product.id} xs={12} sm={6} md={4}>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        }
      }}>
        <CardMedia
          component="img"
          height="160"
          image={product.thumbnail}
          alt={product.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {product.title}
          </Typography>
          <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
            ${product.price}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.rating})
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {product.category}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Link href={`/products/${product.id}`} passHref>
            <Button size="small" variant="outlined">View</Button>
          </Link>
          <Button size="small" variant="contained" startIcon={<AddShoppingCartIcon />}>
            Add to Cart
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

