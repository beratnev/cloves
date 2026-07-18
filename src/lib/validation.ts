import { z } from 'zod'

// Email validation
export const emailSchema = z.string().email('Invalid email address')

// Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

// Phone number validation
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')

// URL validation
export const urlSchema = z.string().url('Invalid URL')

// Product validation
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name too long'),
  description: z.string().min(10, 'Description too short').max(2000, 'Description too long'),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().positive('Discount price must be positive').optional(),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  inStock: z.boolean(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image required'),
})

// Order validation
export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be positive'),
    price: z.number().positive('Price must be positive'),
  })).min(1, 'Order must contain at least one item'),
  shippingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: emailSchema,
    phone: phoneSchema.optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  paymentMethod: z.object({
    type: z.enum(['card', 'paypal']),
    cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number').optional(),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date').optional(),
    cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV').optional(),
  }),
})

// User profile validation
export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: emailSchema,
  phone: phoneSchema.optional(),
})

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Validate and sanitize user input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

// Safe JSON parse with validation
export function safeJsonParse<T>(json: string, schema: z.ZodSchema<T>): T | null {
  try {
    const data = JSON.parse(json)
    return schema.parse(data)
  } catch {
    return null
  }
}

// SQL injection prevention (basic)
export function sanitizeSqlInput(input: string): string {
  return input.replace(/['";\\]/g, '')
}

// File upload validation
export const fileUploadSchema = z.object({
  name: z.string(),
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
})
