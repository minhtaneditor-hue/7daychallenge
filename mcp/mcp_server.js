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
    console.log(`[MCP] Call: get_recent_orders (limit=${limit}, status=${status})`);
    let sql = 'SELECT o.id, o.amount, o.status, c.fullname, c.phone, p.name as product_name FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id';
    const params = [];
    if (status) { sql += ' WHERE o.status = ?'; params.push(status); }
    sql += ' ORDER BY o.id DESC LIMIT ?'; params.push(limit);
    const orders = await query(sql, params);
    return { content: [{ type: "text", text: JSON.stringify(orders, null, 2) }] };
  });

  server.tool("get_new_orders_since_last_check", "Kiểm tra đơn hàng mới trong X phút vừa qua", {
    minutes_ago: z.coerce.number().optional()
  }, async ({ minutes_ago = 5 }) => {
    console.log(`[MCP] Call: get_new_orders_since_last_check (minutes=${minutes_ago})`);
    const sql = "SELECT o.id, o.amount, o.status, c.fullname, c.phone, p.name as product_name FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE o.created_at >= datetime('now', '-' || ? || ' minutes') ORDER BY o.id DESC";
    const orders = await query(sql, [minutes_ago]);
    
    if (orders.length === 0) {
      return { content: [{ type: "text", text: "Không có đơn hàng mới nào trong " + minutes_ago + " phút qua." }] };
    }

    return { content: [{ type: "text", text: JSON.stringify(orders, null, 2) }] };
  });

  server.tool("get_revenue_report", "Báo cáo doanh thu", {}, async () => {
    console.log(`[MCP] Call: get_revenue_report`);
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

  server.tool("send_telegram_notification", "Gửi thông báo Telegram trực tiếp cho sếp", {
    message: z.string()
  }, async ({ message }) => {
    console.log(`[MCP] Call: send_telegram_notification (msg length=${message.length})`);
    const token = '8640405490:AAE53GyTapNhcML6ZACXbBFYudRwM9GQ3HY';
    const chatId = '7384174497';
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
      });
      const data = await response.json();
      console.log(`[MCP] Telegram API Response: ${data.ok}`);
      return { content: [{ type: "text", text: data.ok ? "Đã gửi Telegram thành công qua Trợ lý." : "Lỗi: " + data.description }] };
    } catch (e) {
      console.error(`[MCP] Telegram Error: ${e.message}`);
      return { content: [{ type: "text", text: "Lỗi kết nối: " + e.message }] };
    }
  });

  return server;
}

const app = express();
app.use(cors());

const activeTransports = new Map();

app.get("/mcp/sse", async (req, res) => {
  console.log(`[MCP] New SSE Connection Request`);
  const server = createServer();
  const transport = new SSEServerTransport("/mcp/message", res);
  await server.connect(transport);
  
  const sessionId = transport.sessionId;
  console.log(`[MCP] SSE Connected. Session: ${sessionId}`);
  activeTransports.set(sessionId, transport);
  
  req.on('close', () => {
    console.log(`[MCP] SSE Connection Closed. Session: ${sessionId}`);
    activeTransports.set(sessionId, transport);
    activeTransports.delete(sessionId);
  });
});

app.post("/mcp/message", async (req, res) => {
  const sessionId = req.query.sessionId;
  console.log(`[MCP] Incoming Message. Session: ${sessionId}`);
  console.log(`[MCP] Body: ${JSON.stringify(req.body)}`);
  const transport = activeTransports.get(sessionId);
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    console.log(`[MCP] Message failed: Session ${sessionId} not found`);
    res.status(404).send("Transport not found");
  }
});

const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 MCP Server đang chạy tại http://0.0.0.0:${PORT}/mcp`);
});
