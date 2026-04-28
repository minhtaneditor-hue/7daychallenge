import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { query, execute } from "../api/_lib/db.js";

const server = new McpServer({
  name: "minh-tan-academy-mcp",
  version: "1.0.0",
});

// 1. get_recent_orders
server.tool(
  "get_recent_orders",
  "Lấy danh sách đơn hàng mới nhất (chờ thanh toán hoặc thành công)",
  {
    limit: z.number().optional().describe("Số lượng đơn hàng cần lấy (mặc định 5)"),
    status: z.enum(["pending", "success"]).optional().describe("Trạng thái đơn hàng"),
  },
  async ({ limit = 5, status }) => {
    let sql = 'SELECT o.id, o.amount, o.status, c.fullname, c.phone, p.name as product_name FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id';
    const params = [];
    if (status) {
        sql += ' WHERE o.status = ?';
        params.push(status);
    }
    sql += ' ORDER BY o.id DESC LIMIT ?';
    params.push(limit);
    
    const orders = await query(sql, params);
    return {
      content: [{ type: "text", text: JSON.stringify(orders, null, 2) }],
    };
  }
);

// 2. get_revenue_report
server.tool(
  "get_revenue_report",
  "Báo cáo tổng doanh thu và tổng số đơn hàng đã thành công",
  {},
  async () => {
    const report = await query('SELECT SUM(amount) as total_revenue, COUNT(*) as total_orders FROM orders WHERE status = "success"');
    return {
      content: [{ type: "text", text: JSON.stringify(report[0], null, 2) }],
    };
  }
);

// 3. update_product_info
server.tool(
  "update_product_info",
  "Cập nhật thông tin sản phẩm/khóa học (giá, tên) trên website",
  {
    product_id: z.number().describe("ID sản phẩm (mặc định là 1)"),
    new_price: z.number().optional().describe("Giá mới (nếu có)"),
    new_name: z.string().optional().describe("Tên mới (nếu có)"),
  },
  async ({ product_id, new_price, new_name }) => {
    const updates = [];
    const params = [];
    if (new_price !== undefined) { updates.push('price = ?'); params.push(new_price); }
    if (new_name !== undefined) { updates.push('name = ?'); params.push(new_name); }
    
    if (updates.length === 0) return { content: [{ type: "text", text: "Không có thông tin nào được cập nhật." }] };
    
    const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    params.push(product_id);
    await execute(sql, params);
    
    return {
      content: [{ type: "text", text: `Đã cập nhật sản phẩm ID ${product_id} thành công.` }],
    };
  }
);

// 4. get_customer_info
server.tool(
  "get_customer_info",
  "Tìm kiếm thông tin khách hàng bằng số điện thoại hoặc email",
  {
    search_term: z.string().describe("Số điện thoại hoặc Email cần tìm"),
  },
  async ({ search_term }) => {
    const customers = await query('SELECT * FROM customers WHERE phone LIKE ? OR email LIKE ?', [`%${search_term}%`, `%${search_term}%`]);
    if (customers.length === 0) return { content: [{ type: "text", text: "Không tìm thấy khách hàng nào." }] };
    
    // Lấy danh sách các đơn hàng của khách
    const orders = await query('SELECT id, product_id, amount, status FROM orders WHERE customer_id = ?', [customers[0].id]);
    
    return {
      content: [{ type: "text", text: JSON.stringify({ customer: customers[0], orders }, null, 2) }],
    };
  }
);

// 5. confirm_order_manual
server.tool(
  "confirm_order_manual",
  "Xác nhận một đơn hàng thành công bằng tay (chỉ đổi status sang success)",
  {
    order_id: z.number().describe("ID của đơn hàng cần xác nhận"),
  },
  async ({ order_id }) => {
    await execute('UPDATE orders SET status = "success" WHERE id = ?', [order_id]);
    return {
      content: [{ type: "text", text: `Đã xác nhận thanh toán thành công cho đơn hàng ID ${order_id}.` }],
    };
  }
);

// 🚀 Express Server Setup cho Transport
const app = express();
app.use(cors());

let transport;

app.get("/mcp/sse", async (req, res) => {
  transport = new SSEServerTransport("/mcp/message", res);
  await server.connect(transport);
});

app.post("/mcp/message", async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(503).send("No active transport. Please connect to /mcp/sse first.");
  }
});

const PORT = 3001;
// Lắng nghe trên 0.0.0.0 để cho phép kết nối qua IP Public
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 MCP Server đang chạy tại http://0.0.0.0:${PORT}/mcp`);
});
