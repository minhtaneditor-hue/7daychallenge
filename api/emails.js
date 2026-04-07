const COMMUNITY_LINK = "https://www.facebook.com/groups/26557378780561721";

const templates = {
    // EMAIL CHÀO MỪNG (DAY 0)
    day0: (name) => ({
        subject: "[Welcome] Đã đến lúc chiếc iPhone 30 triệu của bạn thôi \"làm cảnh\" 📸",
        html: baseTemplate(name, `
            <h2 style="color: #06403D; font-size: 24px; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">📩 BIẾN IPHONE 30 TRIỆU THÀNH "VŨ KHÍ" HẠNH PHÚC</h2>
            <p>Chào ${name}, tôi là Minh Tấn.</p>
            <p>Chúc mừng bạn đã chính thức có mặt tại thử thách <b>7 Day Boyfriend Camera</b>. Việc bạn đọc email này cho thấy bạn không muốn tiếp tục là một người "tàng hình" trên mạng xã hội hay một "phó nháy" luôn khiến người thương phải thở dài.</p>
            
            <div style="background: #fdf6e3; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h4 style="margin: 0; color: #b8860b;">🎯 Lý do thử thách này ra đời</h4>
                <p style="margin: 10px 0 0 0; font-size: 0.95rem;">Rất nhiều người đàn ông sở hữu thiết bị đắt tiền nhất nhưng lại gặp lỗi "hệ thống" trong cách quan sát. Thử thách này giúp bạn lấy lại sự tự tin và làm chủ thiết bị đang nằm trong túi mình.</p>
            </div>

            <h3 style="color: #06403D;">🧠 Bạn sẽ học được gì?</h3>
            <ul style="padding-left: 20px;">
                <li><b>Tư duy quan sát:</b> Cách nhìn thấy "góc vàng" ở mọi nơi.</li>
                <li><b>Kiểm soát bối cảnh:</b> Điều phối ánh sáng và chiều sâu.</li>
                <li><b>Sự tinh gọn:</b> Chỉ 5 phút thực hành mỗi ngày.</li>
            </ul>

            <h3 style="color: #06403D;">🏆 Kết quả sau 7 ngày</h3>
            <p>✅ <b>Sự công nhận:</b> Thấy nụ cười tự hào của cô ấy khi đăng ảnh bạn chụp.</p>
            <p>✅ <b>Tài sản số:</b> Hiểu thế nào là một bức ảnh có "gu".</p>
            <p>✅ <b>Phần quà 10 Triệu:</b> Cơ hội nhận khoá học <b>21 Ngày Video Tài Sản</b> cho người xuất sắc nhất.</p>

            <p>Hành trình bắt đầu vào sáng mai với bài học đầu tiên: <i>"Chỉnh góc này, mặt sẽ nhỏ lại ngay"</i>.</p>
            <p>Hẹn gặp bạn ngày mai!</p>
        `)
    }),

    // DAY 1
    day1: (name) => ({
        subject: "[Day 1] Tại sao chiếc iPhone 30 triệu lại biến mặt cô ấy thành... hình tròn?",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🤳 DAY 1: Tuyệt chiêu "gọt mặt" V-line không cần dùng App</h2>
            <p>Chào ${name},</p>
            <p>Rất nhiều người thắc mắc: "Tại sao điện thoại xịn, mẫu đẹp mà ảnh ra nhìn mặt cứ bị thô?" Câu trả lời là <b>méo hình</b> do ống kính góc rộng.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="background: #06403D; color: white;">
                        <th style="padding: 12px; border: 1px solid #ddd;">Bước</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Kỹ Thuật</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Tại Sao?</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">1</td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><b>Lùi xa 2m</b></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">Tránh méo hình. Dùng <b>Zoom 2x/3x</b> để cận cảnh.</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">2</td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><b>Độ cao Trán</b></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">Nâng máy cao bằng tầm trán mẫu để giấu nọng cằm.</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">3</td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><b>Nghiên 15°</b></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">Chúi nhẹ đầu máy xuống để tạo hiệu ứng V-Line.</td>
                    </tr>
                </tbody>
            </table>

            ${missionBox(1, "Chụp 2 tấm: Tấm 1 chụp ngang miệng (lỗi). Tấm 2 áp dụng kỹ thuật 3 bước tên.", "#ngay1")}
            ${communityButton()}
        `)
    }),

    // DAY 2
    day2: (name) => ({
        subject: "[Day 2] Mẹo khiến chân dài miên man (không cần dùng app kéo)",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🦵 DAY 2: Tuyệt chiêu "hack" chân dài 1.1m trong 3 giây</h2>
            <p>Chào ${name}, sai lầm của 90% đàn ông là cầm máy ngang ngực/bụng. Điều này làm thân trên to ra và chân bị ngắn lại.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="background: #06403D; color: white;">
                        <th style="padding: 12px; border: 1px solid #ddd;">Bước</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hành Động</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hiệu Quả</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">1</td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><b>Hạ thấp camera</b></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">Hạ tay xuống ngang hông hoặc eo người mẫu.</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">2</td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><b>Độ nghiêng 10°</b></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">Ngửa màn hình điện thoại hướng về phía mình một chút.</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">3</td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><b>Chân sát mép</b></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">Căn bàn chân mẫu chạm vào mép dưới khung hình.</td>
                    </tr>
                </tbody>
            </table>

            ${missionBox(2, "Chụp 2 tấm so sánh: Ngang ngực vs Hạ thấp máy + sát mép.", "#ngay2")}
            ${communityButton()}
        `)
    }),

    // DAY 3
    day3: (name) => ({
        subject: "[Day 3] Tại sao ảnh bạn chụp luôn làm cô ấy trông... mệt mỏi?",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">✨ DAY 3: Bí mật "Ánh sáng triệu đô" cho làn da mịn màng</h2>
            <p>Chào ${name}, ánh sáng từ trên đỉnh đầu (đèn trần) sẽ tạo ra quầng thâm mắt và bóng mặt thô. Chúng ta cần <b>Ánh sáng hướng mặt</b>.</p>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><b>1. Cửa sổ vàng:</b> Tìm nơi có ánh sáng tự nhiên mềm mại.</p>
                <p><b>2. Xoay 180°:</b> Mẫu hướng mặt ra cửa sổ, bạn đứng lưng dựa vào cửa sổ.</p>
                <p><b>3. Điểm sáng Catchlight:</b> Đảm bảo thấy chấm sáng trong mắt mẫu.</p>
            </div>

            ${missionBox(3, "Chụp cô ấy dưới đèn trần và so sánh với ảnh chụp gần cửa sổ.", "#ngay3")}
            ${communityButton()}
        `)
    }),

    // DAY 4
    day4: (name) => ({
        subject: "[Day 4] Bí kíp để cô ấy không bao giờ bị \"đơ\" trước ống kính",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🚶‍♀️ DAY 4: Tuyệt chiêu Pose ảnh "diễn như không diễn"</h2>
            <p>Chào ${name}, đừng bắt mẫu đứng im như khúc gỗ. Cảm xúc nằm ở sự chuyển động.</p>
            
            <div style="border-left: 5px solid #FFD700; padding: 15px; background: #fffaf0; margin: 20px 0;">
                <p><b>Kỹ Thuật BURST MODE:</b></p>
                <p>1. Nhờ cô ấy bước đi chậm hoặc xoay người.</p>
                <p>2. Nhấn giữ nút chụp (hoặc vuốt trái) để chụp liên tục 20 tấm/giây.</p>
                <p>3. Chọn khoảnh khắc "vàng" (tóc bay, nụ cười tự nhiên nhất).</p>
            </div>

            ${missionBox(4, "Chụp ảnh khi cô ấy đang bước đi bằng chế độ Burst.", "#ngay4")}
            ${communityButton()}
        `)
    }),

    // DAY 5
    day5: (name) => ({
        subject: "[Day 5] Đừng đặt người vào giữa ảnh nếu muốn trông chuyên nghiệp",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">📐 DAY 5: Biến ảnh điện thoại thành "ảnh bìa tạp chí"</h2>
            <p>Chào ${name}, hãy dùng <b>Quy tắc 1/3</b> để tạo "khoảng thở" cho bức ảnh sang hơn.</p>
            
            <div style="background: #f4f4f4; padding: 20px; border-radius: 10px;">
                <p>1. <b>Bật Grid:</b> Vào cài đặt Camera, bật chế độ Lưới.</p>
                <p>2. <b>Vị trí Vàng:</b> Đặt mẫu vào đường kẻ lệch trái hoặc lệch phải.</p>
                <p>3. <b>Dọn Rác:</b> Quét nhanh 4 góc ảnh, loại bỏ cột điện, túi rác phông nền.</p>
            </div>

            ${missionBox(5, "Chụp ảnh mẫu nằm trên đường lưới 1/3 với phông nền sạch.", "#ngay5")}
            ${communityButton()}
        `)
    }),

    // DAY 6
    day6: (name) => ({
        subject: "[Day 6] Tại sao ảnh Cafe của bạn trông... nhạt nhẽo?",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">☕ DAY 6: Góc chụp Cafe "vạn người mê"</h2>
            <p>Chào ${name}, đừng chụp thẳng từ trên xuống. Hãy tạo chiều sâu không gian.</p>
            
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 15px;"><b>📐 Góc chéo 45°:</b> Đứng lệch sang một bên bàn để lấy đường dẫn.</li>
                <li style="margin-bottom: 15px;"><b>✨ Hạ tầm mắt:</b> Đưa camera xuống ngang tầm ly cafe hoặc hâm hông mẫu.</li>
                <li style="margin-bottom: 15px;"><b>🖼️ Kỹ thuật Layering:</b> Để một vật nhỏ cạnh ống kính để làm mờ nhẹ tiền cảnh.</li>
            </ul>

            ${missionBox(6, "Chụp ảnh Cafe với ít nhất 1 yếu tố chiều sâu (góc chéo hoặc layering).", "#ngay6")}
            ${communityButton()}
        `)
    }),

    // DAY 7
    day7: (name) => ({
        subject: "[Day 7] Tấm ảnh \"Masterpiece\" thay lời muốn nói",
        html: baseTemplate(name, `
            <h2 style="color: #06403D; text-align: center;">🏆 BÀI THI CUỐI CÙNG</h2>
            <p>Chào bạn, chúc mừng bạn đã đi đến ngày cuối cùng. Bạn đã sở hữu 6 mảnh ghép quan trọng nhất. 🧩</p>
            
            <div style="border: 2px dashed #FFD700; padding: 20px; border-radius: 15px; background: #fffcf0;">
                <p><b>💥 Kỹ thuật TỔNG LỰC ADVISOR:</b></p>
                <p>1. Bố cục 1/3 + Dọn rác (Day 5)</p>
                <p>2. Hạ máy ngang eo + Chúi 15° (Day 2 & 1)</p>
                <p>3. Ánh sáng tự nhiên (Day 3) + Burst Mode (Day 4)</p>
            </div>

            <p style="margin-top: 25px;">Hành trình kết thúc, nhưng con đường biến Smartphone thành tài sản số của bạn chỉ mới bắt đầu.</p>
            
            ${missionBox("CUỐI", "Chụp 1 tấm ảnh Masterpiece hội tụ đủ các yếu tố. Gửi cho cô ấy và xem phản hồi!", "#ngay7")}
            
            <div style="background: #06403D; color: white; padding: 25px; border-radius: 15px; text-align: center; margin-top: 30px;">
                <h3 style="margin-top: 0;">🎁 CƠ HỘI NHẬN QUÀ 10.000.000 VNĐ</h3>
                <p>Đăng hành trình 7 ngày và ảnh tốt nghiệp kèm hashtag để tham gia xét duyệt quà tặng. Kết quả sẽ báo qua email!</p>
                ${communityButton()}
            </div>
        `)
    })
};

// --- HELPER FUNCTIONS FOR CLEANER CODE ---

function baseTemplate(name, body) {
    return `
        <div style="background: #f4f4f4; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <div style="background: #06403D; padding: 25px; text-align: center; border-bottom: 4px solid #FFD700;">
                    <h1 style="color: white; margin: 0; font-size: 20px; letter-spacing: 2px;">BOYFRIEND CAMERA CHALLENGE</h1>
                </div>
                <div style="padding: 30px 40px; color: #333; line-height: 1.7; font-size: 16px;">
                    <p style="font-size: 18px;">Xin chào <b>${name}</b>,</p>
                    ${body}
                    <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 30px; text-align: center;">
                        <p style="margin: 0; font-weight: bold; color: #06403D;">Minh Tấn</p>
                        <p style="margin: 0; color: #888; font-size: 14px;">Advisor - Minh Tấn Academy</p>
                    </div>
                </div>
            </div>
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
                © 2024 Minh Tần Academy. Đã đăng ký bản quyền.<br>
                Bạn nhận được email này vì đã đăng ký Thử thách 7 Ngày Boyfriend Camera.
            </p>
        </div>
    `;
}

function missionBox(day, task, hashtag) {
    return `
        <div style="margin: 30px 0; background: #fdf2f2; border: 1px solid #feb2b2; padding: 20px; border-radius: 12px; border-left: 6px solid #e53e3e;">
            <h4 style="margin: 0 0 10px 0; color: #9b2c2c; display: flex; align-items: center;">🔥 NHIỆM VỤ NGÀY ${day}</h4>
            <p style="margin: 0; font-size: 0.95rem;">${task}</p>
            <p style="margin-top: 10px; font-size: 0.85rem; color: #666;">Kèm bộ hashtag: <b>#minhtanacademy #BoyfriendCameraChallenge ${hashtag}</b></p>
        </div>
    `;
}

function communityButton() {
    return `
        <div style="text-align: center; margin-top: 20px;">
            <a href="${COMMUNITY_LINK}" style="display: inline-block; background: #FFD700; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 10px rgba(218, 165, 32, 0.3);">KHOE THÀNH QUẢ TRÊN GROUP →</a>
        </div>
    `;
}

export default templates;
