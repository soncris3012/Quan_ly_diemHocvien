// src/data/businessWorkflows.js
// Đặc tả 3 luồng quy trình nghiệp vụ tương tác dạng làn trách nhiệm (Swimlanes)

export const WORKFLOWS = [
  {
    id: 'flow_a',
    title: 'Luồng A: Quá Trình Học & Ghi Nhận Điểm Chuẩn',
    subtitle: 'Chu trình đào tạo từ lập kế hoạch đến chốt sổ điểm chính thức',
    summary: 'Mô hình hóa việc Phòng Đào tạo phân bổ học phần theo kế hoạch, mở lớp, ghi nhận điểm thành phần, tổ chức thi lần 1, đánh giá và khóa sổ điểm.',
    swimlanes: ['Phòng Đào tạo', 'Hệ thống CADET DB', 'Học viên', 'Ban Giám đốc'],
    steps: [
      {
        id: 'step_a1',
        lane: 'Phòng Đào tạo',
        title: '1. Lập Kế Hoạch Đào Tạo',
        desc: 'Ban hành kế hoạch khung bố trí môn học cho các lớp niên chế trong học kỳ.',
        input: 'Danh mục Học phần (HocPhan), Lớp niên chế (LopHoc), Niên lịch Học kỳ (HocKy)',
        processing: 'Kiểm tra khối lượng kiến thức, tạo bản ghi kế hoạch khung.',
        output: 'Bản ghi KeHoachDaoTao mới ở trạng thái DU_KIEN.',
        relatedTables: ['HocPhan', 'HocKy', 'LopHoc', 'KeHoachDaoTao'],
        highlightColor: 'var(--color-purple)'
      },
      {
        id: 'step_a2',
        lane: 'Phòng Đào tạo',
        title: '2. Mở Lớp Học Phần Thực Tế',
        desc: 'Khởi tạo đợt học cụ thể từ kế hoạch khung và gán phiên bản quy tắc đánh giá điểm.',
        input: 'Kế hoạch đã duyệt (KeHoachDaoTao), Bộ quy tắc đánh giá (QuyTacDanhGia)',
        processing: 'Tạo mã LopHocPhan, xác định thời gian bắt đầu/kết thúc và quy tắc tính điểm áp dụng.',
        output: 'Bản ghi LopHocPhan mới ở trạng thái DANG_HOC.',
        relatedTables: ['KeHoachDaoTao', 'QuyTacDanhGia', 'LopHocPhan'],
        highlightColor: 'var(--color-purple)'
      },
      {
        id: 'step_a3',
        lane: 'Hệ thống CADET DB',
        title: '3. Phân Công & Khởi Tạo Lượt Học',
        desc: 'Hệ thống tự động liên kết danh sách quân nhân của lớp vào lớp học phần và mở bảng điểm rỗng.',
        input: 'Lớp học phần (LopHocPhan), Danh sách học viên thuộc lớp (HocVien)',
        processing: 'Sinh tự động các bản ghi LuotHoc (LoaiLuotHoc = HOC_LAN_DAU) và khởi tạo BangDiem rỗng tương ứng (TrangThaiKhoa = DANG_MO).',
        output: 'Các bản ghi LuotHoc và BangDiem ban đầu.',
        relatedTables: ['HocVien', 'LopHocPhan', 'LuotHoc', 'BangDiem'],
        highlightColor: 'var(--color-emerald)'
      },
      {
        id: 'step_a4',
        lane: 'Phòng Đào tạo',
        title: '4. Nhập Điểm Thành Phần & Điểm Thi',
        desc: 'Cán bộ đào tạo nhập điểm Chuyên cần, Thường xuyên và điểm bài thi kết thúc học phần Lần 1.',
        input: 'Bảng điểm của học viên, Điểm CC (10%), TX (30%), Điểm thi kết thúc (60%)',
        processing: 'Cập nhật BangDiem.DiemCC, BangDiem.DiemTX; Tạo bản ghi LanThi mới với SoLanThi = 1, DiemThiThucTe.',
        output: 'Dữ liệu điểm thành phần và kết quả thi Lần 1 được lưu vết.',
        relatedTables: ['BangDiem', 'LanThi'],
        highlightColor: 'var(--color-emerald)'
      },
      {
        id: 'step_a5',
        lane: 'Hệ thống CADET DB',
        title: '5. Đánh Giá Điểm & Xét Đạt',
        desc: 'Áp dụng công thức quy tắc tính điểm: Kiểm tra ngưỡng liệt cuối kỳ (< 4.0) và tính tổng kết.',
        input: 'Điểm CC, TX, Lần thi 1, Công thức QuyTacDanhGia',
        processing: 'Nếu DiemThi < 4.0 -> Tổng kết = DiemThi (Trượt). Nếu không -> Tổng kết = CC*0.1 + TX*0.3 + Thi*0.6, làm tròn 1 chữ số thập phân.',
        output: 'DiemTongKetChot và KetQuaChot (DAT / KHONG_DAT).',
        relatedTables: ['QuyTacDanhGia', 'BangDiem', 'LanThi'],
        highlightColor: 'var(--color-blue)'
      },
      {
        id: 'step_a6',
        lane: 'Phòng Đào tạo',
        title: '6. Chốt Sổ Điểm & Khóa Dữ Liệu',
        desc: 'Cán bộ đào tạo xác nhận đóng sổ điểm. Hệ thống chuyển sang trạng thái khóa bảo mật.',
        input: 'Bảng điểm đã hoàn tất tính toán',
        processing: 'Set TrangThaiKhoa = DA_KHOA, ghi nhận NguoiChot và ThoiDiemChot; Ghi một dòng vào NhatKyDiem (LoaiThaoTac = CHOT_DIEM).',
        output: 'Bảng điểm khóa hoàn toàn, cấm thao tác sửa thông thường.',
        relatedTables: ['BangDiem', 'NhatKyDiem'],
        highlightColor: 'var(--color-amber)'
      }
    ]
  },

  {
    id: 'flow_b',
    title: 'Luồng B: Phân Biệt Thi Lại & Học Lại',
    subtitle: 'Xử lý các tình huống học viên không đạt học phần',
    summary: 'Điểm nhấn quan trọng nhất trong thiết kế CSDL: Phân biệt rõ Thi lại (cùng lượt học, thêm LanThi) với Học lại (khởi tạo LuotHoc mới ở học kỳ sau và liên kết lượt cũ).',
    swimlanes: ['Học viên', 'Hệ thống CADET DB', 'Phòng Đào tạo'],
    steps: [
      {
        id: 'step_b1',
        lane: 'Hệ thống CADET DB',
        title: '1. Kiểm Tra Kết Quả Lần 1',
        desc: 'Học viên có kết quả Lần 1 không đạt (Điểm thi < 4.0 hoặc Tổng kết < 4.0).',
        input: 'BangDiem, LanThi (SoLanThi = 1)',
        processing: 'Kiểm tra điều kiện: Kết quả KHONG_DAT, chưa quá số lần thi cho phép (SoLanThiToiDa = 2).',
        output: 'Đủ điều kiện dự thi lại lần 2.',
        relatedTables: ['BangDiem', 'LanThi', 'QuyTacDanhGia'],
        highlightColor: 'var(--color-amber)'
      },
      {
        id: 'step_b2',
        lane: 'Phòng Đào tạo',
        title: '2. Tổ Chức Thi Lại (Lần 2)',
        desc: 'Tạo bản ghi lần thi thứ hai trong CÙNG bảng điểm hiện tại. Giữ nguyên điểm thực tế.',
        input: 'Mã bảng điểm hiện tại, Điểm thi thực tế bài thi lại (ví dụ 8.0)',
        processing: 'Thêm bản ghi LanThi (SoLanThi = 2, DiemThiThucTe = 8.0, TrangThaiDuThi = DA_THI).',
        output: 'Bản ghi LanThi số 2 được lưu trữ đầy đủ.',
        relatedTables: ['BangDiem', 'LanThi'],
        highlightColor: 'var(--color-emerald)'
      },
      {
        id: 'step_b3',
        lane: 'Hệ thống CADET DB',
        title: '3. Áp Dụng Trần Điểm Thi Lại (6.9)',
        desc: 'Quy chế quy định trần điểm thi lại là 6.9. Điểm thi gốc 8.0 vẫn được lưu, điểm công nhận là 6.9.',
        input: 'LanThi.DiemThiThucTe (8.0), QuyTacDanhGia.TranDiemThiLai (6.9)',
        processing: 'Xác định DiemThiCongNhan = MIN(DiemThiThucTe, 6.9). Tính lại điểm tổng kết sau thi lại theo quy định.',
        output: 'DiemTongKetChot mới, KetQuaChot = DAT sau khi thi lại.',
        relatedTables: ['QuyTacDanhGia', 'LanThi', 'BangDiem'],
        highlightColor: 'var(--color-blue)'
      },
      {
        id: 'step_b4',
        lane: 'Hệ thống CADET DB',
        title: '4. Trường Hợp Thi Lại Vẫn Không Đạt',
        desc: 'Nếu thi lại lần 2 vẫn dưới ngưỡng quy định (< 4.0) -> Học viên kết thúc lượt học với trạng thái KHONG_DAT.',
        input: 'LanThi (SoLanThi = 2, Diem < 4.0)',
        processing: 'Cập nhật LuotHoc.TrangThai = HOAN_THANH, KetQuaChot = KHONG_DAT. Đánh dấu học viên bắt buộc phải học lại.',
        output: 'Lượt học 1 khép lại hoàn toàn.',
        relatedTables: ['LuotHoc', 'BangDiem', 'LanThi'],
        highlightColor: 'var(--color-rose)'
      },
      {
        id: 'step_b5',
        lane: 'Phòng Đào tạo',
        title: '5. Phân Bổ Học Lại Khóa Sau (Lượt Học Mới)',
        desc: 'Ở học kỳ tiếp theo, Phòng Đào tạo mở lớp học phần mới và xếp học viên vào học lại.',
        input: 'Học viên (MaHV), Lớp học phần kỳ sau (MaLHP_moi), Lượt học cũ (MaLuotHoc_cu)',
        processing: 'TẠO BẢN GHI LUOTHOC MỚI: LoaiLuotHoc = HOC_LAI, MaLuotHocTruoc = MaLuotHoc_cu. Mở BangDiem mới tinh cho lượt học này!',
        output: 'Một chu trình học tập mới độc lập nhưng vẫn liên kết vết với lượt học cũ.',
        relatedTables: ['LuotHoc', 'LopHocPhan', 'BangDiem'],
        highlightColor: 'var(--color-purple)'
      }
    ]
  },

  {
    id: 'flow_c',
    title: 'Luồng C: Kiểm Soát & Sửa Điểm Đã Khóa',
    subtitle: 'Quy trình kiểm toán bảo mật nghiêm ngặt theo kỷ luật quân sự',
    summary: 'Mô phỏng quy trình sửa điểm sau khi đã chốt: Không được tự ý sửa! Bắt buộc phải có Yêu cầu mở khóa, Ban Giám đốc phê chuẩn có thời hạn, ghi Nhật ký thay đổi chi tiết trước - sau và tái khóa.',
    swimlanes: ['Phòng Đào tạo', 'Ban Giám đốc', 'Hệ thống CADET DB'],
    steps: [
      {
        id: 'step_c1',
        lane: 'Phòng Đào tạo',
        title: '1. Phát Hiện Sai Sót / Phúc Khảo',
        desc: 'Phát hiện sai lệch điểm sau khi chấm phúc khảo bài thi hoặc nhập nhầm điểm quá trình.',
        input: 'Bảng điểm đang có TrangThaiKhoa = DA_KHOA, Biên bản phúc khảo của Hội đồng',
        processing: 'Hệ thống chặn mọi thao tác sửa trực tiếp. Yêu cầu cán bộ lập phiếu đề nghị mở khóa.',
        output: 'Chặn quyền chỉnh sửa tại giao diện.',
        relatedTables: ['BangDiem'],
        highlightColor: 'var(--color-rose)'
      },
      {
        id: 'step_c2',
        lane: 'Phòng Đào tạo',
        title: '2. Lập Phiếu Đề Nghị Mở Khóa',
        desc: 'Cán bộ đào tạo tạo bản ghi YeuCauMoKhoa kèm lý do giải trình chi tiết và số văn bản.',
        input: 'MaBangDiem, LyDo ("Phúc khảo bài thi"), MaVanBan ("TTr-DT-2026/04")',
        processing: 'Tạo bản ghi YeuCauMoKhoa mới ở trạng thái CHO_DUYET; ghi nhận NguoiYeuCau và ThoiDiemYeuCau.',
        output: 'Bản ghi YeuCauMoKhoa được gửi lên Ban Giám đốc.',
        relatedTables: ['YeuCauMoKhoa', 'TaiKhoan'],
        highlightColor: 'var(--color-amber)'
      },
      {
        id: 'step_c3',
        lane: 'Ban Giám đốc',
        title: '3. Ban Giám Đốc Xem Xét Phê Duyệt',
        desc: 'Lãnh đạo nhà trường kiểm tra căn cứ văn bản và ra quyết định phê duyệt có thời hạn.',
        input: 'YeuCauMoKhoa đang chờ duyệt, Văn bản tờ trình đính kèm',
        processing: 'Cập nhật TrangThai = DA_DUYET, NguoiDuyet = TK_GIAM_DOC, ThoiDiemDuyet, HanDuocSua = ThoiDiemDuyet + 24 Giờ. BangDiem.TrangThaiKhoa chuyển thành MO_KHOA_TAM.',
        output: 'Quyền sửa được kích hoạt trong khung giờ cho phép.',
        relatedTables: ['YeuCauMoKhoa', 'BangDiem'],
        highlightColor: 'var(--color-emerald)'
      },
      {
        id: 'step_c4',
        lane: 'Phòng Đào tạo',
        title: '4. Thực Hiện Sửa Điểm & Ghi Nhật Ký',
        desc: 'Cán bộ điều chỉnh điểm số. Hệ thống TỰ ĐỘNG chụp lại giá trị cũ và ghi giá trị mới vào sổ cái nhật ký.',
        input: 'Điểm số mới cần cập nhật, Yêu cầu mở khóa đã duyệt',
        processing: 'Cập nhật điểm trong BangDiem hoặc LanThi; INSERT ngay 1 dòng vào NhatKyDiem (LoaiThaoTac = SUA_DIEM, GiaTriCu, GiaTriMoi, LyDo, MaYeuCau).',
        output: 'Dữ liệu được cập nhật kèm theo vết kiểm toán đầy đủ không thể tẩy xóa.',
        relatedTables: ['BangDiem', 'LanThi', 'NhatKyDiem', 'YeuCauMoKhoa'],
        highlightColor: 'var(--color-blue)'
      },
      {
        id: 'step_c5',
        lane: 'Hệ thống CADET DB',
        title: '5. Tính Lại Tổng Kết & Tái Khóa',
        desc: 'Hệ thống tự động tính lại điểm tổng kết và tự động khóa lại khi hết hạn hoặc cán bộ chủ động khóa.',
        input: 'Điểm mới cập nhật, QuyTacDanhGia',
        processing: 'Tính lại DiemTongKetChot; Chuyển BangDiem.TrangThaiKhoa trở lại DA_KHOA; Ghi NhatKyDiem (LoaiThaoTac = TAI_KHOA).',
        output: 'Sổ điểm được đóng an toàn, bảo đảm tính toàn vẹn của dữ liệu học vụ.',
        relatedTables: ['BangDiem', 'QuyTacDanhGia', 'NhatKyDiem'],
        highlightColor: 'var(--color-amber)'
      }
    ]
  }
];
