// src/data/actorsData.js
// Ma trận tác nhân và mô phỏng phân quyền quản lý đơn vị quân sự

export const ACTORS = [
  {
    id: 'actor_hv',
    name: 'Học Viên Quân Sự',
    roleCode: 'ROLE_HV',
    badgeColor: 'var(--color-emerald)',
    tagClass: 'tag-emerald',
    icon: 'User',
    summary: 'Đối tượng trung tâm của quá trình đào tạo và rèn luyện',
    whatTheyDo: 'Tra cứu kết quả học tập, lịch thi, trạng thái học phần của bản thân và gửi đơn phúc khảo/khiếu nại nếu phát hiện sai lệch.',
    dataScopeView: 'CHỈ XEM ĐƯỢC KẾT QUẢ CỦA CHÍNH MÌNH (Row-Level Security theo MaHV = User.MaHV). Không được xem điểm của đồng đội khác.',
    dataScopeModify: 'Không có quyền sửa đổi bất kỳ dữ liệu điểm nào trong hệ thống.',
    impactedTables: ['HocVien', 'LuotHoc', 'BangDiem', 'LanThi'],
    note: 'Quyền xem được kiểm soát chặt chẽ để bảo đảm tính bảo mật cá nhân và quy định quân đội.'
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
    dataScopeView: 'XEM ĐƯỢC HỌC VIÊN THUỘC ĐƠN VỊ ĐƯỢC PHÂN CÔNG (dựa trên bảng PhanCongQuanLy và cây phân cấp đơn vị DonVi).',
    dataScopeModify: 'Không có quyền can thiệp, nhập điểm hay sửa điểm chuyên môn (thuộc thẩm quyền Phòng Đào tạo).',
    impactedTables: ['DonVi', 'PhanCongQuanLy', 'LopHoc', 'HocVien', 'BangDiem'],
    note: 'ĐIỂM SÁNG KIẾN TRÚC: Cần bảng PhanCongQuanLy để xác định một tài khoản chỉ huy đang quản lý đại đội nào trong khoảng thời gian nào, cho phép luân chuyển cán bộ linh hoạt.'
  },
  {
    id: 'actor_dt',
    name: 'Phòng Đào Tạo',
    roleCode: 'ROLE_DT',
    badgeColor: 'var(--color-purple)',
    tagClass: 'tag-purple',
    icon: 'GraduationCap',
    summary: 'Cơ quan tham mưu quản lý học vụ và kết quả đào tạo toàn trường',
    whatTheyDo: 'Lập kế hoạch đào tạo khung, mở lớp học phần, phân công học viên vào lớp, nhập điểm thành phần, nhập điểm thi, xét đạt/trượt và thực hiện chốt sổ điểm.',
    dataScopeView: 'Xem toàn bộ dữ liệu đào tạo, kế hoạch, lớp học phần và điểm số trong phạm vi phụ trách.',
    dataScopeModify: 'Được tạo kế hoạch, tạo lớp học phần, phân công lượt học, nhập và cập nhật điểm khi sổ điểm ĐANG MỞ. Khi sổ điểm ĐÃ KHÓA, không được tự ý sửa mà phải lập yêu cầu xin mở khóa.',
    impactedTables: ['KeHoachDaoTao', 'LopHocPhan', 'LuotHoc', 'BangDiem', 'LanThi', 'YeuCauMoKhoa', 'NhatKyDiem'],
    note: 'Là tác nhân tác động nhiều bảng nhất trong hệ thống đào tạo.'
  },
  {
    id: 'actor_gd',
    name: 'Ban Giám Đốc (Lãnh Đạo)',
    roleCode: 'ROLE_GD',
    badgeColor: 'var(--color-amber)',
    tagClass: 'tag-amber',
    icon: 'Award',
    summary: 'Cấp lãnh đạo cao nhất phê duyệt chính sách và kiểm soát tuân thủ',
    whatTheyDo: 'Kiểm tra, giám sát toàn diện báo cáo chất lượng đào tạo; phê duyệt hoặc từ chối các Yêu cầu xin mở khóa sổ điểm đã đóng theo thẩm quyền.',
    dataScopeView: 'Toàn quyền tra cứu, thanh tra toàn trường và giám sát lịch sử nhật ký sửa điểm (Audit Log).',
    dataScopeModify: 'Chỉ cập nhật trạng thái phê duyệt trong bảng YeuCauMoKhoa (Duyệt / Từ chối kèm thời hạn cho phép sửa).',
    impactedTables: ['YeuCauMoKhoa', 'BangDiem', 'NhatKyDiem'],
    note: 'Bảo đảm tính kỷ luật quân sự nghiêm minh: Chỉ có Ban Giám đốc mới có thẩm quyền cho phép mở lại một bảng điểm đã khóa.'
  }
];

// Cấu trúc cây đơn vị quân sự mẫu phục vụ kiểm chứng phân quyền
export const UNIT_TREE_DATA = {
  id: 'd1',
  name: 'Tiểu đoàn 1',
  type: 'TIEU_DOAN',
  code: 'd1',
  commander: 'Trung tá Hoàng Văn Quyết (Tiểu đoàn trưởng)',
  children: [
    {
      id: 'd1_c1',
      name: 'Đại đội 1 (c1)',
      type: 'DAI_DOI',
      code: 'd1_c1',
      commander: 'Đại úy Trần Văn Bình (Đại đội trưởng)',
      classes: [
        {
          id: 'CNTT1-K58',
          name: 'Lớp CNTT1-K58',
          studentsCount: 28,
          students: [
            { id: 'HV001', name: 'Nguyễn Văn An', gpa: 7.8, status: 'DANG_HOC' },
            { id: 'HV002', name: 'Trần Đình Trọng', gpa: 6.9, status: 'DANG_HOC' },
            { id: 'HV003', name: 'Lê Hoàng Long', gpa: 8.4, status: 'DANG_HOC' }
          ]
        },
        {
          id: 'CNTT2-K58',
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
      code: 'd1_c2',
      commander: 'Đại úy Nguyễn Hữu Hùng (Đại đội trưởng)',
      classes: [
        {
          id: 'ATTT1-K58',
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
