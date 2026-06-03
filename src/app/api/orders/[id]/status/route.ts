import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { orderStatusSchema } from "@/lib/validations";

type Params = {
  params: Promise<{ id: string }>;
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

  const updated = await prisma.order.updateMany({
    where: {
      id,
      status: "PENDING",
    },
    data: {
      status: data.status,
    },
  });

  if (updated.count === 0) {
    return NextResponse.json(
      { error: "Only pending orders can be updated" },
      { status: 409 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id },
  });

  return NextResponse.json(order);
}
