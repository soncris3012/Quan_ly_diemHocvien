// src/data/aiLogData.js
// Nhật ký sử dụng AI trong phân tích và hoàn thiện thiết kế cơ sở dữ liệu

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
    aiOutputSummary: 'AI liệt kê 4 nhóm tác nhân (Học viên, Chỉ huy, Phòng Đào tạo, Ban Giám đốc). AI chỉ ra tổng hệ số 0.1 + 0.4 + 0.6 = 1.1 là vô lý trong thang điểm 10; việc chỉ huy xem điểm cần xác định phạm vi đơn vị; việc sửa điểm cần có cơ chế phê duyệt.',
    studentCritique: 'Phân tích của AI rất sắc bén ở chỗ chỉ ra tổng hệ số 1.1 và thiếu sót về phạm vi quản lý của chỉ huy. Tuy nhiên AI đề xuất thêm vai trò Giảng viên nhập điểm — điều này không khớp với đề bài (trong môi trường trường quân sự này, Phòng Đào tạo nhập điểm tập trung).',
    acceptedProposals: [
      'Ghi nhận bất cập hệ số 1.1 và đặt nhãn "Cần xác nhận", dùng bộ hệ số giả định 0.1 - 0.3 - 0.6.',
      'Cần bổ sung thực thể xác định phạm vi quản lý của cán bộ chỉ huy theo đơn vị.',
      'Tách riêng quy trình xin mở khóa điểm khỏi hành động sửa điểm.'
    ],
    rejectedProposals: [
      {
        item: 'Thêm tác nhân Giảng viên nhập điểm',
        reason: 'Đề bài nêu rõ Phòng Đào tạo chịu trách nhiệm quản lý kế hoạch và ghi nhận kết quả tập trung; không tự ý mở rộng vai trò làm loãng phạm vi.'
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
    aiOutputSummary: 'AI đề xuất tách thành 3 thực thể phân cấp: LopHocPhan (đợt mở lớp), LuotHoc (đại diện cho sự tham gia của 1 học viên vào 1 lớp học phần), BangDiem (bảng điểm của lượt học đó), và LanThi (danh sách các lần thi 1, 2 của bảng điểm). Đồng thời gợi ý thêm trường MaLuotHocTruoc đệ quy.',
    studentCritique: 'Đây là bước đột phá về mặt kiến trúc dữ liệu! Ý niệm "Lượt học (LuotHoc)" tách rời khỏi "Lớp học phần" và "Học viên" giải quyết triệt để quan hệ N-N biến thiên theo thời gian. Ý niệm tách "Lần thi (LanThi)" giúp không phải dồn DiemThi1, DiemThi2 vào cùng 1 bảng.',
    acceptedProposals: [
      'Tạo thực thể LuotHoc làm trung gian với khóa ngoại đệ quy MaLuotHocTruoc để truy vết học lại.',
      'Tách LanThi thành thực thể độc lập với trường DiemThiThucTe và SoLanThi.',
      'Tách KeHoachDaoTao (kế hoạch khung) khỏi LopHocPhan (triển khai thực tế).'
    ],
    rejectedProposals: [
      {
        item: 'AI đề xuất tự động đổi điểm 8.0 thành 6.9 khi lưu vào bảng điểm',
        reason: 'Sai nguyên tắc lưu trữ dữ liệu gốc! Bảng LanThi phải lưu đúng điểm chấm thực tế 8.0 để bảo đảm tính minh bạch khi phúc khảo; trần 6.9 chỉ là quy tắc xử lý nghiệp vụ khi tính điểm tổng kết.'
      }
    ]
  },

  {
    id: 'prompt_3',
    sessionTitle: 'Phiên 3: Chuẩn Hóa 19 Bảng Quan Hệ & Ràng Buộc Bảo Mật Nhật Ký Điểm',
    date: '2026-03-08',
    objective: 'Chuyển đổi toàn diện từ mô hình ER sang mô hình quan hệ, bổ sung khóa chính PK, khóa ngoại FK, thuộc tính UQ, và thiết kế bảng Audit Trail.',
    inputProvided: 'Danh sách 15 thực thể đã tinh chỉnh từ phiên 2.',
    verbatimPrompt: `Hãy chuyển đổi các thực thể đã thống nhất sang mô hình quan hệ dạng bảng chuẩn mực:
1. Xác định rõ PK, FK, thuộc tính Unique, Nullable cho từng bảng.
2. Thiết kế chi tiết cơ chế bảo mật cho việc sửa điểm: bảng YeuCauMoKhoa và NhatKyDiem.
3. Giải thích tại sao bảng nhật ký điểm không cho phép cập nhật (UPDATE) hay xóa (DELETE).
4. Phân tích xem có nên đưa thêm phòng học, lịch giảng, điểm danh chi tiết từng buổi vào không?`,
    aiOutputSummary: 'AI cung cấp đầy đủ định nghĩa 19 bảng với cú pháp kiểu dữ liệu chuẩn, thiết lập quan hệ 1-1, 1-N, N-N và đệ quy. AI cũng đề xuất thêm 5 bảng về giảng viên, giảng đường, điểm danh 45 tiết học.',
    studentCritique: 'Cấu trúc 19 bảng và thiết kế 2 bảng YeuCauMoKhoa + NhatKyDiem rất hoàn thiện, đạt chuẩn kiểm toán quân sự. Về đề xuất thêm giảng đường, điểm danh từng tiết: Tôi quyết định TỪ CHỐI để giữ đúng trọng tâm bài toán "Quản lý điểm học viên". Nếu đưa thêm quá nhiều bảng ngoại vi, phạm vi sẽ phình to và khó giải thích sâu.',
    acceptedProposals: [
      'Áp dụng trọn vẹn bộ 19 bảng quan hệ chia 4 nhóm màu sắc.',
      'Thiết kế bảng YeuCauMoKhoa có trường HanDuocSua (hạn sửa có hiệu lực trong 24h).',
      'Thiết kế bảng NhatKyDiem ghi nhận đầy đủ GiaTriCu -> GiaTriMoi, MaYeuCau và NguoiThucHien.',
      'Bổ sung bảng QuyTacDanhGia để phiên bản hóa công thức tính điểm.'
    ],
    rejectedProposals: [
      {
        item: 'Thêm các bảng PhongHoc, LichGiangDay, DiemDanhTungBuoi',
        reason: 'Nằm ngoài phạm vi của đề tài quản lý điểm số; thêm vào sẽ làm rối rắm mô hình quan hệ mà không giải quyết thêm giá trị gì cho nghiệp vụ tính điểm và thi lại.'
      },
      {
        item: 'Thêm bảng Kỷ luật / Thi đua khen thưởng',
        reason: 'Là bài toán của phân hệ Công tác Đảng, công tác chính trị; không thuộc phân hệ đào tạo điểm số.'
      }
    ]
  }
];
