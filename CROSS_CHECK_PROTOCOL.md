# 🛡️ ULTIMATE CROSS-CHECK PROTOCOL (SQLite CRM Edition)

This protocol represents the "Professional Standard" for maintaining the 7-Day Challenge Automation System.

## 1. Environment & Database
- [ ] **package.json**: Must have `"type": "module"` and `resend` dependency.
- [ ] **brain.db**: Verify SQLite database exists and contains `customers`, `products`, `orders`.
- [ ] **vercel.json**: Cron job must be scheduled for `0 1 * * *` (8 AM VN).
- [ ] **Cleanup**: No `._` files or system junk in the repository.

## 2. Credentials & Connectivity
- [ ] **Resend**: Verify API key is valid and sender `marketing@minhtanacademy.com` is used.
- [ ] **Database Access**: Verify `api/_db.js` utility works with `/usr/bin/sqlite3`.
- [ ] **Telegram**: Verify Bot Token and Admin Chat ID (7384174497).

## 3. Automation Logic
- [ ] **Date calculation**: Use `Asia/Ho_Chi_Minh` timezone exclusively.
- [ ] **Status Flow**: Ensure `success` -> `DAY1` -> ... -> `DAY7` -> `DONE` transitions occur in `orders` table.
- [ ] **Stock Management**: Verify product stock decrements upon successful payment.

## 4. Email Templates
- [ ] **Placeholders**: Verify `${name}` and `${phone}` are used correctly in `emails-templates.js`.
- [ ] **Links**: Verify Facebook Group and Payment links are active.
- [ ] **Base Template**: Verify aesthetics and layout look premium.

## 5. Deployment & Webhook
- [ ] **Git Sync**: Local changes must be pushed to `main`.
- [ ] **SePay Webhook**: Pointed to `https://yourdomain.com/api/sepay-webhook`.
- [ ] **Health Check**: `/api/health` must return `200 OK`.

---
*Created by Antigravity AI Coding Assistant*
