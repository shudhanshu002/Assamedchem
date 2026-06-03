import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma, Unit } from "@prisma/client";
import Decimal from "decimal.js";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getAllowedUnits, toBaseQuantity } from "@/lib/units";
import { orderSchema } from "@/lib/validations";

type OrderItemInput = {
  productId: string;
  orderQty: string;
  orderUnit: Unit;
  baseQty: string;
  pricePerBaseQty: string;
  lineTotal: string;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const orderItems: OrderItemInput[] = [];
  let totalAmount = new Decimal(0);

  for (const item of data.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Invalid product selected" },
        { status: 400 }
      );
    }

    const orderUnit = item.unit as Unit;
    const allowedUnits = getAllowedUnits(product.dimension);

    if (!allowedUnits.includes(orderUnit)) {
      return NextResponse.json(
        { error: `Invalid unit for ${product.name}` },
        { status: 400 }
      );
    }

    const orderQty = new Decimal(item.quantity);

    if (orderQty.lte(0)) {
      return NextResponse.json(
        { error: "Quantity must be greater than zero" },
        { status: 400 }
      );
    }

    const baseQty = toBaseQuantity(item.quantity, orderUnit);

    if (baseQty.gt(product.stockBaseQty.toString())) {
      return NextResponse.json(
        { error: `Insufficient stock for ${product.name}` },
        { status: 400 }
      );
    }

    const lineTotal = baseQty.mul(product.pricePerBaseQty.toString());
    totalAmount = totalAmount.add(lineTotal);

    orderItems.push({
      productId: product.id,
      orderQty: orderQty.toString(),
      orderUnit,
      baseQty: baseQty.toString(),
      pricePerBaseQty: product.pricePerBaseQty.toString(),
      lineTotal: lineTotal.toString(),
    });
  }

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || new Decimal(item.baseQty).gt(product.stockBaseQty.toString())) {
        throw new Error("Insufficient stock");
      }

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockBaseQty: {
            decrement: item.baseQty,
          },
        },
      });
    }

    return tx.order.create({
      data: {
        userId: session.user.id,
        totalAmount: totalAmount.toString(),
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where:
      session.user.role === "ADMIN"
        ? {}
        : {
            userId: session.user.id,
          },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}