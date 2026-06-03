import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import type { DecimalLike, OrderStatus } from "@/lib/domain";
import { orderStatusSchema } from "@/lib/validations";

type Params = {
  params: Promise<{ id: string }>;
};

type OrderItemForStock = {
  productId: string;
  baseQty: DecimalLike;
};

type OrderForStatusUpdate = {
  status: OrderStatus;
  items: OrderItemForStock[];
};

export async function PATCH(req: NextRequest, context: Params) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();

  const parsed = orderStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const existingOrder = (await tx.order.findUnique({
        where: { id },
        include: {
          items: {
            select: {
              productId: true,
              baseQty: true,
            },
          },
        },
      })) as OrderForStatusUpdate | null;

      if (!existingOrder || existingOrder.status !== "PENDING") {
        throw new Error("ORDER_NOT_PENDING");
      }

      if (data.status === "REJECTED") {
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockBaseQty: {
                increment: item.baseQty.toString(),
              },
            },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: {
          status: data.status,
        },
      });
    });

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof Error && error.message === "ORDER_NOT_PENDING") {
      return NextResponse.json(
        { error: "Only pending orders can be updated" },
        { status: 409 }
      );
    }

    throw error;
  }
}
