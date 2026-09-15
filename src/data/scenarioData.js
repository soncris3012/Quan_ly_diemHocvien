// src/data/scenarioData.js
// 6 Kịch bản kiểm chứng mô hình dữ liệu thực tế với máy trạng thái tương tác

export const SCENARIOS = [
  {
    id: 'sc1',
    title: 'Tình huống 1: Học & Tính Điểm Bình Thường',
    badge: 'Đạt chuẩn',
    badgeClass: 'tag-emerald',
    description: 'Học viên tham gia học phần đầy đủ, đạt điều kiện dự thi và thi kết thúc học phần lần 1 đạt điểm khá.',
    highlightTables: ['HocPhan', 'LopHocPhan', 'LuotHoc', 'BangDiem', 'LanThi', 'QuyTacDanhGia'],
    mockData: {
      student: { id: 'HV001', name: 'Nguyễn Văn An', class: 'CNTT2-K58' },
      course: { id: 'CSDL101', name: 'Cơ sở dữ liệu', credits: 3 },
      rule: { id: 'QT_QS_2025', wCC: 0.1, wTX: 0.3, wCK: 0.6, threshCK: 4.0, threshPass: 4.0 },
      scores: {
        cc: 8.0,
        tx: 7.0,
        finalExam: 6.0,
        examAttempt: 1
      },
      calculated: {
        rawFinal: 6.5,
        status: 'DAT',
        formulaStr: '8.0 × 0.1 + 7.0 × 0.3 + 6.0 × 0.6 = 0.8 + 2.1 + 3.6 = 6.5'
      }
    },
    explanation: 'Học viên đủ điều kiện dự thi, điểm cuối kỳ (6.0) >= 4.0 (ngưỡng liệt), điểm tổng kết (6.5) >= 4.0. Học phần được ghi nhận hoàn thành ở Lần thi 1, Bảng điểm được chốt và chuyển trạng thái ĐÃ KHÓA.'
  },

  {
    id: 'sc2',
    title: 'Tình huống 2: Điểm Cuối Kỳ Dưới Ngưỡng Liệt (< 4.0)',
    badge: 'Dưới ngưỡng',
    badgeClass: 'tag-rose',
    description: 'Học viên có điểm chuyên cần và thường xuyên rất cao nhưng điểm thi cuối kỳ lần 1 bị dưới ngưỡng liệt 4.0.',
    highlightTables: ['BangDiem', 'LanThi', 'QuyTacDanhGia'],
    mockData: {
      student: { id: 'HV002', name: 'Trần Đình Trọng', class: 'CNTT2-K58' },
      course: { id: 'CSDL101', name: 'Cơ sở dữ liệu', credits: 3 },
      rule: { id: 'QT_QS_2025', wCC: 0.1, wTX: 0.3, wCK: 0.6, threshCK: 4.0, threshPass: 4.0 },
      scores: {
        cc: 9.0,
        tx: 8.0,
        finalExam: 3.0,
        examAttempt: 1
      },
      calculated: {
        normalAvg: 5.1,
        finalRecorded: 3.0,
        status: 'KHONG_DAT',
        formulaStr: 'Nếu tính gộp thông thường: 9×0.1 + 8×0.3 + 3×0.6 = 5.1 (đủ đạt). NHƯNG do Điểm thi CK = 3.0 < 4.0 (Ngưỡng liệt) -> Tổng kết = 3.0 (Không đạt).'
      }
    },
    explanation: 'Theo quy định trong đề bài, điểm thi kết thúc học phần dưới 4.0 bị coi là điểm liệt. Bảng QuyTacDanhGia có cột NguongCK = 4.0. Hệ thống ghi nhận điểm tổng kết bằng chính điểm cuối kỳ (3.0) và xác định KetQuaChot = KHONG_DAT. Học viên đủ điều kiện được thi lại Lần 2.'
  },

  {
    id: 'sc3',
    title: 'Tình huống 3: Thi Lại Điểm Cao & Áp Trần 6.9',
    badge: 'Áp trần 6.9',
    badgeClass: 'tag-amber',
    description: 'Học viên thi lại Lần 2 đạt kết quả thực tế xuất sắc (8.0), hệ thống xử lý trần điểm 6.9 như thế nào?',
    highlightTables: ['BangDiem', 'LanThi', 'QuyTacDanhGia'],
    mockData: {
      student: { id: 'HV002', name: 'Trần Đình Trọng', class: 'CNTT2-K58' },
      course: { id: 'CSDL101', name: 'Cơ sở dữ liệu', credits: 3 },
      rule: { id: 'QT_QS_2025', wCC: 0.1, wTX: 0.3, wCK: 0.6, capRetest: 6.9 },
      scores: {
        cc: 9.0,
        tx: 8.0,
        exam1: 3.0,
        exam2Raw: 8.0,
        exam2Capped: 6.9
      },
      interpretationA: {
        title: 'Cách 1: Áp trần cho điểm thi cuối kỳ lần 2',
        calc: 'Điểm thi công nhận = 6.9. Tổng kết = 9×0.1 + 8×0.3 + 6.9×0.6 = 0.9 + 2.4 + 4.14 = 7.44 -> Làm tròn 7.4'
      },
      interpretationB: {
        title: 'Cách 2: Áp trần trực tiếp cho điểm tổng kết học phần',
        calc: 'Tổng kết thô = 9×0.1 + 8×0.3 + 8.0×0.6 = 8.1. Áp trần toàn môn: MIN(8.1, 6.9) = 6.9'
      }
    },
    explanation: 'ĐIỂM SÁNG BẢO TOÀN DỮ LIỆU: Bảng LanThi lưu trường DiemThiThucTe = 8.0. Không bao giờ ghi đè trực tiếp con số 8.0 thành 6.9 trong cơ sở dữ liệu! Việc áp trần do quy tắc xử lý khi tính DiemTongKetChot. Báo cáo thể hiện rõ cả 2 cách hiểu và đánh dấu "cần nhà trường xác nhận".'
  },

  {
    id: 'sc4',
    title: 'Tình huống 4: Thi Lại Không Đạt -> Học Lại Ở Khóa Sau',
    badge: 'Phân biệt Lượt học',
    badgeClass: 'tag-purple',
    description: 'Học viên thi lần 1 và thi lại lần 2 đều không đạt. Sang kỳ sau, học viên phải học lại cùng khóa dưới.',
    highlightTables: ['LuotHoc', 'BangDiem', 'LanThi', 'LopHocPhan'],
    mockData: {
      student: { id: 'HV003', name: 'Lê Hoàng Long', class: 'CNTT2-K58' },
      course: { id: 'CSDL101', name: 'Cơ sở dữ liệu', credits: 3 },
      attempt1: {
        enrollmentId: 'LH001',
        term: 'Học kỳ 1 (2025-2026)',
        lhp: 'LHP_CSDL_01',
        type: 'HOC_LAN_DAU',
        exam1: 3.0,
        exam2: 3.5,
        finalGrade: 3.5,
        status: 'KHONG_DAT'
      },
      attempt2: {
        enrollmentId: 'LH002',
        term: 'Học kỳ 1 (2026-2027) - Học cùng K59',
        lhp: 'LHP_CSDL_02',
        type: 'HOC_LAI',
        prevEnrollmentId: 'LH001',
        cc: 8.5,
        tx: 7.5,
        exam1: 7.0,
        finalGrade: 7.3,
        status: 'DAT'
      }
    },
    explanation: 'CHỨNG MINH SỰ CẦN THIẾT CỦA BẢNG LuotHoc: Nếu chỉ có bảng HocVien và BangDiem, ta sẽ không thể lưu đồng thời 2 lần học riêng biệt của cùng một học viên cho cùng một môn mà không làm mất lịch sử điểm lần đầu! Bảng LuotHoc cho phép tạo dòng mới với MaLuotHocTruoc = LH001 để truy vết xuyên suốt.'
  },

  {
    id: 'sc5',
    title: 'Tình huống 5: Quy Trình Sửa Điểm Đã Khóa (Audit Trail)',
    badge: 'Kiểm soát & Mở khóa',
    badgeClass: 'tag-amber',
    description: 'Bảng điểm đã chốt bị khóa. Cán bộ phát hiện bài thi phúc khảo tăng điểm, thực hiện quy trình mở khóa và lưu vết.',
    highlightTables: ['BangDiem', 'YeuCauMoKhoa', 'NhatKyDiem'],
    steps: [
      { step: 1, title: 'Bảng điểm đang khóa', status: 'DA_KHOA', action: 'Chặn sửa trực tiếp' },
      { step: 2, title: 'Lập yêu cầu mở khóa', status: 'CHO_DUYET', code: 'YC_2026_001', reason: 'Phúc khảo bài thi' },
      { step: 3, title: 'Ban Giám đốc phê duyệt', status: 'DA_DUYET', approver: 'TK_GIAM_DOC', deadline: '+24h' },
      { step: 4, title: 'Mở khóa tạm thời & Sửa điểm', status: 'MO_KHOA_TAM', oldVal: '3.0', newVal: '5.5' },
      { step: 5, title: 'Ghi nhật ký biến động & Tái khóa', logId: 'LOG_001', action: 'SUA_DIEM', status: 'DA_KHOA' }
    ],
    explanation: 'Toàn bộ quy trình sửa đổi tuân thủ nghiêm ngặt chuẩn kiểm toán: Không một dòng code hay nút bấm nào được phép sửa điểm ngầm mà không thông qua Yêu cầu mở khóa và lưu vào sổ cái NhatKyDiem.'
  },

  {
    id: 'sc6',
    title: 'Tình huống 6: Chỉ Huy Xem Điểm Theo Đơn Vị Được Phân Công',
    badge: 'Phân quyền phạm vi',
    badgeClass: 'tag-blue',
    description: 'Mô phỏng truy vết bảo mật: Chỉ huy Đại đội 1 chỉ xem được điểm của quân nhân thuộc Đại đội 1, bị từ chối xem Đại đội 2.',
    highlightTables: ['DonVi', 'PhanCongQuanLy', 'LopHoc', 'HocVien', 'BangDiem'],
    commanders: [
      {
        id: 'ch_c1',
        name: 'Đại úy Trần Văn Bình',
        unit: 'Đại đội 1 (d1_c1)',
        allowedClasses: ['CNTT1-K58', 'CNTT2-K58'],
        blockedClasses: ['ATTT1-K58']
      },
      {
        id: 'ch_c2',
        name: 'Đại úy Nguyễn Hữu Hùng',
        unit: 'Đại đội 2 (d1_c2)',
        allowedClasses: ['ATTT1-K58'],
        blockedClasses: ['CNTT1-K58', 'CNTT2-K58']
      }
    ],
    explanation: 'Chứng minh lý do tồn tại của bảng PhanCongQuanLy: Ràng buộc truy cập không dựa trên cảm tính mà đi theo chuỗi logic quan hệ: TaiKhoan -> PhanCongQuanLy -> DonVi -> LopHoc -> HocVien -> BangDiem.'
  }
];
