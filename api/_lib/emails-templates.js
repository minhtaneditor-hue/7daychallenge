const COMMUNITY_LINK = "https://www.facebook.com/groups/26557378780561721";

const templates = {
    // 1. WELCOME (IMMEDIATE REGISTRATION)
    welcome: (name) => ({
        subject: "[WELCOME] Đã đến lúc chiếc iPhone 30 triệu của bạn thôi \"làm cảnh\" 📸",
        html: baseTemplate(name, `
            <h2 style="color: #06403D; font-size: 24px;">CHÀO MỪNG BẠN GIA NHẬP ĐỘI NGŨ "PHÓ NHÁY" THỰC CHIẾN</h2>
            <p>Chào ${name}, tôi là Minh Tấn.</p>
            <p>Rất mừng vì bạn đã nhận ra tầm quan trọng của việc làm chủ chiếc điện thoại trong tay. Với hơn 10 năm kinh nghiệm Editor cho các show lớn như <i>2 Ngày 1 Đêm</i>, tôi hiểu rõ ranh giới giữa một bức ảnh "bình thường" và "xuất sắc" chỉ mỏng manh như một cử chỉ cầm máy.</p>
            
            <p>Việc bạn có mặt ở đây cho thấy bạn đã sẵn sàng chấm dứt những tiếng thở dài của người thương mỗi khi xem lại ảnh bạn chụp.</p>

            <div style="background: #f0fff4; border-radius: 10px; padding: 20px; margin: 25px 0; border-left: 5px solid #38a169;">
                <p style="margin: 0; font-weight: bold; color: #22543d;">💡 LỘ TRÌNH CỦA CHÚNG TA:</p>
                <p style="margin: 10px 0 0 0;">Trong 7 ngày tới (ngay sau khi bạn hoàn tất bước thanh toán), tôi sẽ gửi đến bạn những "mật thư" ngắn gọn - chỉ mất 5 phút xem và làm ngay để thay đổi kết quả vĩnh viễn.</p>
            </div>

            <p>Hãy hoàn tất bước cuối cùng để chúng ta bắt đầu bài học đầu tiên vào sáng mai nhé!</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://7day.minhtanacademy.com/#register-form-section" style="display: inline-block; background: #06403D; color: white; padding: 18px 36px; text-decoration: none; border-radius: 50px; font-weight: bold;">XÁC NHẬN THAM GIA NGAY →</a>
            </div>
        `)
    }),

    // 2. PAYMENT REMINDER (30 MINS AFTER REGISTRATION)
    paymentFollowUp: (name, phone) => ({
        subject: "Cái nguy hiểm nhất là mình nghĩ: \"Mai học cũng được\" 🛑",
        html: baseTemplate(name, `
            <p>Chào ${name}, Tấn muốn nói bạn nghe một chuyện rất thật.</p>
            <p>Trong hàng ngàn người đăng ký thử thách này, một số ít sẽ không bao giờ bắt đầu. Không phải vì bài học khó, hay họ không đủ thông minh.</p>
            <p>Họ dừng lại... chỉ vì họ <b>trì hoãn bước đầu tiên quá lâu</b>.</p>
            
            <p>Ban đầu ai cũng nghĩ đơn giản lắm:<br>
            <i>"Để lát nữa."</i><br>
            <i>"Mai rảnh hơn thanh toán cũng được."</i><br>
            <i>"Cuối tuần xem luôn cho tiện."</i></p>

            <p>Nhưng càng để lâu, việc bắt đầu càng nặng nề. Và rồi một cơ hội để làm người thương hạnh phúc bỗng trở thành một việc "để sau".</p>

            <div style="background: #fff5f5; padding: 20px; border-radius: 10px; border: 1px solid #fed7d7; margin: 25px 0;">
                <p style="margin: 0; color: #c53030; font-weight: bold;">⚠️ Đừng để việc trì hoãn âm thầm lấy mất cơ hội của mình.</p>
            </div>

            <p>Nếu bạn gặp trục trặc gì khi thanh toán, đây là mã QR để bạn hoàn tất nhanh nhất:</p>

            <div style="text-align: center; margin: 30px 0;">
                <img src="https://img.vietqr.io/image/ACB-221896279-compact.png?amount=199000&addInfo=7DAY%20${phone}&accountName=LE%20MINH%20TAN" style="width: 250px; border-radius: 15px; border: 1px solid #eee;">
                <p style="font-size: 13px; color: #666; margin-top: 10px;">Nội dung CK: <b>7DAY ${phone}</b></p>
            </div>

            <p><i>(Nếu bạn đã chuyển tiền, vui lòng bỏ qua email này, hệ thống đang xử lý và sẽ gửi xác nhận cho bạn sớm!)</i></p>
        `)
    }),

    // 3. ORDER SUCCESS (IMMEDIATE PAYMENT)
    orderSuccess: (name, productName, amount) => ({
        subject: "🎉 Xác nhận: Bạn đã chính thức trở thành \"Phó Nháy\" thực chiến!",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">GIAO DỊCH THÀNH CÔNG!</h2>
            <p>Chào mừng ${name}, hệ thống đã ghi nhận thanh toán của bạn cho <b>${productName}</b>.</p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 10px; margin: 25px 0;">
                <p style="margin: 0;">💵 Số tiền: <b>${amount.toLocaleString()}đ</b></p>
                <p style="margin: 5px 0 0 0;">📅 Ngày bắt đầu: <b>Sáng mai (8:00 AM)</b></p>
            </div>

            <p>Trong 7 ngày tới, mỗi sáng Tấn sẽ gửi cho bạn 1 bí chiêu. Hãy chuẩn bị tinh thần để khiến cô ấy phải thốt lên: <i>"Sao hôm nay anh chụp đẹp thế!"</i></p>

            ${communityButton()}
        `)
    }),

    // 4. DAY 1 (1 DAY AFTER PAYMENT)
    day1: (name) => ({
        subject: "[DAY 1] Tuyệt chiêu \"gọt mặt\" V-line không cần App 🤳",
        html: baseTemplate(name, `
            <p>Chào ${name}, bài học đầu tiên này là thứ thay đổi 80% diện mạo bức ảnh của bạn.</p>
            <p><b>[VẤN ĐỀ]</b><br>
            Tại sao đứng ngoài đời nhìn cô ấy rất xinh, nhưng lên ảnh lại thấy "tròn quay", mặt to hơn thực tế? Đó là vì bạn đứng quá sát và dùng camera thường (1x), khiến ống kính bị biến dạng phình ra ở giữa.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Đừng đứng sát. Hãy đứng lùi lại cách người mẫu khoảng 2m và sử dụng <b>Zoom 2x hoặc 3x</b>. Ống kính tele sẽ giúp gương mặt thon gọn và chân thực nhất. Đây gọi là "Hiệu ứng tiêu cự".</p>

            ${missionBox(1, "Dùng Zoom 2x/3x, đứng lùi lại 2m, chụp ngang tầm mắt.", "#ngay1")}
            ${communityButton()}
        `)
    }),

    // 5. DAY 2 (2 DAYS AFTER PAYMENT)
    day2: (name) => ({
        subject: "[DAY 2] Mẹo khiến chân dài 1.1m trong 3 giây 🦵",
        html: baseTemplate(name, `
            <p>Chào ${name}, hôm nay chúng ta học cách "hack" chiều cao.</p>
            <p><b>[VẤN ĐỀ]</b><br>
            Sai lầm chết người là cầm điện thoại ngang ngực hoặc chụp từ trên xuống. Điều này khiến người mẫu bị lùn đi và tỷ lệ cơ thể mất cân đối.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Hạ camera xuống ngang hông. Nghiêng máy nhẹ 10-15 độ về phía bạn và đảm bảo <b>bàn chân người mẫu nằm sát mép dưới khung hình</b>. Chân sẽ tự động dài ra một cách tự nhiên mà không cần kéo app.</p>

            ${missionBox(2, "Hạ máy ngang hông, nghiêng máy 10 độ, chân sát mép ảnh.", "#ngay2")}
            ${communityButton()}
        `)
    }),

    // 6. DAY 3 (3 DAYS AFTER PAYMENT)
    day3: (name) => ({
        subject: "[DAY 3] Bí mật \"Ánh sáng triệu đô\" cho làn da mịn màng ✨",
        html: baseTemplate(name, `
            <p>Chào ${name}, ánh sáng chiếm 90% vẻ đẹp của làn da.</p>
            <p><b>[VẤN ĐỀ]</b><br>
            Ánh sáng trần nhà thường tạo ra nọng cằm và quầng thâm mắt. Ánh sáng nắng gắt giữa trưa thì làm mặt bị bóng dầu và nhăn nhó.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Hãy tìm một cửa sổ. Sử dụng ánh sáng tạt ngang. Để cô ấy hướng mặt về phía cửa sổ, bạn đứng lưng dựa vào tường cạnh đó. Da sẽ mịn và mắt sẽ có "điểm sáng" đầy sức sống.</p>

            ${missionBox(3, "Chụp cạnh cửa sổ, mặt hướng ra phía ánh sáng tự nhiên.", "#ngay3")}
            ${communityButton()}
        `)
    }),

    // 7. DAY 4 (4 DAYS AFTER PAYMENT)
    day4: (name) => ({
        subject: "[DAY 4] Cách tách cô ấy khỏi đám đông du lịch nhốn nháo 🌳",
        html: baseTemplate(name, `
            <p>Chào ${name}, đi du lịch mà dính toàn người lạ vào ảnh thì thật khó chịu.</p>
            <p><b>[VẤN ĐỀ]</b><br>
            Chúng ta thường ham lấy hết toàn cảnh, dẫn đến việc chủ thể bị chìm nghỉm giữa một biển người.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Hãy áp dụng quy tắc <b>"Góc máy cách ly"</b>. Tìm một tán cây hoặc một vật cản gần máy để che bớt những người lạ phía sau. Hoặc đơn giản là hạ thấp máy và chụp hất lên trời để làm sạch hậu cảnh.</p>

            ${missionBox(4, "Tìm vật che chắn tiền cảnh hoặc chụp hất lên để giấu đám đông.", "#ngay4")}
            ${communityButton()}
        `)
    }),

    // 8. DAY 5 (5 DAYS AFTER PAYMENT)
    day5: (name) => ({
        subject: "[DAY 5] Đưa rung cảm Cafe chuyên nghiệp vào bức ảnh ☕",
        html: baseTemplate(name, `
            <p>Chào ${name}, hôm nay chúng ta "chill" tại quán cafe.</p>
            <p><b>[VẤN ĐỀ]</b><br>
            Quán cafe thường hẹp, ảnh chụp hay bị rối vì bàn ghế xung quanh.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Sử dụng một ly nước hoặc nhành hoa đặt sát ống kính để tạo "tiền cảnh" mờ ảo. Kết hợp chế độ <b>Portrait (Chân dung)</b> để phông nền phía sau lung linh hơn. Ly nước chính là "đạo cụ" dẫn dắt thị giác tuyệt vời.</p>

            ${missionBox(5, "Dùng ly nước làm tiền cảnh, bật Portrait Mode để xóa phông.", "#ngay5")}
            ${communityButton()}
        `)
    }),

    // 9. DAY 6 (6 DAYS AFTER PAYMENT)
    day6: (name) => ({
        subject: "[DAY 6] Tuyệt chiêu Pose ảnh \"Diễn như không diễn\" 🚶‍♀️",
        html: baseTemplate(name, `
            <p>Chào ${name}, đừng bắt cô ấy đứng yên như tượng.</p>
            <p><b>[VẤN ĐỀ]</b><br>
            "Anh ơi em đứng thế nào?" - "Thôi em cứ đứng đấy" -> Kết quả là 10 tấm đơ cả 10.</p>

            <p><b>[BÍ QUYẾT]</b><br>
            Yêu cầu cô ấy <b>chuyển động nhẹ</b>: Bước đi chậm, vuốt tóc, hoặc quay mặt đi rồi quay lại nhìn bạn. Bạn hãy sử dụng chế độ <b>Chụp liên tục (Burst Mode)</b> để bắt khoảnh khắc tự nhiên nhất. Ảnh sẽ có thần thái Fashionista ngay.</p>

            ${missionBox(6, "Nhờ cô ấy bước đi từ xa lại gần. Giữ nút chụp liên tục.", "#ngay6")}
            ${communityButton()}
        `)
    }),

    // 10. DAY 7 (7 DAYS AFTER PAYMENT)
    day7: (name) => ({
        subject: "[DAY 7] Tấm ảnh \"Masterpiece\" thay lời muốn nói 🏆",
        html: baseTemplate(name, `
            <p>Chào ${name}, chúc mừng bạn đã đi đến chặng đường cuối của thử thách.</p>
            <p>Đến hôm nay, Tấn tin rằng bạn không còn "sợ" mỗi khi người thương đưa máy nữa. Hôm nay không có chiêu mới, mà là bài thi tổng lực.</p>

            <p><b>[HÀNH ĐỘNG]</b><br>
            Hãy tạo ra một bức ảnh hoàn hảo: Bố cục 1/3, ánh sáng đẹp, góc máy thấp và quan trọng nhất là cảm xúc tự nhiên mà bạn đã học được cách bắt lấy.</p>

            ${missionBox("CUỐI", "Kết hợp tất cả kiến thức đã học để tạo ra 1 tác phẩm tâm đắc nhất.", "#ngay7")}
            
            <p style="text-align: center; color: #06403D; font-weight: bold; margin-top: 30px;">HÀNH TRÌNH MỚI SẼ BẮT ĐẦU TỪ ĐÂY!</p>
            ${communityButton()}
        `)
    },
    // 11. EBOOK DELIVERY
    ebookDelivery: (name) => ({
        subject: "📖 Quà tặng: Ebook \"Cách chụp chân dài hết nọng\" của bạn đây!",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">QUÀ TẶNG ĐÃ SẴN SÀNG!</h2>
            <p>Chào ${name}, Tấn gửi bạn cuốn Ebook hướng dẫn cách chụp hình hack dáng cực đỉnh mà bạn vừa đăng ký.</p>
            
            <div style="background: #f7fafc; padding: 30px; border-radius: 15px; text-align: center; margin: 25px 0; border: 1px dashed #06403D;">
                <p style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">Ebook: Cách chụp chân dài hết nọng</p>
                <a href="https://7day.minhtanacademy.com/assets/ebook-chan-dai.pdf" style="display: inline-block; background: #06403D; color: white; padding: 18px 36px; text-decoration: none; border-radius: 50px; font-weight: bold;">TẢI EBOOK NGAY →</a>
            </div>

            <p>Hy vọng cuốn ebook này sẽ giúp bạn ghi điểm tuyệt đối trong mắt "người ấy" nhé!</p>
            
            <div style="background: #fff5f5; padding: 20px; border-radius: 10px; margin-top: 30px;">
                <p style="margin: 0; font-weight: bold; color: #c53030;">🔥 MUỐN LÊN TAY NHANH HƠN?</p>
                <p style="margin: 10px 0 0 0;">Nếu chỉ đọc thôi chưa đủ, hãy tham gia <b>Thử thách 7 Ngày Lên Tay Phó Nháy</b> của Tấn để được hướng dẫn thực chiến mỗi ngày qua Email.</p>
                <a href="https://7day.minhtanacademy.com/" style="color: #06403D; font-weight: bold;">Xem chi tiết tại đây →</a>
            </div>
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
