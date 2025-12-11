'use client';

import { useEffect, useState } from 'react';
import { useProductStore } from '@/store/productStore';
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Rating,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Link from 'next/link';

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { selectedProduct, loading, error, fetchProductById } = useProductStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 8 }} />;
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  }

  if (!selectedProduct) {
    return <Typography sx={{ textAlign: 'center', mt: 8 }}>Product not found</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {selectedProduct.title}
        </Typography>
        <Button variant="contained" component={Link} href="/dashboard">
          Go to Dashboard
        </Button>
      </Box>

      <Card sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CardMedia
                component="img"
                image={selectedProduct.images[currentImageIndex]}
                alt={selectedProduct.title}
                sx={{ height: 400, objectFit: 'contain', borderRadius: 2 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
              {selectedProduct.images.map((image, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  image={image}
                  alt={`Thumbnail ${index + 1}`}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: index === currentImageIndex ? '2px solid primary.main' : '1px solid transparent',
                    boxShadow: index === currentImageIndex ? 3 : 0,
                  }}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h5" gutterBottom>{selectedProduct.brand}</Typography>
              <Typography variant="body1" paragraph>{selectedProduct.description}</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={selectedProduct.rating} precision={0.1} readOnly size="large" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedProduct.rating} / 5
                </Typography>
              </Box>

              <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                ${selectedProduct.price}
                {selectedProduct.discountPercentage > 0 && (
                  <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 2, textDecoration: 'line-through' }}>
                    ${(selectedProduct.price / (1 - selectedProduct.discountPercentage / 100)).toFixed(2)}
                  </Typography>
                )}
              </Typography>
              
              {selectedProduct.discountPercentage > 0 && (
                <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                  {selectedProduct.discountPercentage}% Off
                </Typography>
              )}
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                Availability: {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'} ({selectedProduct.stock} items)
              </Typography>

              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                startIcon={<AddShoppingCartIcon />}
                disabled={selectedProduct.stock === 0}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default ProductDetailPage;
