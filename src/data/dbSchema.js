// src/data/dbSchema.js
// Đặc tả 19 bảng quan hệ chuẩn hóa cho CADET DB

export const SCHEMA_GROUPS = {
  org: {
    id: 'org',
    name: 'Tổ chức & Người dùng',
    code: 'GROUP_A',
    color: 'var(--color-blue)',
    colorTag: 'tag-blue',
    hex: '#38BDF8',
    description: 'Mô hình hóa cơ cấu tổ chức đơn vị quân đội, lớp niên chế, hồ sơ học viên, tài khoản và phân quyền quản lý'
  },
  train: {
    id: 'train',
    name: 'Kế hoạch & Đào tạo',
    code: 'GROUP_B',
    color: 'var(--color-purple)',
    colorTag: 'tag-purple',
    hex: '#A78BFA',
    description: 'Quản lý danh mục học phần, học kỳ, kế hoạch khung theo lớp, phiên bản quy tắc tính điểm và các lớp học phần thực tế'
  },
  score: {
    id: 'score',
    name: 'Quá trình học & Điểm',
    code: 'GROUP_C',
    color: 'var(--color-emerald)',
    colorTag: 'tag-emerald',
    hex: '#34D399',
    description: 'Ghi nhận từng lượt học (học lần đầu vs học lại), bảng điểm tổng hợp và các lần thi cụ thể (thi lần 1 vs thi lại)'
  },
  audit: {
    id: 'audit',
    name: 'Kiểm soát & Lịch sử',
    code: 'GROUP_D',
    color: 'var(--color-amber)',
    colorTag: 'tag-amber',
    hex: '#FBBF24',
    description: 'Theo dõi quy trình đề nghị mở khóa điểm được Ban Giám đốc phê duyệt và nhật ký biến động điểm số trước - sau'
  }
};

export const TABLES = [
  // ==========================================
  // NHÓM A: TỔ CHỨC VÀ NGƯỜI DÙNG (9 bảng)
  // ==========================================
  {
    id: 'DonVi',
    name: 'DonVi',
    groupId: 'org',
    title: 'Đơn Vị Quản Lý Quân Sự',
    description: 'Lưu trữ cơ cấu tổ chức phân cấp theo cây đơn vị quân sự (Tiểu đoàn - Đại đội).',
    justification: 'Quân đội quản lý con người theo biên chế quân sự. Cần bảng này để xác định cấp chỉ huy trực tiếp và phân quyền truy cập điểm theo phạm vi chỉ huy.',
    columns: [
      { name: 'MaDonVi', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã định danh đơn vị', domain: 'Duy nhất', example: 'd1_c1' },
      { name: 'TenDonVi', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên phiên hiệu đơn vị', domain: 'Văn bản', example: 'Đại đội 1' },
      { name: 'LoaiDonVi', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Cấp đơn vị quân sự', domain: 'TIEU_DOAN, DAI_DOI', example: 'DAI_DOI' },
      { name: 'MaDonViCha', type: 'VARCHAR(20)', key: 'FK', nullable: true, description: 'Tham chiếu đơn vị cấp trên (Quan hệ đệ quy)', domain: 'Tham chiếu DonVi', example: 'd1', ref: { table: 'DonVi', column: 'MaDonVi' } },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Trạng thái hoạt động', domain: 'HOAT_DONG, DANG_GIAI_THE', example: 'HOAT_DONG' }
    ],
    constraints: [
      'PK: MaDonVi',
      'FK: MaDonViCha trỏ về DonVi(MaDonVi)',
      'CHECK: MaDonViCha <> MaDonVi (Không tự làm cha của chính mình)',
      'Ràng buộc phi chu trình (Acyclic tree hierarchy)'
    ]
  },
  {
    id: 'NganhDaoTao',
    name: 'NganhDaoTao',
    groupId: 'org',
    title: 'Ngành Đào Tạo',
    description: 'Danh mục các chuyên ngành kỹ thuật và nghiệp vụ quân sự.',
    justification: 'Tránh lặp lại tên ngành ở nhiều lớp, chuẩn hóa chuẩn đầu ra theo ngành.',
    columns: [
      { name: 'MaNganh', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã ngành đào tạo', domain: 'Duy nhất', example: 'CNTT' },
      { name: 'TenNganh', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên đầy đủ của ngành', domain: 'Văn bản', example: 'Công nghệ thông tin Quân sự' },
      { name: 'MoTa', type: 'NVARCHAR(255)', key: null, nullable: true, description: 'Mô tả tóm tắt mục tiêu', domain: 'Văn bản', example: 'Đào tạo kỹ sư an toàn thông tin & tác chiến mạng' }
    ],
    constraints: ['PK: MaNganh']
  },
  {
    id: 'KhoaHoc',
    name: 'KhoaHoc',
    groupId: 'org',
    title: 'Khóa Đào Tạo',
    description: 'Quản lý khóa tuyển sinh và niên khóa đào tạo.',
    justification: 'Học viên quân sự đào tạo theo khóa niên chế tập trung; phân biệt khung chương trình theo từng khóa.',
    columns: [
      { name: 'MaKhoa', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã khóa học', domain: 'Duy nhất', example: 'K58' },
      { name: 'TenKhoa', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên gọi khóa', domain: 'Văn bản', example: 'Khóa 58 Đại học Quân sự' },
      { name: 'NamNhapHoc', type: 'INT', key: null, nullable: false, description: 'Năm tuyển sinh nhập ngũ', domain: '> 1950', example: '2023' },
      { name: 'NamKetThucDuKien', type: 'INT', key: null, nullable: false, description: 'Năm tốt nghiệp dự kiến', domain: '>= NamNhapHoc', example: '2028' }
    ],
    constraints: [
      'PK: MaKhoa',
      'CHECK: NamKetThucDuKien >= NamNhapHoc'
    ]
  },
  {
    id: 'LopHoc',
    name: 'LopHoc',
    groupId: 'org',
    title: 'Lớp Niên Chế (Lớp Hành Chính)',
    description: 'Lớp học truyền thống gắn liền với một ngành, một khóa và thuộc biên chế một đại đội.',
    justification: 'Trong quân đội, học viên sinh hoạt theo lớp niên chế thuộc một đơn vị quân sự cụ thể.',
    columns: [
      { name: 'MaLop', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã lớp hành chính', domain: 'Duy nhất', example: 'CNTT2-K58' },
      { name: 'TenLop', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên lớp', domain: 'Văn bản', example: 'Lớp Công nghệ thông tin 2' },
      { name: 'MaNganh', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Thuộc ngành đào tạo', domain: 'Tham chiếu NganhDaoTao', example: 'CNTT', ref: { table: 'NganhDaoTao', column: 'MaNganh' } },
      { name: 'MaKhoa', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Thuộc khóa học', domain: 'Tham chiếu KhoaHoc', example: 'K58', ref: { table: 'KhoaHoc', column: 'MaKhoa' } },
      { name: 'MaDonVi', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Đại đội biên chế quản lý', domain: 'Tham chiếu DonVi', example: 'd1_c1', ref: { table: 'DonVi', column: 'MaDonVi' } },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Tình trạng lớp', domain: 'DANG_HOC, DA_TOT_NGHIEP', example: 'DANG_HOC' }
    ],
    constraints: [
      'PK: MaLop',
      'FK: MaNganh -> NganhDaoTao(MaNganh)',
      'FK: MaKhoa -> KhoaHoc(MaKhoa)',
      'FK: MaDonVi -> DonVi(MaDonVi)'
    ]
  },
  {
    id: 'HocVien',
    name: 'HocVien',
    groupId: 'org',
    title: 'Hồ Sơ Học Viên Quân Sự',
    description: 'Lưu lý lịch học viên, lớp niên chế hiện tại và tài khoản liên kết.',
    justification: 'Thực thể trung tâm chịu sự quản lý của đơn vị và là chủ thể của kết quả học tập.',
    columns: [
      { name: 'MaHV', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã học viên (Số hiệu quân nhân)', domain: 'Duy nhất', example: 'HV001' },
      { name: 'HoTen', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Họ và tên học viên', domain: 'Văn bản', example: 'Nguyễn Văn An' },
      { name: 'NgaySinh', type: 'DATE', key: null, nullable: false, description: 'Ngày tháng năm sinh', domain: 'Date', example: '2004-05-12' },
      { name: 'MaLop', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Lớp niên chế hiện tại', domain: 'Tham chiếu LopHoc', example: 'CNTT2-K58', ref: { table: 'LopHoc', column: 'MaLop' } },
      { name: 'MaTaiKhoan', type: 'VARCHAR(20)', key: 'FK, UQ', nullable: true, description: 'Tài khoản đăng nhập hệ thống', domain: 'Tham chiếu TaiKhoan (Duy nhất nếu có)', example: 'TK001', ref: { table: 'TaiKhoan', column: 'MaTaiKhoan' } },
      { name: 'TrangThaiHocTap', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Tình trạng học tập', domain: 'DANG_HOC, THOI_HOC, BAO_LUU', example: 'DANG_HOC' }
    ],
    constraints: [
      'PK: MaHV',
      'FK: MaLop -> LopHoc(MaLop)',
      'FK: MaTaiKhoan -> TaiKhoan(MaTaiKhoan)',
      'UQ: MaTaiKhoan (Một tài khoản chỉ gắn với tối đa 1 học viên)'
    ]
  },
  {
    id: 'TaiKhoan',
    name: 'TaiKhoan',
    groupId: 'org',
    title: 'Tài Khoản Xác Thực',
    description: 'Chứa thông tin đăng nhập dùng chung cho cả cán bộ, chỉ huy và học viên.',
    justification: 'Tách riêng cơ chế xác thực khỏi thông tin con người, hỗ trợ nhiều loại người dùng đồng nhất.',
    columns: [
      { name: 'MaTaiKhoan', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã tài khoản', domain: 'Duy nhất', example: 'TK_CH_C1' },
      { name: 'TenDangNhap', type: 'VARCHAR(50)', key: 'UQ', nullable: false, description: 'Username đăng nhập', domain: 'Duy nhất', example: 'chihuy_c1' },
      { name: 'MatKhauHash', type: 'VARCHAR(255)', key: null, nullable: false, description: 'Mã băm mật khẩu', domain: 'Mã băm an toàn (demo không lộ)', example: '$2a$12$...' },
      { name: 'TenHienThi', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên hiển thị trên hệ thống', domain: 'Văn bản', example: 'Đại úy Trần Văn Bình - Ctr C1' },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Trạng thái tài khoản', domain: 'KICH_HOAT, TAM_KHOA', example: 'KICH_HOAT' }
    ],
    constraints: [
      'PK: MaTaiKhoan',
      'UQ: TenDangNhap'
    ]
  },
  {
    id: 'VaiTro',
    name: 'VaiTro',
    groupId: 'org',
    title: 'Danh Mục Vai Trò Hệ Thống',
    description: 'Định nghĩa các nhóm quyền: Học viên, Chỉ huy đơn vị, Phòng Đào tạo, Ban Giám đốc.',
    justification: 'Áp dụng mô hình kiểm soát truy cập dựa trên vai trò (RBAC - Role-Based Access Control).',
    columns: [
      { name: 'MaVaiTro', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã vai trò', domain: 'Duy nhất', example: 'ROLE_CH' },
      { name: 'TenVaiTro', type: 'NVARCHAR(50)', key: 'UQ', nullable: false, description: 'Tên vai trò', domain: 'Văn bản', example: 'Chỉ huy đơn vị' },
      { name: 'MoTa', type: 'NVARCHAR(255)', key: null, nullable: true, description: 'Mô tả quyền hạn', domain: 'Văn bản', example: 'Xem và giám sát kết quả học viên thuộc đơn vị mình phụ trách' }
    ],
    constraints: [
      'PK: MaVaiTro',
      'UQ: TenVaiTro'
    ]
  },
  {
    id: 'TaiKhoanVaiTro',
    name: 'TaiKhoanVaiTro',
    groupId: 'org',
    title: 'Gán Vai Trò Cho Tài Khoản (N-N)',
    description: 'Bảng liên kết giải quyết quan hệ nhiều-nhiều giữa tài khoản và vai trò.',
    justification: 'Một tài khoản cán bộ có thể kiêm nhiệm nhiều vai trò.',
    columns: [
      { name: 'MaTaiKhoan', type: 'VARCHAR(20)', key: 'PK, FK', nullable: false, description: 'Tài khoản', domain: 'Tham chiếu TaiKhoan', example: 'TK_CH_C1', ref: { table: 'TaiKhoan', column: 'MaTaiKhoan' } },
      { name: 'MaVaiTro', type: 'VARCHAR(20)', key: 'PK, FK', nullable: false, description: 'Vai trò được gán', domain: 'Tham chiếu VaiTro', example: 'ROLE_CH', ref: { table: 'VaiTro', column: 'MaVaiTro' } }
    ],
    constraints: [
      'PK: (MaTaiKhoan, MaVaiTro)',
      'FK: MaTaiKhoan -> TaiKhoan(MaTaiKhoan)',
      'FK: MaVaiTro -> VaiTro(MaVaiTro)'
    ]
  },
  {
    id: 'PhanCongQuanLy',
    name: 'PhanCongQuanLy',
    groupId: 'org',
    title: 'Phân Công Phạm Vi Quản Lý Của Chỉ Huy',
    description: 'Gắn tài khoản chỉ huy với đơn vị quân sự cụ thể theo khoảng thời gian hiệu lực.',
    justification: 'Làm rõ yêu cầu: Chỉ huy chỉ được xem điểm học viên thuộc đại đội/tiểu đoàn mình phụ trách; có thể luân chuyển công tác theo thời gian.',
    columns: [
      { name: 'MaPhanCong', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã quyết định phân công', domain: 'Duy nhất', example: 'PC001' },
      { name: 'MaTaiKhoan', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Tài khoản chỉ huy', domain: 'Tham chiếu TaiKhoan', example: 'TK_CH_C1', ref: { table: 'TaiKhoan', column: 'MaTaiKhoan' } },
      { name: 'MaDonVi', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Đơn vị được giao quản lý', domain: 'Tham chiếu DonVi', example: 'd1_c1', ref: { table: 'DonVi', column: 'MaDonVi' } },
      { name: 'ChucVu', type: 'NVARCHAR(50)', key: null, nullable: false, description: 'Chức vụ quân sự', domain: 'Đại đội trưởng, Chính trị viên...', example: 'Đại đội trưởng' },
      { name: 'TuNgay', type: 'DATE', key: null, nullable: false, description: 'Ngày bắt đầu phụ trách', domain: 'Date', example: '2025-01-01' },
      { name: 'DenNgay', type: 'DATE', key: null, nullable: true, description: 'Ngày kết thúc (NULL nếu đang công tác)', domain: '>= TuNgay hoặc NULL', example: null }
    ],
    constraints: [
      'PK: MaPhanCong',
      'FK: MaTaiKhoan -> TaiKhoan(MaTaiKhoan)',
      'FK: MaDonVi -> DonVi(MaDonVi)',
      'CHECK: DenNgay IS NULL OR DenNgay >= TuNgay'
    ]
  },

  // ==========================================
  // NHÓM B: KẾ HOẠCH VÀ ĐÀO TẠO (5 bảng)
  // ==========================================
  {
    id: 'HocPhan',
    name: 'HocPhan',
    groupId: 'train',
    title: 'Danh Mục Học Phần (Môn Học)',
    description: 'Chứa thông tin các môn học trong chương trình đào tạo chuẩn.',
    justification: 'Chuẩn hóa số tín chỉ, tiết lý thuyết, thực hành; tránh lặp lại tên môn.',
    columns: [
      { name: 'MaHP', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã học phần', domain: 'Duy nhất', example: 'CSDL101' },
      { name: 'TenHP', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên học phần', domain: 'Văn bản', example: 'Cơ sở dữ liệu' },
      { name: 'SoTinChi', type: 'INT', key: null, nullable: false, description: 'Số tín chỉ', domain: '> 0', example: '3' },
      { name: 'SoTietLyThuyet', type: 'INT', key: null, nullable: false, description: 'Số tiết lý thuyết', domain: '>= 0', example: '30' },
      { name: 'SoTietThucHanh', type: 'INT', key: null, nullable: false, description: 'Số tiết thực hành', domain: '>= 0', example: '15' },
      { name: 'MoTa', type: 'NVARCHAR(255)', key: null, nullable: true, description: 'Mô tả nội dung', domain: 'Văn bản', example: 'Mô hình dữ liệu quan hệ, SQL và chuẩn hóa' }
    ],
    constraints: [
      'PK: MaHP',
      'CHECK: SoTinChi > 0',
      'CHECK: SoTietLyThuyet >= 0 AND SoTietThucHanh >= 0'
    ]
  },
  {
    id: 'HocKy',
    name: 'HocKy',
    groupId: 'train',
    title: 'Học Kỳ Đào Tạo',
    description: 'Xác định các khoảng thời gian học tập trong năm học.',
    justification: 'Mốc thời gian tổ chức kế hoạch giảng dạy, thi kết thúc học phần và tính điểm trung bình học kỳ.',
    columns: [
      { name: 'MaHK', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã học kỳ', domain: 'Duy nhất', example: '2025_HK1' },
      { name: 'TenHK', type: 'NVARCHAR(50)', key: null, nullable: false, description: 'Tên học kỳ', domain: 'Văn bản', example: 'Học kỳ 1 năm học 2025-2026' },
      { name: 'NamHoc', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Năm học', domain: 'YYYY-YYYY', example: '2025-2026' },
      { name: 'NgayBatDau', type: 'DATE', key: null, nullable: false, description: 'Ngày bắt đầu học kỳ', domain: 'Date', example: '2025-09-01' },
      { name: 'NgayKetThuc', type: 'DATE', key: null, nullable: false, description: 'Ngày kết thúc học kỳ', domain: '>= NgayBatDau', example: '2026-01-15' }
    ],
    constraints: [
      'PK: MaHK',
      'CHECK: NgayKetThuc >= NgayBatDau'
    ]
  },
  {
    id: 'KeHoachDaoTao',
    name: 'KeHoachDaoTao',
    groupId: 'train',
    title: 'Kế Hoạch Khung Theo Lớp Niên Chế',
    description: 'Quy định một lớp niên chế được bố trí học môn nào trong học kỳ nào.',
    justification: 'Trong đào tạo quân sự, việc học được tổ chức theo kế hoạch khung định sẵn cho cả khóa/lớp chứ không đăng ký tự do.',
    columns: [
      { name: 'MaKeHoach', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã dòng kế hoạch', domain: 'Duy nhất', example: 'KH_CNTT2_CSDL' },
      { name: 'MaLop', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Lớp niên chế được phân công', domain: 'Tham chiếu LopHoc', example: 'CNTT2-K58', ref: { table: 'LopHoc', column: 'MaLop' } },
      { name: 'MaHP', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Học phần được bố trí', domain: 'Tham chiếu HocPhan', example: 'CSDL101', ref: { table: 'HocPhan', column: 'MaHP' } },
      { name: 'MaHK', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Học kỳ triển khai', domain: 'Tham chiếu HocKy', example: '2025_HK1', ref: { table: 'HocKy', column: 'MaHK' } },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Trạng thái triển khai', domain: 'DU_KIEN, DANG_DAY, HOAN_THANH', example: 'DANG_DAY' },
      { name: 'GhiChu', type: 'NVARCHAR(255)', key: null, nullable: true, description: 'Ghi chú chỉ đạo', domain: 'Văn bản', example: 'Kế hoạch chuẩn theo khung K58' }
    ],
    constraints: [
      'PK: MaKeHoach',
      'UQ: (MaLop, MaHP, MaHK) (Mỗi môn chỉ lập kế hoạch 1 lần cho lớp trong 1 kỳ)',
      'FK: MaLop -> LopHoc(MaLop)',
      'FK: MaHP -> HocPhan(MaHP)',
      'FK: MaHK -> HocKy(MaHK)'
    ]
  },
  {
    id: 'QuyTacDanhGia',
    name: 'QuyTacDanhGia',
    groupId: 'train',
    title: 'Phiên Bản Quy Tắc Đánh Giá Điểm',
    description: 'Lưu cấu hình trọng số, ngưỡng đạt, trần thi lại và thuật toán làm tròn.',
    justification: 'Không hardcode công thức trong code phần mềm! Quy chế đào tạo có thể thay đổi qua các năm; bảng này cho phép giải thích chính xác kết quả của từng đợt học theo quy tắc tại thời điểm đó.',
    columns: [
      { name: 'MaQuyTac', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã bộ quy tắc', domain: 'Duy nhất', example: 'QT_QS_2025' },
      { name: 'TenQuyTac', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên bộ quy tắc', domain: 'Văn bản', example: 'Quy tắc điểm chuẩn Quân sự 2025' },
      { name: 'PhienBan', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Phiên bản áp dụng', domain: 'v1.0, v1.1...', example: 'v1.0' },
      { name: 'TrongSoCC', type: 'DECIMAL(3,2)', key: null, nullable: false, description: 'Trọng số điểm chuyên cần', domain: '0.0 - 1.0', example: '0.10' },
      { name: 'TrongSoTX', type: 'DECIMAL(3,2)', key: null, nullable: false, description: 'Trọng số điểm thường xuyên', domain: '0.0 - 1.0', example: '0.30' },
      { name: 'TrongSoCK', type: 'DECIMAL(3,2)', key: null, nullable: false, description: 'Trọng số điểm cuối kỳ', domain: '0.0 - 1.0', example: '0.60' },
      { name: 'NguongCK', type: 'DECIMAL(3,1)', key: null, nullable: false, description: 'Điểm liệt cuối kỳ', domain: 'Mặc định: 4.0', example: '4.0' },
      { name: 'NguongTongKet', type: 'DECIMAL(3,1)', key: null, nullable: false, description: 'Ngưỡng tổng kết đạt môn', domain: 'Mặc định: 4.0 hoặc 5.0', example: '4.0' },
      { name: 'TranDiemThiLai', type: 'DECIMAL(3,1)', key: null, nullable: false, description: 'Mức trần công nhận khi thi lại', domain: 'Mặc định: 6.9', example: '6.9' },
      { name: 'PhamViApDungTran', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Trần áp dụng cho điểm thi hay tổng kết', domain: 'DIEM_THI, DIEM_TONG_KET', example: 'DIEM_THI' },
      { name: 'SoLanThiToiDa', type: 'INT', key: null, nullable: false, description: 'Số lần thi tối đa trong một lượt học', domain: '1 hoặc 2', example: '2' },
      { name: 'SoChuSoLamTron', type: 'INT', key: null, nullable: false, description: 'Số chữ số thập phân làm tròn', domain: '1 hoặc 2', example: '1' }
    ],
    constraints: [
      'PK: MaQuyTac',
      'CHECK: TrongSoCC + TrongSoTX + TrongSoCK = 1.00',
      'CHECK: TrongSoCC >= 0 AND TrongSoTX >= 0 AND TrongSoCK >= 0'
    ]
  },
  {
    id: 'LopHocPhan',
    name: 'LopHocPhan',
    groupId: 'train',
    title: 'Lớp Học Phần Thực Tế',
    description: 'Đợt mở lớp học cụ thể để giảng dạy một kế hoạch, gắn với một quy tắc đánh giá.',
    justification: 'Phân biệt KeHoachDaoTao (chủ trương kế hoạch) với LopHocPhan (đợt tổ chức lớp thực tế). Một kế hoạch có thể chia làm nhiều lớp học phần nếu quân số đông.',
    columns: [
      { name: 'MaLHP', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã lớp học phần', domain: 'Duy nhất', example: 'LHP_CSDL_01' },
      { name: 'MaKeHoach', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Thuộc dòng kế hoạch', domain: 'Tham chiếu KeHoachDaoTao', example: 'KH_CNTT2_CSDL', ref: { table: 'KeHoachDaoTao', column: 'MaKeHoach' } },
      { name: 'MaQuyTac', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Áp dụng bộ quy tắc tính điểm', domain: 'Tham chiếu QuyTacDanhGia', example: 'QT_QS_2025', ref: { table: 'QuyTacDanhGia', column: 'MaQuyTac' } },
      { name: 'TenLHP', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên lớp học phần', domain: 'Văn bản', example: 'Cơ sở dữ liệu - Nhóm 1' },
      { name: 'NgayBatDau', type: 'DATE', key: null, nullable: false, description: 'Ngày khai giảng đợt học', domain: 'Date', example: '2025-09-05' },
      { name: 'NgayKetThuc', type: 'DATE', key: null, nullable: false, description: 'Ngày kết thúc đợt học', domain: '>= NgayBatDau', example: '2025-12-30' },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Tình trạng lớp học phần', domain: 'DANG_HOC, DA_THI, DA_CHOT_DIEM', example: 'DA_CHOT_DIEM' }
    ],
    constraints: [
      'PK: MaLHP',
      'FK: MaKeHoach -> KeHoachDaoTao(MaKeHoach)',
      'FK: MaQuyTac -> QuyTacDanhGia(MaQuyTac)'
    ]
  },

  // ==========================================
  // NHÓM C: QUÁ TRÌNH HỌC VÀ ĐIỂM (3 bảng)
  // ==========================================
  {
    id: 'LuotHoc',
    name: 'LuotHoc',
    groupId: 'score',
    title: 'Lượt Học Của Học Viên (Study Enrollment)',
    description: 'Ghi nhận một học viên cụ thể tham gia vào một lớp học phần.',
    justification: 'CỰC KỲ QUAN TRỌNG: Phân biệt học lần đầu và học lại! Nếu học viên trượt sau thi lại, kỳ sau học viên sẽ có một LuotHoc MỚI với MaLuotHocTruoc trỏ về lượt cũ để truy vết lịch sử đào tạo.',
    columns: [
      { name: 'MaLuotHoc', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã lượt học', domain: 'Duy nhất', example: 'LH001' },
      { name: 'MaHV', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Học viên tham gia', domain: 'Tham chiếu HocVien', example: 'HV001', ref: { table: 'HocVien', column: 'MaHV' } },
      { name: 'MaLHP', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Lớp học phần tham gia', domain: 'Tham chiếu LopHocPhan', example: 'LHP_CSDL_01', ref: { table: 'LopHocPhan', column: 'MaLHP' } },
      { name: 'LoaiLuotHoc', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Tính chất lượt học', domain: 'HOC_LAN_DAU, HOC_LAI, HOC_CAI_THIEN', example: 'HOC_LAN_DAU' },
      { name: 'MaLuotHocTruoc', type: 'VARCHAR(20)', key: 'FK', nullable: true, description: 'Lượt học trước đó nếu là học lại (Quan hệ đệ quy)', domain: 'Tham chiếu LuotHoc', example: null, ref: { table: 'LuotHoc', column: 'MaLuotHoc' } },
      { name: 'NgayPhanCong', type: 'DATE', key: null, nullable: false, description: 'Ngày xếp vào lớp học phần', domain: 'Date', example: '2025-09-02' },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Trạng thái lượt học', domain: 'DANG_HOC, HOAN_THANH, HUY', example: 'HOAN_THANH' }
    ],
    constraints: [
      'PK: MaLuotHoc',
      'UQ: (MaHV, MaLHP) (Một học viên không thể có 2 lượt học trong cùng 1 lớp học phần)',
      'FK: MaHV -> HocVien(MaHV)',
      'FK: MaLHP -> LopHocPhan(MaLHP)',
      'FK: MaLuotHocTruoc -> LuotHoc(MaLuotHoc)'
    ]
  },
  {
    id: 'BangDiem',
    name: 'BangDiem',
    groupId: 'score',
    title: 'Bảng Điểm Tổng Hợp Cho Lượt Học',
    description: 'Lưu điểm thành phần quá trình (CC, TX), điểm tổng kết sau khi chốt và cờ khóa bảo mật.',
    justification: 'Một lượt học có duy nhất một bảng điểm tổng hợp. Khi chốt điểm, trạng thái khóa kích hoạt ngăn chặn sửa đổi trực tiếp.',
    columns: [
      { name: 'MaBangDiem', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã bảng điểm', domain: 'Duy nhất', example: 'BD001' },
      { name: 'MaLuotHoc', type: 'VARCHAR(20)', key: 'FK, UQ', nullable: false, description: 'Gắn liền với lượt học', domain: 'Tham chiếu LuotHoc (Duy nhất)', example: 'LH001', ref: { table: 'LuotHoc', column: 'MaLuotHoc' } },
      { name: 'DiemCC', type: 'DECIMAL(3,1)', key: null, nullable: true, description: 'Điểm chuyên cần (0.0 - 10.0)', domain: '0.0 - 10.0 hoặc NULL nếu chưa nhập', example: '8.0' },
      { name: 'DiemTX', type: 'DECIMAL(3,1)', key: null, nullable: true, description: 'Điểm kiểm tra thường xuyên', domain: '0.0 - 10.0 hoặc NULL nếu chưa nhập', example: '7.0' },
      { name: 'DiemTongKetChot', type: 'DECIMAL(3,1)', key: null, nullable: true, description: 'Điểm tổng kết chính thức được chốt', domain: '0.0 - 10.0 hoặc NULL', example: '6.5' },
      { name: 'KetQuaChot', type: 'VARCHAR(20)', key: null, nullable: true, description: 'Đánh giá kết quả', domain: 'DAT, KHONG_DAT, CHUA_XET', example: 'DAT' },
      { name: 'TrangThaiKhoa', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Trạng thái khóa bảng điểm', domain: 'DANG_MO, DA_KHOA, MO_KHOA_TAM', example: 'DA_KHOA' },
      { name: 'NguoiChot', type: 'VARCHAR(20)', key: 'FK', nullable: true, description: 'Cán bộ thực hiện chốt điểm', domain: 'Tham chiếu TaiKhoan', example: 'TK_DAO_TAO', ref: { table: 'TaiKhoan', column: 'MaTaiKhoan' } },
      { name: 'ThoiDiemChot', type: 'DATETIME', key: null, nullable: true, description: 'Thời điểm đóng sổ điểm', domain: 'DateTime', example: '2026-01-10 16:30:00' }
    ],
    constraints: [
      'PK: MaBangDiem',
      'UQ: MaLuotHoc (Quan hệ 1-1 giữa LuotHoc và BangDiem)',
      'FK: MaLuotHoc -> LuotHoc(MaLuotHoc)',
      'FK: NguoiChot -> TaiKhoan(MaTaiKhoan)',
      'CHECK: DiemCC BETWEEN 0 AND 10 OR DiemCC IS NULL',
      'CHECK: DiemTX BETWEEN 0 AND 10 OR DiemTX IS NULL',
      'CHECK: DiemTongKetChot BETWEEN 0 AND 10 OR DiemTongKetChot IS NULL'
    ]
  },
  {
    id: 'LanThi',
    name: 'LanThi',
    groupId: 'score',
    title: 'Chi Tiết Lần Thi Kết Thúc Học Phần',
    description: 'Tách riêng từng lần thi (Lần 1, Lần 2 thi lại) cho một bảng điểm.',
    justification: 'RẤT QUAN TRỌNG: Không dồn mọi lần thi vào 1 dòng bảng điểm! Giữ nguyên Điểm thi thực tế (DiemThiThucTe = 8.0) kể cả khi có trần 6.9; ghi nhận rõ số lần thi và tình trạng dự thi (Vắng mặt, Đình chỉ).',
    columns: [
      { name: 'MaLanThi', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã lần thi', domain: 'Duy nhất', example: 'LT001' },
      { name: 'MaBangDiem', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Bảng điểm liên kết', domain: 'Tham chiếu BangDiem', example: 'BD001', ref: { table: 'BangDiem', column: 'MaBangDiem' } },
      { name: 'SoLanThi', type: 'INT', key: null, nullable: false, description: 'Thứ tự lần thi', domain: '1 (Lần đầu), 2 (Thi lại)', example: '1' },
      { name: 'NgayThi', type: 'DATE', key: null, nullable: true, description: 'Ngày thi thực tế', domain: 'Date', example: '2025-12-25' },
      { name: 'DiemThiThucTe', type: 'DECIMAL(3,1)', key: null, nullable: true, description: 'Điểm chấm thực tế của bài thi', domain: '0.0 - 10.0 hoặc NULL nếu chưa thi', example: '6.0' },
      { name: 'TrangThaiDuThi', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Tình trạng dự thi', domain: 'DA_THI, VANG_CO_PHEP, VANG_KHONG_PHEP, DINH_CHI', example: 'DA_THI' },
      { name: 'NguoiNhap', type: 'VARCHAR(20)', key: 'FK', nullable: true, description: 'Cán bộ nhập điểm bài thi', domain: 'Tham chiếu TaiKhoan', example: 'TK_DAO_TAO', ref: { table: 'TaiKhoan', column: 'MaTaiKhoan' } },
      { name: 'ThoiDiemNhap', type: 'DATETIME', key: null, nullable: true, description: 'Thời điểm lưu điểm thi', domain: 'DateTime', example: '2025-12-26 09:00:00' }
    ],
    constraints: [
      'PK: MaLanThi',
      'UQ: (MaBangDiem, SoLanThi) (Trong 1 bảng điểm, không có 2 bản ghi cùng số lần thi)',
      'FK: MaBangDiem -> BangDiem(MaBangDiem)',
      'FK: NguoiNhap -> TaiKhoan(MaTaiKhoan)',
      'CHECK: SoLanThi IN (1, 2)',
      'CHECK: DiemThiThucTe BETWEEN 0 AND 10 OR DiemThiThucTe IS NULL'
    ]
  },

  // ==========================================
  // NHÓM D: KIỂM SOÁT VÀ LỊCH SỬ (2 bảng)
  // ==========================================
  {
    id: 'YeuCauMoKhoa',
    name: 'YeuCauMoKhoa',
    groupId: 'audit',
    title: 'Yêu Cầu Phê Duyệt Mở Khóa Điểm',
    description: 'Quy trình đề xuất xin mở khóa điểm đã chốt để sửa sai sót, do Ban Giám đốc phê duyệt.',
    justification: 'Một cờ khóa đơn giản không thể hiện được trách nhiệm giải trình. Bảng này lưu lý do sửa, người ký duyệt, số văn bản và thời hạn mở quyền (ví dụ chỉ được sửa trong 24h).',
    columns: [
      { name: 'MaYeuCau', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã yêu cầu mở khóa', domain: 'Duy nhất', example: 'YC_2026_001' },
      { name: 'MaBangDiem', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Bảng điểm cần can thiệp', domain: 'Tham chiếu BangDiem', example: 'BD001', ref: { table: 'BangDiem', column: 'MaBangDiem' } },
      { name: 'NguoiYeuCau', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Cán bộ làm đơn đề nghị', domain: 'Tham chiếu TaiKhoan', example: 'TK_DAO_TAO', ref: { table: 'TaiKhoan', column: 'MaTaiKhoan' } },
      { name: 'ThoiDiemYeuCau', type: 'DATETIME', key: null, nullable: false, description: 'Thời điểm tạo yêu cầu', domain: 'DateTime', example: '2026-01-12 08:30:00' },
      { name: 'LyDo', type: 'NVARCHAR(255)', key: null, nullable: false, description: 'Lý do xin mở khóa', domain: 'Văn bản giải trình', example: 'Chấm phúc khảo bài thi cuối kỳ của học viên' },
      { name: 'MaVanBan', type: 'VARCHAR(50)', key: null, nullable: true, description: 'Số công văn / tờ trình', domain: 'Văn bản hành chính', example: 'TTr-DT-2026/04' },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Trạng thái xét duyệt', domain: 'CHO_DUYET, DA_DUYET, TU_CHOI, HET_HAN', example: 'DA_DUYET' },
      { name: 'NguoiDuyet', type: 'VARCHAR(20)', key: 'FK', nullable: true, description: 'Thành viên Ban Giám đốc duyệt', domain: 'Tham chiếu TaiKhoan', example: 'TK_GIAM_DOC', ref: { table: 'TaiKhoan', column: 'MaTaiKhoan' } },
      { name: 'ThoiDiemDuyet', type: 'DATETIME', key: null, nullable: true, description: 'Thời điểm chuẩn y', domain: 'DateTime', example: '2026-01-12 10:00:00' },
      { name: 'HanDuocSua', type: 'DATETIME', key: null, nullable: true, description: 'Hạn chót quyền sửa có hiệu lực', domain: 'DateTime', example: '2026-01-13 10:00:00' },
      { name: 'LyDoTuChoi', type: 'NVARCHAR(255)', key: null, nullable: true, description: 'Lý do không chấp thuận (nếu có)', domain: 'Văn bản', example: null }
    ],
    constraints: [
      'PK: MaYeuCau',
      'FK: MaBangDiem -> BangDiem(MaBangDiem)',
      'FK: NguoiYeuCau -> TaiKhoan(MaTaiKhoan)',
      'FK: NguoiDuyet -> TaiKhoan(MaTaiKhoan)'
    ]
  },
  {
    id: 'NhatKyDiem',
    name: 'NhatKyDiem',
    groupId: 'audit',
    title: 'Nhật Ký Biến Động Điểm (Audit Trail)',
    description: 'Lưu vết lịch sử mọi thao tác: Chốt điểm, Sửa điểm, Mở khóa, Tái khóa.',
    justification: 'Ngăn chặn tiêu cực sửa điểm ngầm. Mỗi lần sửa điểm phải liên kết với Mã yêu cầu mở khóa, ghi rõ tên trường, giá trị cũ -> giá trị mới, người thực hiện và mốc thời gian.',
    columns: [
      { name: 'MaNhatKy', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã bản ghi nhật ký', domain: 'Duy nhất', example: 'LOG_001' },
      { name: 'MaBangDiem', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Bảng điểm bị tác động', domain: 'Tham chiếu BangDiem', example: 'BD001', ref: { table: 'BangDiem', column: 'MaBangDiem' } },
      { name: 'MaLanThi', type: 'VARCHAR(20)', key: 'FK', nullable: true, description: 'Lần thi bị sửa (nếu sửa điểm thi)', domain: 'Tham chiếu LanThi', example: 'LT001', ref: { table: 'LanThi', column: 'MaLanThi' } },
      { name: 'MaYeuCau', type: 'VARCHAR(20)', key: 'FK', nullable: true, description: 'Căn cứ theo yêu cầu mở khóa nào', domain: 'Tham chiếu YeuCauMoKhoa', example: 'YC_2026_001', ref: { table: 'YeuCauMoKhoa', column: 'MaYeuCau' } },
      { name: 'LoaiThaoTac', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Hành động thực hiện', domain: 'NHAP_DIEM, CHOT_DIEM, MO_KHOA, SUA_DIEM, TAI_KHOA', example: 'SUA_DIEM' },
      { name: 'TenTruong', type: 'VARCHAR(50)', key: null, nullable: true, description: 'Tên cột dữ liệu bị thay đổi', domain: 'DiemCC, DiemTX, DiemThiThucTe...', example: 'DiemThiThucTe' },
      { name: 'GiaTriCu', type: 'VARCHAR(50)', key: null, nullable: true, description: 'Giá trị ban đầu trước khi sửa', domain: 'Văn bản', example: '3.0' },
      { name: 'GiaTriMoi', type: 'VARCHAR(50)', key: null, nullable: true, description: 'Giá trị mới được cập nhật', domain: 'Văn bản', example: '5.5' },
      { name: 'NguoiThucHien', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Người thực hiện thao tác', domain: 'Tham chiếu TaiKhoan', example: 'TK_DAO_TAO', ref: { table: 'TaiKhoan', column: 'MaTaiKhoan' } },
      { name: 'ThoiDiem', type: 'DATETIME', key: null, nullable: false, description: 'Thời điểm ghi nhận', domain: 'DateTime', example: '2026-01-12 10:15:00' },
      { name: 'LyDo', type: 'NVARCHAR(255)', key: null, nullable: true, description: 'Giải trình chi tiết của người sửa', domain: 'Văn bản', example: 'Cập nhật điểm phúc khảo theo quyết định Hội đồng' }
    ],
    constraints: [
      'PK: MaNhatKy',
      'FK: MaBangDiem -> BangDiem(MaBangDiem)',
      'FK: MaLanThi -> LanThi(MaLanThi)',
      'FK: MaYeuCau -> YeuCauMoKhoa(MaYeuCau)',
      'FK: NguoiThucHien -> TaiKhoan(MaTaiKhoan)',
      'Ràng buộc bất biến: Bảng nhật ký chỉ cho INSERT, cấm UPDATE/DELETE trong nghiệp vụ thường'
    ]
  }
];

// Ràng buộc toàn vẹn cốt lõi cần giải thích
export const INTEGRITY_CONSTRAINTS = [
  {
    id: 'c1',
    title: 'Cây đơn vị quân sự không chu trình (Acyclic Hierarchy)',
    type: 'Toàn vẹn quan hệ',
    target: 'DonVi',
    description: 'Một đơn vị không thể tự làm cha của chính mình (MaDonViCha <> MaDonVi) và chuỗi quan hệ phụ thuộc không được tạo thành vòng lặp vô tận.',
    implementation: 'CHECK constraint cấp độ bảng & Recursive CTE validation khi thao tác.'
  },
  {
    id: 'c2',
    title: 'Không trùng lặp lượt học trong cùng lớp học phần',
    type: 'Khóa duy nhất',
    target: 'LuotHoc',
    description: 'Một học viên chỉ có duy nhất một lượt học trong cùng một lớp học phần cụ thể.',
    implementation: 'UNIQUE (MaHV, MaLHP).'
  },
  {
    id: 'c3',
    title: 'Bảng điểm gắn duy nhất với một lượt học',
    type: 'Quan hệ 1 - 1',
    target: 'BangDiem',
    description: 'Mỗi lượt học có tối đa một bảng điểm; không được phép tồn tại 2 bảng điểm cho cùng 1 lượt học.',
    implementation: 'UNIQUE (MaLuotHoc) trên bảng BangDiem.'
  },
  {
    id: 'c4',
    title: 'Giới hạn số lần thi trong một lượt học',
    type: 'Khóa kết hợp & Check',
    target: 'LanThi',
    description: 'Mỗi bảng điểm có tối đa 2 lần thi (SoLanThi IN (1, 2)) và không trùng số lần thi trong cùng bảng điểm.',
    implementation: 'UNIQUE (MaBangDiem, SoLanThi) và CHECK (SoLanThi BETWEEN 1 AND 2).'
  },
  {
    id: 'c5',
    title: 'Miền giá trị điểm số hợp lệ',
    type: 'Miền giá trị CHECK',
    target: 'BangDiem, LanThi',
    description: 'Tất cả các điểm CC, TX, Điểm thi thực tế và Điểm tổng kết nếu đã nhập phải nằm trong thang điểm [0.0, 10.0]. Điểm 0.0 khác NULL (chưa có điểm).',
    implementation: 'CHECK (Diem >= 0.0 AND Diem <= 10.0).'
  },
  {
    id: 'c6',
    title: 'Tổng trọng số đánh giá phải tuyệt đối bằng 1.0',
    type: 'Ràng buộc nghiệp vụ',
    target: 'QuyTacDanhGia',
    description: 'Tổng trọng số thành phần Chuyên cần, Thường xuyên và Cuối kỳ phải bằng 1.00 (khắc phục lỗi 0.1 + 0.4 + 0.6 = 1.1 trong đề bài ban đầu).',
    implementation: 'CHECK (TrongSoCC + TrongSoTX + TrongSoCK = 1.00).'
  },
  {
    id: 'c7',
    title: 'Chỉ chốt điểm khi đã có đầy đủ điểm hợp lệ',
    type: 'Quy tắc nghiệp vụ',
    target: 'BangDiem',
    description: 'Bảng điểm chỉ được chuyển sang TrangThaiKhoa = "DA_KHOA" khi DiemCC, DiemTX và ít nhất LanThi (SoLanThi = 1) đã có điểm.',
    implementation: 'Application Logic / Database Trigger kiểm tra trước khi UPDATE.'
  },
  {
    id: 'c8',
    title: 'Chỉ được thi lại khi không đạt lần đầu',
    type: 'Quy tắc nghiệp vụ',
    target: 'LanThi',
    description: 'Lần thi số 2 chỉ được phép khởi tạo nếu Lần thi 1 đã có kết quả và không đạt yêu cầu theo quy tắc áp dụng.',
    implementation: 'Stored Procedure hoặc Trigger kiểm tra kết quả Lần 1.'
  },
  {
    id: 'c9',
    title: 'Sửa điểm đã khóa phải có phê duyệt còn hiệu lực',
    type: 'Toàn vẹn bảo mật',
    target: 'BangDiem, NhatKyDiem',
    description: 'Để cập nhật điểm của một BangDiem đang ở trạng thái khóa, hệ thống bắt buộc phải kiểm tra tồn tại một bản ghi YeuCauMoKhoa có TrangThai = "DA_DUYET" và ThoiDiem <= HanDuocSua.',
    implementation: 'Trigger trên BangDiem & NhatKyDiem kiểm tra điều kiện mở khóa.'
  },
  {
    id: 'c10',
    title: 'Học lại phải bảo lưu lịch sử lượt học cũ',
    type: 'Quan hệ đệ quy',
    target: 'LuotHoc',
    description: 'Khi tạo LuotHoc với LoaiLuotHoc = "HOC_LAI", trường MaLuotHocTruoc phải trỏ về lượt học trước đó của chính học viên đó ở cùng học phần; cấm tạo vòng lặp tham chiếu.',
    implementation: 'Trigger kiểm tra tính nhất quán của MaHV và MaHP giữa 2 lượt học.'
  },
  {
    id: 'c11',
    title: 'Lần thi trong nhật ký phải thuộc đúng bảng điểm',
    type: 'Toàn vẹn tham chiếu chéo',
    target: 'NhatKyDiem',
    description: 'Nếu bản ghi NhatKyDiem có MaLanThi, thì MaLanThi đó bắt buộc phải có MaBangDiem trùng khớp với MaBangDiem của dòng nhật ký.',
    implementation: 'Trigger kiểm tra tính nhất quán của khóa ngoại kép.'
  },
  {
    id: 'c12',
    title: 'Bảo mật phạm vi dữ liệu của Chỉ huy đơn vị',
    type: 'Phân quyền phạm vi',
    target: 'PhanCongQuanLy',
    description: 'Tài khoản chỉ huy chỉ có quyền xem dữ liệu của những học viên thuộc các lớp thuộc biên chế đơn vị (hoặc đơn vị con trực thuộc) mà chỉ huy đó đang được phân công quản lý còn hiệu lực.',
    implementation: 'Security View / Row-Level Security (RLS) dựa trên cây đơn vị.'
  }
];
