/*
  SMTA - DU LIEU KHAO SAT THUC TE 2026
  He quan tri: Microsoft SQL Server 2019+
  Nguon 1: Ky yeu 2026 - Vien Cong nghe thong tin va Truyen thong, MTA
  Nguon 2: Phieu diem lop CNTT2/c160, khoa 60 (24 hoc vien)

  Nguyen tac trung thuc du lieu:
  - Cac truong mon hoc, giang vien, ngay thi, so tin chi, hinh thuc thi va diem
    dang de trong tren phieu goc duoc luu NULL, khong tu suy dien.
  - Ten va ngay sinh hoc vien duoc giu theo dung van ban nguon.
  - Can bo kiem nhiem chi co mot ho so CAN_BO; chuc vu theo don vi nam o
    PHAN_CONG_CAN_BO de tranh trung lap con nguoi.
*/

IF DB_ID(N'SMTA_KHAO_SAT_2026') IS NULL
BEGIN
    CREATE DATABASE [SMTA_KHAO_SAT_2026];
END;
GO

USE [SMTA_KHAO_SAT_2026];
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

IF OBJECT_ID(N'dbo.DON_VI', N'U') IS NULL
CREATE TABLE dbo.DON_VI (
    MaDonVi        VARCHAR(30)    NOT NULL CONSTRAINT PK_DON_VI PRIMARY KEY,
    TenDonVi       NVARCHAR(200)  NOT NULL,
    LoaiDonVi      VARCHAR(30)    NOT NULL,
    MaDonViCha     VARCHAR(30)    NULL,
    NgayThanhLap   DATE           NULL,
    SoQuyetDinh    NVARCHAR(50)   NULL,
    CONSTRAINT FK_DON_VI_CHA FOREIGN KEY (MaDonViCha) REFERENCES dbo.DON_VI(MaDonVi),
    CONSTRAINT CK_DON_VI_KHONG_TU_THAM_CHIEU CHECK (MaDonViCha IS NULL OR MaDonViCha <> MaDonVi)
);
GO

IF OBJECT_ID(N'dbo.CAN_BO', N'U') IS NULL
CREATE TABLE dbo.CAN_BO (
    MaCanBo        VARCHAR(20)    NOT NULL CONSTRAINT PK_CAN_BO PRIMARY KEY,
    HoTen          NVARCHAR(120)  NOT NULL CONSTRAINT UQ_CAN_BO_HOTEN UNIQUE,
    QuanHam        NVARCHAR(40)   NULL,
    HocHamHocVi    NVARCHAR(60)   NULL,
    TrangThai      VARCHAR(20)    NOT NULL CONSTRAINT DF_CAN_BO_TRANGTHAI DEFAULT 'DANG_CONG_TAC',
    CONSTRAINT CK_CAN_BO_TRANGTHAI CHECK (TrangThai IN ('DANG_CONG_TAC', 'NGHI_CHE_DO'))
);
GO

IF OBJECT_ID(N'dbo.PHAN_CONG_CAN_BO', N'U') IS NULL
CREATE TABLE dbo.PHAN_CONG_CAN_BO (
    MaCanBo        VARCHAR(20)    NOT NULL,
    MaDonVi        VARCHAR(30)    NOT NULL,
    ChucVu         NVARCHAR(150)  NOT NULL,
    LaChucVuChinh  BIT            NOT NULL CONSTRAINT DF_PCCB_CHINH DEFAULT 0,
    CONSTRAINT PK_PHAN_CONG_CAN_BO PRIMARY KEY (MaCanBo, MaDonVi, ChucVu),
    CONSTRAINT FK_PCCB_CAN_BO FOREIGN KEY (MaCanBo) REFERENCES dbo.CAN_BO(MaCanBo),
    CONSTRAINT FK_PCCB_DON_VI FOREIGN KEY (MaDonVi) REFERENCES dbo.DON_VI(MaDonVi)
);
GO

IF OBJECT_ID(N'dbo.LOP_HOC', N'U') IS NULL
CREATE TABLE dbo.LOP_HOC (
    MaLop          VARCHAR(30)    NOT NULL CONSTRAINT PK_LOP_HOC PRIMARY KEY,
    TenLop         NVARCHAR(120)  NOT NULL,
    KhoaHoc        INT            NOT NULL,
    HeDaoTao       NVARCHAR(100)  NOT NULL,
    DonVi          NVARCHAR(50)   NOT NULL,
    QuanSoTheoPhieu INT           NOT NULL,
    CONSTRAINT CK_LOP_HOC_QUANSO CHECK (QuanSoTheoPhieu > 0)
);
GO

IF OBJECT_ID(N'dbo.HOC_VIEN', N'U') IS NULL
CREATE TABLE dbo.HOC_VIEN (
    MaHocVien      VARCHAR(30)    NOT NULL CONSTRAINT PK_HOC_VIEN PRIMARY KEY,
    HoTen          NVARCHAR(120)  NOT NULL,
    NgaySinh       DATE           NOT NULL,
    MaLop          VARCHAR(30)    NOT NULL,
    TrangThai      VARCHAR(20)    NOT NULL CONSTRAINT DF_HV_TRANGTHAI DEFAULT 'DANG_HOC',
    CONSTRAINT UQ_HOC_VIEN_LOP_HOTEN_NGAYSINH UNIQUE (MaLop, HoTen, NgaySinh),
    CONSTRAINT FK_HOC_VIEN_LOP FOREIGN KEY (MaLop) REFERENCES dbo.LOP_HOC(MaLop),
    CONSTRAINT CK_HOC_VIEN_TRANGTHAI CHECK (TrangThai IN ('DANG_HOC', 'BAO_LUU', 'TOT_NGHIEP'))
);
GO

IF OBJECT_ID(N'dbo.PHIEU_DIEM', N'U') IS NULL
CREATE TABLE dbo.PHIEU_DIEM (
    MaPhieu         VARCHAR(30)    NOT NULL CONSTRAINT PK_PHIEU_DIEM PRIMARY KEY,
    MaLopHocPhan    VARCHAR(30)    NOT NULL,
    MaLop            VARCHAR(30)    NOT NULL,
    KhoaHoc          INT            NOT NULL,
    HocKy            INT            NULL,
    NamHoc           VARCHAR(20)    NULL,
    MaMonHoc         VARCHAR(30)    NULL,
    TenMonHoc        NVARCHAR(200)  NULL,
    GiangVien        NVARCHAR(120)  NULL,
    KhoaPhuTrach     NVARCHAR(200)  NULL,
    NgayThi          DATE           NULL,
    SoTinChi         TINYINT        NULL,
    HinhThucThi      NVARCHAR(100)  NULL,
    HSChuyenCan      DECIMAL(4,2)   NOT NULL,
    HSThuongXuyen    DECIMAL(4,2)   NOT NULL,
    HSThi            DECIMAL(4,2)   NOT NULL,
    CONSTRAINT UQ_PHIEU_DIEM_LOP_HOC_PHAN UNIQUE (MaLopHocPhan),
    CONSTRAINT FK_PHIEU_DIEM_LOP FOREIGN KEY (MaLop) REFERENCES dbo.LOP_HOC(MaLop),
    CONSTRAINT CK_PHIEU_DIEM_TRONGSO CHECK (HSChuyenCan + HSThuongXuyen + HSThi = 1.00),
    CONSTRAINT CK_PHIEU_DIEM_TINCHI CHECK (SoTinChi IS NULL OR SoTinChi > 0)
);
GO

IF OBJECT_ID(N'dbo.KET_QUA_PHIEU', N'U') IS NULL
CREATE TABLE dbo.KET_QUA_PHIEU (
    MaPhieu          VARCHAR(30)    NOT NULL,
    MaHocVien        VARCHAR(30)    NOT NULL,
    SoThuTu          INT            NOT NULL,
    DiemChuyenCan    DECIMAL(3,1)   NULL,
    DiemThuongXuyen  DECIMAL(3,1)   NULL,
    DiemThi          DECIMAL(3,1)   NULL,
    DiemHocPhan      DECIMAL(3,1)   NULL,
    DiemChu          NVARCHAR(20)   NULL,
    GhiChu           NVARCHAR(500)  NULL,
    CONSTRAINT PK_KET_QUA_PHIEU PRIMARY KEY (MaPhieu, MaHocVien),
    CONSTRAINT UQ_KET_QUA_PHIEU_STT UNIQUE (MaPhieu, SoThuTu),
    CONSTRAINT FK_KQP_PHIEU FOREIGN KEY (MaPhieu) REFERENCES dbo.PHIEU_DIEM(MaPhieu),
    CONSTRAINT FK_KQP_HOC_VIEN FOREIGN KEY (MaHocVien) REFERENCES dbo.HOC_VIEN(MaHocVien),
    CONSTRAINT CK_KQP_CC CHECK (DiemChuyenCan IS NULL OR DiemChuyenCan BETWEEN 0 AND 10),
    CONSTRAINT CK_KQP_TX CHECK (DiemThuongXuyen IS NULL OR DiemThuongXuyen BETWEEN 0 AND 10),
    CONSTRAINT CK_KQP_THI CHECK (DiemThi IS NULL OR DiemThi BETWEEN 0 AND 10),
    CONSTRAINT CK_KQP_HP CHECK (DiemHocPhan IS NULL OR DiemHocPhan BETWEEN 0 AND 10)
);
GO

BEGIN TRANSACTION;

MERGE dbo.DON_VI AS target
USING (VALUES
    ('VIEN_CNTT_TT', N'Viện Công nghệ thông tin và Truyền thông', 'VIEN', NULL, CONVERT(date, '2022-09-21'), N'3683/QĐ-BQP'),
    ('BM_HTTT', N'Bộ môn Hệ thống thông tin', 'BO_MON', 'VIEN_CNTT_TT', NULL, NULL),
    ('BM_KHMT', N'Bộ môn Khoa học máy tính', 'BO_MON', 'VIEN_CNTT_TT', NULL, NULL),
    ('BM_CNPM', N'Bộ môn Công nghệ phần mềm', 'BO_MON', 'VIEN_CNTT_TT', NULL, NULL),
    ('BM_ATTT_MANG', N'Bộ môn An toàn thông tin – Công nghệ mạng', 'BO_MON', 'VIEN_CNTT_TT', NULL, NULL),
    ('TT_TUD_TH', N'Trung tâm Toán ứng dụng và Tin học', 'TRUNG_TAM', 'VIEN_CNTT_TT', NULL, NULL),
    ('TTNCXS_ATTT', N'Trung tâm nghiên cứu xuất sắc về An toàn thông tin', 'TRUNG_TAM', 'VIEN_CNTT_TT', NULL, NULL)
) AS source(MaDonVi, TenDonVi, LoaiDonVi, MaDonViCha, NgayThanhLap, SoQuyetDinh)
ON target.MaDonVi = source.MaDonVi
WHEN MATCHED THEN UPDATE SET TenDonVi=source.TenDonVi, LoaiDonVi=source.LoaiDonVi,
    MaDonViCha=source.MaDonViCha, NgayThanhLap=source.NgayThanhLap, SoQuyetDinh=source.SoQuyetDinh
WHEN NOT MATCHED THEN INSERT (MaDonVi, TenDonVi, LoaiDonVi, MaDonViCha, NgayThanhLap, SoQuyetDinh)
VALUES (source.MaDonVi, source.TenDonVi, source.LoaiDonVi, source.MaDonViCha, source.NgayThanhLap, source.SoQuyetDinh);

DECLARE @CanBoNguon TABLE (
    MaDonVi VARCHAR(30), HoTen NVARCHAR(120), QuanHam NVARCHAR(40),
    HocHamHocVi NVARCHAR(60), ChucVu NVARCHAR(150), LaChucVuChinh BIT
);

INSERT INTO @CanBoNguon VALUES
('VIEN_CNTT_TT',N'Nguyễn Việt Hùng',N'Thượng tá',N'PGS. TS',N'Viện trưởng',1),
('TTNCXS_ATTT',N'Nguyễn Việt Hùng',N'Thượng tá',N'PGS. TS',N'Chỉ huy trưởng',1),
('VIEN_CNTT_TT',N'Trần Cao Trưởng',N'Đại tá',N'PGS. TS',N'Phó Viện trưởng',1),
('VIEN_CNTT_TT',N'Nguyễn Quốc Khánh',N'Thượng tá',N'GV. TS',N'Phó Viện trưởng',1),
('BM_HTTT',N'Nguyễn Văn Giang',N'Đại tá',N'PGS. TS',N'Chủ nhiệm BM',1),
('BM_HTTT',N'Nguyễn Mậu Uyên',N'Đại tá',N'GVC. TS',N'Phó Chủ nhiệm BM',1),
('BM_HTTT',N'Tống Minh Đức',N'Đại tá',N'GVC. TS',N'Giảng viên',0),
('BM_HTTT',N'Nguyễn Hoài Anh',N'Thượng tá',N'GVC. ThS',N'Giảng viên',0),
('BM_HTTT',N'Chu Thị Hường',N'Đại tá',N'GVC. TS',N'Trưởng PTN',1),
('BM_HTTT',N'Đỗ Thị Mai Hường',N'Thượng tá',N'GVC. ThS',N'Giảng viên',0),
('BM_HTTT',N'Tăng Văn Hạ',N'Thượng tá',N'PGS. TS',N'Giảng viên',0),
('BM_HTTT',N'Trần Văn An',N'Thượng tá',N'GV. TS',N'Giảng viên',0),
('BM_HTTT',N'Trần Minh Thanh',N'Thiếu úy',N'CN.',N'Kỹ thuật viên',0),
('BM_KHMT',N'Phan Việt Anh',N'Thượng tá',N'GV. TS',N'Chủ nhiệm BM',1),
('BM_KHMT',N'Nguyễn Quang Uy',N'Đại tá',N'PGS. TS',N'Phó Chủ nhiệm BM',1),
('BM_KHMT',N'Trần Cao Trưởng',N'Đại tá',N'PGS. TS',N'Phó Viện trưởng',1),
('BM_KHMT',N'Nguyễn Trung Tín',N'Thượng tá',N'GV. TS',N'Trưởng PTN',1),
('BM_KHMT',N'Ngô Hữu Phúc',N'Đại tá',N'GVC. TS',N'Giảng viên',0),
('BM_KHMT',N'Vi Bảo Ngọc',N'Trung tá',N'GV. ThS',N'Giảng viên',0),
('BM_KHMT',N'Phan Thị Hải Hồng',N'Trung tá',N'GV. TS',N'Giảng viên',0),
('BM_KHMT',N'Dương Thị Minh Soan',N'Trung tá',N'GV. TS',N'Giảng viên',0),
('BM_KHMT',N'Vũ Thị Ly',N'Trung tá',N'GV. TS',N'Giảng viên',0),
('BM_KHMT',N'Nguyễn Chí Công',N'Đại uý',N'TG. ThS',N'Giảng viên',0),
('BM_KHMT',N'Nguyễn Thị Hường',N'Trung tá CN',N'KTV. CN',N'Kỹ thuật viên',0),
('BM_CNPM',N'Nguyễn Quốc Khánh',N'Thượng tá',N'GV. TS',N'Phó Viện trưởng',1),
('BM_CNPM',N'Đỗ Trung Dũng',N'Trung tá',N'GV. TS',N'Phó Chủ nhiệm BM',1),
('BM_CNPM',N'Nguyễn Hoàng Sinh',N'Thượng tá',N'GV. TS',N'Giảng viên',0),
('BM_CNPM',N'Phan Nguyên Hải',N'Thượng tá',N'GVC. TS',N'Giảng viên',0),
('BM_CNPM',N'Phạm Văn Việt',N'Thượng tá',N'GVC. TS',N'Trưởng PTN',1),
('BM_CNPM',N'Hồ Nhật Quang',N'Trung tá',N'GV. ThS',N'Giảng viên',0),
('BM_CNPM',N'Phạm Thị Bích Vân',N'Trung tá',N'GV. TS',N'Giảng viên',0),
('BM_CNPM',N'Cao Tuấn Anh',N'Trung tá',N'GV. ThS',N'Giảng viên',0),
('BM_CNPM',N'Trần Hữu Phi',N'Thiếu tá',N'GV. TS',N'Giảng viên',0),
('BM_CNPM',N'Nguyễn Thế Hùng',N'Thượng úy',N'TG. ThS',N'Giảng viên',0),
('BM_CNPM',N'Đỗ Thị Phương Loan',N'Thượng tá CN',N'KTV. CN',N'Kỹ thuật viên',0),
('BM_ATTT_MANG',N'Nguyễn Việt Hùng',N'Thượng tá',N'PGS. TS',N'Viện trưởng',1),
('BM_ATTT_MANG',N'Cao Văn Lợi',N'Thượng tá',N'GV. TS',N'Chủ nhiệm BM',1),
('BM_ATTT_MANG',N'Đặng Lê Đình Trang',N'Trung tá',N'GV. TS',N'Phó Chủ nhiệm BM',1),
('BM_ATTT_MANG',N'Lưu Hồng Dũng',N'Đại tá',N'GVC. TS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Dương Hương Liên',N'Thượng tá CN',N'KTV. CN',N'Kỹ thuật viên',0),
('BM_ATTT_MANG',N'Trần Thị Lan',N'Trung tá CN',N'KTV. CN',N'Kỹ thuật viên',0),
('BM_ATTT_MANG',N'Nguyễn Hữu Nội',N'Thiếu tá',N'TG. ThS',N'Trợ giảng',0),
('BM_ATTT_MANG',N'Đặng Lê Đình Trang',N'Trung tá',N'GV. TS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Khuất Văn Thành',N'Trung tá',N'GV. TS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Vũ Đình Phái',N'Thiếu tá',N'GV. ThS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Nguyễn Kim Thanh',N'Thiếu tá',N'TG. ThS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Phạm Thái Hưng',N'Trung tá',N'TG. ThS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Nguyễn Văn Cường',N'Thiếu tá',N'GV. ThS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Nguyễn Duy Tùng Khánh',N'Đại uý',N'TG. TS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Trần Tuấn Phong',N'Đại uý',N'TG. ThS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Trần Hồng Quang',N'VCQP',N'GVC. TS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Nguyễn Thành Công',N'Trung uý',N'TG. ThS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Hoàng Trọng Bình',N'Thượng uý',N'TG. ThS',N'Giảng viên',0),
('BM_ATTT_MANG',N'Võ Minh Thiên Long',N'Trung uý',N'TG. CN',N'Giảng viên',0),
('TT_TUD_TH',N'Hy Đức Mạnh',N'Thượng tá',N'GVC. TS',N'Chỉ huy trưởng',1),
('TT_TUD_TH',N'Bùi Văn Định',N'Thượng tá',N'PGS. TS',N'Phó Chỉ huy trưởng',1),
('TT_TUD_TH',N'Tạ Ngọc Ánh',N'Thượng tá',N'GVC. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Nguyễn Thị Thanh Hà',N'Đại tá',N'GVC. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Nguyễn Thị Thu Hương',N'Đại tá',N'GVC. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Phạm Tiến Dũng',N'Đại tá',N'GVC. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Nguyễn Hồng Nam',N'Thượng tá',N'GVC. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Phạm Thế Anh',N'Thượng tá',N'GVC. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Đỗ Anh Tuấn',N'Thượng tá',N'GVC. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Bùi Quốc Hưng',N'Trung tá',N'GVC. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Phan Thị Hương',N'Thượng tá',N'GVC. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Vũ Anh Mỹ',N'Thượng tá',N'GVC. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Trần Thị Huyền Thanh',N'Trung tá',N'GV. TS',N'Giảng viên',0),
('TT_TUD_TH',N'Đỗ Văn Hoàn',N'Thiếu tá',N'GV. TS',N'Trưởng PTN',1),
('TT_TUD_TH',N'Biện Thanh Tuyền',N'Đại úy',N'GV. ThS',N'Giảng viên',0),
('TT_TUD_TH',N'Vương Thị Lê',N'Thượng úy',N'NCV. ThS',N'Nghiên cứu viên',0),
('TT_TUD_TH',N'Trần Thị Phương Lan',N'Thượng úy',N'GV. ThS',N'Giảng viên',0),
('TT_TUD_TH',N'Nguyễn Thị Phương Nhung',N'Thượng tá CN',N'KTV. CN',N'Kỹ thuật viên',0);

;WITH NguonKhongTrung AS (
    SELECT HoTen, MAX(QuanHam) AS QuanHam, MAX(HocHamHocVi) AS HocHamHocVi,
           ROW_NUMBER() OVER (ORDER BY HoTen) AS STT
    FROM @CanBoNguon GROUP BY HoTen
)
MERGE dbo.CAN_BO AS target
USING NguonKhongTrung AS source
ON target.HoTen = source.HoTen
WHEN MATCHED THEN UPDATE SET QuanHam=source.QuanHam, HocHamHocVi=source.HocHamHocVi
WHEN NOT MATCHED THEN INSERT (MaCanBo, HoTen, QuanHam, HocHamHocVi)
VALUES ('CB' + RIGHT('000' + CONVERT(varchar(3), source.STT), 3), source.HoTen, source.QuanHam, source.HocHamHocVi);

MERGE dbo.PHAN_CONG_CAN_BO AS target
USING (
    SELECT cb.MaCanBo, n.MaDonVi, n.ChucVu, MAX(n.LaChucVuChinh) AS LaChucVuChinh
    FROM @CanBoNguon n JOIN dbo.CAN_BO cb ON cb.HoTen=n.HoTen
    GROUP BY cb.MaCanBo, n.MaDonVi, n.ChucVu
) AS source
ON target.MaCanBo=source.MaCanBo AND target.MaDonVi=source.MaDonVi AND target.ChucVu=source.ChucVu
WHEN MATCHED THEN UPDATE SET LaChucVuChinh=source.LaChucVuChinh
WHEN NOT MATCHED THEN INSERT (MaCanBo, MaDonVi, ChucVu, LaChucVuChinh)
VALUES (source.MaCanBo, source.MaDonVi, source.ChucVu, source.LaChucVuChinh);

MERGE dbo.LOP_HOC AS target
USING (VALUES ('CNTT2_K60', N'Lớp Công nghệ thông tin 2 – Khóa 60', 60, N'Đại học – Quân sự', N'CNTT2', 24))
AS source(MaLop, TenLop, KhoaHoc, HeDaoTao, DonVi, QuanSoTheoPhieu)
ON target.MaLop=source.MaLop
WHEN MATCHED THEN UPDATE SET TenLop=source.TenLop, KhoaHoc=source.KhoaHoc, HeDaoTao=source.HeDaoTao,
    DonVi=source.DonVi, QuanSoTheoPhieu=source.QuanSoTheoPhieu
WHEN NOT MATCHED THEN INSERT VALUES (source.MaLop, source.TenLop, source.KhoaHoc, source.HeDaoTao, source.DonVi, source.QuanSoTheoPhieu);

MERGE dbo.HOC_VIEN AS target
USING (VALUES
('HV60CNTT2_01',N'Phan Đăng Xuân',CONVERT(date,'2006-12-06'),'CNTT2_K60'),
('HV60CNTT2_02',N'Phạm Đức Anh',CONVERT(date,'2006-07-28'),'CNTT2_K60'),
('HV60CNTT2_03',N'Hoàng Hải Đăng',CONVERT(date,'2006-09-22'),'CNTT2_K60'),
('HV60CNTT2_04',N'Nguyễn Bảo Long',CONVERT(date,'2005-03-14'),'CNTT2_K60'),
('HV60CNTT2_05',N'Phạm Văn Trà',CONVERT(date,'2006-12-10'),'CNTT2_K60'),
('HV60CNTT2_06',N'Bùi Trí Đích',CONVERT(date,'2005-04-18'),'CNTT2_K60'),
('HV60CNTT2_07',N'Phạm Tiến Đạt',CONVERT(date,'2005-11-25'),'CNTT2_K60'),
('HV60CNTT2_08',N'Vũ Ngọc Quyết',CONVERT(date,'2006-08-22'),'CNTT2_K60'),
('HV60CNTT2_09',N'Đỗ Quý Bắc',CONVERT(date,'2006-06-24'),'CNTT2_K60'),
('HV60CNTT2_10',N'Nguyễn Trọng Bảo',CONVERT(date,'2006-02-17'),'CNTT2_K60'),
('HV60CNTT2_11',N'Ng Hữu Trường Sơn',CONVERT(date,'2006-12-30'),'CNTT2_K60'),
('HV60CNTT2_12',N'Lê Minh Hùng',CONVERT(date,'2005-08-11'),'CNTT2_K60'),
('HV60CNTT2_13',N'Trương Hoàng Minh',CONVERT(date,'2006-06-08'),'CNTT2_K60'),
('HV60CNTT2_14',N'Đoàn Tuấn Minh',CONVERT(date,'2006-05-15'),'CNTT2_K60'),
('HV60CNTT2_15',N'Nguyễn Việt Hoàng',CONVERT(date,'2006-01-02'),'CNTT2_K60'),
('HV60CNTT2_16',N'Ng Ngọc Nam Khánh',CONVERT(date,'2006-02-26'),'CNTT2_K60'),
('HV60CNTT2_17',N'Lê Khả Duy',CONVERT(date,'2006-05-05'),'CNTT2_K60'),
('HV60CNTT2_18',N'Trương Vi Thiện',CONVERT(date,'2006-02-18'),'CNTT2_K60'),
('HV60CNTT2_19',N'Phùng Vinh Hiển',CONVERT(date,'2006-08-15'),'CNTT2_K60'),
('HV60CNTT2_20',N'Huỳnh Gia Hân',CONVERT(date,'2006-05-21'),'CNTT2_K60'),
('HV60CNTT2_21',N'Phạm Huyền Trang',CONVERT(date,'2006-01-01'),'CNTT2_K60'),
('HV60CNTT2_22',N'Vàng Thị Vi',CONVERT(date,'2005-07-27'),'CNTT2_K60'),
('HV60CNTT2_23',N'Bhnước Thị Y Thao',CONVERT(date,'2006-10-16'),'CNTT2_K60'),
('HV60CNTT2_24',N'Vũ Thị Thanh Xuân',CONVERT(date,'2006-03-22'),'CNTT2_K60')
) AS source(MaHocVien,HoTen,NgaySinh,MaLop)
ON target.MaHocVien=source.MaHocVien
WHEN MATCHED THEN UPDATE SET HoTen=source.HoTen, NgaySinh=source.NgaySinh, MaLop=source.MaLop
WHEN NOT MATCHED THEN INSERT (MaHocVien,HoTen,NgaySinh,MaLop) VALUES (source.MaHocVien,source.HoTen,source.NgaySinh,source.MaLop);

MERGE dbo.PHIEU_DIEM AS target
USING (VALUES ('PD_CNTT2_C160','CNTT2/c160','CNTT2_K60',60,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.10,0.30,0.60))
AS source(MaPhieu,MaLopHocPhan,MaLop,KhoaHoc,HocKy,NamHoc,MaMonHoc,TenMonHoc,GiangVien,KhoaPhuTrach,NgayThi,SoTinChi,HinhThucThi,HSChuyenCan,HSThuongXuyen,HSThi)
ON target.MaPhieu=source.MaPhieu
WHEN MATCHED THEN UPDATE SET MaLopHocPhan=source.MaLopHocPhan, MaLop=source.MaLop, KhoaHoc=source.KhoaHoc,
    HocKy=source.HocKy, NamHoc=source.NamHoc, MaMonHoc=source.MaMonHoc, TenMonHoc=source.TenMonHoc,
    GiangVien=source.GiangVien, KhoaPhuTrach=source.KhoaPhuTrach, NgayThi=source.NgayThi,
    SoTinChi=source.SoTinChi, HinhThucThi=source.HinhThucThi, HSChuyenCan=source.HSChuyenCan,
    HSThuongXuyen=source.HSThuongXuyen, HSThi=source.HSThi
WHEN NOT MATCHED THEN INSERT VALUES (source.MaPhieu,source.MaLopHocPhan,source.MaLop,source.KhoaHoc,source.HocKy,source.NamHoc,
    source.MaMonHoc,source.TenMonHoc,source.GiangVien,source.KhoaPhuTrach,source.NgayThi,source.SoTinChi,
    source.HinhThucThi,source.HSChuyenCan,source.HSThuongXuyen,source.HSThi);

MERGE dbo.KET_QUA_PHIEU AS target
USING (
    SELECT 'PD_CNTT2_C160' AS MaPhieu, MaHocVien,
           CONVERT(int, RIGHT(MaHocVien,2)) AS SoThuTu
    FROM dbo.HOC_VIEN WHERE MaLop='CNTT2_K60'
) AS source
ON target.MaPhieu=source.MaPhieu AND target.MaHocVien=source.MaHocVien
WHEN NOT MATCHED THEN INSERT (MaPhieu,MaHocVien,SoThuTu,DiemChuyenCan,DiemThuongXuyen,DiemThi,DiemHocPhan,DiemChu,GhiChu)
VALUES (source.MaPhieu,source.MaHocVien,source.SoThuTu,NULL,NULL,NULL,NULL,NULL,NULL);

COMMIT TRANSACTION;
GO

CREATE OR ALTER VIEW dbo.vw_PhieuDiem_CNTT2
AS
SELECT k.SoThuTu, hv.MaHocVien, hv.HoTen, hv.NgaySinh, l.DonVi,
       k.DiemChuyenCan, k.DiemThuongXuyen, k.DiemThi, k.DiemHocPhan, k.DiemChu, k.GhiChu,
       p.MaLopHocPhan, p.KhoaHoc, p.HSChuyenCan, p.HSThuongXuyen, p.HSThi
FROM dbo.KET_QUA_PHIEU k
JOIN dbo.HOC_VIEN hv ON hv.MaHocVien=k.MaHocVien
JOIN dbo.LOP_HOC l ON l.MaLop=hv.MaLop
JOIN dbo.PHIEU_DIEM p ON p.MaPhieu=k.MaPhieu
WHERE k.MaPhieu='PD_CNTT2_C160';
GO

SELECT * FROM dbo.vw_PhieuDiem_CNTT2 ORDER BY SoThuTu;
SELECT dv.TenDonVi, cb.HoTen, cb.QuanHam, cb.HocHamHocVi, pc.ChucVu
FROM dbo.PHAN_CONG_CAN_BO pc
JOIN dbo.CAN_BO cb ON cb.MaCanBo=pc.MaCanBo
JOIN dbo.DON_VI dv ON dv.MaDonVi=pc.MaDonVi
ORDER BY dv.TenDonVi, pc.LaChucVuChinh DESC, cb.HoTen;
GO
