const templates = {
    day0: (name) => ({
        subject: "🎉 Chào mừng bạn đến với Thử thách 7 Ngày Boyfriend Camera!",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4CAF50;">Xin chào ${name}!</h2>
                <p>Chúc mừng bạn đã chính thức tham gia vào hành trình biến chiếc điện thoại thành "vũ khí" chụp ảnh đỉnh cao.</p>
                <p><strong>Ngày hôm nay (Day 0):</strong> Hãy chuẩn bị tâm lý và kiểm tra thiết bị của bạn. Bài học chính thức đầu tiên sẽ được gửi vào sáng mai nhé!</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Lưu ý:</strong> Hãy lưu địa chỉ email này vào danh sách ưu tiên để không bỏ lỡ bất kỳ bài học nào trong 7 ngày tới.</p>
                </div>
                <p>Hẹn gặp lại bạn vào sáng mai!</p>
                <p>-- <br><strong>Minh Tấn</strong></p>
            </div>
        `
    }),
    day1: (name) => ({
        subject: "📸 Day 1: Tư duy bố cục và Ánh sáng cơ bản",
        html: `<p>Xin chào ${name}, đây là bài học ngày thứ nhất...</p>`
    }),
    // ... placeholders for days 2-7
    generic: (day, name) => ({
        subject: `📸 Day ${day}: Thử thách Boyfriend Camera tiếp tục!`,
        html: `<p>Xin chào ${name}, đây là bài học ngày thứ ${day} của bạn. Hãy kiên trì nhé!</p>`
    })
};

export default templates;
