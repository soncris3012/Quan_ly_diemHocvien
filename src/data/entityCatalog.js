// src/data/entityCatalog.js
// Danh mục thực thể phân loại theo 4 nhóm màu sắc trực quan (Mô hình 23 bảng)

export const ENTITY_GROUPS = [
  { id: 'org', name: 'Tổ chức, Đơn vị & Bảo mật', color: '#38BDF8', tagClass: 'tag-blue' },
  { id: 'personnel', name: 'Quân sự & Chuyên môn', color: '#A78BFA', tagClass: 'tag-purple' },
  { id: 'teaching', name: 'Đào tạo & Giảng dạy', color: '#34D399', tagClass: 'tag-emerald' },
  { id: 'grading', name: 'Điểm số & Khảo thí', color: '#FBBF24', tagClass: 'tag-amber' }
];

export const ENTITIES = [
  // Nhóm 1: Tổ chức, Đơn vị & Bảo mật
  {
    id: 'ent_donvi',
    name: 'Đơn Vị (DON_VI)',
    groupId: 'org',
    meaning: 'Cơ cấu tổ chức phân cấp gồm đơn vị quân sự và đơn vị học thuật như Viện, Bộ môn.',
    identifier: 'Mã đơn vị (MaDonVi [PK])',
    keyAttributes: ['MaDonVi', 'TenDonVi', 'LoaiDonVi', 'MaDonViCha'],
    relationships: 'Quan hệ đệ quy cha-con; 1 Đơn vị quản lý nhiều Lớp học hoặc nhiều Bộ môn chuyên ngành.',
    example: 'Tiểu đoàn 1 quản lý Đại đội 1; Viện Công nghệ Thông tin và Truyền thông quản lý bốn Bộ môn chuyên môn.',
    justification: 'Biểu diễn đúng cây tổ chức, phục vụ lọc và tổng hợp báo cáo theo đơn vị.',
    tableRef: 'DON_VI'
  },
  {
    id: 'ent_bomon',
    name: 'Bộ Môn (BO_MON)',
    groupId: 'org',
    meaning: 'Đơn vị chuyên môn trực thuộc Viện, chịu trách nhiệm quản lý học thuật và giảng viên.',
    identifier: 'Mã bộ môn (MaBoMon [PK])',
    keyAttributes: ['MaBoMon', 'TenBoMon', 'MaDonVi'],
    relationships: 'Thuộc 1 Đơn vị cấp Viện; Quản lý nhiều Giảng viên (1:N).',
    example: 'An toàn thông tin, Hệ thống thông tin, Khoa học máy tính và Công nghệ phần mềm trực thuộc Viện CNTT-TT.',
    justification: 'Tổ chức học thuật: Giảng viên thuộc bộ môn chịu trách nhiệm giảng dạy các môn học chuyên ngành.',
    tableRef: 'BO_MON'
  },
  {
    id: 'ent_nguoi',
    name: 'Hồ Sơ Nhân Sự (NGUOI)',
    groupId: 'org',
    meaning: 'Thực thể cha tổng quát chứa thông tin nhân thân cơ bản của quân nhân, cán bộ và giảng viên.',
    identifier: 'Mã người (MaNguoi [PK])',
    keyAttributes: ['MaNguoi', 'HoTen', 'NgaySinh', 'GioiTinh', 'QueQuan', 'SoDienThoai', 'Email'],
    relationships: 'Được kế thừa bởi Học viên (HOC_VIEN) và Giảng viên (GIANG_VIEN) theo mô hình thực thể con (IS-A).',
    example: 'NG_001 (Nguyễn Văn An, Học viên), NG_002 (TS. Lê Đức Thắng, Giảng viên).',
    justification: 'Chuẩn hóa thiết kế, tránh trùng lặp các cột họ tên, ngày sinh ở cả bảng học viên và giảng viên.',
    tableRef: 'NGUOI'
  },
  {
    id: 'ent_user',
    name: 'Tài Khoản & Quyền (USER / ROLE)',
    groupId: 'org',
    meaning: 'Cơ chế định danh, xác thực và phân quyền truy cập theo mô hình RBAC.',
    identifier: 'Mã người dùng (MaUser [PK])',
    keyAttributes: ['MaUser', 'TenDangNhap', 'MatKhau', 'TrangThai', 'MaNguoi'],
    relationships: 'Gắn với 1 NGUOI; Gán nhiều ROLE qua USER_ROLE; ROLE gán nhiều PERMISSION qua ROLE_PERMISSION.',
    example: 'Tài khoản gv_lethang có quyền nhập điểm thành phần cho lớp được phân công.',
    justification: 'Phân quyền chặt chẽ: Giảng viên chỉ nhập điểm lớp mình dạy; Chỉ huy được đọc điểm toàn Học viện nhưng không được sửa điểm.',
    tableRef: 'USER'
  },

  // Nhóm 2: Quân sự & Chuyên môn
  {
    id: 'ent_capbac_chucvu',
    name: 'Cấp Bậc & Chức Vụ Quân Sự',
    groupId: 'personnel',
    meaning: 'Quản lý quân hàm quân đội và chức trách của quân nhân trong học tập, công tác.',
    identifier: 'MaCapBac [PK], MaChucVu [PK]',
    keyAttributes: ['MaCapBac', 'TenCapBac', 'ThuTu', 'MaChucVu', 'TenChucVu'],
    relationships: 'Được tham chiếu bởi bảng HOC_VIEN để định danh vị trí quân sự của học viên.',
    example: 'Học viên Nguyễn Văn An: Cấp bậc Thượng sĩ, Chức vụ Lớp trưởng.',
    justification: 'Đặc thù quân đội: Đánh giá học tập luôn gắn liền với cấp bậc và chức trách quân sự.',
    tableRef: 'CAP_BAC'
  },
  {
    id: 'ent_nganh_chuyennganh',
    name: 'Ngành & Chuyên Ngành Đào Tạo',
    groupId: 'personnel',
    meaning: 'Khung chương trình đào tạo từ ngành tổng quát xuống chuyên ngành sâu.',
    identifier: 'MaNganh [PK], MaChuyenNganh [PK]',
    keyAttributes: ['MaNganh', 'TenNganh', 'MaChuyenNganh', 'TenChuyenNganh'],
    relationships: '1 Ngành có nhiều Chuyên ngành (1:N); 1 Chuyên ngành được phân cho nhiều Học viên.',
    example: 'Ngành CNTT ➔ Chuyên ngành An toàn thông tin & Tác chiến không gian mạng.',
    justification: 'Phân loại đào tạo chuẩn hóa, hỗ trợ quản lý chuẩn đầu ra theo từng chuyên ngành.',
    tableRef: 'CHUYEN_NGANH'
  },

  // Nhóm 3: Đào tạo & Giảng dạy
  {
    id: 'ent_giangvien',
    name: 'Giảng Viên (GIANG_VIEN) ★ Trọng Tâm Mới',
    groupId: 'teaching',
    meaning: 'Cán bộ giảng dạy thuộc các bộ môn chuyên môn, chịu trách nhiệm giảng dạy và đánh giá điểm quá trình.',
    identifier: 'Mã giảng viên (MaGV [PK])',
    keyAttributes: ['MaGV', 'MaNguoi', 'MaBoMon', 'HocVi', 'ChuyenMon', 'TrangThai'],
    relationships: 'Kế thừa từ NGUOI; Thuộc 1 BO_MON; Được phân công giảng dạy nhiều lớp học phần qua PHAN_CONG.',
    example: 'GV001: TS. Lê Đức Thắng, Bộ môn Hệ thống thông tin, phụ trách môn Cơ sở dữ liệu lớp CNTT2-K58.',
    justification: 'ĐÁP ỨNG YÊU CẦU ĐỀ BÀI: Giảng viên là chủ thể trực tiếp giảng bài, chấm điểm chuyên cần, thường xuyên và kiểm tra bài tập.',
    tableRef: 'GIANG_VIEN'
  },
  {
    id: 'ent_hocvien',
    name: 'Học Viên Quân Sự (HOC_VIEN)',
    groupId: 'teaching',
    meaning: 'Quân nhân đang theo học các khóa đào tạo chính quy trong nhà trường quân đội.',
    identifier: 'Mã học viên (MaHV [PK])',
    keyAttributes: ['MaHV', 'MaNguoi', 'MaLop', 'MaChuyenNganh', 'MaCapBac', 'MaChucVu'],
    relationships: 'Kế thừa từ NGUOI; Thuộc 1 Lớp niên chế; Có nhiều Kết quả học tập qua KET_QUA_HOC_TAP.',
    example: 'HV001: Nguyễn Văn An, Thượng sĩ, Lớp trưởng lớp CNTT2-K58.',
    justification: 'Thực thể trung tâm chịu sự quản lý của đơn vị và là đối tượng thụ hưởng đào tạo.',
    tableRef: 'HOC_VIEN'
  },
  {
    id: 'ent_lophoc_khoa',
    name: 'Lớp Học & Khóa Đào Tạo',
    groupId: 'teaching',
    meaning: 'Lớp sinh hoạt tập trung của học viên biên chế theo đơn vị đại đội và niên khóa tuyển sinh.',
    identifier: 'MaLop [PK], MaKhoaDT [PK]',
    keyAttributes: ['MaLop', 'TenLop', 'MaDonVi', 'MaKhoaDT', 'NamBatDau', 'NamKetThuc'],
    relationships: '1 Lớp thuộc 1 Khóa đào tạo và 1 Đơn vị Đại đội; Chứa nhiều Học viên.',
    example: 'Lớp CNTT2-K58 thuộc Khóa 58 (2023 - 2028), biên chế tại Đại đội 1.',
    justification: 'Môi trường quân sự quản lý học viên theo lớp hành chính trực thuộc đơn vị cơ sở.',
    tableRef: 'LOP_HOC'
  },
  {
    id: 'ent_monhoc',
    name: 'Môn Học (MON_HOC)',
    groupId: 'teaching',
    meaning: 'Danh mục các môn học trong chương trình đào tạo chuẩn.',
    identifier: 'Mã môn học (MaMonHoc [PK])',
    keyAttributes: ['MaMonHoc', 'TenMonHoc', 'SoTinChi', 'SoTiet', 'LoaiMonHoc'],
    relationships: 'Được phân công giảng dạy cho nhiều lớp trong các học kỳ thông qua PHAN_CONG.',
    example: 'CSDL101 - Cơ sở dữ liệu (3 tín chỉ, 45 tiết, Bắt buộc).',
    justification: 'Chuẩn hóa danh mục môn học, dùng chung cho toàn bộ kế hoạch đào tạo.',
    tableRef: 'MON_HOC'
  },
  {
    id: 'ent_phancong',
    name: 'Phân Công Giảng Dạy (PHAN_CONG) ★ Mắt Xích Cốt Lõi',
    groupId: 'teaching',
    meaning: 'Quyết định phân công Giảng viên giảng dạy một Môn học cụ thể cho một Lớp trong Học kỳ.',
    identifier: 'Mã phân công (MaPhanCong [PK])',
    keyAttributes: ['MaPhanCong', 'MaGV', 'MaMonHoc', 'MaLop', 'MaHocKy', 'NhomHoc', 'SoTiet'],
    relationships: 'Liên kết 4 bên: GIANG_VIEN (1) + MON_HOC (1) + LOP_HOC (1) + HOC_KY (1) ➔ PHAN_CONG (N).',
    example: 'PC_CSDL_01: TS. Lê Đức Thắng dạy môn CSDL cho Lớp CNTT2-K58 trong Học kỳ 1 năm học 2025-2026.',
    justification: 'MẮT XÍCH TRUNG TÂM: Cho phép biết chính xác giảng viên nào dạy môn gì, cho lớp nào, vào kỳ nào và chịu trách nhiệm nhập điểm cho lớp đó.',
    tableRef: 'PHAN_CONG'
  },

  // Nhóm 4: Điểm số & Khảo thí
  {
    id: 'ent_loaidiem',
    name: 'Loại Điểm & Trọng Số (LOAI_DIEM)',
    groupId: 'grading',
    meaning: 'Cấu hình linh hoạt các đầu điểm: Chuyên cần, Thường xuyên, Bài tập lớn, Thi kết thúc...',
    identifier: 'Mã loại điểm (MaLoaiDiem [PK])',
    keyAttributes: ['MaLoaiDiem', 'TenLoaiDiem', 'TrongSo'],
    relationships: 'Được tham chiếu bởi từng bản ghi điểm chi tiết DIEM để tính trọng số.',
    example: 'LD_CC (Chuyên cần 10%), LD_TX (Thường xuyên 30%), LD_CK (Cuối kỳ 60%).',
    justification: 'ĐỘNG HÓA CÔNG THỨC: Không hardcode cố định tên cột điểm; cho phép điều chỉnh trọng số linh hoạt.',
    tableRef: 'LOAI_DIEM'
  },
  {
    id: 'ent_ketqua',
    name: 'Kết Quả Học Tập (KET_QUA_HOC_TAP)',
    groupId: 'grading',
    meaning: 'Tổng kết kết quả học tập của một học viên đối với một đợt phân công môn học.',
    identifier: 'Mã kết quả (MaKQ [PK])',
    keyAttributes: ['MaKQ', 'MaHV', 'MaPhanCong', 'DiemTongKet', 'XepLoai', 'TrangThai'],
    relationships: 'Quan hệ nhiều-nhiều giữa HOC_VIEN và PHAN_CONG; Chứa nhiều điểm thành phần DIEM (1:N).',
    example: 'HV001 học phân công PC_CSDL_01 đạt Điểm tổng kết 7.4, Xếp loại Khá.',
    justification: 'Lưu trữ điểm tổng kết và xếp loại cuối cùng sau khi đã quy đổi theo trọng số.',
    tableRef: 'KET_QUA_HOC_TAP'
  },
  {
    id: 'ent_diem',
    name: 'Điểm Chi Tiết (DIEM)',
    groupId: 'grading',
    meaning: 'Chi tiết từng con điểm thành phần được Giảng viên hoặc Phòng Khảo thí nhập vào hệ thống.',
    identifier: 'Mã điểm (MaDiem [PK])',
    keyAttributes: ['MaDiem', 'MaKQ', 'MaLoaiDiem', 'Diem', 'NgayNhap', 'MaNguoiNhap'],
    relationships: 'Gắn liền với KET_QUA_HOC_TAP; Thuộc 1 LOAI_DIEM; Lưu vết người nhập MaNguoiNhap (Giảng viên/Khảo thí).',
    example: 'Giảng viên Lê Đức Thắng nhập Điểm chuyên cần: 8.5 cho học viên Nguyễn Văn An ngày 20/11/2025.',
    justification: 'Ghi nhận chi tiết, minh bạch từng đầu điểm, lưu vết thời gian và người nhập bảo đảm tính giải trình.',
    tableRef: 'DIEM'
  },
  {
    id: 'ent_dotthi',
    name: 'Đợt Thi Kết Thúc Môn (DOT_THI)',
    groupId: 'grading',
    meaning: 'Tổ chức thi kết thúc học phần Lần 1 và Thi lại Lần 2 độc lập cho từng phân công giảng dạy.',
    identifier: 'Mã đợt thi (MaDotThi [PK])',
    keyAttributes: ['MaDotThi', 'MaPhanCong', 'TenDotThi', 'LoaiDotThi', 'NgayThi'],
    relationships: 'Thuộc 1 PHAN_CONG; Tổ chức thi cho các học viên thuộc phân công đó.',
    example: 'Đợt thi kết thúc môn CSDL Lần 1 (ngày 25/12/2025); Đợt thi lại Lần 2 (ngày 10/01/2026).',
    justification: 'Tách bạch khâu giảng dạy của Giảng viên với khâu Khảo thí thi kết thúc môn theo đúng quy chế.',
    tableRef: 'DOT_THI'
  }
];
