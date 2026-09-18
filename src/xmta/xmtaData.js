export const XMTA_SECTIONS = [
  ['overview','01','Tổng Quan XMTA'],['actors','02','Tác Nhân & Quyền'],['workflow','03','Quy Trình Kiểm Tra'],
  ['entities','04','Danh Mục Thực Thể'],['er','05','Phòng Trưng Bày ER'],['relational','06','Mô Hình Quan Hệ'],
  ['dictionary','07','Từ Điển Dữ Liệu'],['scenarios','08','Kiểm Chứng Tình Huống'],['ai','09','Nhật Ký Sử Dụng AI'],['conclusion','10','Kết Luận & Mở Rộng']
];

export const FITNESS_ENTITIES = [
  { code:'R1', name:'THISINH', title:'Thí sinh / Nhân sự', fields:['MaTS [PK]','HoTen','NgaySinh','GioiTinh','DonVi'] },
  { code:'R2', name:'DOTTHI', title:'Đợt kiểm tra thể lực', fields:['MaDot [PK]','TenDot','NgayBD','NgayKT','DiaDiem','TrangThai'] },
  { code:'R3', name:'MONTHELUC', title:'Môn kiểm tra', fields:['MaMon [PK]','TenMon','DonViDo','ChieuDanhGia'] },
  { code:'R4', name:'BAREMDIEM', title:'Bảng tiêu chuẩn điểm', fields:['MaBarem [PK]','MaMon [FK]','GioiTinh','TuoiMin / TuoiMax','MocThanhTich','Diem','XepLoai'] },
  { code:'R5', name:'DANGKYTHI', title:'Đăng ký & sàng lọc y tế', fields:['MaDangKy [PK]','MaTS [FK]','MaDot [FK]','HuyetAp','NhipTim','TrangThaiYTe','KetLuanChung'] },
  { code:'R6', name:'KETQUACHITIET', title:'Kết quả từng lượt thi', fields:['MaKQ [PK]','MaDangKy [FK]','MaMon [FK]','ThanhTichTho','DiemQuyDoi','LanThi','GiamKhao','DatYeuCau'] }
];

export const FITNESS_TESTS = [
  { id:'RUN100', name:'Chạy 100 mét', unit:'giây', direction:'LOWER', sample:'13.20', accent:'#22d3ee' },
  { id:'RUN3000', name:'Chạy 3.000 mét', unit:'phút', direction:'LOWER', sample:'13.50', accent:'#60a5fa' },
  { id:'PULLUP', name:'Co tay xà đơn', unit:'lần', direction:'HIGHER', sample:'12', accent:'#a78bfa' },
  { id:'LONGJUMP', name:'Bật xa tại chỗ', unit:'mét', direction:'HIGHER', sample:'2.45', accent:'#34d399' }
];
