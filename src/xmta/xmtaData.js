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
  { code:'R5', name:'TIEU_CHUAN_MON', title:'Ngưỡng xếp loại theo đối tượng', kind:'THAM CHIẾU', fields:['MaMon [PK, FK]','DoiTuongApDung [PK]','MucXepLoai [PK]','GiaTriNguong','GhiChu'] },
  { code:'R6', name:'DOT_KIEM_TRA', title:'Đợt kiểm tra thể lực', kind:'NGHIỆP VỤ', fields:['MaDot [PK]','TenDot','NgayBatDau','NgayKetThuc','GhiChu'] },
  { code:'R7', name:'KET_QUA_CHI_TIET', title:'Thành tích từng môn và lần thi', kind:'GIAO DỊCH', fields:['MaDot [PK, FK]','MaQuanNhan [PK, FK]','MaMon [PK, FK]','LanThi [PK]','ThanhTichTho','XepLoaiMon','NgayKiemTra','GhiChu'] },
  { code:'R8', name:'KET_QUA_TONG_HOP', title:'Kết luận toàn đợt và chỉ đạo', kind:'GIAO DỊCH', fields:['MaDot [PK, FK]','MaQuanNhan [PK, FK]','XepLoaiChungCuoc','TrangThaiThiVet','DeXuatAI','GhiChuChiHuy'] }
];

export const FITNESS_RELATIONS = [
  ['R1','DON_VI','DON_VI','MaDonViCapTren','Đơn vị cấp trên quản lý nhiều đơn vị cấp dưới'],
  ['R2','CAP_BAC','QUAN_NHAN','RankCapBac','Một quân hàm gắn với nhiều quân nhân'],
  ['R3','DON_VI','QUAN_NHAN','MaDonVi','Một đơn vị quản lý nhiều quân nhân'],
  ['R4','MON_KIEM_TRA','TIEU_CHUAN_MON','MaMon','Một môn có nhiều ngưỡng tiêu chuẩn'],
  ['R5','DOT_KIEM_TRA','KET_QUA_CHI_TIET','MaDot','Một đợt có nhiều kết quả chi tiết'],
  ['R6','QUAN_NHAN','KET_QUA_CHI_TIET','MaQuanNhan','Một quân nhân có nhiều lượt kiểm tra'],
  ['R7','MON_KIEM_TRA','KET_QUA_CHI_TIET','MaMon','Một môn xuất hiện trong nhiều kết quả'],
  ['R8','DOT_KIEM_TRA','KET_QUA_TONG_HOP','MaDot','Một đợt tổng kết nhiều quân nhân'],
  ['R9','QUAN_NHAN','KET_QUA_TONG_HOP','MaQuanNhan','Một quân nhân có kết quả qua nhiều đợt']
];

export const FITNESS_TESTS = [
  { id:'BOI', name:'Bơi', unit:'giây', direction:'LOWER', sample:'75.00', accent:'#22d3ee' },
  { id:'CHAY', name:'Chạy', unit:'giây', direction:'LOWER', sample:'13.50', accent:'#60a5fa' },
  { id:'XA', name:'Xà', unit:'lần', direction:'HIGHER', sample:'12', accent:'#a78bfa' },
  { id:'TA', name:'Tạ', unit:'kg', direction:'HIGHER', sample:'45', accent:'#34d399' }
];
