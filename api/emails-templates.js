const COMMUNITY_LINK = "https://www.facebook.com/groups/26557378780561721";

const templates = {
    paymentReminder: (name, phone) => ({
        subject: "⚠️ Đừng để sự trì hoãn làm \"dìm hàng\" chiếc iPhone 30 triệu của bạn",
        html: baseTemplate(name, `
            <h2 style="color: #9b2c2c; font-size: 22px; border-bottom: 2px solid #feb2b2; padding-bottom: 10px;">📩 ĐỪNG ĐỂ SỰ TRÌ HOÃN LÀM "DÌM HÀNG" CHIẾC IPHONE 30 TRIỆU CỦA BẠN</h2>
            <p>Chào bạn, tôi là Tấn.</p>
            <p>Tôi thấy bạn đã đăng ký tham gia <b>7 Ngày Lên Tay "Phó Nháy" Cho Người Yêu</b> nhưng chưa hoàn tất bước cuối cùng. Với tư cách là một Advisor, tôi muốn nhắc bạn về một "điểm đau" thực tế:</p>
            
            <div style="background: #fff5f5; padding: 20px; border-radius: 10px; border-left: 5px solid #e53e3e; margin: 20px 0;">
                <h4 style="margin: 0; color: #9b2c2c;">1. Vấn đề:</h4>
                <p style="margin: 10px 0 0 0;">Sự trì hoãn chính là lý do khiến bạn vẫn đang sở hữu một thiết bị 30 triệu nhưng chỉ chụp ra những bức ảnh trị giá 3 triệu.</p>
            </div>
            <div style="text-align: center; margin: 35px 0;">
                <p style="font-weight: bold; margin-bottom: 15px; color: #06403D;">QUÉT MÃ ĐỂ GIỮ SUẤT CUỐI CÙNG</p>
                <img src="https://img.vietqr.io/image/MB-0922255861-compact.png?amount=199000&addInfo=Thanh%20toan%207Day%20${phone}&accountName=NGUYEN%20MINH%20TAN" alt="VietQR Payment" style="width: 100%; max-width: 250px;">
                <div style="margin-top: 25px;">
                    <a href="https://7day.minhtanacademy.com/#register-form-section" style="display: inline-block; background: #06403D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">HOÀN TẤT THANH TOÁN NGAY →</a>
                </div>
            </div>
            <p>Chào quyết thắng!</p>
        `)
    }),

    day0: (name) => ({
        subject: "[Welcome] Đã đến lúc chiếc iPhone 30 triệu của bạn thôi \"làm cảnh\" 📸",
        html: baseTemplate(name, `
            <h2 style="color: #06403D; font-size: 24px; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">📩 BIẾN CHIẾC IPHONE 30 TRIỆU THÀNH "VŨ KHÍ" HẠNH PHÚC</h2>
            <p>Chào bạn, tôi là Minh Tấn.</p>
            <p>Chúc mừng bạn đã chính thức có mặt tại thử thách <b>7 Ngày Lên Tay "Phó Nháy" Cho Người Yêu</b>. Việc bạn đọc email này cho thấy bạn không muốn tiếp tục là một người "tàng hình" trên mạng xã hội hay một "phó nháy" luôn khiến người thương phải thở dài.</p>
            <p>Trong 7 ngày tới, tôi sẽ không nhồi nhét cho bạn những thông số kỹ thuật khô khan hay lý thuyết nhiếp ảnh phức tạp. Chúng ta sẽ tập trung vào sự tinh gọn: Chỉ 5 phút thực hành mỗi ngày để thay đổi kết quả vĩnh viễn.</p>
            <p>Hành trình trở thành "Phó Nháy" thực thụ sẽ bắt đầu vào sáng mai. Bài học đầu tiên: <b>"Chỉnh góc này, mặt sẽ nhỏ lại ngay"</b>.</p>
            <p>Hẹn gặp bạn ngày mai!</p>
        `)
    }),

    day1: (name) => ({
        subject: "[Day 1] Tại sao chiếc iPhone 30 triệu lại biến mặt cô ấy thành... hình tròn?",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🤳 DAY 1: Tuyệt chiêu "gọt mặt" V-line không cần dùng App</h2>
            <p>Chào bạn,</p>
            <p>Rất nhiều học viên của tôi từng thắc mắc: "Tại sao điện thoại xịn, mẫu đẹp mà ảnh ra nhìn cứ bị thô?" Câu trả lời nằm ở <b>Hiệu ứng tiêu cự</b>.</p>
            <p><b>Bước 1:</b> Đứng lùi lại cách người mẫu khoảng 1.5m - 2m. Dùng Zoom 2x hoặc 3x.<br>
               <b>Bước 2:</b> Giơ điện thoại lên cao ngang tầm trán.<br>
               <b>Bước 3:</b> Hơi nghiêng máy xuống 15 độ.</p>
            ${missionBox(1, "<b>Tấm 1:</b> Đứng sát, camera ngang miệng.<br><b>Tấm 2:</b> Đứng xa 2m, dùng Zoom 2x, nâng máy cao bằng trán, nghiêng 15 độ.", "#ngay1")}
            ${communityButton()}
            <p>Hẹn gặp bạn ngày mai!</p>
        `)
    }),

    day2: (name) => ({
        subject: "[Day 2] Mẹo khiến chân dài miên man (không cần dùng app kéo)",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🦵 DAY 2: Tuyệt chiêu "hack" chân dài 1.1m trong 3 giây</h2>
            <p>Chào bạn,</p>
            <p>Sai lầm của đa số đàn ông là cầm điện thoại ngang ngực. Điều này làm người mẫu lùn đi.</p>
            <p><b>Bước 1:</b> Hạ thấp camera xuống ngang hông hoặc eo.<br>
               <b>Bước 2:</b> Nghiêng máy 10 độ về phía bạn.<br>
               <b>Bước 3:</b> Để bàn chân cô ấy sát mép dưới khung hình.</p>
            ${missionBox(2, "Hạ thấp máy xuống ngang hông, nghiêng máy 10 độ, để chân sát mép ảnh.", "#ngay2")}
            ${communityButton()}
            <p>Hẹn gặp bạn ngày mai!</p>
        `)
    }),

    day3: (name) => ({
        subject: "[Day 3] Tại sao ảnh bạn chụp luôn làm cô ấy trông... mệt mỏi?",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">✨ DAY 3: Bí mật "Ánh sáng triệu đô" cho làn da mịn màng</h2>
            <p>Chào bạn,</p>
            <p>Ánh sáng trần nhà thường tạo ra nọng cằm và quầng thâm mắt. Hãy đứng quay mặt ra cửa sổ.</p>
            <p><b>Bước 1:</b> Tìm cửa sổ có ánh sáng tự nhiên.<br>
               <b>Bước 2:</b> Để người mẫu hướng mặt ra cửa sổ, bạn đứng lưng dựa vào cửa sổ.<br>
               <b>Bước 3:</b> Đảm bảo thấy điểm sáng trong mắt (Catchlight).</p>
            ${missionBox(3, "Chụp cạnh cửa sổ, mặt hướng ra phía ánh sáng tự nhiên.", "#ngay3")}
            ${communityButton()}
            <p>Hẹn gặp bạn ngày mai!</p>
        `)
    }),

    day4: (name) => ({
        subject: "[Day 4] Bí kíp để cô ấy không bao giờ bị \"đơ\" trước ống kính",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🚶‍♀️ DAY 4: Tuyệt chiêu Pose ảnh "diễn như không diễn"</h2>
            <p>Chào bạn,</p>
            <p>Đừng bắt cô ấy đứng yên. Hãy nhờ cô ấy bước đi chậm hoặc vuốt tóc.</p>
            <p>Sử dụng <b>Burst Mode</b> (chụp liên tục) để bắt được khoảnh khắc tóc bay hoặc nụ cười tự nhiên nhất.</p>
            ${missionBox(4, "Nhờ cô ấy bước đi từ xa lại gần. Giữ nút chụp liên tục.", "#ngay4")}
            ${communityButton()}
            <p>Hẹn gặp bạn ngày mai!</p>
        `)
    }),

    day5: (name) => ({
        subject: "[Day 5] Đừng đặt người vào giữa ảnh nếu muốn trông chuyên nghiệp",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">📐 DAY 5: Biến ảnh chụp điện thoại thành "ảnh bìa tạp chí"</h2>
            <p>Chào bạn,</p>
            <p>Vào Cài đặt Camera -> Bật chế độ Lưới (Grid). Đừng đặt người vào ô giữa.</p>
            <p>Hãy đặt cô ấy vào đường kẻ 1/3 bên trái hoặc bên phải để bức ảnh có "khoảng thở".</p>
            ${missionBox(5, "Đặt người mẫu vào đường kẻ 1/3, chọn phông nền sạch và thoáng.", "#ngay5")}
            ${communityButton()}
            <p>Hẹn gặp bạn ngày mai!</p>
        `)
    }),

    day6: (name) => ({
        subject: "[Day 6] Tại sao ảnh Cafe của bạn trông... nhạt nhẽo?",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">☕ DAY 6: Góc chụp Cafe "vạn người mê"</h2>
            <p>Chào bạn,</p>
            <p>Thay vì chụp chính diện bàn, hãy đứng lệch 45 độ. Hạ thấp camera ngang tầm ly nước. Đặt một vật nhỏ sát ống kính làm tiền cảnh.</p>
            ${missionBox(6, "Chụp góc chéo 45 độ tại quán cafe, lấy thêm tiền cảnh.", "#ngay6")}
            ${communityButton()}
            <p>Hẹn gặp bạn ngày mai cho Bài Test Tổng Lực!</p>
        `)
    }),

    day7: (name) => ({
        subject: "[Day 7] Tấm ảnh \"Masterpiece\" thay lời muốn nói",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🏆 BÀI THI CUỐI CÙNG: TRỞ THÀNH "PHÓ NHÁY" THỰC THỤ</h2>
            <p>Chào bạn, chúc mừng bạn đã đi đến ngày cuối cùng.</p>
            <p><b>Bước 1:</b> Góc 1/3 sạch sẽ.<br>
               <b>Bước 2:</b> Hạ máy hông, chúi máy 15 độ.<br>
               <b>Bước 3:</b> Nhờ cô ấy chuyển động và dùng Burst Mode.</p>
            ${missionBox("CUỐI", "Chụp 1 tấm ảnh hoàn chỉnh hội tụ đủ các yếu tố.", "#ngay7")}
            ${communityButton()}
            <p>Chào quyết thắng!</p>
        `)
    })
};

function baseTemplate(name, body) {
    return `
        <div style="background: #f4f4f4; padding: 40px 10px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden;">
                <div style="background: #06403D; padding: 25px; text-align: center; border-bottom: 4px solid #FFD700;">
                    <h1 style="color: white; margin: 0; font-size: 18px;">7 NGÀY LÊN TAY "PHÓ NHÁY"</h1>
                </div>
                <div style="padding: 30px; color: #333; line-height: 1.6; font-size: 15px;">
                    <p>Xin chào <b>${name || 'bạn'}</b>,</p>
                    ${body}
                    <div style="margin-top: 35px; border-top: 1px solid #eee; padding-top: 25px; text-align: center;">
                        <p style="margin: 0; font-weight: bold; color: #06403D;">Minh Tấn</p>
                        <p style="margin: 0; color: #888; font-size: 13px;">Advisor - Minh Tấn Academy</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function missionBox(day, task, hashtag) {
    const title = day === "CUỐI" ? "🏆 BÀI THI CUỐI CÙNG" : `🔥 NHIỆM VỤ NGÀY ${day}`;
    return `<div style="margin: 25px 0; background: #fdf2f2; border-left: 5px solid #e53e3e; padding: 15px; border-radius: 8px;"><h4 style="margin:0;color:#9b2c2c;">${title}</h4><p style="margin:10px 0 0 0;">${task}</p></div>`;
}

function communityButton() {
    return `<div style="text-align: center; margin-top: 25px;"><a href="${COMMUNITY_LINK}" style="display: inline-block; background: #FFD700; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold;">KHOE THÀNH QUẢ TRÊN GROUP →</a></div>`;
}

export default templates;
