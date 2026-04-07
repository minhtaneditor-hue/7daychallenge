const templates = {
    day0: (name) => ({
        subject: "🎉 Chào mừng bạn đến với Thử thách 7 Ngày Boyfriend Camera!",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <h2 style="color: #4CAF50;">Xin chào ${name}!</h2>
                <p>Chúc mừng bạn đã chính thức tham gia vào hành trình biến chiếc điện thoại thành "vũ khí" chụp ảnh đỉnh cao.</p>
                <p><strong>Ngày hôm nay (Day 0):</strong> Hãy chuẩn bị tâm lý và kiểm tra thiết bị của bạn. Bài học chính thức đầu tiên sẽ được gửi vào sáng mai nhé!</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                    <p><strong>Lưu ý:</strong> Hãy lưu địa chỉ email này vào danh sách ưu tiên để không bỏ lỡ bất kỳ bài học nào trong 7 ngày tới.</p>
                </div>
                <p>Hẹn gặp lại bạn vào sáng mai!</p>
                <p>-- <br><strong>Minh Tấn</strong></p>
                <p style="font-size: 0.9rem; color: #888;">#BoyfriendCameraChallenge</p>
            </div>
        `
    }),
    day1: (name) => ({
        subject: "Day 1 – Chỉnh góc này, mặt sẽ nhỏ lại ngay",
        html: wrapContent(name, 1, "Chụp ảnh không làm mặt to", 
            "Sai lầm phổ biến nhất khi đàn ông chụp ảnh: để camera ngang mặt. Điều này làm mặt to, cằm bè và ảnh kém đẹp.",
            ["Đứng cách người mẫu khoảng 1.5m – 2m", "Nâng camera cao hơn mắt một chút", "Nghiêng nhẹ camera xuống"],
            "Chụp 2 tấm: Tấm 1 camera ngang mặt. Tấm 2 camera cao hơn mắt. So sánh kết quả, bạn sẽ thấy mặt nhỏ hơn ngay.")
    }),
    day2: (name) => ({
        subject: "Day 2 – Mẹo khiến chân dài hơn ngay",
        html: wrapContent(name, 2, "Làm chân dài hơn ngay lập tức",
            "Chân ngắn trong ảnh thường do camera ngang người.",
            ["Hạ camera xuống thấp hơn eo", "Nghiêng camera lên nhẹ", "Chụp dọc"],
            "Chụp 2 tấm: Tấm 1 camera ngang người. Tấm 2 camera thấp hơn eo. Chân sẽ dài hơn rõ rệt.")
    }),
    day3: (name) => ({
        subject: "Day 3 – Tìm ánh sáng đẹp trong 10 giây",
        html: wrapContent(name, 3, "Chụp da đẹp hơn ngay",
            "Ánh sáng quyết định 80% ảnh đẹp. Bạn không cần đèn cầu kỳ.",
            ["Tìm cửa sổ hoặc ánh sáng ngoài trời", "Để ánh sáng chiếu vào mặt", "Tránh ánh sáng từ trên đầu"],
            "Chụp 2 tấm: Tấm 1 dưới đèn trần. Tấm 2 gần cửa sổ. So sánh xem da đẹp hơn thế nào.")
    }),
    day4: (name) => ({
        subject: "Day 4 – Pose đơn giản giúp ảnh tự nhiên",
        html: wrapContent(name, 4, "1 pose khiến ảnh tự nhiên",
            "Khi đứng yên chụp hình, ảnh thường bị cứng.",
            ["Nhờ người mẫu bước đi chậm", "Bạn chụp liên tục (Burst mode)", "Chọn tấm đẹp nhất"],
            "Chụp 5 tấm khi người mẫu đang bước. Bạn sẽ thấy ảnh tự nhiên hơn hẳn.")
    }),
    day5: (name) => ({
        subject: "Day 5 – Đừng đặt người giữa ảnh",
        html: wrapContent(name, 5, "Bố cục khiến ảnh trông chuyên nghiệp",
            "Đặt người giữa ảnh thường làm ảnh trông nghiệp dư.",
            ["Mở camera", "Đặt người lệch sang trái hoặc phải", "Chừa khoảng trống (Negative space)"],
            "Chụp 2 tấm: Tấm 1 đặt giữa. Tấm 2 đặt lệch. Bạn sẽ thấy ảnh đẹp hơn ngay.")
    }),
    day6: (name) => ({
        subject: "Day 6 – Góc chụp cafe dễ đẹp nhất",
        html: wrapContent(name, 6, "Chụp ảnh cafe đẹp ngay",
            "Sai lầm phổ biến: chụp từ chính diện.",
            ["Đứng chéo bàn", "Hạ camera nhẹ", "Chụp nghiêng"],
            "Chụp 3 tấm: Góc chính diện, góc chéo và góc gần. So sánh sự khác biệt.")
    }),
    day7: (name) => ({
        subject: "Day 7 – Bài test Boyfriend Camera",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <h2 style="color: #4CAF50;">Day 7: Tấm ảnh hoàn chỉnh</h2>
                <p>Hôm nay bạn sẽ kết hợp tất cả các kỹ thuật đã học!</p>
                <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p><strong>Công thức:</strong> 1. Ánh sáng tự nhiên | 2. Camera hơi cao | 3. Pose bước đi | 4. Bố cục lệch</p>
                </div>
                <h3>Nhiệm vụ cuối:</h3>
                <p>Chụp 1 tấm ảnh hoàn chỉnh. Sau đó gửi cho bạn gái. Nếu cô ấy nói: "Đẹp đó." -> Chúc mừng, bạn đã pass challenge!</p>
                
                <div style="margin-top: 40px; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; text-align: center;">
                    <h3>BƯỚC TIẾP THEO</h3>
                    <p>Nếu bạn muốn chụp ảnh đẹp hơn, xây Instagram có style riêng hoặc chỉnh màu chuyên nghiệp, hãy tham gia:</p>
                    <a href="#" style="display: inline-block; background: #4CAF50; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 30px; font-weight: bold;">13 ngày Instagram Photobook</a>
                </div>
                
                <p style="margin-top: 30px;">Hân hạnh đồng hành cùng bạn,<br><strong>Minh Tấn</strong></p>
                <p style="font-size: 0.9rem; color: #888;">#BoyfriendCameraChallenge</p>
            </div>
        `
    })
};

function wrapContent(name, day, title, problem, steps, mission) {
    const stepsHtml = steps.map((s, i) => `<li><strong>Bước ${i+1}:</strong> ${s}</li>`).join("");
    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
            <h2 style="color: #4CAF50;">Day ${day}: ${title}</h2>
            <p>Xin chào ${name},</p>
            
            <p><strong>Vấn đề:</strong> ${problem}</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                <h3 style="margin-top:0;">Làm theo 3 bước:</h3>
                <ul style="padding-left: 20px;">
                    ${stepsHtml}
                </ul>
            </div>
            
            <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Nhiệm vụ (5-10 phút):</strong> ${mission}</p>
            </div>
            
            <p>Hãy thực hành ngay và đăng ảnh với hashtag bạn nhé!</p>
            <p>Hẹn gặp lại vào sáng mai,<br><strong>Minh Tấn</strong></p>
            <p style="font-size: 0.9rem; color: #888;">#BoyfriendCameraChallenge</p>
        </div>
    `;
}

export default templates;
