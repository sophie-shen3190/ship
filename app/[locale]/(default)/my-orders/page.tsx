import { getOrdersByPaidEmail, getOrdersByUserUuid } from "@/models/order";
import { getUserEmail, getUserUuid } from "@/services/user";

import Table from "@/components/blocks/table";
import { TableColumn } from "@/types/blocks/table";
import moment from "moment";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function MyOrders() {
  const user_uuid = await getUserUuid();
  const user_email = await getUserEmail();

  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/my-orders`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  let orders = await getOrdersByUserUuid(user_uuid);
  if (!orders || orders.length === 0) {
    orders = await getOrdersByPaidEmail(user_email);
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-md py-24">
        <p className="text-md text-primary mt-8">* No orders found.</p>
      </div>
    );
  }

  const columns: TableColumn[] = [
    { name: "order_no", title: "Order No" },
    { name: "paid_email", title: "Email" },
    { name: "product_name", title: "Product Name" },
    {
      name: "amount",
      title: "Amount",
      callback: (item: any) =>
        `${item.currency.toUpperCase() === "CNY" ? "¥" : "$"} ${
          item.amount / 100
        }`,
    },
    {
      name: "paid_at",
      title: "Paid At",
      callback: (item: any) =>
        moment(item.paid_at).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <div className="max-w-full md:max-w-7xl mx-auto px-8 py-16">
      <h1 className="text-3xl text-center font-semibold mb-8">My Orders</h1>
      <Table columns={columns} data={orders} />
      <p className="text-sm text-muted-foreground mt-8">
        * You will receive an email with ShipAny's code when it is ready.
        <br />
        Any questions, please contact us.
      </p>
    </div>
  );
}
