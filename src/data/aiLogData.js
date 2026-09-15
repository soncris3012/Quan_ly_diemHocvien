// src/data/aiLogData.js
// Nhật ký sử dụng AI trong phân tích và hoàn thiện thiết kế cơ sở dữ liệu (Mô hình 23 bảng)

export const AI_LOGS = [
  {
    id: 'prompt_1',
    sessionTitle: 'Phiên 1: Phân Tích Nghiệp Vụ Ban Đầu & Phát Hiện Bất Cập Đề Bài',
    date: '2026-03-02',
    objective: 'Rà soát bài toán quản lý điểm học viên quân sự, xác định tác nhân, các luồng nghiệp vụ và phát hiện các điểm mâu thuẫn trong đề bài.',
    inputProvided: 'Mô tả bài toán ban đầu từ đề cương môn học CSDL.',
    verbatimPrompt: `Bạn đóng vai trò chuyên gia phân tích nghiệp vụ cơ sở dữ liệu. Hãy phân tích đề tài "Quản lý điểm học viên quân sự".
Cho tôi biết:
1. Có những tác nhân nào và phạm vi dữ liệu của từng người?
2. Có bất cập hoặc mâu thuẫn logic nào trong các quy định tính điểm, thi lại và sửa điểm trong đề bài không?
3. Cần làm rõ những giả định nào trước khi vẽ mô hình ER?`,
    aiOutputSummary: 'AI liệt kê các nhóm tác nhân (Học viên, Giảng viên, Chỉ huy, Phòng Đào tạo, Ban Giám đốc). AI chỉ ra tổng hệ số 0.1 + 0.4 + 0.6 = 1.1 là vô lý trong thang điểm 10; việc chỉ huy xem điểm cần xác định phạm vi đơn vị; việc sửa điểm cần có cơ chế phê duyệt.',
    studentCritique: 'Phân tích của AI rất sắc bén ở chỗ chỉ ra tổng hệ số 1.1 và thiếu sót về phạm vi quản lý của chỉ huy. Về vai trò Giảng viên, nhóm nhận thấy đây là chủ thể rất quan trọng cần đưa vào ở các bước tiếp theo khi mô hình hóa phân công giảng dạy.',
    acceptedProposals: [
      'Ghi nhận bất cập hệ số 1.1 và đặt nhãn "Cần xác nhận", dùng bộ hệ số chuẩn 0.1 - 0.3 - 0.6.',
      'Cần bổ sung thực thể xác định phạm vi quản lý của cán bộ chỉ huy theo đơn vị quân sự.',
      'Tách riêng quy trình xin mở khóa điểm khỏi hành động sửa điểm.'
    ],
    rejectedProposals: [
      {
        item: 'AI đề xuất thêm phân hệ quản lý ký túc xá và quân trang cho học viên',
        reason: 'Không thuộc bài toán quản lý điểm học vụ; loại bỏ ngay để tránh phân tán đề tài.'
      }
    ]
  },

  {
    id: 'prompt_2',
    sessionTitle: 'Phiên 2: Đề Xuất Mô Hình ER & Giải Quyết Vấn Đề "Thi Lại vs Học Lại"',
    date: '2026-03-05',
    objective: 'Thiết kế các thực thể cho bài toán kết quả học tập, giải quyết triệt để sự khác nhau giữa thi lại và học lại ở khóa sau.',
    inputProvided: 'Sơ đồ ER tự phác thảo ban đầu (chỉ có SinhVien, MonHoc, BangDiem, DiemThi).',
    verbatimPrompt: `Tôi gửi bạn sơ đồ ER ban đầu gồm: SinhVien, MonHoc, BangDiem.
Vấn đề gặp phải: Nếu một học viên thi lại thì lưu ở đâu? Nếu học viên trượt hẳn và năm sau phải học lại cùng khóa sau thì bảng BangDiem hiện tại sẽ bị ghi đè hoặc trùng khóa chính!
Hãy đề xuất giải pháp chuẩn hóa mô hình dữ liệu để:
- Lưu được cả lần thi đầu và lần thi lại.
- Giữ được điểm thi thực tế (ví dụ 8.0) dù có trần công nhận (6.9).
- Quản lý được việc học viên học lại ở khóa sau mà không xóa lịch sử đợt học trước.`,
    aiOutputSummary: 'AI đề xuất tách thành các thực thể phân cấp: Đợt học theo phân công, Kết quả học tập từng đợt, Bảng điểm chi tiết và Đợt thi kết thúc môn. Đồng thời gợi ý không bao giờ hardcode điểm trần 6.9 vào CSDL.',
    studentCritique: 'Đây là bước đột phá về mặt kiến trúc dữ liệu! Ý niệm tách "Đợt thi (DOT_THI)" và "Điểm thành phần (DIEM)" giải quyết triệt để việc bảo toàn điểm bài thi thực tế 8.0 phục vụ phúc khảo.',
    acceptedProposals: [
      'Tách DOT_THI thành thực thể độc lập quản lý đợt thi lần 1, đợt thi lại.',
      'Lưu điểm gốc trong bảng DIEM và chỉ áp trần khi tính DiemTongKet trong KET_QUA_HOC_TAP.',
      'Tách các loại điểm (LOAI_DIEM) để linh hoạt cấu hình trọng số thay vì tạo cột tĩnh.'
    ],
    rejectedProposals: [
      {
        item: 'AI đề xuất tự động đổi điểm 8.0 thành 6.9 ngay khi lưu vào bảng điểm',
        reason: 'Sai nguyên tắc lưu trữ dữ liệu gốc! Bảng điểm phải lưu đúng điểm chấm thực tế 8.0 để bảo đảm tính minh bạch khi phúc khảo; trần 6.9 chỉ là quy tắc xử lý nghiệp vụ khi tính điểm tổng kết.'
      }
    ]
  },

  {
    id: 'prompt_3',
    sessionTitle: 'Phiên 3: Tích Hợp Đầy Đủ Giảng Viên, Bộ Môn & Chuẩn Hóa 23 Bảng (R1 – R23)',
    date: '2026-03-08',
    objective: 'Bổ sung đầy đủ yếu tố Giảng viên và Phân công giảng dạy, hoàn thiện mô hình 23 bảng quan hệ chuẩn mực (R1 - R23) đáp ứng trọn vẹn yêu cầu thực tế.',
    inputProvided: 'Danh sách 23 bảng quan hệ theo thiết kế mới: R1 DON_VI đến R23 DOT_THI.',
    verbatimPrompt: `Hãy hoàn thiện mô hình quan hệ 23 bảng (R1 đến R23) tích hợp đầy đủ yếu tố Giảng viên:
R1 DON_VI, R2 KHOA_DAO_TAO, R3 LOP_HOC, R4 NGUOI, R5 USER, R6 ROLE, R7 USER_ROLE, R8 PERMISSION, R9 ROLE_PERMISSION,
R10 NGANH, R11 CHUYEN_NGANH, R12 CAP_BAC, R13 CHUC_VU, R14 HOC_VIEN, R15 BO_MON, R16 GIANG_VIEN,
R17 MON_HOC, R18 HOC_KY, R19 PHAN_CONG, R20 LOAI_DIEM, R21 KET_QUA_HOC_TAP, R22 DIEM, R23 DOT_THI.
Hãy giải thích:
1. Mối quan hệ giữa NGUOI với HOC_VIEN và GIANG_VIEN (Kế thừa IS-A).
2. Vai trò trung tâm của PHAN_CONG (R19) trong việc kết nối Giảng viên với Lớp học và Môn học.
3. Cơ chế phân quyền: Giảng viên chỉ nhập điểm lớp mình dạy, lưu MaNguoiNhap trong DIEM.`,
    aiOutputSummary: 'AI phân tích chi tiết cấu trúc 23 bảng: NGUOI là thực thể cha, GIANG_VIEN và HOC_VIEN là thực thể con (mô hình IS-A chuẩn). Bảng PHAN_CONG là mắt xích trung tâm giải quyết quan hệ N-N-N-N giữa Giảng viên, Môn học, Lớp và Học kỳ. Thuộc tính MaNguoiNhap trong DIEM giải quyết hoàn hảo bài toán trách nhiệm giải trình.',
    studentCritique: 'Mô hình 23 bảng này hoàn toàn chặt chẽ và chuẩn hóa cao nhất (đạt BCNF). Yếu tố Giảng viên được tích hợp rất tự nhiên và hợp lý: Giảng viên thuộc Bộ môn, được phân công giảng dạy, trực tiếp nhập điểm CC, TX cho lớp mình dạy; Phòng Đào tạo tổ chức đợt thi và chốt điểm.',
    acceptedProposals: [
      'Chốt trọn bộ 23 bảng quan hệ (R1 đến R23) với các khóa chính PK và khóa ngoại FK đầy đủ.',
      'Sử dụng mô hình kế thừa IS-A: NGUOI ➔ HOC_VIEN & GIANG_VIEN.',
      'Áp dụng Row-Level Security: Giảng viên chỉ nhập điểm cho phân công giảng dạy mang MaGV của mình.',
      'Lưu MaNguoiNhap trong bảng DIEM để lưu vết danh tính người nhập điểm.'
    ],
    rejectedProposals: [
      {
        item: 'Thêm các bảng Quản lý phòng học vật lý, Điểm danh từng tiết 45 phút, Lịch xếp thời khóa biểu',
        reason: 'Nằm ngoài phạm vi của đề tài quản lý điểm và khảo thí; thêm vào sẽ làm phân tán trọng tâm sang bài toán quản lý cơ sở vật chất.'
      },
      {
        item: 'Thêm bảng Kỷ luật / Thi đua khen thưởng quân sự',
        reason: 'Là nghiệp vụ của phân hệ Công tác Đảng, công tác chính trị; không thuộc phân hệ điểm số đào tạo.'
      }
    ]
  }
];
