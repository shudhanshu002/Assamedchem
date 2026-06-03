import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, context: Params) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();

  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      sku: data.sku,
      description: data.description || null,
      dimension: data.dimension,
      baseUnit: data.baseUnit,
      stockBaseQty: data.stockBaseQty.toString(),
      pricePerBaseQty: data.pricePerBaseQty.toString(),
      isActive: data.isActive ?? true,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, context: Params) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
