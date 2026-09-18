// src/data/dbSchema.js
// Bộ 23 bảng quan hệ chuẩn mực R1 -> R23 tích hợp đầy đủ Giảng viên, Phân công và Điểm số

export const SCHEMA_GROUPS = {
  org: {
    id: 'org',
    name: 'Tổ chức, Đơn vị & Bảo mật',
    code: 'GROUP_A',
    color: 'var(--color-blue)',
    colorTag: 'tag-blue',
    hex: '#38BDF8',
    description: 'Cơ cấu tổ chức quân sự, bộ môn, con người và hệ thống xác thực phân quyền RBAC'
  },
  personnel: {
    id: 'personnel',
    name: 'Quân sự & Chuyên môn',
    code: 'GROUP_B',
    color: 'var(--color-purple)',
    colorTag: 'tag-purple',
    hex: '#A78BFA',
    description: 'Cấp bậc, chức vụ quân nhân, danh mục ngành và chuyên ngành đào tạo'
  },
  teaching: {
    id: 'teaching',
    name: 'Đào tạo & Phân công giảng dạy',
    code: 'GROUP_C',
    color: 'var(--color-emerald)',
    colorTag: 'tag-emerald',
    hex: '#34D399',
    description: 'Hồ sơ học viên, giảng viên, lớp học, môn học và quyết định phân công giảng dạy theo học kỳ'
  },
  grading: {
    id: 'grading',
    name: 'Điểm số & Khảo thí',
    code: 'GROUP_D',
    color: 'var(--color-amber)',
    colorTag: 'tag-amber',
    hex: '#FBBF24',
    description: 'Loại điểm, điểm thành phần, kết quả học tập tổng kết và tổ chức các đợt thi kết thúc môn'
  }
};

export const TABLES = [
  // ==========================================
  // NHÓM 1: TỔ CHỨC, ĐƠN VỊ & BẢO MẬT (R1, R4, R5, R6, R7, R8, R9, R15)
  // ==========================================
  {
    id: 'DON_VI',
    code: 'R1',
    name: 'DON_VI',
    groupId: 'org',
    title: 'Đơn Vị Quản Lý (Cây Phân Cấp)',
    description: 'Quản lý cơ cấu đơn vị quân sự (Tiểu đoàn, Đại đội) và đơn vị hành chính.',
    justification: 'Xác định cấp quản lý quân nhân và ranh giới chỉ huy trong môi trường quân đội.',
    columns: [
      { name: 'MaDonVi', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã định danh đơn vị', domain: 'Duy nhất', example: 'DV_D1' },
      { name: 'TenDonVi', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên phiên hiệu đơn vị', domain: 'Văn bản', example: 'Tiểu đoàn 1' },
      { name: 'LoaiDonVi', type: 'VARCHAR(30)', key: null, nullable: false, description: 'Cấp bậc đơn vị', domain: 'TIEU_DOAN, DAI_DOI, KHOA', example: 'TIEU_DOAN' },
      { name: 'MaDonViCha', type: 'VARCHAR(20)', key: 'FK', nullable: true, description: 'Đơn vị cấp trên (Quan hệ đệ quy)', domain: 'Tham chiếu DON_VI', example: null, ref: { table: 'DON_VI', column: 'MaDonVi' } }
    ],
    constraints: ['PK: MaDonVi', 'FK: MaDonViCha -> DON_VI(MaDonVi)', 'CHECK: MaDonViCha <> MaDonVi']
  },
  {
    id: 'BO_MON',
    code: 'R15',
    name: 'BO_MON',
    groupId: 'org',
    title: 'Bộ Môn Chuyên Môn',
    description: 'Các bộ môn chuyên ngành trực thuộc Khoa/Đơn vị quản lý giảng viên.',
    justification: 'Quản lý tổ chức học thuật chuyên môn, phân bổ môn học cho giảng viên trực thuộc.',
    columns: [
      { name: 'MaBoMon', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã bộ môn', domain: 'Duy nhất', example: 'BM_ATTT' },
      { name: 'TenBoMon', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên bộ môn', domain: 'Văn bản', example: 'Bộ môn An toàn thông tin' },
      { name: 'MaDonVi', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Viện quản lý trực tiếp', domain: 'Tham chiếu DON_VI', example: 'DV_VIEN_CNTT_TT', ref: { table: 'DON_VI', column: 'MaDonVi' } }
    ],
    constraints: ['PK: MaBoMon', 'FK: MaDonVi -> DON_VI(MaDonVi)']
  },
  {
    id: 'NGUOI',
    code: 'R4',
    name: 'NGUOI',
    groupId: 'org',
    title: 'Hồ Sơ Nhân Sự Cơ Bản (Thực Thể Cha)',
    description: 'Lưu trữ thông tin lý lịch cá nhân dùng chung cho cả Học viên, Giảng viên và Cán bộ.',
    justification: 'Chuẩn hóa mô hình kế thừa (Generalization/Specialization): Tránh trùng lặp các thuộc tính Họ tên, Ngày sinh, Quê quán giữa Học viên và Giảng viên.',
    columns: [
      { name: 'MaNguoi', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã định danh cá nhân', domain: 'Duy nhất', example: 'NG_001' },
      { name: 'HoTen', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Họ và tên đầy đủ', domain: 'Văn bản', example: 'Nguyễn Văn An' },
      { name: 'NgaySinh', type: 'DATE', key: null, nullable: false, description: 'Ngày tháng năm sinh', domain: 'Date', example: '2004-05-12' },
      { name: 'GioiTinh', type: 'NVARCHAR(10)', key: null, nullable: false, description: 'Giới tính', domain: 'Nam, Nữ', example: 'Nam' },
      { name: 'QueQuan', type: 'NVARCHAR(200)', key: null, nullable: true, description: 'Quê quán', domain: 'Địa chỉ', example: 'Hà Nội' },
      { name: 'SoDienThoai', type: 'VARCHAR(15)', key: null, nullable: true, description: 'Số điện thoại liên lạc', domain: 'Số điện thoại', example: '0987654321' },
      { name: 'Email', type: 'VARCHAR(100)', key: null, nullable: true, description: 'Hòm thư điện tử quân sự', domain: 'Email', example: 'an.nv@mta.edu.vn' }
    ],
    constraints: ['PK: MaNguoi']
  },
  {
    id: 'USER',
    code: 'R5',
    name: 'USER',
    groupId: 'org',
    title: 'Tài Khoản Xác Thực Hệ Thống',
    description: 'Chứa thông tin tài khoản đăng nhập gắn liền với hồ sơ cá nhân.',
    justification: 'Tách cơ chế bảo mật đăng nhập độc lập khỏi thông tin nhân thân.',
    columns: [
      { name: 'MaUser', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã tài khoản', domain: 'Duy nhất', example: 'USR_001' },
      { name: 'TenDangNhap', type: 'VARCHAR(50)', key: 'UQ', nullable: false, description: 'Tên đăng nhập hệ thống', domain: 'Duy nhất', example: 'gv_lethang' },
      { name: 'MatKhau', type: 'VARCHAR(255)', key: null, nullable: false, description: 'Mật khẩu đã mã hóa', domain: 'Mã băm bcrypt/argon2', example: '$2a$12$e8...' },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Tình trạng tài khoản', domain: 'HOAT_DONG, KHOA', example: 'HOAT_DONG' },
      { name: 'MaNguoi', type: 'VARCHAR(20)', key: 'FK, UQ', nullable: false, description: 'Gắn liền với 1 người', domain: 'Tham chiếu NGUOI', example: 'NG_001', ref: { table: 'NGUOI', column: 'MaNguoi' } }
    ],
    constraints: ['PK: MaUser', 'UQ: TenDangNhap', 'FK: MaNguoi -> NGUOI(MaNguoi)']
  },
  {
    id: 'ROLE',
    code: 'R6',
    name: 'ROLE',
    groupId: 'org',
    title: 'Vai Trò Hệ Thống (RBAC)',
    description: 'Các nhóm vai trò: Học viên, Giảng viên, Chỉ huy đơn vị, Phòng Đào tạo, Ban Giám đốc.',
    justification: 'Thiết lập mô hình phân quyền Role-Based Access Control tiêu chuẩn.',
    columns: [
      { name: 'MaRole', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã vai trò', domain: 'Duy nhất', example: 'ROLE_GV' },
      { name: 'TenRole', type: 'NVARCHAR(50)', key: 'UQ', nullable: false, description: 'Tên vai trò', domain: 'Văn bản', example: 'Giảng viên giảng dạy' },
      { name: 'MoTa', type: 'NVARCHAR(255)', key: null, nullable: true, description: 'Mô tả quyền hạn vai trò', domain: 'Văn bản', example: 'Nhập điểm thành phần các lớp được phân công' }
    ],
    constraints: ['PK: MaRole', 'UQ: TenRole']
  },
  {
    id: 'USER_ROLE',
    code: 'R7',
    name: 'USER_ROLE',
    groupId: 'org',
    title: 'Gán Vai Trò Cho Người Dùng (N-N)',
    description: 'Bảng liên kết nhiều-nhiều giữa Tài khoản và Vai trò.',
    justification: 'Một quân nhân/cán bộ có thể kiêm nhiệm nhiều vai trò (ví dụ vừa là Giảng viên vừa là Chỉ huy Bộ môn).',
    columns: [
      { name: 'MaUser', type: 'VARCHAR(20)', key: 'PK, FK', nullable: false, description: 'Tài khoản', domain: 'Tham chiếu USER', example: 'USR_001', ref: { table: 'USER', column: 'MaUser' } },
      { name: 'MaRole', type: 'VARCHAR(20)', key: 'PK, FK', nullable: false, description: 'Vai trò', domain: 'Tham chiếu ROLE', example: 'ROLE_GV', ref: { table: 'ROLE', column: 'MaRole' } }
    ],
    constraints: ['PK: (MaUser, MaRole)', 'FK: MaUser -> USER(MaUser)', 'FK: MaRole -> ROLE(MaRole)']
  },
  {
    id: 'PERMISSION',
    code: 'R8',
    name: 'PERMISSION',
    groupId: 'org',
    title: 'Danh Mục Quyền Thao Tác',
    description: 'Định nghĩa chi tiết các quyền hạn nguyên tử trong hệ thống.',
    justification: 'Phân quyền chi tiết (Granular Permissions): XEM_DIEM, NHAP_DIEM_CC_TX, CHOT_DIEM, MO_KHOA...',
    columns: [
      { name: 'MaPermission', type: 'VARCHAR(50)', key: 'PK', nullable: false, description: 'Mã quyền nguyên tử', domain: 'Duy nhất', example: 'PERM_GRADE_INPUT' },
      { name: 'TenPermission', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên quyền', domain: 'Văn bản', example: 'Nhập điểm thường xuyên' },
      { name: 'MoTa', type: 'NVARCHAR(255)', key: null, nullable: true, description: 'Mô tả thao tác được phép', domain: 'Văn bản', example: 'Quyền ghi điểm CC và TX cho nhóm học' }
    ],
    constraints: ['PK: MaPermission']
  },
  {
    id: 'ROLE_PERMISSION',
    code: 'R9',
    name: 'ROLE_PERMISSION',
    groupId: 'org',
    title: 'Gán Quyền Cho Vai Trò (N-N)',
    description: 'Bảng liên kết giải quyết quyền hạn chi tiết gắn liền với từng vai trò.',
    justification: 'Đảm bảo sự linh hoạt tối đa khi thay đổi chính sách bảo mật mà không sửa code.',
    columns: [
      { name: 'MaRole', type: 'VARCHAR(20)', key: 'PK, FK', nullable: false, description: 'Vai trò', domain: 'Tham chiếu ROLE', example: 'ROLE_GV', ref: { table: 'ROLE', column: 'MaRole' } },
      { name: 'MaPermission', type: 'VARCHAR(50)', key: 'PK, FK', nullable: false, description: 'Quyền hạn', domain: 'Tham chiếu PERMISSION', example: 'PERM_GRADE_INPUT', ref: { table: 'PERMISSION', column: 'MaPermission' } }
    ],
    constraints: ['PK: (MaRole, MaPermission)', 'FK: MaRole -> ROLE(MaRole)', 'FK: MaPermission -> PERMISSION(MaPermission)']
  },

  // ==========================================
  // NHÓM 2: QUÂN SỰ & CHUYÊN MÔN (R10, R11, R12, R13)
  // ==========================================
  {
    id: 'NGANH',
    code: 'R10',
    name: 'NGANH',
    groupId: 'personnel',
    title: 'Ngành Đào Tạo',
    description: 'Khung ngành đào tạo cấp trường (CNTT, Điện tử, Tác chiến...).',
    justification: 'Tránh dư thừa dữ liệu tên ngành tại các lớp học.',
    columns: [
      { name: 'MaNganh', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã ngành', domain: 'Duy nhất', example: 'NG_CNTT' },
      { name: 'TenNganh', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên ngành đào tạo', domain: 'Văn bản', example: 'Công nghệ thông tin' }
    ],
    constraints: ['PK: MaNganh']
  },
  {
    id: 'CHUYEN_NGANH',
    code: 'R11',
    name: 'CHUYEN_NGANH',
    groupId: 'personnel',
    title: 'Chuyên Ngành Đào Tạo',
    description: 'Phân ngành sâu trực thuộc một Ngành đào tạo chính.',
    justification: 'Học viên quân sự học theo chuyên ngành hẹp ở các giai đoạn chuyên môn hóa.',
    columns: [
      { name: 'MaChuyenNganh', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã chuyên ngành', domain: 'Duy nhất', example: 'CN_ATTT' },
      { name: 'TenChuyenNganh', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên chuyên ngành', domain: 'Văn bản', example: 'An toàn thông tin & Tác chiến mạng' },
      { name: 'MaNganh', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Thuộc ngành đào tạo', domain: 'Tham chiếu NGANH', example: 'NG_CNTT', ref: { table: 'NGANH', column: 'MaNganh' } }
    ],
    constraints: ['PK: MaChuyenNganh', 'FK: MaNganh -> NGANH(MaNganh)']
  },
  {
    id: 'CAP_BAC',
    code: 'R12',
    name: 'CAP_BAC',
    groupId: 'personnel',
    title: 'Cấp Bậc Quân Hàm Quân Đội',
    description: 'Danh mục cấp bậc quân sự (Hạ sĩ, Trung sĩ, Thượng sĩ, Thiếu úy...).',
    justification: 'Đặc thù quân đội: Mọi quân nhân đều có cấp bậc; thứ tự cấp bậc dùng để xếp hạng phân cấp.',
    columns: [
      { name: 'MaCapBac', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã cấp bậc', domain: 'Duy nhất', example: 'CB_TS' },
      { name: 'TenCapBac', type: 'NVARCHAR(50)', key: null, nullable: false, description: 'Tên quân hàm', domain: 'Văn bản', example: 'Thượng sĩ' },
      { name: 'ThuTu', type: 'INT', key: null, nullable: false, description: 'Thứ tự cấp bậc', domain: 'Số nguyên tăng dần', example: '3' }
    ],
    constraints: ['PK: MaCapBac']
  },
  {
    id: 'CHUC_VU',
    code: 'R13',
    name: 'CHUC_VU',
    groupId: 'personnel',
    title: 'Chức Vụ Quân Sự / Quản Lý',
    description: 'Chức vụ của học viên hoặc cán bộ trong đơn vị (Lớp trưởng, Tiểu đội trưởng, Bí thư chi đoàn...).',
    justification: 'Phản ánh cơ cấu quản lý nội bộ tổ chức của lớp học viên quân sự.',
    columns: [
      { name: 'MaChucVu', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã chức vụ', domain: 'Duy nhất', example: 'CV_LT' },
      { name: 'TenChucVu', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên chức vụ', domain: 'Văn bản', example: 'Lớp trưởng' },
      { name: 'MoTa', type: 'NVARCHAR(255)', key: null, nullable: true, description: 'Mô tả nhiệm vụ chức trách', domain: 'Văn bản', example: 'Quản lý học tập và sinh hoạt lớp' }
    ],
    constraints: ['PK: MaChucVu']
  },

  // ==========================================
  // NHÓM 3: ĐÀO TẠO & PHÂN CÔNG GIẢNG DẠY (R2, R3, R14, R16, R17, R18, R19)
  // ==========================================
  {
    id: 'KHOA_DAO_TAO',
    code: 'R2',
    name: 'KHOA_DAO_TAO',
    groupId: 'teaching',
    title: 'Khóa Tuyển Sinh Đào Tạo',
    description: 'Khóa đào tạo theo năm nhập học và niên hạn kết thúc.',
    justification: 'Quản lý học viên và kế hoạch theo niên khóa.',
    columns: [
      { name: 'MaKhoaDT', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã khóa học', domain: 'Duy nhất', example: 'K58' },
      { name: 'TenKhoaDT', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên khóa đào tạo', domain: 'Văn bản', example: 'Khóa 58 Đại học Quân sự' },
      { name: 'NamBatDau', type: 'INT', key: null, nullable: false, description: 'Năm nhập học', domain: '> 1950', example: '2023' },
      { name: 'NamKetThuc', type: 'INT', key: null, nullable: false, description: 'Năm tốt nghiệp dự kiến', domain: '>= NamBatDau', example: '2028' }
    ],
    constraints: ['PK: MaKhoaDT', 'CHECK: NamKetThuc >= NamBatDau']
  },
  {
    id: 'LOP_HOC',
    code: 'R3',
    name: 'LOP_HOC',
    groupId: 'teaching',
    title: 'Lớp Niên Chế (Lớp Hành Chính)',
    description: 'Lớp học viên quản lý theo đơn vị đại đội và thuộc khóa đào tạo.',
    justification: 'Môi trường quân sự quản lý học viên theo lớp hành chính trực thuộc đơn vị cơ sở.',
    columns: [
      { name: 'MaLop', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã lớp hành chính', domain: 'Duy nhất', example: 'CNTT2_K58' },
      { name: 'TenLop', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên lớp', domain: 'Văn bản', example: 'Lớp Công nghệ thông tin 2 - K58' },
      { name: 'MaDonVi', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Đại đội quản lý', domain: 'Tham chiếu DON_VI', example: 'DV_C1', ref: { table: 'DON_VI', column: 'MaDonVi' } },
      { name: 'MaKhoaDT', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Thuộc khóa học', domain: 'Tham chiếu KHOA_DAO_TAO', example: 'K58', ref: { table: 'KHOA_DAO_TAO', column: 'MaKhoaDT' } }
    ],
    constraints: ['PK: MaLop', 'FK: MaDonVi -> DON_VI(MaDonVi)', 'FK: MaKhoaDT -> KHOA_DAO_TAO(MaKhoaDT)']
  },
  {
    id: 'HOC_VIEN',
    code: 'R14',
    name: 'HOC_VIEN',
    groupId: 'teaching',
    title: 'Hồ Sơ Học Viên Quân Sự',
    description: 'Chuyên biệt hóa từ NGUOI: Bổ sung lớp học, chuyên ngành, cấp bậc, chức vụ quân sự.',
    justification: 'Thực thể trung tâm chịu sự quản lý của đơn vị và là chủ thể của toàn bộ kết quả điểm số.',
    columns: [
      { name: 'MaHV', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã định danh học viên', domain: 'Duy nhất', example: 'HV001' },
      { name: 'MaNguoi', type: 'VARCHAR(20)', key: 'FK, UQ', nullable: false, description: 'Tham chiếu hồ sơ nhân sự NGUOI', domain: 'Tham chiếu NGUOI', example: 'NG_001', ref: { table: 'NGUOI', column: 'MaNguoi' } },
      { name: 'MaLop', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Lớp niên chế đang học', domain: 'Tham chiếu LOP_HOC', example: 'CNTT2_K58', ref: { table: 'LOP_HOC', column: 'MaLop' } },
      { name: 'MaChuyenNganh', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Chuyên ngành học tập', domain: 'Tham chiếu CHUYEN_NGANH', example: 'CN_ATTT', ref: { table: 'CHUYEN_NGANH', column: 'MaChuyenNganh' } },
      { name: 'MaCapBac', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Quân hàm hiện tại', domain: 'Tham chiếu CAP_BAC', example: 'CB_TS', ref: { table: 'CAP_BAC', column: 'MaCapBac' } },
      { name: 'MaChucVu', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Chức trách trong lớp', domain: 'Tham chiếu CHUC_VU', example: 'CV_LT', ref: { table: 'CHUC_VU', column: 'MaChucVu' } },
      { name: 'NgayNhapHoc', type: 'DATE', key: null, nullable: false, description: 'Ngày nhập ngũ/nhập học', domain: 'Date', example: '2023-09-05' },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Tình trạng học vụ', domain: 'DANG_HOC, BAO_LUU, TOT_NGHIEP', example: 'DANG_HOC' }
    ],
    constraints: [
      'PK: MaHV',
      'UQ: MaNguoi',
      'FK: MaNguoi -> NGUOI(MaNguoi)',
      'FK: MaLop -> LOP_HOC(MaLop)',
      'FK: MaChuyenNganh -> CHUYEN_NGANH(MaChuyenNganh)',
      'FK: MaCapBac -> CAP_BAC(MaCapBac)',
      'FK: MaChucVu -> CHUC_VU(MaChucVu)'
    ]
  },
  {
    id: 'GIANG_VIEN',
    code: 'R16',
    name: 'GIANG_VIEN',
    groupId: 'teaching',
    title: 'Hồ Sơ Giảng Viên Quân Sự (Yếu Tố Trọng Tâm Mới)',
    description: 'Chuyên biệt hóa từ NGUOI: Lưu thông tin bộ môn công tác, học vị, chuyên môn giảng dạy.',
    justification: 'ĐÁP ỨNG TRỌN VẸN YÊU CẦU ĐỀ BÀI: Giảng viên là người trực tiếp tham gia giảng dạy theo phân công và nhập điểm thành phần.',
    columns: [
      { name: 'MaGV', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã giảng viên', domain: 'Duy nhất', example: 'GV001' },
      { name: 'MaNguoi', type: 'VARCHAR(20)', key: 'FK, UQ', nullable: false, description: 'Tham chiếu hồ sơ nhân sự NGUOI', domain: 'Tham chiếu NGUOI', example: 'NG_002', ref: { table: 'NGUOI', column: 'MaNguoi' } },
      { name: 'MaBoMon', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Bộ môn trực thuộc', domain: 'Tham chiếu BO_MON', example: 'BM_CSDL', ref: { table: 'BO_MON', column: 'MaBoMon' } },
      { name: 'HocVi', type: 'NVARCHAR(50)', key: null, nullable: false, description: 'Học vị chuyên môn', domain: 'Thạc sĩ, Tiến sĩ, PGS, GS', example: 'Tiến sĩ' },
      { name: 'ChuyenMon', type: 'NVARCHAR(150)', key: null, nullable: false, description: 'Lĩnh vực nghiên cứu/giảng dạy', domain: 'Văn bản', example: 'Hệ thống cơ sở dữ liệu lớn' },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Tình trạng công tác', domain: 'DANG_CONG_TAC, NGHI_CHE_DO', example: 'DANG_CONG_TAC' }
    ],
    constraints: [
      'PK: MaGV',
      'UQ: MaNguoi',
      'FK: MaNguoi -> NGUOI(MaNguoi)',
      'FK: MaBoMon -> BO_MON(MaBoMon)'
    ]
  },
  {
    id: 'MON_HOC',
    code: 'R17',
    name: 'MON_HOC',
    groupId: 'teaching',
    title: 'Danh Mục Môn Học (Học Phần)',
    description: 'Chương trình môn học chuẩn với số tín chỉ, số tiết lý thuyết/thực hành.',
    justification: 'Chuẩn hóa danh mục môn học, dùng chung cho kế hoạch và phân công giảng dạy.',
    columns: [
      { name: 'MaMonHoc', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã môn học', domain: 'Duy nhất', example: 'CSDL101' },
      { name: 'TenMonHoc', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên môn học', domain: 'Văn bản', example: 'Cơ sở dữ liệu' },
      { name: 'SoTinChi', type: 'INT', key: null, nullable: false, description: 'Số tín chỉ', domain: '> 0', example: '3' },
      { name: 'SoTiet', type: 'INT', key: null, nullable: false, description: 'Tổng số tiết học', domain: '> 0', example: '45' },
      { name: 'LoaiMonHoc', type: 'NVARCHAR(50)', key: null, nullable: false, description: 'Tính chất môn', domain: 'Bắt buộc, Tự chọn', example: 'Bắt buộc' }
    ],
    constraints: ['PK: MaMonHoc', 'CHECK: SoTinChi > 0 AND SoTiet > 0']
  },
  {
    id: 'HOC_KY',
    code: 'R18',
    name: 'HOC_KY',
    groupId: 'teaching',
    title: 'Học Kỳ Đào Tạo',
    description: 'Khung thời gian giảng dạy và đánh giá trong năm học.',
    justification: 'Căn cứ thời gian để lập phân công giảng dạy và khóa sổ điểm học kỳ.',
    columns: [
      { name: 'MaHocKy', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã học kỳ', domain: 'Duy nhất', example: 'HK1_2025' },
      { name: 'TenHocKy', type: 'NVARCHAR(50)', key: null, nullable: false, description: 'Tên học kỳ', domain: 'Văn bản', example: 'Học kỳ 1 năm học 2025-2026' },
      { name: 'NamHoc', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Năm học', domain: 'YYYY-YYYY', example: '2025-2026' },
      { name: 'NgayBatDau', type: 'DATE', key: null, nullable: false, description: 'Ngày bắt đầu học kỳ', domain: 'Date', example: '2025-09-01' },
      { name: 'NgayKetThuc', type: 'DATE', key: null, nullable: false, description: 'Ngày bế mạc học kỳ', domain: '>= NgayBatDau', example: '2026-01-15' }
    ],
    constraints: ['PK: MaHocKy', 'CHECK: NgayKetThuc >= NgayBatDau']
  },
  {
    id: 'PHAN_CONG',
    code: 'R19',
    name: 'PHAN_CONG',
    groupId: 'teaching',
    title: 'Phân Công Giảng Dạy (Khóa Trung Tâm Đào Tạo)',
    description: 'Quyết định phân công Giảng viên giảng dạy Môn học cho một Lớp trong Học kỳ cụ thể.',
    justification: 'KẾT NỐI TRỌNG TÂM: Liên kết 4 thực thể Giảng viên (GIANG_VIEN), Môn học (MON_HOC), Lớp học (LOP_HOC) và Học kỳ (HOC_KY) thành một nhóm lớp học cụ thể.',
    columns: [
      { name: 'MaPhanCong', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã dòng phân công', domain: 'Duy nhất', example: 'PC_CSDL_01' },
      { name: 'MaGV', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Giảng viên phụ trách', domain: 'Tham chiếu GIANG_VIEN', example: 'GV001', ref: { table: 'GIANG_VIEN', column: 'MaGV' } },
      { name: 'MaMonHoc', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Môn học được giảng dạy', domain: 'Tham chiếu MON_HOC', example: 'CSDL101', ref: { table: 'MON_HOC', column: 'MaMonHoc' } },
      { name: 'MaLop', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Lớp học viên tham gia', domain: 'Tham chiếu LOP_HOC', example: 'CNTT2_K58', ref: { table: 'LOP_HOC', column: 'MaLop' } },
      { name: 'MaHocKy', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Học kỳ triển khai', domain: 'Tham chiếu HOC_KY', example: 'HK1_2025', ref: { table: 'HOC_KY', column: 'MaHocKy' } },
      { name: 'NhomHoc', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Mã phân nhóm (nhóm 1, nhóm 2)', domain: 'Văn bản', example: 'Nhóm 01' },
      { name: 'SoTiet', type: 'INT', key: null, nullable: false, description: 'Số tiết được giao giảng dạy', domain: '> 0', example: '45' }
    ],
    constraints: [
      'PK: MaPhanCong',
      'UQ: (MaMonHoc, MaLop, MaHocKy, NhomHoc)',
      'FK: MaGV -> GIANG_VIEN(MaGV)',
      'FK: MaMonHoc -> MON_HOC(MaMonHoc)',
      'FK: MaLop -> LOP_HOC(MaLop)',
      'FK: MaHocKy -> HOC_KY(MaHocKy)'
    ]
  },

  // ==========================================
  // NHÓM 4: ĐIỂM SỐ & KHẢO THÍ (R20, R21, R22, R23)
  // ==========================================
  {
    id: 'LOAI_DIEM',
    code: 'R20',
    name: 'LOAI_DIEM',
    groupId: 'grading',
    title: 'Danh Mục Loại Điểm & Trọng Số',
    description: 'Cấu hình linh hoạt các thành phần điểm: Chuyên cần (0.1), Thường xuyên (0.3), Cuối kỳ (0.6)...',
    justification: 'ĐỘNG HÓA CÔNG THỨC: Không hardcode các loại điểm cố định; cho phép nhà trường thêm bớt các loại điểm (bài tập lớn, thực hành, thi) và điều chỉnh trọng số linh hoạt.',
    columns: [
      { name: 'MaLoaiDiem', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã loại điểm', domain: 'Duy nhất', example: 'LD_CC' },
      { name: 'TenLoaiDiem', type: 'NVARCHAR(50)', key: null, nullable: false, description: 'Tên cột điểm', domain: 'Chuyên cần, Thường xuyên, Cuối kỳ', example: 'Chuyên cần' },
      { name: 'TrongSo', type: 'DECIMAL(3,2)', key: null, nullable: false, description: 'Tỷ lệ trọng số (0.0 - 1.0)', domain: '0.0 - 1.0', example: '0.10' }
    ],
    constraints: ['PK: MaLoaiDiem', 'CHECK: TrongSo >= 0 AND TrongSo <= 1']
  },
  {
    id: 'KET_QUA_HOC_TAP',
    code: 'R21',
    name: 'KET_QUA_HOC_TAP',
    groupId: 'grading',
    title: 'Kết Quả Học Tập Tổng Hợp Của Học Viên',
    description: 'Ghi nhận kết quả của một Học viên trong một Phân công giảng dạy (Điểm tổng kết, Xếp loại, Đạt/Không đạt).',
    justification: 'Giải quyết quan hệ N-N giữa Học viên (HOC_VIEN) và Đợt phân công (PHAN_CONG); lưu trữ kết quả cuối cùng sau khi tổng hợp các đầu điểm.',
    columns: [
      { name: 'MaKQ', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã kết quả học tập', domain: 'Duy nhất', example: 'KQ_001' },
      { name: 'MaHV', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Học viên', domain: 'Tham chiếu HOC_VIEN', example: 'HV001', ref: { table: 'HOC_VIEN', column: 'MaHV' } },
      { name: 'MaPhanCong', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Phân công lớp giảng dạy', domain: 'Tham chiếu PHAN_CONG', example: 'PC_CSDL_01', ref: { table: 'PHAN_CONG', column: 'MaPhanCong' } },
      { name: 'DiemTongKet', type: 'DECIMAL(3,1)', key: null, nullable: true, description: 'Điểm tổng kết chính thức (0.0 - 10.0)', domain: '0.0 - 10.0 hoặc NULL', example: '7.4' },
      { name: 'XepLoai', type: 'NVARCHAR(20)', key: null, nullable: true, description: 'Xếp loại học lực', domain: 'Xuat sac, Gioi, Kha, TB, Yeu', example: 'Khá' },
      { name: 'TrangThai', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Trạng thái học phần', domain: 'DANG_HOC, HOAN_THANH, HOC_LAI', example: 'HOAN_THANH' }
    ],
    constraints: [
      'PK: MaKQ',
      'UQ: (MaHV, MaPhanCong) (Một học viên chỉ có 1 kết quả trong cùng 1 phân công)',
      'FK: MaHV -> HOC_VIEN(MaHV)',
      'FK: MaPhanCong -> PHAN_CONG(MaPhanCong)'
    ]
  },
  {
    id: 'DIEM',
    code: 'R22',
    name: 'DIEM',
    groupId: 'grading',
    title: 'Chi Tiết Từng Đầu Điểm Thành Phần',
    description: 'Lưu từng con điểm cụ thể gắn với kết quả học tập, loại điểm, ngày nhập và người nhập.',
    justification: 'CHUẨN HÓA CẤP ĐỘ CAO: Giảng viên nhập điểm Chuyên cần, Thường xuyên sẽ được ghi vào đây kèm mã người nhập MaNguoiNhap (chính là MaGV hoặc Cán bộ).',
    columns: [
      { name: 'MaDiem', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã điểm chi tiết', domain: 'Duy nhất', example: 'D_001' },
      { name: 'MaKQ', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Gắn liền với Kết quả học tập', domain: 'Tham chiếu KET_QUA_HOC_TAP', example: 'KQ_001', ref: { table: 'KET_QUA_HOC_TAP', column: 'MaKQ' } },
      { name: 'MaLoaiDiem', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Loại điểm (CC, TX, Thi...)', domain: 'Tham chiếu LOAI_DIEM', example: 'LD_CC', ref: { table: 'LOAI_DIEM', column: 'MaLoaiDiem' } },
      { name: 'Diem', type: 'DECIMAL(3,1)', key: null, nullable: false, description: 'Giá trị điểm số (0.0 - 10.0)', domain: '0.0 - 10.0', example: '8.5' },
      { name: 'NgayNhap', type: 'DATETIME', key: null, nullable: false, description: 'Thời điểm nhập điểm', domain: 'DateTime', example: '2025-11-20 14:30:00' },
      { name: 'MaNguoiNhap', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Người thực hiện nhập (Giảng viên / Đào tạo)', domain: 'Tham chiếu NGUOI', example: 'NG_002', ref: { table: 'NGUOI', column: 'MaNguoi' } }
    ],
    constraints: [
      'PK: MaDiem',
      'FK: MaKQ -> KET_QUA_HOC_TAP(MaKQ)',
      'FK: MaLoaiDiem -> LOAI_DIEM(MaLoaiDiem)',
      'FK: MaNguoiNhap -> NGUOI(MaNguoi)',
      'CHECK: Diem BETWEEN 0.0 AND 10.0'
    ]
  },
  {
    id: 'DOT_THI',
    code: 'R23',
    name: 'DOT_THI',
    groupId: 'grading',
    title: 'Đợt Thi Kết Thúc Học Phần (Khảo Thí)',
    description: 'Quản lý lịch thi lần 1, thi lại lần 2 cho từng phân công giảng dạy.',
    justification: 'Tách riêng tổ chức khảo thí khỏi điểm quá trình; hỗ trợ thi lại, thi bổ sung cho học viên.',
    columns: [
      { name: 'MaDotThi', type: 'VARCHAR(20)', key: 'PK', nullable: false, description: 'Mã đợt thi', domain: 'Duy nhất', example: 'DT_001' },
      { name: 'MaPhanCong', type: 'VARCHAR(20)', key: 'FK', nullable: false, description: 'Thuộc phân công môn học', domain: 'Tham chiếu PHAN_CONG', example: 'PC_CSDL_01', ref: { table: 'PHAN_CONG', column: 'MaPhanCong' } },
      { name: 'TenDotThi', type: 'NVARCHAR(100)', key: null, nullable: false, description: 'Tên đợt thi', domain: 'Văn bản', example: 'Thi kết thúc học phần Lần 1' },
      { name: 'LoaiDotThi', type: 'VARCHAR(20)', key: null, nullable: false, description: 'Tính chất đợt thi', domain: 'LAN_1, THI_LAI, THI_PHU', example: 'LAN_1' },
      { name: 'NgayThi', type: 'DATE', key: null, nullable: false, description: 'Ngày tổ chức thi', domain: 'Date', example: '2025-12-25' }
    ],
    constraints: [
      'PK: MaDotThi',
      'FK: MaPhanCong -> PHAN_CONG(MaPhanCong)'
    ]
  }
];

// 12 Ràng buộc toàn vẹn cốt lõi
export const INTEGRITY_CONSTRAINTS = [
  {
    id: 'c1',
    title: 'Cơ cấu đơn vị quân sự phi chu trình',
    type: 'Toàn vẹn quan hệ',
    target: 'DON_VI',
    description: 'Một đơn vị không thể tự làm cha của chính mình (MaDonViCha <> MaDonVi) và chuỗi phân cấp không tạo thành vòng lặp vô tận.',
    implementation: 'CHECK constraint cấp độ bảng & Recursive CTE validation.'
  },
  {
    id: 'c2',
    title: 'Kế thừa nhân thân duy nhất (Generalization Integrity)',
    type: 'Khóa duy nhất 1-1',
    target: 'HOC_VIEN, GIANG_VIEN, USER',
    description: 'Mỗi bản ghi trong NGUOI chỉ có thể liên kết với tối đa 1 bản ghi Học viên hoặc Giảng viên, và duy nhất 1 tài khoản User.',
    implementation: 'UNIQUE constraint trên trường MaNguoi ở các bảng con.'
  },
  {
    id: 'c3',
    title: 'Không trùng lặp phân công giảng dạy',
    type: 'Khóa duy nhất kết hợp',
    target: 'PHAN_CONG',
    description: 'Trong cùng một học kỳ, một môn học của một lớp và nhóm học chỉ được phân công cho 1 giảng viên phụ trách chính.',
    implementation: 'UNIQUE (MaMonHoc, MaLop, MaHocKy, NhomHoc).'
  },
  {
    id: 'c4',
    title: 'Một học viên chỉ có 1 kết quả trong cùng một phân công',
    type: 'Toàn vẹn nghiệp vụ',
    target: 'KET_QUA_HOC_TAP',
    description: 'Một quân nhân trong một lớp học phần chỉ có đúng một bản ghi kết quả học tập tổng hợp.',
    implementation: 'UNIQUE (MaHV, MaPhanCong).'
  },
  {
    id: 'c5',
    title: 'Miền giá trị thang điểm [0.0 - 10.0]',
    type: 'Ràng buộc CHECK miền giá trị',
    target: 'DIEM, KET_QUA_HOC_TAP',
    description: 'Mọi điểm thành phần và điểm tổng kết phải nằm trong khoảng [0.0, 10.0]. Điểm 0.0 khác điểm NULL (chưa có điểm).',
    implementation: 'CHECK (Diem >= 0.0 AND Diem <= 10.0).'
  },
  {
    id: 'c6',
    title: 'Tổng trọng số các loại điểm bằng 1.0',
    type: 'Toàn vẹn cấu hình',
    target: 'LOAI_DIEM',
    description: 'Tổng trọng số của các loại điểm thành phần hợp lệ trong cùng chương trình đào tạo phải bằng 1.00 (100%).',
    implementation: 'CHECK constraint / Trigger kiểm tra cấu hình LOAI_DIEM.'
  },
  {
    id: 'c7',
    title: 'Giảng viên chỉ nhập điểm các lớp mình được phân công',
    type: 'Phân quyền hàng (Row-Level Security)',
    target: 'DIEM, PHAN_CONG',
    description: 'Khi một Giảng viên đăng nhập, hệ thống chỉ cho phép nhập điểm vào các bản ghi KET_QUA_HOC_TAP có MaPhanCong trỏ về chính MaGV của giảng viên đó.',
    implementation: 'Security View / Trigger kiểm tra MaNguoiNhap = PHAN_CONG.MaGV.'
  },
  {
    id: 'c8',
    title: 'Tổ chức đợt thi lại chỉ cho học viên chưa đạt',
    type: 'Quy tắc nghiệp vụ',
    target: 'DOT_THI, KET_QUA_HOC_TAP',
    description: 'Đợt thi kết thúc môn có LoaiDotThi = THI_LAI chỉ được lập danh sách đối với những học viên có kết quả lần 1 dưới ngưỡng đạt.',
    implementation: 'Stored Procedure lọc danh sách học viên dự thi.'
  },
  {
    id: 'c9',
    title: 'Năm kết thúc khóa học không trước năm bắt đầu',
    type: 'Toàn vẹn thời gian',
    target: 'KHOA_DAO_TAO, HOC_KY',
    description: 'NamKetThuc >= NamBatDau và NgayKetThuc >= NgayBatDau.',
    implementation: 'CHECK (NamKetThuc >= NamBatDau).'
  },
  {
    id: 'c10',
    title: 'Giảng viên phải thuộc Bộ môn trực thuộc đơn vị hợp lệ',
    type: 'Toàn vẹn tham chiếu',
    target: 'GIANG_VIEN, BO_MON, DON_VI',
    description: 'Giảng viên gắn với Bộ môn, Bộ môn phải gắn với Đơn vị Khoa hợp lệ.',
    implementation: 'Foreign Key cascade validation.'
  },
  {
    id: 'c11',
    title: 'Bảo mật quyền truy cập theo mô hình RBAC',
    type: 'Phân quyền hệ thống',
    target: 'USER_ROLE, ROLE_PERMISSION',
    description: 'Các quyền thực thi phải được gán thông qua bảng trung gian ROLE và PERMISSION, không phân quyền tĩnh.',
    implementation: 'Mô hình chuẩn RBAC với 2 bảng quan hệ N-N.'
  },
  {
    id: 'c12',
    title: 'Chỉ huy được tra cứu điểm toàn Học viện',
    type: 'Phân quyền đọc toàn Học viện',
    target: 'HOC_VIEN, LOP_HOC, DON_VI',
    description: 'ROLE_CH được đọc kết quả của toàn bộ học viên; DON_VI và LOP_HOC được sử dụng làm điều kiện lọc, nhóm và tổng hợp báo cáo.',
    implementation: 'RBAC cấp quyền SELECT toàn Học viện; bộ lọc theo cây DON_VI.'
  }
];
