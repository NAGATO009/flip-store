import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, CircularProgress, Chip, useMediaQuery, useTheme 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { getProducts, addProduct } from '../services/api';

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: '', type: 'Apparel', inventory: 0, status: 'In Stock', price: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await addProduct(newProduct);
      fetchProducts(true);
      setOpen(false);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 220 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'inventory', headerName: 'Inventory', width: 120, type: 'number' },
    { 
        field: 'status', 
        headerName: 'Status', 
        width: 150,
        renderCell: (params) => {
            const color = params.value === 'In Stock' ? 'success' : params.value === 'Low Stock' ? 'warning' : 'error';
            return <Chip label={params.value} color={color} size="small" />;
        }
    },
    { field: 'price', headerName: 'Price ($)', width: 120, type: 'number' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Typography variant="h4" fontWeight="700" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>Inventory</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          New Product
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
      ) : isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {products.map((product) => (
            <Box key={product._id} sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2, boxShadow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1rem', flex: 1, pr: 1 }}>{product.title}</Typography>
                <Chip label={product.status} color={product.status === 'In Stock' ? 'success' : product.status === 'Low Stock' ? 'warning' : 'error'} size="small" />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Typography variant="body2">{product.type}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Inventory</Typography>
                  <Typography variant="body2">{product.inventory}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Price</Typography>
                  <Typography variant="body2" fontWeight="600" sx={{ color: 'secondary.main' }}>${product.price}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ height: 600, width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            getRowId={(row) => row._id}
            disableSelectionOnClick
            sx={{ border: 0 }}
          />
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent sx={{ minWidth: { xs: 'auto', sm: 400 } }}>
          <TextField 
            fullWidth label="Product Title" variant="outlined" sx={{ mt: 2 }} 
            onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
          />
          <TextField 
            fullWidth label="Category" variant="outlined" sx={{ mt: 2 }} 
            onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
          />
          <TextField 
            fullWidth label="Initial Stock" type="number" variant="outlined" sx={{ mt: 2 }} 
            onChange={(e) => setNewProduct({...newProduct, inventory: parseInt(e.target.value)})}
          />
          <TextField 
            fullWidth label="Price ($)" type="number" variant="outlined" sx={{ mt: 2 }} 
            onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <Button onClick={() => setOpen(false)} fullWidth sx={{ order: { xs: 2, sm: 1 } }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!newProduct.title} fullWidth sx={{ order: { xs: 1, sm: 2 } }}>Save Product</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
