import { findOrderByOrderNo, updateOrderStatus } from "@/models/order";

import Stripe from "stripe";
import { getIsoTimestr } from "@/lib/time";

export async function handleOrderSession(session_id: string) {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (
      !session ||
      !session.metadata ||
      !session.metadata.order_no ||
      session.payment_status !== "paid"
    ) {
      throw new Error("invalid session");
    }

    const order_no = session.metadata.order_no;
    const paid_email =
      session.customer_details?.email || session.customer_email || "";
    const paid_detail = JSON.stringify(session);

    const order = await findOrderByOrderNo(order_no);
    if (!order || order.status !== "created") {
      throw new Error("invalid order");
    }

    const paid_at = getIsoTimestr();
    await updateOrderStatus(order_no, "paid", paid_at, paid_email, paid_detail);
  } catch (e) {
    throw e;
  }
}
