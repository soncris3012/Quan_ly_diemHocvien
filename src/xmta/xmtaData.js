export const XMTA_SECTIONS = [
  ['overview','01','Tổng Quan XMTA'],['actors','02','Tác Nhân & Quyền'],['workflow','03','Quy Trình Kiểm Tra'],
  ['entities','04','Danh Mục Thực Thể'],['er','05','Phòng Trưng Bày ER'],['relational','06','Mô Hình Quan Hệ'],
  ['dictionary','07','Từ Điển Dữ Liệu'],['scenarios','08','Kiểm Chứng Tình Huống'],['ai','09','Nhật Ký Sử Dụng AI'],['conclusion','10','Kết Luận & Mở Rộng']
];

// Mô hình chính thức theo ba hồ sơ phân tích và thiết kế XMTA.
export const FITNESS_ENTITIES = [
  { code:'R1', name:'DON_VI', title:'Cây phân cấp đơn vị', kind:'DANH MỤC', fields:['MaDonVi [PK]','TenDonVi','RankDonVi','MaDonViCapTren [FK]'] },
  { code:'R2', name:'CAP_BAC', title:'Danh mục quân hàm', kind:'DANH MỤC', fields:['RankCapBac [PK]','TenCapBac [AK]','VietTat'] },
  { code:'R3', name:'QUAN_NHAN', title:'Hồ sơ học viên và cán bộ', kind:'NGHIỆP VỤ', fields:['MaQuanNhan [PK]','HoTen','NgaySinh','GioiTinh','LoaiDoiTuong','RankCapBac [FK]','MaDonVi [FK]'] },
  { code:'R4', name:'MON_KIEM_TRA', title:'Danh mục môn thể lực', kind:'DANH MỤC', fields:['MaMon [PK]','TenMon [AK]','DonViDo','QuyTacSoSanh'] },
  { code:'R5', name:'TIEU_CHUAN_MON', title:'Ngưỡng theo giới tính, nhóm tuổi và hiệu lực', kind:'THAM CHIẾU', fields:['MaMon [PK, FK]','GioiTinhApDung [PK]','TuoiMin [PK]','TuoiMax','MucXepLoai [PK]','GiaTriNguong','HieuLucTu [PK]','HieuLucDen','GhiChu'] },
  { code:'R6', name:'DOT_KIEM_TRA', title:'Đợt kiểm tra và quy tắc tổng hợp', kind:'NGHIỆP VỤ', fields:['MaDot [PK]','TenDot','LoaiDot','NgayBatDau','NgayKetThuc','TyLeMonDatToiThieu','SoMonKhongDatToiDa','GhiChu'] },
  { code:'R7', name:'NOI_DUNG_DOT', title:'Danh sách môn áp dụng linh hoạt theo đợt', kind:'THAM CHIẾU', fields:['MaDot [PK, FK]','MaMon [PK, FK]','BatBuoc','ThuTu','GhiChu'] },
  { code:'R8', name:'KET_QUA_CHI_TIET', title:'Thành tích, trạng thái tham gia và người chấm', kind:'GIAO DỊCH', fields:['MaDot [PK, FK]','MaQuanNhan [PK, FK]','MaMon [PK, FK]','LanThi [PK]','ThanhTichTho','TrangThaiThucHien','XepLoaiMon','MaNguoiCham [FK]','ThoiDiemGhiNhan','GhiChu'] },
  { code:'R9', name:'KET_QUA_TONG_HOP', title:'Kết luận toàn đợt và chỉ đạo', kind:'GIAO DỊCH', fields:['MaDot [PK, FK]','MaQuanNhan [PK, FK]','SoMonDat','SoMonKhongDat','XepLoaiChungCuoc','TrangThaiThiVet','DeXuatAI','GhiChuChiHuy'] }
];

// Kiểu SQL đề xuất và lý do lựa chọn, dùng chung cho mọi cách trình bày lược đồ.
export const FITNESS_FIELD_META = {
  DON_VI: { MaDonVi:['VARCHAR(20)','Mã nghiệp vụ ngắn, có thể chứa chữ, số và tiền tố đơn vị.'], TenDonVi:['NVARCHAR(100)','Tên đơn vị cần lưu tiếng Việt có dấu.'], RankDonVi:['TINYINT','Cấp đơn vị là số nguyên nhỏ trong một miền giá trị hẹp.'], MaDonViCapTren:['VARCHAR(20)','Phải cùng kiểu với DON_VI.MaDonVi để tạo khóa ngoại đệ quy.'] },
  CAP_BAC: { RankCapBac:['TINYINT','Thứ bậc quân hàm là số nguyên nhỏ, thuận tiện cho sắp xếp.'], TenCapBac:['NVARCHAR(50)','Tên quân hàm cần hỗ trợ tiếng Việt có dấu.'], VietTat:['NVARCHAR(10)','Chuỗi viết tắt ngắn và có thể chứa ký tự tiếng Việt.'] },
  QUAN_NHAN: { MaQuanNhan:['VARCHAR(20)','Mã quân nhân là mã nghiệp vụ, không dùng để tính toán.'], HoTen:['NVARCHAR(100)','Họ tên cần lưu đầy đủ ký tự tiếng Việt.'], NgaySinh:['DATE','Chỉ cần ngày sinh, không cần phần giờ.'], GioiTinh:['VARCHAR(10)','Miền giá trị ngắn, được kiểm soát bằng CHECK.'], LoaiDoiTuong:['VARCHAR(20)','Lưu mã phân loại ổn định như HOC_VIEN hoặc CAN_BO.'], RankCapBac:['TINYINT','Đồng nhất với khóa chính CAP_BAC.RankCapBac.'], MaDonVi:['VARCHAR(20)','Đồng nhất với khóa chính DON_VI.MaDonVi.'] },
  MON_KIEM_TRA: { MaMon:['VARCHAR(20)','Mã môn ngắn, dễ đọc và ổn định khi trao đổi dữ liệu.'], TenMon:['NVARCHAR(100)','Tên môn cần hỗ trợ tiếng Việt có dấu.'], DonViDo:['NVARCHAR(20)','Đơn vị đo là chuỗi ngắn như giây, lần hoặc kg.'], QuyTacSoSanh:['VARCHAR(20)','Lưu mã quy tắc cố định để xử lý nhất quán.'] },
  TIEU_CHUAN_MON: { MaMon:['VARCHAR(20)','Đồng nhất với khóa chính MON_KIEM_TRA.MaMon.'], GioiTinhApDung:['VARCHAR(10)','Phân biệt tiêu chuẩn NAM, NU hoặc CHUNG.'], TuoiMin:['TINYINT','Mốc tuổi nhỏ, tham gia xác định đúng nhóm tiêu chuẩn.'], TuoiMax:['TINYINT','Giới hạn trên của nhóm tuổi áp dụng.'], MucXepLoai:['VARCHAR(20)','Lưu mã xếp loại ổn định dùng trong khóa ghép.'], GiaTriNguong:['DECIMAL(10,2)','Giữ chính xác ngưỡng có phần thập phân, tránh sai số số thực.'], HieuLucTu:['DATE','Giữ đúng phiên bản tiêu chuẩn tại thời điểm kiểm tra.'], HieuLucDen:['DATE','Cho phép kết thúc hiệu lực mà không sửa dữ liệu lịch sử.'], GhiChu:['NVARCHAR(255)','Ghi chú tự do cần hỗ trợ tiếng Việt.'] },
  DOT_KIEM_TRA: { MaDot:['VARCHAR(20)','Mã đợt là mã nghiệp vụ ngắn, có thể chứa chữ và số.'], TenDot:['NVARCHAR(100)','Tên đợt cần hỗ trợ tiếng Việt có dấu.'], LoaiDot:['VARCHAR(20)','Phân biệt DINH_KY, DOT_XUAT và PHUC_TRA.'], NgayBatDau:['DATE','Nghiệp vụ chỉ cần ngày bắt đầu.'], NgayKetThuc:['DATE','Nghiệp vụ chỉ cần ngày kết thúc.'], TyLeMonDatToiThieu:['DECIMAL(5,2)','Cấu hình tỷ lệ đạt thay vì viết cứng quy tắc 4/5.'], SoMonKhongDatToiDa:['TINYINT','Giới hạn số môn không đạt theo từng đợt.'], GhiChu:['NVARCHAR(255)','Ghi chú ngắn cần hỗ trợ tiếng Việt.'] },
  NOI_DUNG_DOT: { MaDot:['VARCHAR(20)','Đồng nhất với DOT_KIEM_TRA.MaDot.'], MaMon:['VARCHAR(20)','Đồng nhất với MON_KIEM_TRA.MaMon.'], BatBuoc:['BIT','Biểu diễn rõ môn bắt buộc hoặc lựa chọn.'], ThuTu:['TINYINT','Số thứ tự nhỏ để sắp lịch thực hiện.'], GhiChu:['NVARCHAR(255)','Mô tả điều kiện lựa chọn hoặc tổ chức.'] },
  KET_QUA_CHI_TIET: { MaDot:['VARCHAR(20)','Đồng nhất với khóa chính DOT_KIEM_TRA.MaDot.'], MaQuanNhan:['VARCHAR(20)','Đồng nhất với khóa chính QUAN_NHAN.MaQuanNhan.'], MaMon:['VARCHAR(20)','Đồng nhất với khóa chính MON_KIEM_TRA.MaMon.'], LanThi:['TINYINT','Số lần thi là số nguyên dương nhỏ và tham gia khóa ghép.'], ThanhTichTho:['DECIMAL(10,2)','Cho phép NULL khi vắng; giữ chính xác thành tích đo được.'], TrangThaiThucHien:['VARCHAR(20)','Phân biệt CO_MAT, VANG_CO_PHEP, VANG_KHONG_PHEP, MIEN_GIAM.'], XepLoaiMon:['VARCHAR(20)','Kết quả do hệ thống tính từ tiêu chuẩn đúng hiệu lực.'], MaNguoiCham:['VARCHAR(20)','Tham chiếu QUAN_NHAN để truy vết cán bộ ghi nhận.'], ThoiDiemGhiNhan:['DATETIME','Lưu cả ngày và giờ đo thành tích.'], GhiChu:['NVARCHAR(255)','Ghi chú kết quả cần hỗ trợ tiếng Việt.'] },
  KET_QUA_TONG_HOP: { MaDot:['VARCHAR(20)','Đồng nhất với khóa chính DOT_KIEM_TRA.MaDot.'], MaQuanNhan:['VARCHAR(20)','Đồng nhất với khóa chính QUAN_NHAN.MaQuanNhan.'], SoMonDat:['TINYINT','Số lượng nhỏ, dùng đối chiếu quy tắc của đợt.'], SoMonKhongDat:['TINYINT','Số lượng nhỏ, hỗ trợ giải thích kết luận.'], XepLoaiChungCuoc:['VARCHAR(20)','Lưu mã kết luận để báo cáo và thống kê.'], TrangThaiThiVet:['VARCHAR(20)','Lưu mã trạng thái hữu hạn của quy trình thi vét.'], DeXuatAI:['NVARCHAR(MAX)','Nội dung AI có độ dài biến đổi và cần hỗ trợ tiếng Việt.'], GhiChuChiHuy:['NVARCHAR(MAX)','Chỉ đạo có thể dài, cần lưu nguyên văn tiếng Việt.'] }
};

export function parseFitnessField(field) {
  return { name: field.replace(/\s*\[[^\]]+\]\s*$/, ''), key: field.match(/\[([^\]]+)\]/)?.[1] || '' };
}

export const FITNESS_RELATIONS = [
  ['R1','DON_VI','DON_VI','MaDonViCapTren','Đơn vị cấp trên quản lý nhiều đơn vị cấp dưới'],
  ['R2','CAP_BAC','QUAN_NHAN','RankCapBac','Một quân hàm gắn với nhiều quân nhân'],
  ['R3','DON_VI','QUAN_NHAN','MaDonVi','Một đơn vị quản lý nhiều quân nhân'],
  ['R4','MON_KIEM_TRA','TIEU_CHUAN_MON','MaMon','Một môn có nhiều ngưỡng tiêu chuẩn'],
  ['R5','DOT_KIEM_TRA','NOI_DUNG_DOT','MaDot','Một đợt cấu hình nhiều môn áp dụng'],
  ['R6','MON_KIEM_TRA','NOI_DUNG_DOT','MaMon','Một môn được dùng trong nhiều đợt'],
  ['R7','DOT_KIEM_TRA','KET_QUA_CHI_TIET','MaDot','Một đợt có nhiều kết quả chi tiết'],
  ['R8','QUAN_NHAN','KET_QUA_CHI_TIET','MaQuanNhan','Một quân nhân có nhiều lượt kiểm tra'],
  ['R9','MON_KIEM_TRA','KET_QUA_CHI_TIET','MaMon','Một môn xuất hiện trong nhiều kết quả'],
  ['R10','QUAN_NHAN','KET_QUA_CHI_TIET','MaNguoiCham','Một cán bộ ghi nhận nhiều kết quả'],
  ['R11','DOT_KIEM_TRA','KET_QUA_TONG_HOP','MaDot','Một đợt tổng kết nhiều quân nhân'],
  ['R12','QUAN_NHAN','KET_QUA_TONG_HOP','MaQuanNhan','Một quân nhân có kết quả qua nhiều đợt']
];

export const FITNESS_TESTS = [
  { id:'BOI', name:'Bơi', unit:'giây', direction:'LOWER', sample:'75.00', accent:'#22d3ee' },
  { id:'CHAY', name:'Chạy', unit:'giây', direction:'LOWER', sample:'13.50', accent:'#60a5fa' },
  { id:'XA', name:'Xà', unit:'lần', direction:'HIGHER', sample:'12', accent:'#a78bfa' },
  { id:'TA', name:'Tạ', unit:'kg', direction:'HIGHER', sample:'45', accent:'#34d399' }
];
