# LittleForest API Integration Guide

## Overview

This guide explains how to integrate the Vercel dashboard (https://litteforest.vercel.app/) with the public website (https://www.littleforest.co.ke/) through API endpoints.

## Base URL

**Production:** `https://www.littleforest.co.ke/api/integration`
**Development:** `http://localhost:5000/api/integration` (when testing locally)

## Authentication

Currently using open endpoints. In production, add API key authentication by including:
```
Authorization: Bearer YOUR_API_KEY
```

## Available Endpoints

### 1. Health Check
```
GET /api/integration/health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-17T13:45:00.000Z",
  "version": "1.0.0",
  "database": "supabase"
}
```

### 2. Get All Products
```
GET /api/integration/products
```
**Response:**
```json
[
  {
    "id": "1e94b53a-54b4-421f-809e-d7083a1beeed",
    "name": "Honey",
    "category": "Honey",
    "price": "Ksh 800",
    "description": "Organic forest honey, harvested from indigenous little forests.",
    "image_url": "data:image/jpeg;base64,...",
    "status": "active",
    "featured": false,
    "stock_quantity": 50,
    "created_at": "2025-07-17T10:30:00.000Z",
    "updated_at": "2025-07-17T10:30:00.000Z"
  }
]
```

### 3. Update Product Inventory (Single)
```
PUT /api/integration/inventory/:id
```
**Request Body:**
```json
{
  "stock_quantity": 25,
  "status": "active"
}
```
**Response:**
```json
{
  "success": true,
  "product": {
    "id": "1e94b53a-54b4-421f-809e-d7083a1beeed",
    "stock_quantity": 25,
    "status": "active",
    ...
  }
}
```

### 4. Bulk Inventory Update
```
POST /api/integration/inventory/bulk
```
**Request Body:**
```json
{
  "products": [
    {
      "id": "1e94b53a-54b4-421f-809e-d7083a1beeed",
      "stock_quantity": 10
    },
    {
      "id": "2f84c63b-65c5-532g-920f-e8194b2cfffe",
      "stock_quantity": 0
    }
  ]
}
```
**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "1e94b53a-54b4-421f-809e-d7083a1beeed",
      "success": true,
      "product": {...}
    },
    {
      "id": "2f84c63b-65c5-532g-920f-e8194b2cfffe",
      "success": true,
      "product": {...}
    }
  ]
}
```

### 5. Record Sale
```
POST /api/integration/sales
```
**Request Body:**
```json
{
  "productId": "1e94b53a-54b4-421f-809e-d7083a1beeed",
  "quantity": 2,
  "amount": 1600,
  "date": "2025-07-17T13:45:00.000Z"
}
```
**Response:**
```json
{
  "success": true,
  "sale": {
    "id": "sale-123",
    "title": "Sale - 1e94b53a-54b4-421f-809e-d7083a1beeed",
    "content": "{\"productId\":\"1e94b53a-54b4-421f-809e-d7083a1beeed\",\"quantity\":2,\"amount\":1600,\"date\":\"2025-07-17T13:45:00.000Z\"}",
    "type": "sale",
    "status": "published"
  }
}
```

## Integration Workflow

### From Vercel Dashboard → Public Website

1. **Inventory Management:**
   - When stock changes in Vercel dashboard, call `PUT /api/integration/inventory/:id`
   - For bulk updates, use `POST /api/integration/inventory/bulk`
   - Products with `stock_quantity: 0` are automatically set to `status: "out_of_stock"`

2. **Sales Recording:**
   - When a sale is made, call `POST /api/integration/sales`
   - This records the sale and automatically reduces stock quantity

3. **Product Sync:**
   - Use `GET /api/integration/products` to get current state of all products
   - Compare with your local database and sync differences

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid data)
- `404` - Not Found (product doesn't exist)
- `500` - Server Error

Error responses include:
```json
{
  "error": "Descriptive error message"
}
```

## Implementation Example (JavaScript)

```javascript
// Update inventory from Vercel dashboard
async function updateInventory(productId, stockQuantity) {
  try {
    const response = await fetch(`https://www.littleforest.co.ke/api/integration/inventory/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock_quantity: stockQuantity,
        status: stockQuantity > 0 ? 'active' : 'out_of_stock'
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log('Inventory updated successfully');
    } else {
      console.error('Failed to update inventory:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Record a sale
async function recordSale(productId, quantity, amount) {
  try {
    const response = await fetch('https://www.littleforest.co.ke/api/integration/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        quantity,
        amount,
        date: new Date().toISOString()
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log('Sale recorded successfully');
    }
  } catch (error) {
    console.error('Failed to record sale:', error);
  }
}
```

## Database Schema

The integration uses Supabase with the following relevant tables:

- **products**: Main product catalog
- **content**: Used for storing sales records (type: 'sale')

## Next Steps

1. Test all endpoints with your Vercel application
2. Implement proper API key authentication
3. Add webhook support for real-time updates
4. Set up monitoring and logging for the integration

## Support

For technical support with the integration, contact the development team.