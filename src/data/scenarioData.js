// src/data/scenarioData.js
// 6 Kịch bản kiểm chứng mô hình dữ liệu thực tế tích hợp Giảng viên & Phân công giảng dạy

export const SCENARIOS = [
  {
    id: 'sc1',
    title: 'Tình huống 1: Giảng Viên Dạy & Đánh Giá Điểm Chuẩn',
    badge: 'Đạt chuẩn',
    badgeClass: 'tag-emerald',
    description: 'Giảng viên TS. Lê Đức Thắng được phân công dạy CSDL, nhập điểm CC = 8.0, TX = 7.0; Học viên thi cuối kỳ đạt 6.0.',
    highlightTables: ['GIANG_VIEN', 'PHAN_CONG', 'LOAI_DIEM', 'DIEM', 'KET_QUA_HOC_TAP'],
    mockData: {
      student: { id: 'HV001', name: 'Nguyễn Văn An', class: 'CNTT2_K58' },
      lecturer: { id: 'GV001', name: 'TS. Lê Đức Thắng', dept: 'Bộ môn CSDL' },
      assignment: { id: 'PC_CSDL_01', course: 'Cơ sở dữ liệu (3 TC)', term: 'Học kỳ 1 (2025-2026)' },
      scores: {
        cc: 8.0,
        tx: 7.0,
        finalExam: 6.0
      },
      calculated: {
        finalGrade: 6.5,
        status: 'HOAN_THANH',
        rank: 'Khá',
        formulaStr: '8.0 × 0.1 (CC do GV nhập) + 7.0 × 0.3 (TX do GV nhập) + 6.0 × 0.6 (Thi cuối kỳ) = 6.5'
      }
    },
    explanation: 'Giảng viên đăng nhập với tài khoản gv_lethang, xem danh sách phân công PC_CSDL_01 và nhập điểm thành phần vào bảng DIEM kèm MaNguoiNhap = GV001. Hệ thống tự động tính điểm tổng kết lưu vào KET_QUA_HOC_TAP.'
  },

  {
    id: 'sc2',
    title: 'Tình huống 2: Điểm Cuối Kỳ Dưới Ngưỡng Liệt (< 4.0)',
    badge: 'Dưới ngưỡng',
    badgeClass: 'tag-rose',
    description: 'Điểm quá trình do Giảng viên nhập rất cao (CC: 9.0, TX: 8.0) nhưng điểm thi kết thúc đợt 1 bị điểm liệt (3.0).',
    highlightTables: ['DIEM', 'KET_QUA_HOC_TAP', 'DOT_THI'],
    mockData: {
      student: { id: 'HV002', name: 'Trần Đình Trọng', class: 'CNTT2_K58' },
      scores: {
        cc: 9.0,
        tx: 8.0,
        finalExam: 3.0
      },
      calculated: {
        normalAvg: 5.1,
        finalRecorded: 3.0,
        status: 'CHUA_DAT',
        formulaStr: 'Nếu tính gộp thông thường: 9×0.1 + 8×0.3 + 3×0.6 = 5.1 (đủ đạt). NHƯNG do Điểm thi CK = 3.0 < 4.0 (Ngưỡng liệt) ➔ Ghi nhận Tổng kết = 3.0 (Chưa đạt).'
      }
    },
    explanation: 'Theo quy chế khảo thí, điểm bài thi cuối kỳ dưới 4.0 bị coi là điểm liệt. Hệ thống ghi nhận kết quả không đạt, giữ nguyên điểm quá trình do Giảng viên đã chấm và xếp học viên vào đợt thi lại DOT_THI lần 2.'
  },

  {
    id: 'sc3',
    title: 'Tình huống 3: Đợt Thi Lại Điểm Cao & Áp Trần 6.9',
    badge: 'Áp trần 6.9',
    badgeClass: 'tag-amber',
    description: 'Học viên dự đợt thi lại (DOT_THI: THI_LAI) đạt điểm thực tế xuất sắc (8.0), hệ thống xử lý trần điểm 6.9.',
    highlightTables: ['DOT_THI', 'DIEM', 'KET_QUA_HOC_TAP', 'LOAI_DIEM'],
    mockData: {
      student: { id: 'HV002', name: 'Trần Đình Trọng', class: 'CNTT2_K58' },
      retestBatch: { id: 'DT_002', name: 'Đợt thi lại HK1', type: 'THI_LAI' },
      scores: {
        cc: 9.0,
        tx: 8.0,
        exam1: 3.0,
        exam2Raw: 8.0,
        exam2Capped: 6.9
      },
      interpretationA: {
        title: 'Cách 1: Áp trần cho điểm thi lại (6.9)',
        calc: 'Điểm thi công nhận = 6.9. Tổng kết = 9×0.1 + 8×0.3 + 6.9×0.6 = 7.4 (Khá)'
      },
      interpretationB: {
        title: 'Cách 2: Áp trần trực tiếp cho điểm tổng kết học phần (6.9)',
        calc: 'Tổng kết thô = 9×0.1 + 8×0.3 + 8.0×0.6 = 8.1. Áp trần toàn môn: MIN(8.1, 6.9) = 6.9'
      }
    },
    explanation: 'Bảo toàn dữ liệu gốc: Bảng DIEM vẫn lưu giá trị bài thi thực tế 8.0; việc áp trần 6.9 được thực hiện khi quy đổi DiemTongKet trong KET_QUA_HOC_TAP.'
  },

  {
    id: 'sc4',
    title: 'Tình huống 4: Thi Lại Vẫn Trượt ➔ Phân Công Học Lại Khóa Sau',
    badge: 'Học lại kỳ sau',
    badgeClass: 'tag-purple',
    description: 'Học viên thi cả 2 đợt đều không đạt. Sang kỳ sau, học viên được xếp vào phân công giảng dạy mới (PHAN_CONG) cùng khóa dưới.',
    highlightTables: ['PHAN_CONG', 'KET_QUA_HOC_TAP', 'HOC_VIEN', 'GIANG_VIEN'],
    mockData: {
      student: { id: 'HV003', name: 'Lê Hoàng Long', class: 'CNTT2_K58' },
      attempt1: {
        assignment: 'PC_CSDL_01 (Kỳ 1 năm học 2025-2026)',
        lecturer: 'TS. Lê Đức Thắng',
        exam1: 3.0,
        exam2: 3.5,
        finalGrade: 3.5,
        status: 'HOC_LAI'
      },
      attempt2: {
        assignment: 'PC_CSDL_02 (Kỳ 1 năm học 2026-2027 - Học cùng K59)',
        lecturer: 'ThS. Hoàng Minh Tuấn',
        cc: 8.5,
        tx: 7.5,
        exam1: 7.0,
        finalGrade: 7.3,
        status: 'HOAN_THANH'
      }
    },
    explanation: 'Minh chứng cho thiết kế quan hệ giữa HOC_VIEN và PHAN_CONG qua KET_QUA_HOC_TAP: Mỗi lần học lại là một bản ghi KET_QUA_HOC_TAP mới gắn với một PHAN_CONG mới, giữ trọn vẹn lịch sử đào tạo mà không đè dữ liệu cũ.'
  },

  {
    id: 'sc5',
    title: 'Tình huống 5: Quy Trình Giảng Viên Điều Chỉnh Điểm Phúc Khảo',
    badge: 'Phúc khảo & Lưu vết',
    badgeClass: 'tag-amber',
    description: 'Học viên xin phúc khảo. Giảng viên chấm phúc khảo thẩm định và cập nhật lại điểm trong bảng DIEM có lưu vết MaNguoiNhap.',
    highlightTables: ['DIEM', 'KET_QUA_HOC_TAP', 'GIANG_VIEN', 'NGUOI'],
    steps: [
      { step: 1, title: 'Điểm ban đầu đã công bố', status: 'DA_CHOT', score: '3.0' },
      { step: 2, title: 'Học viên nộp đơn xin phúc khảo bài thi', status: 'CHO_CHAM', code: 'PK_2026_01' },
      { step: 3, title: 'Giảng viên Hội đồng thẩm định bài thi', approver: 'GV002 - PGS. Trần Văn Nam', result: 'Tăng 2.5 điểm' },
      { step: 4, title: 'Cập nhật bảng DIEM có MaNguoiNhap', oldVal: '3.0', newVal: '5.5' },
      { step: 5, title: 'Tính lại DiemTongKet & Khép lại phúc khảo', status: 'HOAN_THANH', newFinal: '5.8' }
    ],
    explanation: 'Bảng DIEM có cột MaNguoiNhap (tham chiếu NGUOI) cho phép xác định chính xác giảng viên hoặc cán bộ nào đã thực hiện chỉnh sửa điểm vào mốc thời gian nào.'
  },

  {
    id: 'sc6',
    title: 'Tình huống 6: Chỉ Huy Xem Điểm Quân Nhân Đơn Vị Mình',
    badge: 'Phân quyền đơn vị',
    badgeClass: 'tag-blue',
    description: 'Chỉ huy Đại đội 1 chỉ xem được điểm của học viên thuộc các lớp biên chế tại Đại đội 1 (CNTT1, CNTT2), bị từ chối xem Đại đội 2.',
    highlightTables: ['DON_VI', 'LOP_HOC', 'HOC_VIEN', 'KET_QUA_HOC_TAP'],
    commanders: [
      {
        id: 'ch_c1',
        name: 'Đại úy Trần Văn Bình',
        unit: 'Đại đội 1 (DV_C1)',
        allowedClasses: ['CNTT1_K58', 'CNTT2_K58'],
        blockedClasses: ['ATTT1_K58']
      },
      {
        id: 'ch_c2',
        name: 'Đại úy Nguyễn Hữu Hùng',
        unit: 'Đại đội 2 (DV_C2)',
        allowedClasses: ['ATTT1_K58'],
        blockedClasses: ['CNTT1_K58', 'CNTT2_K58']
      }
    ],
    explanation: 'Phân quyền phạm vi dựa trên liên kết DON_VI -> LOP_HOC -> HOC_VIEN -> KET_QUA_HOC_TAP: Tách bạch rõ ràng giữa vai trò quản lý quân sự của Chỉ huy và vai trò chuyên môn của Giảng viên.'
  }
];
