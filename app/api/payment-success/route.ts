import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not authenticated" });
  }

  if (!user.id) {
    return NextResponse.json({ error: "User not authenticated" });
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" });
  }

  const { razorpay_payment_id, razorpay_order_id, amount } = body;

  if (!razorpay_payment_id || !razorpay_order_id || !amount) {
    return NextResponse.json({ error: "Invalid request" });
  }

  if (dbUser.Premium[0]?.active) {
    return NextResponse.json({ error: "User is already a premium member" });
  }

  try {
    const userId = dbUser.id;

    await prisma.order.create({
      data: {
        userId: userId,
        total: amount,
      },
    });

    const premiumRecord = await prisma.premium.findUnique({
      where: { userId: userId },
    });

    if (!premiumRecord) {
      await prisma.premium.create({
        data: {
          userId: userId,
          active: true,
        },
      });
    } else {
      await prisma.premium.update({
        where: {
          userId: userId,
        },
        data: {
          active: true,
        },
      });
    }

    return NextResponse.json({
      success: "Payment successful",
    });
  } catch {
    return NextResponse.json({ error: "Failed to complete payment" });
  }
}
