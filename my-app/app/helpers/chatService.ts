// Định nghĩa kiểu dữ liệu cho tin nhắn
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isQuickReply?: boolean;
}

// Mảng các câu trả lời có sẵn cho bot
export const botResponses = [
  "Để tính toán công suất, bạn cần biết lực kéo và vận tốc băng tải.",
  "Tỉ số truyền tổng là tích các tỉ số truyền thành phần.",
  "Bạn có thể xem thêm thông tin chi tiết trong phần Thông Số Kỹ Thuật.",
  "Hiệu suất hệ thống thường dao động từ 85-95% tùy vào từng loại bộ truyền.",
  "Bạn cần nhập đủ các thông số trong phần Cấu Hình Động Cơ để nhận kết quả chính xác.",
  "Ứng dụng hỗ trợ tính toán cho băng tải có lực kéo từ 1000-15000N.",
  "Động cơ được đề xuất dựa trên công suất tính toán và hệ số an toàn.",
  "Bạn có thể xuất báo cáo PDF từ phần Báo Cáo sau khi hoàn tất tính toán.",
  "Thời gian tính toán phụ thuộc vào độ phức tạp của hệ thống truyền động.",
  "Hãy đảm bảo kiểm tra kết quả tính toán bằng cách so sánh với các tiêu chuẩn kỹ thuật."
];

// Các câu hỏi gợi ý
export const suggestions = [
  "Làm sao để tính công suất động cơ?",
  "Tỉ số truyền tổng là gì?",
  "Cách chọn động cơ phù hợp?",
  "Khi nào cần dùng bộ truyền xích?",
  "Hiệu suất hệ thống là gì?",
  "Làm thế nào để tính toán mô-men xoắn?",
  "Cách thiết kế hộp giảm tốc hai cấp?",
  "Loại vật liệu nào phù hợp cho bánh răng?"
];

// Câu trả lời theo từ khóa
export const keywordResponses: Record<string, string> = {
  'công suất': 'Công suất động cơ được tính bằng công thức P = (F × v) / 1000, trong đó F là lực kéo (N) và v là vận tốc băng tải (m/s).',
  'tỉ số': 'Tỉ số truyền tổng (u_t) là tích của các tỉ số truyền thành phần. Trong ứng dụng này, u_t = u_xích × u_bánh_răng_1 × u_bánh_răng_2.',
  'động cơ': 'Động cơ được chọn dựa trên công suất cần thiết (P_ct), số vòng quay yêu cầu và hệ số an toàn. Thông thường chọn P_đc ≥ 1.1 × P_ct.',
  'xích': 'Bộ truyền xích thường được sử dụng khi cần truyền công suất lớn ở tốc độ thấp và trung bình, đặc biệt trong môi trường bụi bẩn.',
  'hiệu suất': 'Hiệu suất hệ thống là tích các hiệu suất thành phần: η = η_xích × η_bánh_răng² × η_ổ_lăn⁴ × η_khớp_nối.',
  'mô-men': 'Mô-men xoắn được tính theo công thức: T = 9.55 × 10⁶ × (P / n), trong đó P là công suất (kW) và n là số vòng quay (vg/ph).',
  'báo cáo': 'Bạn có thể tạo báo cáo PDF trong tab "Báo Cáo" sau khi hoàn tất các tính toán thiết kế.',
  'vật liệu': 'Các bánh răng thường được làm từ thép 40X với độ cứng 45-50 HRC để đảm bảo độ bền và khả năng chịu tải.',
  'ứng dụng': 'Ứng dụng này được phát triển để tính toán và thiết kế hệ thống truyền động với hộp giảm tốc cho băng tải.',
  'bước xích': 'Bước xích (p) thường được chọn dựa trên công suất cần truyền và tốc độ vòng quay. Theo tiêu chuẩn, bước xích phổ biến là 19.05mm, 25.4mm.',
  'tang': 'Đường kính tang (D) ảnh hưởng đến tốc độ quay của trục công tác. Công thức tính: n = (60000 × v) / (π × D).',
  'băng tải': 'Băng tải cần được đặc trưng bởi lực kéo (F), vận tốc (v) và các thông số khác như đường kính tang (D).',
  'bánh răng': 'Bánh răng trụ răng thẳng với mô-đun phù hợp (3-5mm) thường được sử dụng cho hộp giảm tốc công nghiệp.',
  'mô đun': 'Mô-đun (m) của bánh răng ảnh hưởng đến kích thước và khả năng chịu tải. Chọn m dựa vào công suất truyền và vật liệu.',
  'tuổi thọ': 'Tuổi thọ thiết kế cho hộp giảm tốc công nghiệp thông thường từ 5-10 năm tùy điều kiện làm việc.',
  'k160s4': 'K160S4 là động cơ 7.5kW, 1450 vg/ph thường được chọn cho băng tải công suất trung bình.',
  'truyền động': 'Truyền động gồm động cơ, bộ truyền hở (xích/đai) và hộp giảm tốc để đạt tỉ số truyền và mô-men yêu cầu.',
  'cấu hình': 'Cấu hình động cơ và bộ truyền phụ thuộc vào yêu cầu kỹ thuật như công suất, tốc độ và mô-men xoắn.',
};

// Phân tích tin nhắn người dùng
export const analyzeUserMessage = (message: string): string => {
  message = message.toLowerCase();
  
  // Xử lý câu chào hoặc cảm ơn
  if (message.includes('xin chào') || message.includes('chào') || message.includes('hello')) {
    return "Xin chào! Tôi có thể giúp gì cho bạn về việc tính toán hộp giảm tốc?";
  }
  
  if (message.includes('cảm ơn') || message.includes('thank')) {
    return "Không có gì! Tôi luôn sẵn sàng hỗ trợ bạn. Bạn cần giúp đỡ gì thêm không?";
  }
  
  // Kiểm tra từ khóa trong tin nhắn
  for (const keyword in keywordResponses) {
    if (message.includes(keyword)) {
      return keywordResponses[keyword];
    }
  }
  
  // Nếu không tìm thấy từ khóa, kiểm tra các chủ đề liên quan
  if (message.includes('tính') || message.includes('toán') || message.includes('công thức')) {
    return "Để tính toán chính xác, bạn cần xác định các thông số đầu vào chính như lực kéo, vận tốc băng tải và đường kính tang. Bạn muốn tôi hướng dẫn cách tính toán cụ thể cho thông số nào?";
  }
  
  if (message.includes('thiết kế') || message.includes('kết cấu') || message.includes('cấu tạo')) {
    return "Thiết kế hộp giảm tốc cần cân nhắc nhiều yếu tố như tỉ số truyền, công suất, tuổi thọ làm việc và điều kiện môi trường. Bạn muốn biết thêm về phương pháp thiết kế nào?";
  }
  
  // Nếu không tìm thấy từ khóa nào, trả về câu trả lời ngẫu nhiên
  const randomIndex = Math.floor(Math.random() * botResponses.length);
  return botResponses[randomIndex];
};

// Thông tin kỹ thuật
export const technicalInfo = {
  formula: `Các công thức quan trọng:

• Công suất làm việc: P = (F × v) / 1000
• Số vòng quay trục công tác: n = (60000 × v) / (π × D)
• Mô-men xoắn: T = 9.55 × 10⁶ × (P / n)
• Tỉ số truyền tổng: u_t = n_đc / n_lv
• Công suất tương đương: P_td = P_lv × √[(t₁(T₁/T)² + t₂(T₂/T)²)/(t₁+t₂)]
• Hiệu suất tổng: η = η_xích × η_bánh_răng² × η_ổ_lăn⁴ × η_khớp_nối
• Khoảng cách giữa trục: a = (z₁ + z₂) × m/2
• Lực vòng: Ft = 2000 × T / d
• Độ bền tính toán: [σ] = σ_o / (K_a × K_v)`,
  
  motor: `Thông số động cơ K160S4:

• Công suất: 7.5 kW
• Tốc độ quay: 1450 vg/ph
• Hiệu suất: 89%
• Hệ số công suất: 0.82
• Khối lượng: 94 kg
• Dòng điện định mức: 15.5 A
• Điện áp: 380V
• Mô-men khởi động: 2.2 × mô-men định mức
• Mô-men cực đại: 2.5 × mô-men định mức
• Cấp bảo vệ: IP54

Động cơ K160S4 được khuyên dùng cho hệ thống băng tải có công suất cần thiết từ 5.5 đến 8 kW.`,
  
  transmission: `Thông số bộ truyền:

• Bộ truyền xích:
  - Bước xích: 19.05 mm
  - Số răng đĩa chủ động/bị động: 18/46
  - Tỉ số truyền: 2.578
  - Hiệu suất: 96%
  - Số đoạn xích: 64
  - Khoảng cách trục: 304.8 mm

• Hộp giảm tốc bánh răng trụ:
  - Cấp 1: z₁/z₂ = 18/102, mô-đun = 4, u = 5.66
  - Cấp 2: z₁/z₂ = 22/70, mô-đun = 3, u = 3.18
  - Hiệu suất mỗi cấp: 96%
  - Vật liệu: Thép 40X, độ cứng 45-50 HRC
  - Dầu bôi trơn: SAE 90, 2.5 lít

• Tỉ số truyền tổng: 46.4
• Hiệu suất tổng: 85.7%`,

  calculations: `Ví dụ tính toán:

1. Với lực kéo F = 7500N, vận tốc băng tải v = 0.9 m/s, đường kính tang D = 550mm:

• Công suất làm việc:
  P = (F × v) / 1000 = (7500 × 0.9) / 1000 = 6.75 kW

• Số vòng quay trục công tác:
  n = (60000 × v) / (π × D) = (60000 × 0.9) / (3.14 × 550) = 31.25 vg/ph

• Mô-men xoắn trên trục công tác:
  T = 9.55 × 10⁶ × (P / n) = 9.55 × 10⁶ × (6.75 / 31.25) = 2,062,866 N.mm

• Với tỉ số truyền tổng ut = 46.4:
  - Số vòng quay động cơ: nđc = nlv × ut = 31.25 × 46.4 = 1450 vg/ph`,
};

// Câu hỏi theo chủ đề
export const questionsByTopic = {
  gearbox: [
    "Hộp giảm tốc được cấu tạo từ những bộ phận nào?",
    "Làm sao để tính toán tỉ số truyền tối ưu cho hộp giảm tốc?",
    "Khi nào nên dùng hộp giảm tốc 2 cấp thay vì 1 cấp?",
    "Vật liệu nào phù hợp nhất cho bánh răng trong hộp giảm tốc công nghiệp?"
  ],
  motor: [
    "Cách tính công suất động cơ cho băng tải?",
    "Làm sao để chọn động cơ phù hợp với tải?",
    "Động cơ K160S4 có thông số kỹ thuật như thế nào?",
    "Hiệu suất của động cơ ảnh hưởng thế nào đến công suất cần thiết?"
  ],
  chain: [
    "Khi nào nên sử dụng bộ truyền xích?",
    "Cách tính toán khoảng cách trục cho bộ truyền xích?",
    "Làm thế nào để chọn bước xích phù hợp?",
    "Hiệu suất của bộ truyền xích là bao nhiêu?"
  ],
  report: [
    "Báo cáo kỹ thuật cần có những thông tin gì?",
    "Cách xuất báo cáo sang định dạng PDF?",
    "Làm sao để thêm thông tin chi tiết vào báo cáo?",
    "Có thể tùy chỉnh mẫu báo cáo không?"
  ]
};

// Format thời gian tin nhắn
export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Lấy câu hỏi ngẫu nhiên từ chủ đề
export const getRandomQuestionsByTopic = (topic: keyof typeof questionsByTopic, count = 2): string[] => {
  const questions = [...questionsByTopic[topic]];
  const result: string[] = [];
  
  for (let i = 0; i < Math.min(count, questions.length); i++) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    result.push(questions.splice(randomIndex, 1)[0]);
  }
  
  return result;
};

// Tạo tin nhắn mới
export const createMessage = (text: string, sender: 'user' | 'bot', isQuickReply = false): Message => {
  return {
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date(),
    isQuickReply,
  };
};