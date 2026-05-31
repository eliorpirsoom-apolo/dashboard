import clsx from "clsx";
import { orders, type Order } from "@/lib/mock-data";

const statusStyles: Record<Order["status"], string> = {
  שולם: "bg-green-100 text-green-700",
  ממתין: "bg-amber-100 text-amber-700",
  בוטל: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">הזמנות וחשבון</h1>
        <p className="text-muted">היסטוריית ההזמנות והחשבוניות שלך</p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-surface">
        <table className="w-full text-right text-sm">
          <thead className="border-b bg-accent/50 text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">מספר חשבונית</th>
              <th className="px-5 py-3 font-medium">לקוח</th>
              <th className="px-5 py-3 font-medium">תאריך</th>
              <th className="px-5 py-3 font-medium">סכום</th>
              <th className="px-5 py-3 font-medium">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-accent/30">
                <td className="px-5 py-3 font-medium">{order.id}</td>
                <td className="px-5 py-3">{order.customer}</td>
                <td className="px-5 py-3 text-muted">{order.date}</td>
                <td className="px-5 py-3 font-medium">{order.amount}</td>
                <td className="px-5 py-3">
                  <span
                    className={clsx(
                      "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusStyles[order.status],
                    )}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
