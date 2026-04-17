const COMMUNITY_LINK = "https://www.facebook.com/groups/26557378780561721";

const templates = {
    paymentReminder: (name, phone) => ({
        subject: "⚠️ Đừng để sự trì hoãn làm \"dìm hàng\" chiếc iPhone 30 triệu của bạn",
        html: baseTemplate(name, `
            <div style="background: #fdf2f2; border-left: 5px solid #e53e3e; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                <h3 style="margin: 0; color: #9b2c2c; font-size: 18px;">🛑 THÔNG BÁO QUAN TRỌNG</h3>
                <p style="margin: 10px 0 0 0; color: #333;">Suất tham gia thử thách của bạn sắp hết hạn.</p>
            </div>

            <h2 style="color: #06403D; font-size: 22px;">Chào ${name},</h2>
            <p>Tôi là Tấn. Tôi thấy bạn đã đăng ký tham gia <b>7 Ngày Lên Tay "Phó Nháy"</b> nhưng chưa hoàn tất bước cuối cùng.</p>
            
            <p><b>[VẤN ĐỀ]</b><br>
            Sự trì hoãn chính là lý do khiến nhiều người sở hữu một thiết bị 30 triệu nhưng chỉ chụp ra những bức ảnh trị giá 3 triệu. Đừng để chiếc iPhone của bạn chỉ là một "máy nghe gọi" đắt tiền.</p>

            <p><b>[GIẢI PHÁP]</b><br>
            Chỉ với 199.000đ - bằng 3 ly cafe - bạn sẽ làm chủ hoàn toàn thiết bị của mình và nhận về sự ngưỡng mộ (và yên ổn) mỗi khi đi chơi cùng người thương.</p>

            <div style="text-align: center; margin: 40px 0;">
                <p style="font-weight: bold; margin-bottom: 15px; color: #06403D; text-transform: uppercase;">QUÉT MÃ ĐỂ GIỮ SUẤT CUỐI CÙNG</p>
                <img src="https://img.vietqr.io/image/ACB-221896279-compact.png?amount=199000&addInfo=7Day%20${phone}&accountName=LE%20MINH%20TAN" alt="VietQR Payment" style="width: 100%; max-width: 250px; border: 1px solid #eee; border-radius: 10px; padding: 10px;">
                <div style="margin-top: 25px;">
                    <a href="https://7day.minhtanacademy.com/#register-form-section" style="display: inline-block; background: #06403D; color: white; padding: 18px 36px; text-decoration: none; border-radius: 50px; font-weight: bold; box-shadow: 0 4px 15px rgba(6,64,61,0.2);">XÁC NHẬN THANH TOÁN NGAY →</a>
                </div>
            </div>
            <p>Hẹn gặp bạn ở bên trong!</p>
        `)
    }),

    day0: (name) => ({
        subject: "[WELCOME] Đã đến lúc chiếc iPhone 30 triệu của bạn thôi \"làm cảnh\" 📸",
        html: baseTemplate(name, `
            <h2 style="color: #06403D; font-size: 24px;">TUYỆT VỜI! CHÀO MỪNG BẠN GIA NHẬP ĐỘI NGŨ "PHÓ NHÁY" THỰC CHIẾN</h2>
            <p>Chào ${name}, tôi là Minh Tấn.</p>
            <p>Chúc mừng bạn đã chính thức có mặt tại thử thách <b>7 Ngày Lên Tay "Phó Nháy"</b>. Việc bạn đọc email này cho thấy bạn đã sẵn sàng chấm dứt những tiếng thở dài của người thương mỗi khi xem lại ảnh bạn chụp.</p>
            
            <div style="background: #f0fff4; border-radius: 10px; padding: 20px; margin: 25px 0; border-left: 5px solid #38a169;">
                <p style="margin: 0; font-weight: bold; color: #22543d;">💡 LỘ TRÌNH CỦA CHÚNG TA:</p>
                <p style="margin: 10px 0 0 0;">Trong 7 ngày tới, tôi sẽ gửi đến bạn những "mật thư" ngắn gọn - chỉ mất 5 phút xem và làm ngay để thay đổi kết quả vĩnh viễn.</p>
            </div>

            <p>Bài học đầu tiên sẽ bắt đầu vào <b>8:00 sáng mai</b>. Hãy chuẩn bị tinh thần để khiến cô ấy phải thốt lên: <i>"Sao hôm nay anh chụp đẹp thế!"</i></p>
            
            ${communityButton()}
        `)
    }),

    day1: (name) => ({
        subject: "[DAY 1] Bí mật về \"Hiệu ứng tiêu cự\" - Mặt nhỏ lại ngay lập tức 🤳",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">DAY 1: Tuyệt chiêu "gọt mặt" V-line không cần App</h2>
            
            <p><b>[VẤN ĐỀ]</b><br>
            Tại sao cùng một người, nhưng có tấm nhìn gầy, có tấm lại "tròn quay"? Đó là vì bạn đứng quá sát và dùng camera thường (1x), khiến khuôn mặt bị biến dạng phình ra ở giữa.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Đừng đứng sát. Hãy đứng lùi lại cách người mẫu khoảng 2m và sử dụng <b>Zoom 2x hoặc 3x</b>. Ống kính tele sẽ giúp gương mặt thon gọn và chân thực nhất.</p>

            ${missionBox(1, "Sử dụng Zoom 2x/3x, chụp ngang tầm mắt, đứng lùi lại 2m.", "#ngay1")}
            ${communityButton()}
        `)
    }),

    day2: (name) => ({
        subject: "[DAY 2] Mẹo khiến chân dài miên man như siêu mẫu 🦵",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">DAY 2: Kỹ thuật "Hack" chân dài 1.1m trong 3 giây</h2>
            
            <p><b>[VẤN ĐỀ]</b><br>
            Sai lầm chết người của đấng mày râu là cầm điện thoại ngang ngực. Điều này khiến người mẫu bị lùn đi và tỷ lệ cơ thể mất cân đối.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Hạ camera xuống ngang hông. Nghiêng máy nhẹ 10-15 độ về phía bạn và đảm bảo bàn chân người mẫu nằm sát mép dưới khung hình.</p>

            ${missionBox(2, "Hạ máy ngang hông, nghiêng máy 10 độ, chân sát mép ảnh.", "#ngay2")}
            ${communityButton()}
        `)
    }),

    day3: (name) => ({
        subject: "[DAY 3] Làm chủ ánh sáng tự nhiên cho làn da mịn màng ✨",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">DAY 3: Bí mật "Ánh sáng triệu đô" bên cửa sổ</h2>
            
            <p><b>[VẤN ĐỀ]</b><br>
            Ánh sáng trần nhà thường tạo ra nọng cằm và quầng thâm mắt xấu xí. Đây chính là lý do ảnh chụp trong nhà thường bị "dìm hàng".</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Sử dụng ánh sáng tạt ngang từ cửa sổ. Để người mẫu hướng mặt về phía nguồn sáng, bạn đứng lưng dựa vào tường cạnh cửa sổ. Da sẽ mịn và mắt sẽ có "điểm sáng" (catchlight) đầy sức sống.</p>

            ${missionBox(3, "Chụp cạnh cửa sổ, mặt hướng ra phía ánh sáng tự nhiên.", "#ngay3")}
            ${communityButton()}
        `)
    }),

    day4: (name) => ({
        subject: "[DAY 4] Đừng bắt cô ấy đứng yên nếu không muốn bị \"đơ\" 🚶‍♀️",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">DAY 4: Tuyệt chiêu Pose ảnh "Diễn như không diễn"</h2>
            
            <p><b>[VẤN ĐỀ]</b><br>
            "Anh ơi em đứng thế nào?" - "Thôi em cứ đứng đấy" -> Kết quả là 10 tấm đơ cả 10. Đừng bắt cô ấy đứng một chỗ và cười ép.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Hãy yêu cầu cô ấy chuyển động nhẹ: Bước đi chậm, vuốt tóc, hoặc quay mặt đi rồi quay lại nhìn bạn. Bạn hãy sử dụng chế độ <b>Chụp liên tục (Burst Mode)</b> để bắt khoảnh khắc tự nhiên nhất.</p>

            ${missionBox(4, "Nhờ cô ấy bước đi từ xa lại gần. Giữ nút chụp liên tục.", "#ngay4")}
            ${communityButton()}
        `)
    }),

    day5: (name) => ({
        subject: "[DAY 5] Bố cục 1/3 - Biến ảnh điện thoại thành tạp chí 📐",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">DAY 5: Quy tắc "Tỷ lệ vàng" cho bức ảnh chuyên nghiệp</h2>
            
            <p><b>[VẤN ĐỀ]</b><br>
            Đừng bao giờ đặt người vào chính giữa khung hình nếu bạn muốn bức ảnh trông nghệ thuật. Nó tạo cảm giác bí bách và thiếu chuyên nghiệp.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Vào Cài đặt Camera -> Bật Lưới (Grid). Hãy đặt người mẫu vào đường kẻ 1/3 bên trái hoặc bên phải. Khoảng trống còn lại sẽ khiến bức ảnh nhìn cao cấp hơn hẳn.</p>

            ${missionBox(5, "Bật Grid, đặt người mẫu vào đường kẻ dọc 1/3.", "#ngay5")}
            ${communityButton()}
        `)
    }),

    day6: (name) => ({
        subject: "[DAY 6] Góc chụp Cafe \"vạn người mê\" chỉ với 1 đạo cụ nhỏ ☕",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">DAY 6: Tuyệt kỹ xóa phông và tạo chiều sâu</h2>
            
            <p><b>[VẤN ĐỀ]</b><br>
            Ảnh chụp quán cafe thường bị rối vì quá nhiều đồ vật xung quanh. Hãy làm nổi bật người mẫu bằng cách tạo ra "chiều sâu".</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Sử dụng một nhành hoa hoặc ly nước đặt sát ống kính để tạo "tiền cảnh" mờ ảo. Kết hợp chế độ <b>Portrait (Chân dung)</b> để phông nền phía sau lung linh hơn.</p>

            ${missionBox(6, "Dùng ly nước làm tiền cảnh, bật Portrait Mode để xóa phông.", "#ngay6")}
            ${communityButton()}
        `)
    }),

    day7: (name) => ({
        subject: "[DAY 7] Tấm ảnh \"Masterpiece\" thay lời muốn nói 🏆",
        html: baseTemplate(name, `
            <h2 style="color: #06403D; font-size: 24px;">🎖️ NGÀY CUỐI CÙNG: TRỞ THÀNH "PHÓ NHÁY" THỰC CHIẾN</h2>
            <p>Chúc mừng bạn đã đi đến chặng đường cuối. Đây là thời điểm để tổng hợp mọi tinh hoa.</p>

            <p><b>[HÀNH ĐỘNG]</b><br>
            Hôm nay, hãy tạo ra một bức ảnh hoàn hảo: Bố cục 1/3, ánh sáng đẹp, góc máy thấp và quan trọng nhất là cảm xúc tự nhiên.</p>

            ${missionBox("CUỐI", "Kết hợp tất cả kiến thức đã học để tạo ra 1 tác phẩm tâm đắc nhất.", "#ngay7")}
            
            <p style="text-align: center; color: #06403D; font-weight: bold; margin-top: 30px;">HÀNH TRÌNH MỚI SẼ BẮT ĐẦU TỪ ĐÂY!</p>
            ${communityButton()}
        `)
    }),

    waitlistWelcome: (name) => ({
        subject: "[Welcome] Bạn đã đăng ký thành công vào danh sách chờ \"Phó Nháy\" 📸",
        html: baseTemplate(name, `
            <h2 style="color: #06403D; font-size: 22px;">CHÚNG TÔI ĐÃ GHI NHẬN THÔNG TIN CỦA BẠN</h2>
            <p>Chào ${name}, tôi là Tấn.</p>
            <p>Rất mừng vì bạn đã nhận ra tầm quan trọng của việc làm chủ chiếc điện thoại trong tay. Với hơn 10 năm kinh nghiệm Editor cho các show lớn như <i>2 Ngày 1 Đêm</i>, tôi hiểu rõ ranh giới giữa một bức ảnh "bình thường" and "xuất sắc" chỉ mỏng manh như một cử chỉ cầm máy.</p>
            
            <div style="background: #fffaf0; border: 1px dashed #d69e2e; padding: 20px; border-radius: 10px; margin: 25px 0;">
                <p style="margin: 0; font-style: italic;">"Người chụp ảnh đẹp nhất không phải người có máy xịn nhất. Mà là người hiểu rõ nhất quy trình tối giản để tạo ra khoảnh khắc."</p>
            </div>

            <p>Tôi sẽ sớm liên hệ với bạn khi có suất tham gia đợt tiếp theo. Hãy đón chờ bài học đầu tiên bay thẳng vào inbox của bạn nhé!</p>
        `)
    }),

    waitlistNurture: (name) => ({
        subject: "Tại sao chiếc iPhone 30 triệu lại biến mặt cô ấy thành... hình tròn?",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">BIẾN CHIẾC IPHONE THÀNH "VŨ KHÍ" HẠNH PHÚC</h2>
            <p>Chào ${name}, lại là Tấn đây.</p>
            <p>Bạn có từng thắc mắc tại sao người khác dùng điện thoại y hệt mình nhưng ảnh họ sang xịn mịn, còn mình chụp thì hay bị "phê bình"?</p>
            
            <p><b>[VẤN ĐỀ]</b><br>
            Sự thật đau lòng là hầu hết đàn ông đều chụp bằng chế độ mặc định (1x) khi đứng quá gần. Điều này làm khuôn mặt người yêu bị biến dạng, cằm to và mũi to hơn thực tế.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Lần tới hãy thử: <b>Đứng lùi lại 2m và dùng Zoom 2x.</b> Chỉ 1 thay đổi nhỏ này thôi cũng đủ giúp cô ấy có gương mặt thon gọn tự nhiên nhất mà không cần app.</p>

            <p>Thử ngay hôm nay và nhắn tôi kết quả nhé!</p>
        `)
    }),

    waitlistClose: (name) => ({
        subject: "[CƠ HỘI CUỐI] Đừng để nụ cười của cô ấy vụt tắt chỉ vì... ảnh xấu 😂",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🎁 MÓN QUÀ DÀNH RIÊNG CHO SỰ KIÊN TRÌ CỦA BẠN</h2>
            <p>Chào ${name}, suất tham gia thử thách <b>7 Ngày Lên Tay Phó Nháy</b> vừa mới trống 1 chỗ dành riêng cho danh sách chờ.</p>
            
            <p>Chi phí: Chỉ 199.000đ. Một khoản đầu tư "siêu lợi nhuận" cho sự yên bình và hạnh phúc của mỗi chuyến đi chơi.</p>

            <div style="text-align: center; margin: 35px 0;">
                <a href="https://7day.minhtanacademy.com/#register-form-section" style="display: inline-block; background: #FFD700; color: #000; padding: 20px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; text-transform: uppercase; box-shadow: 0 4px 15px rgba(255,215,0,0.4);">ĐĂNG KÝ VÀ NHẬN QR NGAY →</a>
                <p style="margin-top: 15px; font-size: 13px; color: #e53e3e;">⏰ Cơ hội này chỉ tồn tại trong 24h tới.</p>
            </div>

            <p>Hẹn gặp bạn ở bên trong!</p>
        `)
    }),

    orderSuccess: (name, productName, amount) => ({
        subject: "🎉 Xác nhận đơn hàng thành công - Sẵn sàng lên tay \"Phó Nháy\"!",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">XÁC NHẬN GIAO DỊCH THÀNH CÔNG</h2>
            <div style="background: #f9f9f9; padding: 25px; border-radius: 12px; border: 1px solid #eee; margin: 25px 0;">
                <table style="width: 100%; font-size: 15px;">
                    <tr><td style="padding: 5px 0; color: #666;">Khách tên:</td><td style="padding: 5px 0; font-weight: bold; text-align: right;">${name}</td></tr>
                    <tr><td style="padding: 5px 0; color: #666;">Sản phẩm:</td><td style="padding: 5px 0; font-weight: bold; text-align: right;">${productName}</td></tr>
                    <tr><td style="padding: 5px 0; color: #666;">Số tiền:</td><td style="padding: 5px 0; font-weight: bold; text-align: right; color: #06403D;">${amount.toLocaleString()} VND</td></tr>
                    <tr><td style="padding: 5px 0; color: #666;">Trạng thái:</td><td style="padding: 5px 0; font-weight: bold; text-align: right; color: #38a169;">ĐÃ THANH TOÁN ✅</td></tr>
                </table>
            </div>
            <p>Hệ thống đã ghi nhận. Bài học đầu tiên sẽ được tự động gửi đến bạn vào sáng mai qua email này.</p>
            <p>Trong lúc chờ đợi, hãy tham gia nhóm Facebook để kết nối với các "đồng đạo" khác:</p>
            ${communityButton()}
        `)
    })
};

function baseTemplate(name, body) {
    return `
        <div style="background: #f4f4f4; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <!-- Header -->
                <div style="background: #06403D; padding: 35px 25px; text-align: center;">
                    <h1 style="color: #FFD700; margin: 0; font-size: 20px; letter-spacing: 2px; text-transform: uppercase; font-weight: 900;">Minh Tấn Academy</h1>
                    <div style="color: white; font-size: 14px; margin-top: 10px; opacity: 0.8;">7 NGÀY LÊN TAY "PHÓ NHÁY" THỰC CHIẾN</div>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px; color: #2D3748; line-height: 1.8; font-size: 16px;">
                    <p style="margin-top: 0;">Xin chào <b>${name || 'bạn'}</b>,</p>
                    ${body}
                    
                    <!-- Signature -->
                    <div style="margin-top: 45px; border-top: 1px solid #edf2f7; padding-top: 30px; text-align: center;">
                        <img src="https://7day.minhtanacademy.com/assets/tan-signature.png" alt="Minh Tan Signature" style="width: 120px; opacity: 0.6; margin-bottom: 5px;">
                        <p style="margin: 0; font-weight: 800; color: #06403D; font-size: 18px;">Minh Tấn</p>
                        <p style="margin: 0; color: #718096; font-size: 13px;">Advisor & Founder - Minh Tấn Academy</p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #edf2f7; padding: 25px; text-align: center; color: #a0aec0; font-size: 12px;">
                    Bản quyền © 2026 Minh Tấn Academy. Mọi quyền được bảo lưu.<br>
                    Bạn nhận được email này vì đã đăng ký tham gia thử thách của chúng tôi.
                </div>
            </div>
            <div style="text-align: center; margin-top: 25px; font-size: 12px; color: #a0aec0;">
                <a href="#" style="color: #a0aec0; text-decoration: underline;">Từ chối nhận email</a> • 
                <a href="https://7day.minhtanacademy.com" style="color: #a0aec0; text-decoration: underline;">Trang chủ</a>
            </div>
        </div>
    `;
}

function missionBox(day, task, hashtag) {
    const title = day === "CUỐI" ? "🏆 BÀI THI TỔNG LỰC" : `🔥 NHIỆM VỤ NGÀY ${day}`;
    return `
        <div style="margin: 30px 0; background: #fffaf0; border: 1px solid #feebc8; border-left: 6px solid #d69e2e; padding: 25px; border-radius: 12px;">
            <h4 style="margin: 0; color: #9c4221; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">${title}</h4>
            <div style="margin: 15px 0; color: #4a5568; font-size: 16px;">${task}</div>
            <div style="display: inline-block; background: #fefcbf; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; color: #744210;">${hashtag}</div>
        </div>
    `;
}

function communityButton() {
    return `
        <div style="text-align: center; margin-top: 35px;">
            <p style="font-size: 14px; color: #718096; margin-bottom: 15px;">Tham gia cộng đồng và khoe thành quả ngay:</p>
            <a href="${COMMUNITY_LINK}" style="display: inline-block; background: #2D3748; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">KHOE THÀNH QUẢ TRÊN GROUP →</a>
        </div>
    `;
}

export default templates;
