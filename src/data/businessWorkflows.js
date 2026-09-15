// src/data/businessWorkflows.js
// Đặc tả 3 luồng quy trình nghiệp vụ tương tác dạng Swimlanes có sự tham gia trực tiếp của Giảng viên

export const WORKFLOWS = [
  {
    id: 'flow_a',
    title: 'Luồng A: Phân Công Giảng Dạy, Giảng Viên Nhập Điểm & Đánh Giá',
    subtitle: 'Chu trình hoàn chỉnh từ phân công, giảng dạy, nhập điểm quá trình đến khảo thí',
    summary: 'Mô hình hóa việc Phòng Đào tạo lập phân công giảng dạy cho Giảng viên, Giảng viên theo dõi lớp và nhập điểm Chuyên cần, Thường xuyên; Phòng Khảo thí mở đợt thi kết thúc môn và tổng hợp kết quả.',
    swimlanes: ['Phòng Đào tạo', 'Giảng viên giảng dạy', 'Hệ thống CADET DB', 'Học viên'],
    steps: [
      {
        id: 'step_a1',
        lane: 'Phòng Đào tạo',
        title: '1. Ban Hành Phân Công Giảng Dạy (PHAN_CONG)',
        desc: 'Phòng Đào tạo lập quyết định phân công Giảng viên giảng dạy Môn học cho Lớp trong Học kỳ.',
        input: 'Giảng viên (GIANG_VIEN), Môn học (MON_HOC), Lớp niên chế (LOP_HOC), Học kỳ (HOC_KY)',
        processing: 'Kiểm tra tải giảng dạy của Giảng viên, tạo bản ghi PHAN_CONG mới (MaPhanCong, NhomHoc, SoTiet).',
        output: 'Bản ghi PHAN_CONG mới sẵn sàng cho đợt học.',
        relatedTables: ['GIANG_VIEN', 'MON_HOC', 'LOP_HOC', 'HOC_KY', 'PHAN_CONG'],
        highlightColor: 'var(--color-purple)'
      },
      {
        id: 'step_a2',
        lane: 'Hệ thống CADET DB',
        title: '2. Khởi Tạo Kết Quả Học Tập Rỗng (KET_QUA_HOC_TAP)',
        desc: 'Hệ thống tự động liên kết danh sách học viên của lớp vào phân công giảng dạy để chuẩn bị ghi nhận điểm.',
        input: 'Phân công (PHAN_CONG), Danh sách học viên của lớp (HOC_VIEN)',
        processing: 'Tự động sinh các bản ghi KET_QUA_HOC_TAP (MaHV, MaPhanCong) ở trạng thái DANG_HOC.',
        output: 'Danh sách sổ điểm của lớp được khởi tạo.',
        relatedTables: ['HOC_VIEN', 'PHAN_CONG', 'KET_QUA_HOC_TAP'],
        highlightColor: 'var(--color-emerald)'
      },
      {
        id: 'step_a3',
        lane: 'Giảng viên giảng dạy',
        title: '3. Giảng Viên Nhập Điểm Thành Phần (CC, TX)',
        desc: 'Giảng viên phụ trách lớp đăng nhập hệ thống, nhập điểm Chuyên cần và Thường xuyên cho học viên.',
        input: 'Sổ điểm nhóm học, Điểm CC, TX, Mã giảng viên (MaGV / MaNguoi)',
        processing: 'INSERT các bản ghi vào bảng DIEM với MaLoaiDiem tương ứng (LD_CC, LD_TX), ghi nhận MaNguoiNhap = MaGV.',
        output: 'Các bản ghi điểm thành phần được lưu trữ kèm danh tính giảng viên nhập.',
        relatedTables: ['GIANG_VIEN', 'KET_QUA_HOC_TAP', 'LOAI_DIEM', 'DIEM'],
        highlightColor: 'var(--color-blue)'
      },
      {
        id: 'step_a4',
        lane: 'Phòng Đào tạo',
        title: '4. Tổ Chức Đợt Thi Kết Thúc Môn (DOT_THI)',
        desc: 'Bộ phận Khảo thí mở đợt thi kết thúc môn Lần 1 và nhập điểm bài thi cuối kỳ.',
        input: 'Phân công môn học (PHAN_CONG), Ngày thi, Bài thi đã chấm',
        processing: 'Tạo bản ghi DOT_THI (LoaiDotThi = LAN_1); INSERT điểm thi vào bảng DIEM với MaLoaiDiem = LD_CK.',
        output: 'Đợt thi và điểm thi kết thúc môn được ghi nhận.',
        relatedTables: ['DOT_THI', 'DIEM', 'LOAI_DIEM'],
        highlightColor: 'var(--color-amber)'
      },
      {
        id: 'step_a5',
        lane: 'Hệ thống CADET DB',
        title: '5. Tổng Hợp Điểm & Xếp Loại Học Phần',
        desc: 'Hệ thống tự động tính điểm tổng kết dựa trên trọng số LOAI_DIEM và xét đạt/trượt.',
        input: 'Các đầu điểm trong DIEM, Trọng số trong LOAI_DIEM',
        processing: 'Tính Điểm tổng kết = CC × 0.1 + TX × 0.3 + Thi × 0.6; Cập nhật DiemTongKet, XepLoai và TrangThai trong KET_QUA_HOC_TAP.',
        output: 'Kết quả học tập chính thức của môn học được đóng sổ.',
        relatedTables: ['LOAI_DIEM', 'DIEM', 'KET_QUA_HOC_TAP'],
        highlightColor: 'var(--color-emerald)'
      }
    ]
  },

  {
    id: 'flow_b',
    title: 'Luồng B: Xử Lý Thi Lại & Phân Công Học Lại Khóa Sau',
    subtitle: 'Quy trình xử lý học viên không đạt học phần',
    summary: 'Học viên không đạt lần 1 được lập danh sách thi lại ở Đợt thi lần 2. Nếu thi lại vẫn trượt, Phòng Đào tạo sẽ tạo phân công học lại ở kỳ sau.',
    swimlanes: ['Hệ thống CADET DB', 'Phòng Đào tạo', 'Giảng viên giảng dạy', 'Học viên'],
    steps: [
      {
        id: 'step_b1',
        lane: 'Hệ thống CADET DB',
        title: '1. Rà Soát Học Viên Dưới Ngưỡng Đạt',
        desc: 'Hệ thống tự động lọc các học viên có điểm thi cuối kỳ < 4.0 hoặc tổng kết < 4.0.',
        input: 'KET_QUA_HOC_TAP, DIEM',
        processing: 'Đánh dấu học viên đủ điều kiện dự thi lại đợt 2.',
        output: 'Danh sách học viên cần thi lại.',
        relatedTables: ['KET_QUA_HOC_TAP', 'DIEM'],
        highlightColor: 'var(--color-rose)'
      },
      {
        id: 'step_b2',
        lane: 'Phòng Đào tạo',
        title: '2. Mở Đợt Thi Lại (DOT_THI: THI_LAI)',
        desc: 'Tổ chức đợt thi lại lần 2 cho môn học, giữ nguyên điểm quá trình (CC, TX) do Giảng viên đã nhập.',
        input: 'Bản ghi PHAN_CONG, Danh sách thi lại',
        processing: 'Tạo bản ghi DOT_THI mới với LoaiDotThi = THI_LAI.',
        output: 'Lịch thi lại được ban hành.',
        relatedTables: ['DOT_THI', 'PHAN_CONG'],
        highlightColor: 'var(--color-amber)'
      },
      {
        id: 'step_b3',
        lane: 'Hệ thống CADET DB',
        title: '3. Nhập Điểm Thi Lại & Áp Trần Điểm',
        desc: 'Nhập điểm bài thi lại vào bảng DIEM, áp dụng mức trần công nhận 6.9 theo quy chế.',
        input: 'Điểm bài thi lại thực tế (8.0), Mức trần quy định (6.9)',
        processing: 'Lưu điểm thi thực tế vào DIEM; tính lại DiemTongKet và XepLoai sau thi lại trong KET_QUA_HOC_TAP.',
        output: 'Cập nhật kết quả sau thi lại.',
        relatedTables: ['DIEM', 'KET_QUA_HOC_TAP'],
        highlightColor: 'var(--color-emerald)'
      },
      {
        id: 'step_b4',
        lane: 'Phòng Đào tạo',
        title: '4. Phân Công Học Lại Ở Khóa Sau (Nếu Trượt)',
        desc: 'Nếu thi lại lần 2 vẫn không đạt, học viên được xếp vào phân công giảng dạy mới ở kỳ tiếp theo.',
        input: 'Học viên (MaHV), Phân công giảng dạy kỳ sau (MaPhanCong_moi)',
        processing: 'Tạo bản ghi KET_QUA_HOC_TAP mới ở kỳ sau với TrangThai = HOC_LAI, bảo lưu lịch sử cũ.',
        output: 'Một chu trình học tập mới được kích hoạt.',
        relatedTables: ['HOC_VIEN', 'PHAN_CONG', 'KET_QUA_HOC_TAP'],
        highlightColor: 'var(--color-purple)'
      }
    ]
  },

  {
    id: 'flow_c',
    title: 'Luồng C: Kiểm Soát & Điều Chỉnh Điểm Phúc Khảo',
    subtitle: 'Quy trình thẩm định và lưu vết sửa đổi điểm số',
    summary: 'Khi có đơn khiếu nại hoặc phúc khảo bài thi, Hội đồng thẩm định xem xét và ghi nhận điểm mới có lưu vết MaNguoiNhap.',
    swimlanes: ['Học viên', 'Hội đồng Khảo thí', 'Hệ thống CADET DB'],
    steps: [
      {
        id: 'step_c1',
        lane: 'Học viên',
        title: '1. Nộp Đơn Xin Phúc Khảo Bài Thi',
        desc: 'Học viên gửi đơn đề nghị chấm lại bài thi kết thúc môn khi phát hiện chênh lệch kết quả.',
        input: 'Mã kết quả (MaKQ), Bài thi cần phúc khảo',
        processing: 'Ghi nhận đề xuất phúc khảo trong thời hạn quy định.',
        output: 'Hồ sơ phúc khảo được chuyển đến Hội đồng chấm.',
        relatedTables: ['KET_QUA_HOC_TAP'],
        highlightColor: 'var(--color-blue)'
      },
      {
        id: 'step_c2',
        lane: 'Hội đồng Khảo thí',
        title: '2. Thẩm Định & Ban Hành Điểm Mới',
        desc: 'Giảng viên chấm phúc khảo kiểm tra lại bài thi và lập biên bản điều chỉnh điểm.',
        input: 'Bài thi gốc, Quyết định thành lập Hội đồng chấm phúc khảo',
        processing: 'Xác định điểm mới sau phúc khảo (ví dụ điều chỉnh từ 3.0 lên 5.5).',
        output: 'Biên bản điểm phúc khảo chính thức.',
        relatedTables: ['GIANG_VIEN', 'DIEM'],
        highlightColor: 'var(--color-amber)'
      },
      {
        id: 'step_c3',
        lane: 'Hệ thống CADET DB',
        title: '3. Lưu Bản Ghi Điểm & Tính Lại Điểm Tổng Kết',
        desc: 'Cập nhật điểm mới vào bảng DIEM kèm MaNguoiNhap, tự động tính lại DiemTongKet và XepLoai.',
        input: 'Điểm phúc khảo mới, Cán bộ thực hiện nhập',
        processing: 'UPDATE DIEM SET Diem = 5.5, NgayNhap = NOW(), MaNguoiNhap = MaNguoiDuyet; Cập nhật lại KET_QUA_HOC_TAP.',
        output: 'Kết quả được cập nhật minh bạch, lưu vết người sửa.',
        relatedTables: ['DIEM', 'KET_QUA_HOC_TAP', 'NGUOI'],
        highlightColor: 'var(--color-emerald)'
      }
    ]
  }
];
