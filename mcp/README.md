# Minh Tấn Academy - MCP Server

Đây là MCP Server đóng vai trò "cánh tay" cho AI Agent (goClaw), cho phép Agent tương tác trực tiếp với Database `brain.db` của hệ thống thông qua Telegram.

## Các tính năng (Tools)
1. `get_recent_orders`: Xem đơn hàng mới nhất
2. `get_revenue_report`: Báo cáo doanh thu
3. `update_product_info`: Cập nhật giá/tên sản phẩm
4. `get_customer_info`: Tra cứu khách hàng
5. `confirm_order_manual`: Xác nhận thủ công đơn hàng

## Hướng dẫn Deploy lên VPS

Đảm bảo bạn đã SSH vào VPS và vào thư mục `/opt/my-website`.

### 1. Tạo Systemd Service
Tạo file `/etc/systemd/system/mcp-server.service`:
```ini
[Unit]
Description=MCP Server for AI Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/my-website
ExecStart=/usr/bin/node mcp/mcp_server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### 2. Kích hoạt Service
```bash
systemctl daemon-reload
systemctl enable mcp-server
systemctl start mcp-server
systemctl status mcp-server
```

## Kết nối với goClaw
- Mở Dashboard goClaw
- Thêm MCP Server mới
- Transport: `streamable-http`
- URL: `http://127.0.0.1:3001/mcp`
- Prefix: `biz`
