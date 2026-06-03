import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Dimension } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") || "";
  const dimension = req.nextUrl.searchParams.get("dimension") || "";

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(dimension
        ? {
            dimension: dimension as Dimension,
          }
        : {}),
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const product = await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      description: data.description || null,
      dimension: data.dimension,
      baseUnit: data.baseUnit,
      stockBaseQty: data.stockBaseQty.toString(),
      pricePerBaseQty: data.pricePerBaseQty.toString(),
    },
  });

  return NextResponse.json(product, { status: 201 });
}
