import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { query, execute } from "../api/_lib/db.js";

function createServer() {
  const server = new McpServer({
    name: "minh-tan-academy-mcp",
    version: "1.0.0",
  });

  server.tool("get_recent_orders", "Lấy danh sách đơn hàng mới nhất", {
    limit: z.coerce.number().optional(),
    status: z.enum(["pending", "success"]).optional(),
  }, async ({ limit = 5, status }) => {
    let sql = 'SELECT o.id, o.amount, o.status, c.fullname, c.phone, p.name as product_name FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id';
    const params = [];
    if (status) { sql += ' WHERE o.status = ?'; params.push(status); }
    sql += ' ORDER BY o.id DESC LIMIT ?'; params.push(limit);
    const orders = await query(sql, params);
    return { content: [{ type: "text", text: JSON.stringify(orders, null, 2) }] };
  });

  server.tool("get_revenue_report", "Báo cáo doanh thu", {}, async () => {
    const report = await query('SELECT SUM(amount) as total_revenue, COUNT(*) as total_orders FROM orders WHERE status = "success"');
    return { content: [{ type: "text", text: JSON.stringify(report[0], null, 2) }] };
  });

  server.tool("update_product_info", "Cập nhật sản phẩm", {
    product_id: z.coerce.number(), new_price: z.coerce.number().optional(), new_name: z.string().optional()
  }, async ({ product_id, new_price, new_name }) => {
    const updates = []; const params = [];
    if (new_price !== undefined) { updates.push('price = ?'); params.push(new_price); }
    if (new_name !== undefined) { updates.push('name = ?'); params.push(new_name); }
    if (updates.length === 0) return { content: [{ type: "text", text: "No updates" }] };
    await execute(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, [...params, product_id]);
    return { content: [{ type: "text", text: `Đã cập nhật sản phẩm ID ${product_id}` }] };
  });

  server.tool("get_customer_info", "Tìm khách hàng", { search_term: z.string() }, async ({ search_term }) => {
    const customers = await query('SELECT * FROM customers WHERE phone LIKE ? OR email LIKE ?', [`%${search_term}%`, `%${search_term}%`]);
    if (customers.length === 0) return { content: [{ type: "text", text: "Không tìm thấy" }] };
    const orders = await query('SELECT id, product_id, amount, status FROM orders WHERE customer_id = ?', [customers[0].id]);
    return { content: [{ type: "text", text: JSON.stringify({ customer: customers[0], orders }, null, 2) }] };
  });

  server.tool("confirm_order_manual", "Xác nhận đơn hàng", { order_id: z.coerce.number() }, async ({ order_id }) => {
    await execute('UPDATE orders SET status = "success" WHERE id = ?', [order_id]);
    return { content: [{ type: "text", text: `Đã xác nhận thanh toán đơn ID ${order_id}` }] };
  });

  return server;
}

const app = express();
app.use(cors());
app.use(express.json());

const activeTransports = new Map();

app.get("/mcp/sse", async (req, res) => {
  const server = createServer();
  const transport = new SSEServerTransport("/mcp/message", res);
  await server.connect(transport);
  
  const sessionId = transport.sessionId;
  activeTransports.set(sessionId, transport);
  
  req.on('close', () => {
    activeTransports.delete(sessionId);
  });
});

app.post("/mcp/message", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = activeTransports.get(sessionId);
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(404).send("Transport not found");
  }
});

const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 MCP Server đang chạy tại http://0.0.0.0:${PORT}/mcp`);
});
