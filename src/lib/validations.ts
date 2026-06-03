import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().optional().nullable(),
  dimension: z.enum(["WEIGHT", "VOLUME", "COUNT"]),
  baseUnit: z.enum(["G", "KG", "ML", "L", "UNIT"]),
  stockBaseQty: z.coerce.number().positive("Stock must be greater than zero"),
  pricePerBaseQty: z.coerce
    .number()
    .positive("Price must be greater than zero"),
  isActive: z.boolean().optional(),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().positive("Quantity must be greater than zero"),
        unit: z.enum(["G", "KG", "ML", "L", "UNIT"]),
      })
    )
    .min(1, "At least one item is required"),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});