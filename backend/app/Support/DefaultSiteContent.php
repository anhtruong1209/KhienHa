<?php

namespace App\Support;

class DefaultSiteContent
{
    public static function make(): array
    {
        return [
            'company' => [
                'name' => 'CÔNG TY TNHH TM KHIÊN HÀ',
                'shortName' => 'KHIÊN HÀ',
                'tagline' => 'Đối tác đóng mới và sửa chữa tàu chuyên nghiệp tại Hải Phòng',
                'description' => 'Khiên Hà được thành lập từ năm 2002, chuyên đóng mới và sửa chữa tàu nội địa, tàu biển, sà lan biển và các phương tiện thủy chuyên dụng với năng lực đến 25.000 DWT.',
                'establishedYear' => '2002',
            ],
            'hero' => [
                'eyebrow' => 'Shipbuilding Since 2002',
                'titleLine1' => 'Năng Lực Đóng Tàu',
                'titleLine2' => 'Vươn Ra Biển Lớn',
                'subtitle' => 'Kết hợp đội ngũ kỹ thuật dày dạn kinh nghiệm, hạ tầng hơn 5ha và quy trình quản lý chất lượng nghiêm ngặt để tạo nên những công trình hàng hải bền bỉ, an toàn và đúng tiến độ.',
                'primaryCtaLabel' => 'Khám phá năng lực',
                'primaryCtaHref' => '#services',
                'secondaryCtaLabel' => 'Xem dự án tiêu biểu',
                'secondaryCtaHref' => '#gallery',
                'highlights' => [
                    ['label' => '25.000 DWT', 'value' => 'Năng lực đóng mới'],
                    ['label' => '10 tàu', 'value' => 'Sửa chữa đồng thời'],
                    ['label' => '20+ năm', 'value' => 'Kinh nghiệm thực chiến'],
                ],
            ],
            'about' => [
                'eyebrow' => 'Về chúng tôi',
                'title' => 'Nhà máy đóng tàu tư nhân hàng đầu khu vực phía Bắc',
                'highlight' => 'Hạ tầng lớn, kỹ thuật mạnh, kiểm soát chất lượng chặt.',
                'description' => 'Khiên Hà đầu tư đồng bộ từ công nghệ cắt CNC, thiết bị nâng hạ trọng tải lớn, hệ thống bắn cát phun sơn đến đội ngũ kỹ sư, thợ lành nghề nhằm bảo đảm hiệu quả thi công cho từng dự án đóng mới và sửa chữa tàu.',
                'image' => 'https://khienha.vn/uploads/anh/367316468994953.jpg',
                'certificateLabel' => 'ISO 9001:2015',
                'certificateText' => 'Hệ thống quản lý chất lượng cho hoạt động đóng mới và sửa chữa tàu thủy.',
            ],
            'contact' => [
                'eyebrow' => 'Liên hệ',
                'title' => 'Kết nối với Khiên Hà',
                'description' => 'Gửi nhu cầu đóng mới, sửa chữa, đại tu hoặc tư vấn kỹ thuật để đội ngũ chúng tôi phản hồi nhanh chóng.',
                'address' => 'Xã Chiến Thắng, huyện An Lão, Hải Phòng, Việt Nam',
                'phone' => '(+84-31) 3903088',
                'fax' => '(+84-31) 3903088',
                'hotline' => '0913 598 034',
                'email' => 'khienhadongtau18@gmail.com',
            ],
            'history' => [
                ['id' => 1, 'year' => '2002', 'title' => 'Thành lập', 'content' => 'Công ty TNHH TM Khiên Hà chính thức hoạt động tại Hải Phòng, định hướng chuyên sâu lĩnh vực đóng mới và sửa chữa phương tiện thủy.'],
                ['id' => 2, 'year' => '2007', 'title' => 'Mở rộng cơ sở', 'content' => 'Doanh nghiệp mở rộng mặt bằng và dây chuyền sản xuất để đáp ứng nhu cầu đóng sửa tàu ngày càng lớn của thị trường.'],
                ['id' => 3, 'year' => '2010', 'title' => 'Về vị trí hiện tại', 'content' => 'Nhà máy chuyển về xã Chiến Thắng, An Lão với quy mô hạ tầng lớn hơn, tối ưu cho đóng tàu trọng tải cao.'],
                ['id' => 4, 'year' => '2021', 'title' => 'Nâng cấp năng lực', 'content' => 'Được đánh giá và cấp chứng nhận năng lực đóng mới tàu đến 25.000 DWT, tạo bước tiến lớn về quy mô sản xuất.'],
            ],
            'capacity' => [
                ['id' => 1, 'category' => 'Nhân sự', 'title' => 'Đội ngũ kỹ thuật và công nhân lành nghề', 'detail' => 'Lực lượng kỹ sư, tổ trưởng và công nhân nhiều năm kinh nghiệm, quen thuộc với các hạng mục đóng mới, cải hoán và sửa chữa phương tiện thủy từ nội địa đến quốc tế.', 'icon' => 'Users', 'image' => 'https://khienha.vn/uploads/anh/233516468994642.jpg'],
                ['id' => 2, 'category' => 'Hạ tầng', 'title' => 'Nhà xưởng và triền tàu quy mô lớn', 'detail' => 'Diện tích hơn 5ha, nhà xưởng trên 4.500m2, hệ thống đường triền cứng dài khoảng 300m, đủ điều kiện phục vụ đóng mới tàu có tải trọng lớn.', 'icon' => 'Building2', 'image' => 'https://khienha.vn/uploads/anh/367316468994953.jpg'],
                ['id' => 3, 'category' => 'Thiết bị', 'title' => 'Cẩu, máy cắt và gia công chính xác', 'detail' => 'Trang bị dầm cổng trục 200 tấn, 100 tấn, dàn cẩu trục 60 tấn, 30 tấn cùng hệ thống CNC phục vụ sản xuất kết cấu chính xác và an toàn.', 'icon' => 'Cpu', 'image' => 'https://khienha.vn/uploads/anh/299816468995344.jpg'],
                ['id' => 4, 'category' => 'Công nghệ bề mặt', 'title' => 'Bắn cát, phun sơn và hoàn thiện đồng bộ', 'detail' => 'Hệ thống khí nén khép kín, năng suất cao giúp xử lý bề mặt, sơn phủ và hoàn thiện đạt chuẩn kỹ thuật cho nhiều loại tàu và sà lan biển.', 'icon' => 'Wind', 'image' => 'https://khienha.vn/uploads/anh/639616469009097.jpg'],
            ],
            'quality' => [
                'title' => 'Quy trình quản lý chất lượng nhiều lớp',
                'description' => 'Khiên Hà kiểm soát chất lượng từ khâu tiếp nhận vật tư, gia công, lắp ráp, thử nghiệm đến bàn giao nhằm bảo đảm độ an toàn, độ bền và tiến độ dự án.',
                'image' => 'https://khienha.vn/uploads/tintuc/1701647416008iso.png',
                'mainImage' => 'https://khienha.vn/uploads/tintuc/1701647416008iso.png',
                'steps' => [
                    ['id' => 1, 'step' => 'Bước 1', 'title' => 'Kiểm tra vật tư đầu vào và hồ sơ kỹ thuật trước khi gia công.'],
                    ['id' => 2, 'step' => 'Bước 2', 'title' => 'Giám sát từng công đoạn cắt, hàn, lắp ráp, căn chỉnh kết cấu thân tàu.'],
                    ['id' => 3, 'step' => 'Bước 3', 'title' => 'Nghiệm thu nội bộ, chạy thử và hoàn thiện hồ sơ bàn giao theo tiêu chuẩn hiện hành.'],
                ],
            ],
            'goals' => [
                ['id' => 1, 'title' => 'Tầm nhìn 2030', 'content' => 'Trở thành đối tác đóng mới và sửa chữa tàu uy tín hàng đầu khu vực miền Bắc, đủ năng lực đáp ứng các dự án ngày càng phức tạp.'],
                ['id' => 2, 'title' => 'Sứ mệnh', 'content' => 'Mang đến những công trình hàng hải an toàn, bền bỉ và hiệu quả kinh tế cho khách hàng trong và ngoài nước.'],
                ['id' => 3, 'title' => 'Cam kết', 'content' => 'Tập trung vào chất lượng, tiến độ, an toàn lao động và dịch vụ hậu mãi minh bạch.'],
            ],
            'gallery' => [
                ['id' => 1, 'url' => 'https://khienha.vn/uploads/anh/79371608532527Tau 9000T.jpg', 'title' => 'Tàu hàng 9.000T', 'category' => 'Đóng mới'],
                ['id' => 2, 'url' => 'https://khienha.vn/uploads/anh/89831647418380Tau du lich.jpg', 'title' => 'Tàu du lịch cao cấp', 'category' => 'Dự án du lịch'],
                ['id' => 3, 'url' => 'https://khienha.vn/uploads/anh/92011647418432Tau ca nghe luoi chup.jpg', 'title' => 'Tàu cá vỏ thép', 'category' => 'Nghề cá'],
                ['id' => 4, 'url' => 'https://khienha.vn/uploads/anh/233516468994642.jpg', 'title' => 'Lắp ráp phân đoạn', 'category' => 'Thi công'],
                ['id' => 5, 'url' => 'https://khienha.vn/uploads/anh/299816468995344.jpg', 'title' => 'Xưởng cơ khí', 'category' => 'Nhà xưởng'],
                ['id' => 6, 'url' => 'https://khienha.vn/uploads/anh/639616469009097.jpg', 'title' => 'Sà lan biển', 'category' => 'Sản phẩm'],
            ],
            'banners' => [
                'https://khienha.vn/uploads/anh/367316468994953.jpg',
                'https://khienha.vn/uploads/anh/299816468995344.jpg',
                'https://khienha.vn/uploads/anh/724016468995605.jpg',
                'https://khienha.vn/uploads/anh/810916469000106.jpg',
                'https://khienha.vn/uploads/anh/7851646900891Tau%20du%20lich.jpg',
                'https://khienha.vn/uploads/anh/639616469009097.jpg',
            ],
        ];
    }
}
