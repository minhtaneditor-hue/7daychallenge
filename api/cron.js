export default async function handler(req, res) {
    // Chỉ cho phép Vercel Cron hoặc request có Authorization (để bảo mật)
    // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return res.status(401).end('Unauthorized');
    // }

    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxlqXGgzQVl47NiiQ4A4Rmv09dCb1rEcipqK4MbyvrT7_2nLZE3403h49kArxO2bLKRyQ/exec';
    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
    const resendUrl = 'https://api.resend.com/emails';

    try {
        // 1. Lấy danh sách học viên từ Google Sheets
        const response = await fetch(GOOGLE_SHEET_URL);
        const leads = await response.json();
        
        const now = new Date();
        const sentLogs = [];

        // 2. Duyệt qua từng học viên để kiểm tra ngày
        for (const lead of leads) {
            const signupDate = new Date(lead.timestamp);
            const diffInMs = now - signupDate;
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            // Chỉ gửi từ Day 1 đến Day 7
            if (diffInDays >= 1 && diffInDays <= 7) {
                const day = diffInDays;
                
                // Gửi email bài học tương ứng
                await fetch(resendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: 'Minh Tấn <challenge@minhtanacademy.com>',
                        to: lead.email,
                        subject: `📸 THỬ THÁCH NGÀY ${day}: ${getSubject(day)}`,
                        html: getEmailHtml(day, lead.fullname)
                    })
                });
                sentLogs.push({ email: lead.email, day: day });
            }
        }

        res.status(200).json({ success: true, processed: leads.length, sent: sentLogs });
    } catch (error) {
        console.error('Cron Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

function getSubject(day) {
    const subjects = {
        1: "Tư duy bố cục và Ánh sáng",
        2: "Làm chủ Camera điện thoại",
        3: "Cách tạo dáng tự nhiên cho 'mẫu nhà'",
        4: "Bí mật của những tấm ảnh 'ngẫu hứng'",
        5: "Hậu kỳ nhanh trên điện thoại",
        6: "Kể chuyện qua khung hình",
        7: "TỔNG KẾT: Trở thành 'Camera Bạn Trai' thực thụ"
    };
    return subjects[day] || "Bài học mới từ Minh Tấn";
}

function getEmailHtml(day, name) {
    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #4CAF50;">Day ${day}: Chào ${name || 'bạn'}!</h2>
            <p>Đây là bài học tiếp theo trong chuỗi thử thách 7 ngày biến bạn thành người chụp ảnh có tâm nhất hệ mặt trời.</p>
            <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; border-left: 5px solid #4CAF50;">
                <p><strong>Nội dung hôm nay:</strong> ${getSubject(day)}</p>
                <p><em>(Tấn hãy thay nội dung bài học chi tiết của bạn vào đây nhé...)</em></p>
            </div>
            <p style="margin-top: 20px;">Hãy thực hành ngay và đừng quên khoe thành quả vào nhóm nhé!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 0.8rem; color: #999;">Bạn nhận được email này vì đã đăng ký tham gia 7 Day Boyfriend Camera.</p>
        </div>
    `;
}
