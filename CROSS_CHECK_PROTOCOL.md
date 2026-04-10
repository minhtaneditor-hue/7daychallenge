# 🛡️ ULTIMATE CROSS-CHECK PROTOCOL

This protocol represents the "Professional Standard" for maintaining the 7-Day Challenge Automation System.

## 1. Environment & Config
- [ ] **package.json**: Must have `"type": "module"` and `resend` dependency.
- [ ] **vercel.json**: Cron job must be scheduled for `0 1 * * *` (8 AM VN).
- [ ] **Cleanup**: No `._` files or system junk in the repository.

## 2. Credentials & Connectivity
- [ ] **Resend**: Verify API key is valid and sender `marketing@minhtanacademy.com` is used.
- [ ] **Google Sheets**: Verify script URL handles `action: 'update-status'` and `fetch-all`.
- [ ] **Telegram**: Verify Bot Token and Admin Chat ID (7384174497).

## 3. Automation Logic
- [ ] **Date calculation**: Use `Asia/Ho_Chi_Minh` timezone exclusively.
- [ ] **Status Flow**: Ensure `PAID` -> `DAY_1` -> ... -> `DAY_7` transitions are permanent (no double sends).
- [ ] **Error Handling**: Every major operation must have a Telegram error alert.

## 4. Email Templates
- [ ] **Placeholders**: Verify `${name}` and `${phone}` are used correctly.
- [ ] **Links**: Verify Facebook Group and Payment links are active.
- [ ] **Base Template**: Verify aesthetics and layout look premium.

## 5. Deployment & Webhook
- [ ] **Git Sync**: Local changes must be pushed to `main`.
- [ ] **Webhook**: Telegram webhook must point to `https://7day.minhtanacademy.com/api/telegram-webhook`.
- [ ] **Health Check**: `/api/health` must return `200 OK`.

---
*Created by Antigravity AI Coding Assistant*
