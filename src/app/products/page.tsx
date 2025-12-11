'use client';

import { useEffect, useState, useCallback } from 'react';
import { useProductStore } from '@/store/productStore';
import {
  Container,
  Typography,
  Grid,
  Pagination,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Button, // Ensure Button is imported
} from '@mui/material';
import ProductCard from '@/components/ProductCard/ProductCard';
import Link from 'next/link';

const ProductsPage = () => {
  const { 
    products, 
    total, 
    loading, 
    error, 
    categories,
    fetchProducts, 
    searchProducts,
    fetchCategories,
    fetchProductsByCategory
  } = useProductStore();
  
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const rowsPerPage = 12;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else if (searchTerm) {
      searchProducts(searchTerm);
    } else {
      fetchProducts(rowsPerPage, (page - 1) * rowsPerPage);
    }
  }, [page, searchTerm, selectedCategory, fetchProducts, searchProducts, fetchProductsByCategory]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelectedCategory('');
    setPage(1); 
  }, []);
  
  const handleCategoryChange = useCallback((event: any) => {
    setSelectedCategory(event.target.value as string);
    setSearchTerm('');
    setPage(1);
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Products
        </Typography>
        <Button variant="contained" component={Link} href="/dashboard">
          Go to Dashboard
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.slug} value={category.slug}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', my: 4 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      
      {!loading && !error && (
        <Grid container spacing={4}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(total / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          disabled={!!searchTerm || !!selectedCategory}
        />
      </Box>
    </Container>
  );
};

export default ProductsPage;
