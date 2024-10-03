"use server";
import { getUserById } from "@/data/user";
import Razorpay from "razorpay";
import { currentUser } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrderId = async () => {
  const authenticatedUser = await currentUser();
  const amount = 9;
  if (!authenticatedUser) {
    throw new Error("User not authenticated");
  }

  if (!authenticatedUser.id) {
    throw new Error("User id not found");
  }

  const userId = authenticatedUser.id;

  const user = await getUserById(userId);

  if (user?.Premium[0]?.active) {
    throw new Error("User is already a premium member");
  }

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: user?.email,
    payment_capture: false,
    notes: {
      user_id: userId,
    },
  });
  return order;
};
