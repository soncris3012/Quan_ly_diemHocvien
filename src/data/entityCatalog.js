// src/data/entityCatalog.js
// Danh mục thực thể phân loại theo 4 nhóm màu sắc trực quan

export const ENTITY_GROUPS = [
  { id: 'org', name: 'Tổ chức & Con người', color: '#38BDF8', tagClass: 'tag-blue' },
  { id: 'train', name: 'Đào tạo & Kế hoạch', color: '#A78BFA', tagClass: 'tag-purple' },
  { id: 'score', name: 'Kết quả & Đánh giá', color: '#34D399', tagClass: 'tag-emerald' },
  { id: 'audit', name: 'Kiểm soát & Lịch sử', color: '#FBBF24', tagClass: 'tag-amber' }
];

export const ENTITIES = [
  // Nhóm 1: Tổ chức & Con người
  {
    id: 'ent_donvi',
    name: 'Đơn Vị',
    groupId: 'org',
    meaning: 'Cơ cấu tổ chức quân đội phân cấp từ Tiểu đoàn xuống các Đại đội trực thuộc.',
    identifier: 'Mã đơn vị (MaDonVi)',
    keyAttributes: ['MaDonVi', 'TenDonVi', 'LoaiDonVi', 'MaDonViCha'],
    relationships: '1 Đơn vị có 0..N đơn vị con (Quan hệ đệ quy); 1 Đơn vị quản lý 0..N Lớp học; 1 Đơn vị được quản lý bởi 0..N Chỉ huy qua thời gian.',
    example: 'Tiểu đoàn 1 (d1) quản lý Đại đội 1 (d1_c1) và Đại đội 2 (d1_c2).',
    justification: 'Môi trường quân sự quản lý học viên theo chế độ quân lệnh và đơn vị biên chế, xác định ranh giới bảo mật thông tin.',
    tableRef: 'DonVi'
  },
  {
    id: 'ent_lophoc',
    name: 'Lớp Niên Chế',
    groupId: 'org',
    meaning: 'Tập thể học viên thuộc cùng một ngành, cùng một khóa tuyển sinh và sinh hoạt trong một đại đội.',
    identifier: 'Mã lớp (MaLop)',
    keyAttributes: ['MaLop', 'TenLop', 'MaNganh', 'MaKhoa', 'MaDonVi'],
    relationships: 'Thuộc 1 Ngành, 1 Khóa học, 1 Đơn vị; Chứa 1..N Học viên; Là đối tượng tiếp nhận Kế hoạch đào tạo.',
    example: 'Lớp CNTT2-K58 thuộc ngành CNTT, khóa K58, biên chế tại Đại đội 1.',
    justification: 'Quân đội bố trí kế hoạch giảng dạy tập trung theo từng lớp niên chế, không cho phép học viên tự chọn lớp phân tán.',
    tableRef: 'LopHoc'
  },
  {
    id: 'ent_hocvien',
    name: 'Học Viên Quân Sự',
    groupId: 'org',
    meaning: 'Quân nhân đang theo học các khóa đào tạo chính quy trong nhà trường quân sự.',
    identifier: 'Mã học viên / Số hiệu quân nhân (MaHV)',
    keyAttributes: ['MaHV', 'HoTen', 'NgaySinh', 'MaLop', 'MaTaiKhoan'],
    relationships: 'Thuộc đúng 1 Lớp niên chế hiện tại; Liên kết với tối đa 1 Tài khoản; Tham gia nhiều Lớp học phần thông qua Lượt học.',
    example: 'Học viên HV001 - Nguyễn Văn An, sinh năm 2004, lớp CNTT2-K58.',
    justification: 'Thực thể trung tâm chịu sự giám sát của chỉ huy và là chủ thể của mọi dữ liệu học tập, rèn luyện.',
    tableRef: 'HocVien'
  },
  {
    id: 'ent_taikhoan',
    name: 'Tài Khoản & Phân Quyền',
    groupId: 'org',
    meaning: 'Định danh định danh người dùng và xác thực phân quyền trên hệ thống.',
    identifier: 'Mã tài khoản (MaTaiKhoan)',
    keyAttributes: ['MaTaiKhoan', 'TenDangNhap', 'TenHienThi', 'TrangThai'],
    relationships: 'Liên kết N-N với Vai trò; Gắn với Học viên hoặc gắn với Đơn vị qua Quyết định phân công quản lý.',
    example: 'Tài khoản TK_CH_C1 đại diện cho Đại đội trưởng Đại đội 1.',
    justification: 'Tách riêng lớp bảo mật xác thực khỏi thông tin lý lịch cá nhân, hỗ trợ cơ chế RBAC và chuyển giao tài khoản khi luân chuyển cán bộ.',
    tableRef: 'TaiKhoan'
  },
  {
    id: 'ent_phancong',
    name: 'Phân Công Quản Lý',
    groupId: 'org',
    meaning: 'Quyết định giao quyền chỉ huy, quản lý một đơn vị quân sự cho cán bộ trong một khoảng thời gian cụ thể.',
    identifier: 'Mã phân công (MaPhanCong)',
    keyAttributes: ['MaPhanCong', 'MaTaiKhoan', 'MaDonVi', 'ChucVu', 'TuNgay', 'DenNgay'],
    relationships: 'Liên kết 1 Tài khoản chỉ huy với 1 Đơn vị quân sự theo mốc thời gian.',
    example: 'Đại úy Trần Văn Bình quản lý Đại đội 1 từ 01/01/2025 đến nay.',
    justification: 'Giải quyết bài toán phân quyền: Giúp hệ thống biết chính xác chỉ huy nào được phép xem điểm của học viên nào tại bất kỳ thời điểm nào.',
    tableRef: 'PhanCongQuanLy'
  },

  // Nhóm 2: Đào tạo & Kế hoạch
  {
    id: 'ent_hocphan',
    name: 'Học Phần (Môn Học)',
    groupId: 'train',
    meaning: 'Đơn vị kiến thức chuẩn mực có thời lượng, số tín chỉ và chuẩn đầu ra xác định.',
    identifier: 'Mã học phần (MaHP)',
    keyAttributes: ['MaHP', 'TenHP', 'SoTinChi', 'SoTietLyThuyet', 'SoTietThucHanh'],
    relationships: 'Được bố trí trong nhiều Kế hoạch đào tạo; có thể được mở thành nhiều Lớp học phần.',
    example: 'CSDL101 - Cơ sở dữ liệu (3 tín chỉ, 30 lý thuyết, 15 thực hành).',
    justification: 'Chuẩn hóa danh mục môn học, bảo đảm tính tái sử dụng trong toàn bộ chương trình giáo dục.',
    tableRef: 'HocPhan'
  },
  {
    id: 'ent_kehoach',
    name: 'Kế Hoạch Đào Tạo Khung',
    groupId: 'train',
    meaning: 'Chủ trương bố trí một môn học cho một lớp niên chế trong một học kỳ cụ thể.',
    identifier: 'Mã kế hoạch (MaKeHoach)',
    keyAttributes: ['MaKeHoach', 'MaLop', 'MaHP', 'MaHK', 'TrangThai'],
    relationships: 'Tham chiếu đồng thời Lớp học, Học phần và Học kỳ; làm căn cứ để mở các Lớp học phần.',
    example: 'Lớp CNTT2-K58 được lên kế hoạch học môn CSDL101 trong Học kỳ 1 năm học 2025-2026.',
    justification: 'Phản ánh đúng đặc thù quân sự: Phòng Đào tạo phân bổ chương trình theo kế hoạch khung từ trước, lớp học viên học theo lệnh điều động.',
    tableRef: 'KeHoachDaoTao'
  },
  {
    id: 'ent_quytac',
    name: 'Quy Tắc Đánh Giá (Versioning Rules)',
    groupId: 'train',
    meaning: 'Tập hợp các thông số tính điểm, ngưỡng đạt, trần thi lại và thuật toán làm tròn được phiên bản hóa.',
    identifier: 'Mã quy tắc (MaQuyTac)',
    keyAttributes: ['MaQuyTac', 'TenQuyTac', 'PhienBan', 'TrongSoCC', 'TrongSoTX', 'TrongSoCK', 'NguongCK', 'TranDiemThiLai'],
    relationships: 'Được tham chiếu bởi các Lớp học phần để áp dụng tính điểm đồng nhất.',
    example: 'QT_QS_2025 (Chuyên cần 10%, Thường xuyên 30%, Cuối kỳ 60%, Ngưỡng liệt cuối kỳ 4.0, Trần thi lại 6.9).',
    justification: 'KHÔNG hardcode công thức trong mã nguồn! Khi nhà trường thay đổi quy chế thi, việc có thực thể Quy tắc cho phép dữ liệu quá khứ không bị sai lệch khi tính lại.',
    tableRef: 'QuyTacDanhGia'
  },
  {
    id: 'ent_lophocphan',
    name: 'Lớp Học Phần Thực Tế',
    groupId: 'train',
    meaning: 'Lớp học cụ thể được triển khai trên thực tế để giảng dạy theo một dòng kế hoạch.',
    identifier: 'Mã lớp học phần (MaLHP)',
    keyAttributes: ['MaLHP', 'MaKeHoach', 'MaQuyTac', 'TenLHP', 'NgayBatDau', 'NgayKetThuc'],
    relationships: 'Thuộc 1 Kế hoạch; áp dụng 1 Quy tắc đánh giá; chứa 1..N Lượt học của học viên.',
    example: 'LHP_CSDL_01 (Cơ sở dữ liệu - Nhóm 1, học từ 05/09/2025 đến 30/12/2025).',
    justification: 'Một kế hoạch có thể chia làm nhiều lớp học phần nếu quân số đông; hoặc mở lớp riêng cho học viên học lại ghép lớp.',
    tableRef: 'LopHocPhan'
  },

  // Nhóm 3: Kết quả & Đánh giá
  {
    id: 'ent_luothoc',
    name: 'Lượt Học (Study Attempt)',
    groupId: 'score',
    meaning: 'Sự tham gia của một học viên cụ thể trong một lớp học phần.',
    identifier: 'Mã lượt học (MaLuotHoc)',
    keyAttributes: ['MaLuotHoc', 'MaHV', 'MaLHP', 'LoaiLuotHoc', 'MaLuotHocTruoc'],
    relationships: 'Liên kết Học viên với Lớp học phần (giải quyết quan hệ N-N); sở hữu duy nhất 1 Bảng điểm; có quan hệ đệ quy trỏ về lượt học cũ.',
    example: 'HV001 học Cơ sở dữ liệu lần đầu (LH001); nếu trượt, kỳ sau học lại tạo lượt học mới (LH002) có MaLuotHocTruoc = LH001.',
    justification: 'ĐIỂM SÁNG HỌC THUẬT: Tách biệt hoàn toàn việc học lại với học lần đầu. Mỗi lượt học giữ trọn vẹn điểm số, lần thi và trạng thái riêng biệt.',
    tableRef: 'LuotHoc'
  },
  {
    id: 'ent_bangdiem',
    name: 'Bảng Điểm Lượt Học',
    groupId: 'score',
    meaning: 'Bảng tổng hợp điểm thành phần và điểm tổng kết cuối cùng cho một lượt học.',
    identifier: 'Mã bảng điểm (MaBangDiem)',
    keyAttributes: ['MaBangDiem', 'MaLuotHoc', 'DiemCC', 'DiemTX', 'DiemTongKetChot', 'TrangThaiKhoa'],
    relationships: 'Quan hệ 1-1 với Lượt học; Chứa 1..N Lần thi; Có 0..N Yêu cầu mở khóa và 0..N Nhật ký sửa đổi.',
    example: 'Bảng điểm BD001: Chuyên cần 8.0, Thường xuyên 7.0, Tổng kết chốt 6.5, Trạng thái: ĐÃ KHÓA.',
    justification: 'Lưu trữ giá trị tổng kết sau khi chốt sổ điểm và đóng vai trò chốt chặn kiểm soát bảo mật dữ liệu.',
    tableRef: 'BangDiem'
  },
  {
    id: 'ent_lanthi',
    name: 'Lần Thi Học Phần',
    groupId: 'score',
    meaning: 'Chi tiết từng lần thi kết thúc học phần (Lần 1 hoặc Lần 2 thi lại).',
    identifier: 'Mã lần thi (MaLanThi)',
    keyAttributes: ['MaLanThi', 'MaBangDiem', 'SoLanThi', 'NgayThi', 'DiemThiThucTe', 'TrangThaiDuThi'],
    relationships: 'Thuộc đúng 1 Bảng điểm; Bị giới hạn số lần thi theo Quy tắc đánh giá.',
    example: 'Lần thi 1: 3.5 điểm (Trượt) -> Lần thi 2: 8.0 điểm (Thi lại đạt điểm cao, trần công nhận 6.9).',
    justification: 'Không dồn mọi lần thi vào 1 cột điểm! Giữ nguyên điểm chấm bài thi thực tế để phục vụ lưu trữ học thuật và minh bạch phúc khảo.',
    tableRef: 'LanThi'
  },

  // Nhóm 4: Kiểm soát & Lịch sử
  {
    id: 'ent_yeucaumokhoa',
    name: 'Yêu Cầu Mở Khóa Điểm',
    groupId: 'audit',
    meaning: 'Đề nghị chính thức từ Phòng Đào tạo gửi Ban Giám đốc xin phép mở khóa sổ điểm đã đóng.',
    identifier: 'Mã yêu cầu (MaYeuCau)',
    keyAttributes: ['MaYeuCau', 'MaBangDiem', 'NguoiYeuCau', 'LyDo', 'TrangThai', 'NguoiDuyet', 'HanDuocSua'],
    relationships: 'Gắn liền với 1 Bảng điểm cụ thể; Được tạo bởi Cán bộ đào tạo; Được phê duyệt bởi Ban Giám đốc.',
    example: 'YC_2026_001: Xin mở khóa bảng điểm BD001 do có quyết định phúc khảo bài thi, Ban Giám đốc duyệt cho sửa trong 24 giờ.',
    justification: 'Thay vì một nút bấm mở khóa tùy tiện, thực thể này ràng buộc trách nhiệm hành chính và giới hạn thời gian can thiệp dữ liệu.',
    tableRef: 'YeuCauMoKhoa'
  },
  {
    id: 'ent_nhatkydiem',
    name: 'Nhật Ký Điểm (Audit Trail)',
    groupId: 'audit',
    meaning: 'Sổ cái ghi nhận bất biến mọi sự kiện thay đổi dữ liệu điểm số.',
    identifier: 'Mã nhật ký (MaNhatKy)',
    keyAttributes: ['MaNhatKy', 'MaBangDiem', 'LoaiThaoTac', 'TenTruong', 'GiaTriCu', 'GiaTriMoi', 'NguoiThucHien', 'ThoiDiem'],
    relationships: 'Tham chiếu Bảng điểm, Lần thi (nếu có) và Yêu cầu mở khóa phê chuẩn.',
    example: 'Cán bộ Đào tạo sửa DiemThiThucTe từ 3.0 thành 5.5 vào lúc 10:15 ngày 12/01/2026 căn cứ theo YC_2026_001.',
    justification: 'Đáp ứng nguyên tắc kiểm toán và thanh tra trong môi trường quân sự: Mọi thay đổi điểm sau khi khóa đều phải có chứng từ và vết lưu lại vĩnh viễn.',
    tableRef: 'NhatKyDiem'
  }
];
