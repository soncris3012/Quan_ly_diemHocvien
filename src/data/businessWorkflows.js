// src/data/businessWorkflows.js
// Đặc tả 3 luồng quy trình nghiệp vụ tương tác dạng Swimlanes có sự tham gia trực tiếp của Giảng viên

export const WORKFLOWS = [
  {
    id: 'flow_a',
    title: 'Luồng A: Phân Công Giảng Dạy, Giảng Viên Nhập Điểm & Đánh Giá',
    subtitle: 'Giảng viên nhập đủ CC–TX–CK; Phòng Đào tạo quản lý, duyệt và khóa điểm',
    summary: 'Phòng Đào tạo lập phân công và tổ chức đợt thi; giảng viên được phân công nhập toàn bộ điểm của lớp học phần; Phòng Đào tạo kiểm tra, duyệt, khóa/mở khóa và quản lý điều chỉnh.',
    swimlanes: ['Phòng Đào tạo', 'Giảng viên giảng dạy', 'Hệ thống SMTA', 'Học viên'],
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
        lane: 'Hệ thống SMTA',
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
        title: '3. Giảng Viên Nhập Điểm Quá Trình (CC, TX)',
        desc: 'Giảng viên dùng tài khoản duy nhất và chỉ mở được sổ điểm của PHAN_CONG thuộc mình.',
        input: 'USER hiện tại, sổ điểm thuộc PHAN_CONG, điểm CC và TX',
        processing: 'Kiểm tra USER → GIANG_VIEN → PHAN_CONG; ghi DIEM với TrangThaiDiem = NHAP và MaNguoiNhap = USER.MaNguoi.',
        output: 'Điểm CC, TX ở trạng thái nháp quản lý; lớp không được phân công bị từ chối.',
        relatedTables: ['USER', 'GIANG_VIEN', 'PHAN_CONG', 'KET_QUA_HOC_TAP', 'LOAI_DIEM', 'DIEM'],
        highlightColor: 'var(--color-blue)'
      },
      {
        id: 'step_a4',
        lane: 'Phòng Đào tạo',
        title: '4. Phòng Đào Tạo Tổ Chức Đợt Thi (DOT_THI)',
        desc: 'Phòng Đào tạo mở đợt thi kết thúc môn cho phân công; không nhập điểm thay giảng viên trong luồng thông thường.',
        input: 'Phân công môn học (PHAN_CONG), Ngày thi, Bài thi đã chấm',
        processing: 'Tạo DOT_THI (LoaiDotThi = LAN_1) gắn với MaPhanCong và mở cửa sổ nhập điểm cuối kỳ.',
        output: 'Đợt thi sẵn sàng để giảng viên phụ trách nhập điểm CK.',
        relatedTables: ['PHAN_CONG', 'DOT_THI'],
        highlightColor: 'var(--color-amber)'
      },
      {
        id: 'step_a5',
        lane: 'Giảng viên giảng dạy',
        title: '5. Giảng Viên Nhập Điểm Cuối Kỳ (CK)',
        desc: 'Giảng viên phụ trách nhập điểm cuối kỳ cho chính lớp học phần mình dạy.',
        input: 'DOT_THI đang mở, bài thi đã chấm, điểm CK',
        processing: 'Ghi DIEM với MaLoaiDiem = LD_CK, MaDotThi tương ứng, MaNguoiNhap là giảng viên và TrangThaiDiem = NHAP.',
        output: 'Điểm CK được ghi đầy đủ nguồn nhập và đợt thi.',
        relatedTables: ['GIANG_VIEN', 'PHAN_CONG', 'DOT_THI', 'DIEM'],
        highlightColor: 'var(--color-blue)'
      },
      {
        id: 'step_a6',
        lane: 'Phòng Đào tạo',
        title: '6. Kiểm Tra, Duyệt & Khóa Sổ Điểm',
        desc: 'Phòng Đào tạo quản lý điểm toàn trường, kiểm tra tính đầy đủ rồi duyệt hoặc trả lại cho giảng viên sửa.',
        input: 'Toàn bộ DIEM CC, TX, CK của lớp học phần',
        processing: 'Chuyển TrangThaiDiem từ NHAP → DA_DUYET → DA_KHOA; ghi MaNguoiDuyet và NgayDuyet. Chỉ ROLE_DT được mở khóa.',
        output: 'Bộ điểm đã được quản lý và khóa có truy vết.',
        relatedTables: ['USER', 'ROLE_PERMISSION', 'DIEM'],
        highlightColor: 'var(--color-amber)'
      },
      {
        id: 'step_a7',
        lane: 'Hệ thống SMTA',
        title: '7. Tổng Hợp Điểm & Xếp Loại Học Phần',
        desc: 'Hệ thống chỉ tổng hợp chính thức từ các đầu điểm đã được Phòng Đào tạo duyệt/khóa.',
        input: 'DIEM đã duyệt, trọng số LOAI_DIEM',
        processing: 'Tính CC × 0.1 + TX × 0.3 + CK × 0.6; cập nhật DiemTongKet, XepLoai và TrangThai.',
        output: 'Kết quả học tập chính thức được đóng sổ.',
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
    swimlanes: ['Hệ thống SMTA', 'Phòng Đào tạo', 'Giảng viên giảng dạy', 'Học viên'],
    steps: [
      {
        id: 'step_b1',
        lane: 'Hệ thống SMTA',
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
        lane: 'Giảng viên giảng dạy',
        title: '3. Giảng Viên Nhập Điểm Thi Lại',
        desc: 'Giảng viên phụ trách nhập điểm thi lại, gắn đúng DOT_THI; hệ thống giữ điểm thực tế để Phòng Đào tạo kiểm tra.',
        input: 'Điểm bài thi lại thực tế (8.0), Mức trần quy định (6.9)',
        processing: 'Lưu điểm thực tế vào DIEM với MaDotThi, MaNguoiNhap và TrangThaiDiem = NHAP.',
        output: 'Điểm thi lại chờ Phòng Đào tạo duyệt.',
        relatedTables: ['GIANG_VIEN', 'DOT_THI', 'DIEM'],
        highlightColor: 'var(--color-emerald)'
      },
      {
        id: 'step_b4',
        lane: 'Phòng Đào tạo',
        title: '4. Duyệt Điểm Thi Lại & Phân Công Học Lại Nếu Cần',
        desc: 'Phòng Đào tạo duyệt/khóa điểm thi lại, cho hệ thống tính lại kết quả; nếu vẫn trượt thì xếp học lại ở kỳ sau.',
        input: 'DIEM thi lại, Học viên (MaHV), Phân công kỳ sau nếu cần',
        processing: 'Ghi MaNguoiDuyet, NgayDuyet và DA_KHOA; tính lại kết quả. Nếu không đạt, tạo KET_QUA_HOC_TAP mới ở kỳ sau.',
        output: 'Kết quả thi lại được công nhận hoặc một chu trình học lại mới được kích hoạt.',
        relatedTables: ['DIEM', 'HOC_VIEN', 'PHAN_CONG', 'KET_QUA_HOC_TAP'],
        highlightColor: 'var(--color-purple)'
      }
    ]
  },

  {
    id: 'flow_c',
    title: 'Luồng C: Kiểm Soát & Điều Chỉnh Điểm Phúc Khảo',
    subtitle: 'Quy trình thẩm định và lưu vết sửa đổi điểm số',
    summary: 'Khi có đơn khiếu nại hoặc phúc khảo bài thi, Hội đồng thẩm định xem xét và ghi nhận điểm mới có lưu vết MaNguoiNhap.',
    swimlanes: ['Học viên', 'Hội đồng Khảo thí', 'Hệ thống SMTA'],
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
        lane: 'Hệ thống SMTA',
        title: '3. Lưu Bản Ghi Điểm & Tính Lại Điểm Tổng Kết',
        desc: 'Phòng Đào tạo cập nhật điểm theo biên bản, giữ nguyên MaNguoiNhap của giảng viên và ghi riêng người duyệt điều chỉnh.',
        input: 'Điểm phúc khảo mới, biên bản và cán bộ Phòng Đào tạo duyệt',
        processing: 'UPDATE DIEM SET Diem = 5.5, TrangThaiDiem = DA_KHOA, MaNguoiDuyet = CurrentUser.MaNguoi, NgayDuyet = NOW(); giữ nguyên MaNguoiNhap; tính lại KET_QUA_HOC_TAP.',
        output: 'Kết quả được cập nhật có truy vết tách biệt người nhập ban đầu và người duyệt điều chỉnh.',
        relatedTables: ['DIEM', 'KET_QUA_HOC_TAP', 'NGUOI'],
        highlightColor: 'var(--color-emerald)'
      }
    ]
  }
];
