const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://sdtla0911114819_db_user:l7xYcYTaFThpLHhZ@cluster0.hit1k6g.mongodb.net/khienha?retryWrites=true&w=majority&appName=Cluster0";

const productionSiteContent = {
  banners: [
    "https://khienha.vn/uploads/anh/367316468994953.jpg",
    "https://khienha.vn/uploads/anh/299816468995344.jpg",
    "https://khienha.vn/uploads/anh/724016468995605.jpg",
    "https://khienha.vn/uploads/anh/810916469000106.jpg",
    "https://khienha.vn/uploads/anh/7851646900891Tau%20du%20lich.jpg",
    "https://khienha.vn/uploads/anh/639616469009097.jpg",
    "https://khienha.vn/uploads/anh/231416474183578.jpg"
  ],
  history: [
    { id: 1, year: "2002", title: "Thành lập", content: "Đặt những viên gạch đầu tiên xây dựng xưởng đóng tàu Khiên Hà." },
    { id: 2, year: "2010", title: "Mở rộng quy mô", content: "Đầu tư hệ thống triền đà cứng 300m, nâng năng lực lên 10,000 DWT." },
    { id: 3, year: "2018", title: "Hiện đại hóa", content: "Trang bị dàn cẩu trục 200 tấn và hệ thống cắt CNC Plasma tự động." },
    { id: 4, year: "2024", title: "Vươn tầm quốc tế", content: "Hoàn thiện quy trình đóng mới tàu chuyên dụng 25,000 DWT." }
  ],
  capacity: [
    { 
      id: 1, 
      category: "Con người",
      title: "Đội ngũ nhân sự chuyên nghiệp", 
      detail: "Hơn 20 năm tích lũy, đội ngũ kỹ thuật năng động, nhiệt huyết. Công nhân dày dặn kinh nghiệm, bộ máy hành chính chuyên nghiệp luôn cập nhật khoa học công nghệ mới.",
      icon: "Users",
      image: "https://khienha.vn/uploads/anh/233516468994642.jpg"
    },
    { 
      id: 2, 
      category: "Hạ tầng",
      title: "Cơ sở hạ tầng quy mô 5ha", 
      detail: "Hệ thống dàn block, nhà xưởng 4.500m2. Đường triền cứng 300m và triền dạt ngang có khả năng kéo tàu 25,000 tấn lên đà sửa chữa cùng lúc 10 con tàu.",
      icon: "Building2",
      image: "https://khienha.vn/uploads/anh/367316468994953.jpg"
    },
    { 
      id: 3, 
      category: "Thiết bị",
      title: "Trang thiết bị hiện đại", 
      detail: "02 Dầm cổng trục 200T và 100T, xe nâng chở block 100T, Cẩu KATO 50T. Máy cắt CNC Plasma 200, máy lốc tôn, máy dập thủy lực phục vụ đóng mới chính xác.",
      icon: "Cpu",
      image: "https://khienha.vn/uploads/anh/299816468995344.jpg"
    },
    { 
      id: 4, 
      category: "Kỹ thuật",
      title: "Hệ thống Phun sơn & Bắn cát", 
      detail: "Hệ thống nén khí khép kín với 10 máy nén khí công suất lớn. 8 vòi bắn hạt mài tự động hoạt động cùng lúc, đảm bảo làm sạch bề mặt tàu trong thời gian nhanh nhất.",
      icon: "Wind",
      image: "https://khienha.vn/uploads/anh/639616469009097.jpg"
    }
  ],
  goals: [
    { id: 1, title: "Tầm nhìn 2030", content: "Trở thành biểu tượng ngành đóng tàu tư nhân tại Việt Nam về chất lượng và tiến độ." },
    { id: 2, title: "Sứ mệnh", content: "Đem lại những con tàu an toàn, bền bỉ, góp phần phát triển kinh tế biển nước nhà." }
  ],
  gallery: [
    { id: 1, title: "Hạ thủy tàu Phú Đạt 16", url: "https://khienha.vn/uploads/anh/231416474183578.jpg", category: "DỰ ÁN" },
    { id: 2, title: "Bàn giao tàu 14.000 DWT", url: "https://khienha.vn/uploads/anh/810916469000106.jpg", category: "DỰ ÁN" },
    { id: 3, title: "Dàn cẩu trục hiện đại", url: "https://khienha.vn/uploads/anh/299816468995344.jpg", category: "TRANG THIẾT BỊ" }
  ]
};

const productionNews = [
  {
    id: 1,
    title: "Hạ thủy thành công tàu dầu Phú Đạt 16 trọng tải 15,000 DWT",
    date: "12/04/2026",
    content: "Sáng nay tại nhà máy Khiên Hà, buổi lễ hạ thủy tàu Phú Đạt 16 đã diễn ra thành công tốt đẹp, khẳng định năng lực đóng mới tàu chuyên dụng của công ty.",
    category: "SỰ KIỆN",
    image: "https://khienha.vn/uploads/anh/231416474183578.jpg"
  },
  {
    id: 2,
    title: "Khiên Hà nhận chứng chỉ chất lượng ISO 9001:2015 từ tổ chức BV",
    date: "05/04/2026",
    content: "Nâng cao quy trình quản lý chất lượng đóng tàu theo tiêu chuẩn quốc tế, đảm bảo mọi sản phẩm xuất xưởng đều đạt độ bền và an toàn tối đa.",
    category: "CHỨNG CHỈ",
    image: "https://khienha.vn/uploads/tintuc/1701647416008iso.png"
  },
  {
    id: 3,
    title: "Bàn giao đội tàu cá vỏ thép cho ngư dân Quảng Ninh",
    date: "28/03/2026",
    content: "Tiếp tục thực hiện sứ mệnh hỗ trợ ngư dân vươn khơi bám biển, Khiên Hà bàn giao 05 tàu cá vỏ thép hiện đại, trang bị đầy đủ thiết bị hàng hải.",
    category: "SÀN XUẤT",
    image: "https://khienha.vn/uploads/anh/7851646900891Tau%20du%20lich.jpg"
  }
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("khienha");
    
    // 1. Clear ALL data
    await db.collection("settings").deleteMany({});
    await db.collection("news").deleteMany({});
    
    // 2. Insert Production Data
    await db.collection("settings").insertOne({ 
      key: "site_content", 
      data: productionSiteContent, 
      updatedAt: new Date() 
    });
    
    await db.collection("news").insertMany(productionNews);
    
    console.log("Database cleared and production-ready data seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

seed();
