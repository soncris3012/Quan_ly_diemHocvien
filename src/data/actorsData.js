// src/data/actorsData.js
// Ma trận 5 tác nhân (bổ sung Giảng viên) và mô phỏng phân quyền dữ liệu

export const ACTORS = [
  {
    id: 'actor_hv',
    name: 'Học Viên Quân Sự',
    roleCode: 'ROLE_HV',
    badgeColor: 'var(--color-emerald)',
    tagClass: 'tag-emerald',
    icon: 'User',
    summary: 'Đối tượng trung tâm của quá trình đào tạo và rèn luyện',
    whatTheyDo: 'Tra cứu điểm thành phần (CC, TX), điểm thi các đợt (Lần 1, Thi lại), điểm tổng kết và xếp loại của chính mình.',
    dataScopeView: 'CHỈ XEM ĐƯỢC KẾT QUẢ CỦA BẢN THÂN (MaHV = CurrentUser.MaHV qua bảng NGUOI).',
    dataScopeModify: 'Không có quyền sửa đổi bất kỳ trường dữ liệu điểm nào.',
    impactedTables: ['HOC_VIEN', 'KET_QUA_HOC_TAP', 'DIEM'],
    note: 'Quyền xem được kiểm soát chặt chẽ bảo đảm bí mật cá nhân và kỷ luật quân đội.'
  },
  {
    id: 'actor_gv',
    name: 'Giảng Viên Giảng Dạy (Yếu Tố Trọng Tâm Mới)',
    roleCode: 'ROLE_GV',
    badgeColor: 'var(--color-purple)',
    tagClass: 'tag-purple',
    icon: 'GraduationCap',
    summary: 'Cán bộ trực tiếp giảng dạy và đánh giá quá trình học tập',
    whatTheyDo: 'Theo dõi danh sách lớp được phân công, ghi nhận điểm chuyên cần (CC), điểm kiểm tra thường xuyên (TX), bài tập lớn cho học viên thuộc phân công giảng dạy của mình.',
    dataScopeView: 'Xem danh sách học viên và bảng điểm các lớp học phần mà mình được phân công giảng dạy (thông qua bảng PHAN_CONG có MaGV = CurrentUser.MaGV).',
    dataScopeModify: 'ĐƯỢC NHẬP VÀ ĐIỀU CHỈNH ĐIỂM THÀNH PHẦN (CC, TX) trong thời hạn đợt học đang mở. Không được nhập điểm thi cuối kỳ (do Hội đồng Khảo thí phụ trách).',
    impactedTables: ['PHAN_CONG', 'KET_QUA_HOC_TAP', 'DIEM', 'GIANG_VIEN'],
    note: 'ĐIỂM SÁNG KIẾN TRÚC MỚI: Bảng PHAN_CONG kết nối Giảng viên với Lớp học và Môn học; khi Giảng viên nhập điểm, bảng DIEM ghi nhận trường MaNguoiNhap chính là mã của Giảng viên để bảo đảm tính minh bạch giải trình.'
  },
  {
    id: 'actor_ch',
    name: 'Chỉ Huy Đơn Vị (Đại đội / Tiểu đoàn)',
    roleCode: 'ROLE_CH',
    badgeColor: 'var(--color-blue)',
    tagClass: 'tag-blue',
    icon: 'Shield',
    summary: 'Cán bộ chỉ huy trực tiếp quản lý quân nhân và kết quả rèn luyện',
    whatTheyDo: 'Theo dõi, tổng hợp và giám sát kết quả học tập của toàn bộ quân nhân thuộc đơn vị mình phụ trách nhằm phục vụ đánh giá phân loại rèn luyện quân sự định kỳ.',
    dataScopeView: 'XEM ĐƯỢC HỌC VIÊN THUỘC ĐƠN VỊ ĐƯỢC PHÂN CÔNG (dựa trên cây đơn vị DON_VI và LOP_HOC).',
    dataScopeModify: 'Không có quyền nhập điểm hay sửa điểm chuyên môn (thuộc thẩm quyền Giảng viên và Phòng Đào tạo).',
    impactedTables: ['DON_VI', 'LOP_HOC', 'HOC_VIEN', 'KET_QUA_HOC_TAP'],
    note: 'Chỉ huy quản lý theo biên chế lớp hành chính (LOP_HOC) và đơn vị quân sự (DON_VI).'
  },
  {
    id: 'actor_dt',
    name: 'Phòng Đào Tạo & Khảo Thí',
    roleCode: 'ROLE_DT',
    badgeColor: 'var(--color-amber)',
    tagClass: 'tag-amber',
    icon: 'FileText',
    summary: 'Cơ quan tham mưu quản lý học vụ và khảo thí toàn trường',
    whatTheyDo: 'Lập quyết định phân công giảng dạy (PHAN_CONG), quản lý danh mục môn học (MON_HOC), tổ chức các đợt thi (DOT_THI), nhập điểm thi cuối kỳ và thực hiện chốt sổ điểm tổng kết.',
    dataScopeView: 'Xem toàn bộ dữ liệu đào tạo, kế hoạch phân công, lớp học phần và điểm số toàn trường.',
    dataScopeModify: 'Được tạo phân công giảng dạy, mở đợt thi, nhập điểm thi kết thúc môn, tính điểm tổng kết và chốt sổ điểm.',
    impactedTables: ['KHOA_DAO_TAO', 'MON_HOC', 'PHAN_CONG', 'DOT_THI', 'KET_QUA_HOC_TAP', 'DIEM'],
    note: 'Là tác nhân điều phối đào tạo và kiểm soát quy chế khảo thí.'
  },
  {
    id: 'actor_gd',
    name: 'Ban Giám Đốc (Lãnh Đạo)',
    roleCode: 'ROLE_GD',
    badgeColor: 'var(--color-rose)',
    tagClass: 'tag-rose',
    icon: 'Award',
    summary: 'Cấp lãnh đạo cao nhất phê duyệt chính sách và kiểm soát tuân thủ',
    whatTheyDo: 'Kiểm tra, thanh tra chất lượng đào tạo toàn trường; phê duyệt các quyết định phân công và xử lý khiếu nại, phúc khảo đặc biệt.',
    dataScopeView: 'Toàn quyền tra cứu, kiểm toán và giám sát dữ liệu toàn trường.',
    dataScopeModify: 'Phê duyệt cấp cao các điều chỉnh điểm sau phúc khảo.',
    impactedTables: ['KET_QUA_HOC_TAP', 'DIEM', 'ROLE_PERMISSION'],
    note: 'Bảo đảm tính kỷ luật quân sự nghiêm minh.'
  }
];

// Cấu trúc cây đơn vị quân sự mẫu
export const UNIT_TREE_DATA = {
  id: 'd1',
  name: 'Tiểu đoàn 1',
  type: 'TIEU_DOAN',
  code: 'DV_D1',
  commander: 'Trung tá Hoàng Văn Quyết (Tiểu đoàn trưởng)',
  children: [
    {
      id: 'd1_c1',
      name: 'Đại đội 1 (c1)',
      type: 'DAI_DOI',
      code: 'DV_C1',
      commander: 'Đại úy Trần Văn Bình (Đại đội trưởng)',
      classes: [
        {
          id: 'CNTT1_K58',
          name: 'Lớp CNTT1-K58',
          studentsCount: 28,
          students: [
            { id: 'HV001', name: 'Nguyễn Văn An', gpa: 7.8, status: 'DANG_HOC' },
            { id: 'HV002', name: 'Trần Đình Trọng', gpa: 6.9, status: 'DANG_HOC' },
            { id: 'HV003', name: 'Lê Hoàng Long', gpa: 8.4, status: 'DANG_HOC' }
          ]
        },
        {
          id: 'CNTT2_K58',
          name: 'Lớp CNTT2-K58',
          studentsCount: 30,
          students: [
            { id: 'HV004', name: 'Phạm Đức Thắng', gpa: 8.1, status: 'DANG_HOC' },
            { id: 'HV005', name: 'Vũ Quốc Toàn', gpa: 5.8, status: 'DANG_HOC' }
          ]
        }
      ]
    },
    {
      id: 'd1_c2',
      name: 'Đại đội 2 (c2)',
      type: 'DAI_DOI',
      code: 'DV_C2',
      commander: 'Đại úy Nguyễn Hữu Hùng (Đại đội trưởng)',
      classes: [
        {
          id: 'ATTT1_K58',
          name: 'Lớp ATTT1-K58',
          studentsCount: 26,
          students: [
            { id: 'HV006', name: 'Đỗ Minh Tuấn', gpa: 7.2, status: 'DANG_HOC' },
            { id: 'HV007', name: 'Bùi Anh Quân', gpa: 6.4, status: 'DANG_HOC' }
          ]
        }
      ]
    }
  ]
};
