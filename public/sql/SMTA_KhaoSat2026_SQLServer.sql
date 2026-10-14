/*
  SMTA - DU LIEU KHAO SAT THUC TE 2026
  He quan tri: Microsoft SQL Server 2019+
  Nguon tham khao 1: Ky yeu 2026 cua Vien CNTT&TT do nguoi dung tra cuu
  Nguon tham khao 2: Phieu diem lop CNTT2/c160, khoa 60 (24 ban ghi)
  Du lieu duoc luu kem nguon; email thieu/bat thuong duoc gan co de doi chieu.

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
    TinhTrangDuLieu VARCHAR(30)   NOT NULL CONSTRAINT DF_DON_VI_TTDL DEFAULT 'DA_TRUY_HOI',
    CONSTRAINT FK_DON_VI_CHA FOREIGN KEY (MaDonViCha) REFERENCES dbo.DON_VI(MaDonVi),
    CONSTRAINT CK_DON_VI_KHONG_TU_THAM_CHIEU CHECK (MaDonViCha IS NULL OR MaDonViCha <> MaDonVi),
    CONSTRAINT CK_DON_VI_TTDL CHECK (TinhTrangDuLieu IN ('DA_TRUY_HOI','CHUA_TRUY_HOI_DANH_SACH'))
);
GO

IF OBJECT_ID(N'dbo.CAN_BO', N'U') IS NULL
CREATE TABLE dbo.CAN_BO (
    MaCanBo        VARCHAR(20)    NOT NULL CONSTRAINT PK_CAN_BO PRIMARY KEY,
    HoTen          NVARCHAR(120)  NOT NULL CONSTRAINT UQ_CAN_BO_HOTEN UNIQUE,
    QuanHam        NVARCHAR(40)   NULL,
    HocHamHocVi    NVARCHAR(60)   NULL,
    NgaySinh       DATE           NULL,
    NgayVeDonVi    VARCHAR(10)    NULL,
    EmailNguon     VARCHAR(150)   NULL,
    TrangThaiEmail VARCHAR(20)    NOT NULL CONSTRAINT DF_CAN_BO_TT_EMAIL DEFAULT 'DA_GHI_NHAN',
    NguonDuLieu    NVARCHAR(200)  NULL,
    TrangThai      VARCHAR(20)    NOT NULL CONSTRAINT DF_CAN_BO_TRANGTHAI DEFAULT 'DANG_CONG_TAC',
    CONSTRAINT CK_CAN_BO_TRANGTHAI CHECK (TrangThai IN ('DANG_CONG_TAC', 'NGHI_CHE_DO')),
    CONSTRAINT CK_CAN_BO_TT_EMAIL CHECK (TrangThaiEmail IN ('DA_GHI_NHAN','KHONG_CO_TRONG_NGUON','CAN_DOI_CHIEU'))
);
GO

IF COL_LENGTH('dbo.DON_VI','TinhTrangDuLieu') IS NULL ALTER TABLE dbo.DON_VI ADD TinhTrangDuLieu VARCHAR(30) NOT NULL CONSTRAINT DF_DON_VI_TTDL_UPGRADE DEFAULT 'DA_TRUY_HOI';
IF COL_LENGTH('dbo.CAN_BO','NgaySinh') IS NULL ALTER TABLE dbo.CAN_BO ADD NgaySinh DATE NULL;
IF COL_LENGTH('dbo.CAN_BO','NgayVeDonVi') IS NULL ALTER TABLE dbo.CAN_BO ADD NgayVeDonVi VARCHAR(10) NULL;
IF COL_LENGTH('dbo.CAN_BO','EmailNguon') IS NULL ALTER TABLE dbo.CAN_BO ADD EmailNguon VARCHAR(150) NULL;
IF COL_LENGTH('dbo.CAN_BO','TrangThaiEmail') IS NULL ALTER TABLE dbo.CAN_BO ADD TrangThaiEmail VARCHAR(20) NOT NULL CONSTRAINT DF_CAN_BO_TT_EMAIL_UPGRADE DEFAULT 'DA_GHI_NHAN';
IF COL_LENGTH('dbo.CAN_BO','NguonDuLieu') IS NULL ALTER TABLE dbo.CAN_BO ADD NguonDuLieu NVARCHAR(200) NULL;
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
    ('VIEN_CNTT_TT', N'Viện Công nghệ thông tin và Truyền thông', 'VIEN', NULL, CONVERT(date, '2022-09-21'), N'3683/QĐ-BQP', 'DA_TRUY_HOI'),
    ('BM_HTTT', N'Bộ môn Hệ thống thông tin', 'BO_MON', 'VIEN_CNTT_TT', NULL, NULL, 'DA_TRUY_HOI'),
    ('BM_KHMT', N'Bộ môn Khoa học máy tính', 'BO_MON', 'VIEN_CNTT_TT', NULL, NULL, 'DA_TRUY_HOI'),
    ('BM_CNPM', N'Bộ môn Công nghệ phần mềm', 'BO_MON', 'VIEN_CNTT_TT', NULL, NULL, 'DA_TRUY_HOI'),
    ('BM_ATTT_MANG', N'Bộ môn An toàn thông tin – Công nghệ mạng', 'BO_MON', 'VIEN_CNTT_TT', NULL, NULL, 'DA_TRUY_HOI'),
    ('PHONG_KHTH', N'Phòng Kế hoạch tổng hợp', 'PHONG', 'VIEN_CNTT_TT', NULL, NULL, 'DA_TRUY_HOI'),
    ('PHONG_TVCGCN', N'Phòng Tư vấn chuyển giao công nghệ', 'PHONG', 'VIEN_CNTT_TT', NULL, NULL, 'DA_TRUY_HOI'),
    ('TT_TUD_TH', N'Trung tâm Toán ứng dụng và Tin học', 'TRUNG_TAM', 'VIEN_CNTT_TT', NULL, NULL, 'DA_TRUY_HOI'),
    ('TT_MAY_TIN', N'Trung tâm Máy tính', 'TRUNG_TAM', 'VIEN_CNTT_TT', NULL, NULL, 'CHUA_TRUY_HOI_DANH_SACH'),
    ('TTNCXS_ATTT', N'Trung tâm nghiên cứu xuất sắc về An toàn thông tin', 'TRUNG_TAM', 'VIEN_CNTT_TT', NULL, NULL, 'CHUA_TRUY_HOI_DANH_SACH')
) AS source(MaDonVi, TenDonVi, LoaiDonVi, MaDonViCha, NgayThanhLap, SoQuyetDinh, TinhTrangDuLieu)
ON target.MaDonVi = source.MaDonVi
WHEN MATCHED THEN UPDATE SET TenDonVi=source.TenDonVi, LoaiDonVi=source.LoaiDonVi,
    MaDonViCha=source.MaDonViCha, NgayThanhLap=source.NgayThanhLap, SoQuyetDinh=source.SoQuyetDinh, TinhTrangDuLieu=source.TinhTrangDuLieu
WHEN NOT MATCHED THEN INSERT (MaDonVi, TenDonVi, LoaiDonVi, MaDonViCha, NgayThanhLap, SoQuyetDinh, TinhTrangDuLieu)
VALUES (source.MaDonVi, source.TenDonVi, source.LoaiDonVi, source.MaDonViCha, source.NgayThanhLap, source.SoQuyetDinh, source.TinhTrangDuLieu);

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

/* Bổ sung chi tiết Kỷ yếu 2026: giữ nguyên ngày về đơn vị theo độ chính xác của nguồn.
   Email thiếu để NULL; miền bất thường được gắn CAN_DOI_CHIEU, không tự sửa. */
DECLARE @ChiTietKyYeu TABLE(MaGoiY VARCHAR(20),HoTen NVARCHAR(120),QuanHam NVARCHAR(40),HocHamHocVi NVARCHAR(60),NgaySinh DATE,NgayVeDonVi VARCHAR(10),EmailNguon VARCHAR(150),TrangThaiEmail VARCHAR(20));
INSERT INTO @ChiTietKyYeu VALUES
('KY001',N'Bùi Quốc Hưng',N'Trung tá',N'GVC. TS',CONVERT(date,'1982-06-28'),'3/2005','quochung2806@yahoo.com','DA_GHI_NHAN'),
('KY002',N'Bùi Văn Định',N'Thượng tá',N'PGS. TS',CONVERT(date,'1978-09-21'),'11/2003','vandinhb@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY003',N'Cao Tuấn Anh',N'Trung tá',N'GV. ThS',CONVERT(date,'1986-01-02'),'02/2013','caotuananh1312@gmail.com','DA_GHI_NHAN'),
('KY004',N'Cao Văn Lợi',N'Thượng tá',N'GV. TS',CONVERT(date,'1979-12-10'),'9/2006','loi.cao@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY005',N'Chu Thị Hường',N'Đại tá',N'GVC. TS',CONVERT(date,'1979-07-22'),'09/2002','huongktqs@gmail.com','DA_GHI_NHAN'),
('KY006',N'Dương Hương Liên',N'Thượng tá CN',N'KTV. CN',CONVERT(date,'1976-07-07'),'08/2000','duonglien.fit@gmail.com','DA_GHI_NHAN'),
('KY007',N'Dương Thị Minh Soan',N'Trung tá',N'GV. TS',CONVERT(date,'1986-06-13'),'2011','soanduong@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY008',N'Đặng Lê Đình Trang',N'Trung tá',N'GV. TS',CONVERT(date,'1987-12-04'),'8/2012','trangdld@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY009',N'Đỗ Anh Tuấn',N'Thượng tá',N'GVC. TS',CONVERT(date,'1981-08-15'),'12/2003','doanhtuanktqs@gmail.com','DA_GHI_NHAN'),
('KY010',N'Đỗ Thị Mai Hường',N'Thượng tá',N'GVC. ThS',CONVERT(date,'1979-10-10'),'11/2003','dohuong@gmail.com','DA_GHI_NHAN'),
('KY011',N'Đỗ Thị Phương Loan',N'Thượng tá CN',N'KTV. CN',CONVERT(date,'1973-06-21'),'1998','doloank12cntt@gmail.com','DA_GHI_NHAN'),
('KY012',N'Đỗ Trung Dũng',N'Trung tá',N'GV. TS',CONVERT(date,'1984-07-08'),'4/2011','dtdo@mta.edu.vn','DA_GHI_NHAN'),
('KY013',N'Hoa Tất Thắng',N'Thượng tá',N'GVC. TS',CONVERT(date,'1979-06-11'),'01/2010','thanght@lqdtu.edu.com','CAN_DOI_CHIEU'),
('KY014',N'Hoàng Trọng Bình',N'Thượng úy',N'TG. ThS',CONVERT(date,'1999-06-02'),'07/2026','binhht99@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY015',N'Hồ Nhật Quang',N'Trung tá',N'GV. ThS',CONVERT(date,'1979-09-09'),'9/2003','honhatquang@yahoo.com','DA_GHI_NHAN'),
('KY016',N'Hy Đức Mạnh',N'Thượng tá',N'GVC. TS',CONVERT(date,'1980-11-02'),'9/2002','ducmanhh@lqdtu.edu.com','CAN_DOI_CHIEU'),
('KY017',N'Khuất Văn Thành',N'Trung tá',N'GV. TS',CONVERT(date,'1988-09-08'),'03/2017','van-thanh.khuat@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY018',N'Lê Đình Sơn',N'Đại tá',N'GVC. TS',CONVERT(date,'1977-11-12'),'09/2001','sonld.mta@mail.bqp','DA_GHI_NHAN'),
('KY019',N'Lưu Hồng Dũng',N'Đại tá',N'GVC. TS',CONVERT(date,'1966-08-27'),'09/1998','luuhongdung@gmail.com','DA_GHI_NHAN'),
('KY020',N'Ngô Hữu Phúc',N'Đại tá',N'GVC. TS',CONVERT(date,'1976-06-25'),'6/2000','ngohuuphuc76@mta.edu.vn','DA_GHI_NHAN'),
('KY021',N'Nguyễn Chí Công',N'Đại úy',N'TG. ThS',CONVERT(date,'1994-10-12'),'5/2020','congnc@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY022',N'Nguyễn Duy Tùng Khánh',N'Đại úy',N'TG. TS',CONVERT(date,'1995-02-03'),'01/2020','tungkhanh@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY023',N'Nguyễn Hoài Anh',N'Thượng tá',N'GVC. ThS',CONVERT(date,'1977-07-13'),'10/2000','hoaianh2005@gmail.com','DA_GHI_NHAN'),
('KY024',N'Nguyễn Hoàng Sinh',N'Thượng tá',N'GV. TS',CONVERT(date,'1977-08-13'),'2025','nhsinh@mta.edu.vn','DA_GHI_NHAN'),
('KY025',N'Nguyễn Hồng Nam',N'Thượng tá',N'GVC. TS',CONVERT(date,'1977-01-02'),'01/2000','nguyenhongnam1977@gmail.com','DA_GHI_NHAN'),
('KY026',N'Nguyễn Hữu Nội',N'Thiếu tá',N'TG. ThS',CONVERT(date,'1987-07-15'),'04/2014','noi.nguyen@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY027',N'Nguyễn Kim Thanh',N'Thiếu tá',N'TG. ThS',CONVERT(date,'1988-06-24'),'03/2013','thanh.nk@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY028',N'Nguyễn Mậu Uyên',N'Đại tá',N'GVC. TS',CONVERT(date,'1978-08-10'),'2003','nguyenitt2005@gmail.com','DA_GHI_NHAN'),
('KY029',N'Nguyễn Ngọc Lực',N'Thiếu tá',N'',CONVERT(date,'1990-06-06'),'01/2023','longthien20032003@gmail.com','DA_GHI_NHAN'),
('KY030',N'Nguyễn Quang Uy',N'Đại tá',N'PGS. TS',CONVERT(date,'1980-03-04'),'9/2004','quanguyhn@gmail.com','DA_GHI_NHAN'),
('KY031',N'Nguyễn Quốc Khánh',N'Thượng tá',N'GV. TS',CONVERT(date,'1983-09-02'),'3/2009','khanh29bk@mta.edu.com','CAN_DOI_CHIEU'),
('KY032',N'Nguyễn Thành Công',N'Trung úy',N'TG. ThS',CONVERT(date,'1999-11-09'),'07/2026','congnt@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY033',N'Nguyễn Thanh Hà',N'Thượng tá',N'ThS',CONVERT(date,'1979-04-05'),'7/2023',NULL,'KHONG_CO_TRONG_NGUON'),
('KY034',N'Nguyễn Thế Hùng',N'Thượng úy',N'TG. ThS',CONVERT(date,'1995-07-20'),'2/2021','nthungmta@gmail.com','DA_GHI_NHAN'),
('KY035',N'Nguyễn Thị Hường',N'Trung tá CN',N'KTV. CN',CONVERT(date,'1973-02-02'),'9/1995',NULL,'KHONG_CO_TRONG_NGUON'),
('KY036',N'Nguyễn Thị Kim Dung',N'Trung tá',N'KS',CONVERT(date,'1973-09-09'),'9/1998','kimdung099@yahoo.com','DA_GHI_NHAN'),
('KY037',N'Nguyễn Thị Nhài',N'Thiếu tá CN',N'',CONVERT(date,'1990-07-08'),'01/2023','nhainguyenthi@mta.edu.vn','DA_GHI_NHAN'),
('KY038',N'Nguyễn Thị Thanh Hà',N'Đại tá',N'GVC. TS',CONVERT(date,'1972-11-07'),'12/2001','nttha711@gmail.com','DA_GHI_NHAN'),
('KY039',N'Nguyễn Thị Thu Hương',N'Đại tá',N'GVC. TS',CONVERT(date,'1975-08-23'),'12/1997','huong23875@yahoo.com','DA_GHI_NHAN'),
('KY040',N'Nguyễn Thị Tiên',N'Trung tá CN',N'',CONVERT(date,'1975-05-31'),'1995','nttienk12@gmail.com','DA_GHI_NHAN'),
('KY041',N'Nguyễn Trung Tín',N'Thượng tá',N'GV. TS',CONVERT(date,'1983-06-03'),'2009','khach_moscow@yahoo.com','DA_GHI_NHAN'),
('KY042',N'Nguyễn Văn Cường',N'Thiếu tá',N'GV. ThS',CONVERT(date,'1989-03-05'),'03/2014','cuongpd@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY043',N'Nguyễn Văn Giang',N'Thượng tá',N'PGS. TS',CONVERT(date,'1981-10-18'),'09/2005','giangnv@mta.edu.vn','DA_GHI_NHAN'),
('KY044',N'Nguyễn Việt Hùng',N'Thượng tá',N'PGS. TS',CONVERT(date,'1981-11-29'),'6/2008','hungnv@mta.edu.vn','DA_GHI_NHAN'),
('KY045',N'Phạm Thái Hưng',N'Trung tá',N'TG. ThS',CONVERT(date,'1984-01-01'),'01/2023','hungpt@mta.edu.vn','DA_GHI_NHAN'),
('KY046',N'Phạm Thế Anh',N'Thượng tá',N'GVC. TS',CONVERT(date,'1981-04-15'),'03/2004','phamtheanhhn@gmail.com','DA_GHI_NHAN'),
('KY047',N'Phạm Thị Bích Vân',N'Trung tá',N'GV. TS',CONVERT(date,'1986-07-01'),'10/2010','van8617@gmail.com','DA_GHI_NHAN'),
('KY048',N'Phạm Tiến Dũng',N'Đại tá',N'GVC. TS',CONVERT(date,'1975-03-28'),'01/2000','ptdung2004@mail.ru','CAN_DOI_CHIEU'),
('KY049',N'Phạm Văn Việt',N'Thượng tá',N'GVC. TS',CONVERT(date,'1979-05-25'),'9/2003','v.v.pham2012@gmail.com','DA_GHI_NHAN'),
('KY050',N'Phan Nguyên Hải',N'Thượng tá',N'GVC. TS',CONVERT(date,'1979-06-13'),'2/2009','Haipn@mta.edu.vn','DA_GHI_NHAN'),
('KY051',N'Phan Thị Hải Hồng',N'Trung tá',N'GV. TS',CONVERT(date,'1984-10-03'),'2010','hongpth@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY052',N'Phan Thị Hương',N'Thượng tá',N'GVC. TS',CONVERT(date,'1983-05-17'),'2/2006','pthuong175@gmail.com','DA_GHI_NHAN'),
('KY053',N'Phan Việt Anh',N'Thượng tá',N'GV. TS',CONVERT(date,'1984-05-19'),'9/2009','anhpv@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY054',N'Tạ Ngọc Ánh',N'Thượng tá',N'GVC. TS',CONVERT(date,'1981-09-19'),'11/2003','tangocanh@gmail.com','DA_GHI_NHAN'),
('KY055',N'Tạ Thị Diệu',N'Thượng tá CN',N'',CONVERT(date,'1975-12-22'),'9/1996','tathidieu1975@gmail.com','DA_GHI_NHAN'),
('KY056',N'Tăng Văn Hạ',N'Thượng tá',N'PGS. TS',CONVERT(date,'1981-05-11'),'9/2005','hatangvan@gmail.com','DA_GHI_NHAN'),
('KY057',N'Tống Minh Đức',N'Đại tá',N'GVC. TS',CONVERT(date,'1976-01-22'),'2000','ductmta@gmail.com','DA_GHI_NHAN'),
('KY058',N'Trần Cao Trưởng',N'Đại tá',N'PGS. TS',CONVERT(date,'1983-05-20'),'2006','truongct@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY059',N'Trần Hồng Quang',N'VCQP',N'GVC. TS',CONVERT(date,'1978-01-12'),'12/2000','quangth@mta.edu.vn','DA_GHI_NHAN'),
('KY060',N'Trần Hữu Phi',N'Thiếu tá',N'GV. TS',CONVERT(date,'1988-10-04'),'02/2013','huuphi_hn@yahoo.com','DA_GHI_NHAN'),
('KY061',N'Trần Minh Thanh',N'Thiếu úy',N'CN.',CONVERT(date,'1993-02-24'),'01/2026','Tranminhthanh19931@gmail.com','DA_GHI_NHAN'),
('KY062',N'Trần Thị Huyền Thanh',N'Trung tá',N'GV. TS',CONVERT(date,'1987-12-07'),'04/2013','thanh0712@gmail.com','DA_GHI_NHAN'),
('KY063',N'Trần Thị Lan',N'Trung tá CN',N'KTV. CN',CONVERT(date,'1975-02-05'),'2000',NULL,'KHONG_CO_TRONG_NGUON'),
('KY064',N'Trần Tuấn Phong',N'Đại úy',N'TG. ThS',CONVERT(date,'1996-05-01'),'07/2021','phongtt.cnm@gmail.com','DA_GHI_NHAN'),
('KY065',N'Trần Văn An',N'Thượng tá',N'GV. TS',CONVERT(date,'1985-11-30'),'8/2013','tavistu@gmail.com','DA_GHI_NHAN'),
('KY066',N'Vi Bảo Ngọc',N'Trung tá',N'GV. ThS',CONVERT(date,'1985-11-21'),'2008','ngocvb@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY067',N'Võ Minh Thiên Long',N'Trung úy',N'TG. CN',CONVERT(date,'2000-11-15'),'02/2025','vmtlong@lqdtu.edu.vn','DA_GHI_NHAN'),
('KY068',N'Vũ Anh Mỹ',N'Thượng tá',N'GVC. TS',CONVERT(date,'1984-02-07'),'02/2006','anhmy7284@gmail.com','DA_GHI_NHAN'),
('KY069',N'Vũ Đình Phái',N'Thiếu tá',N'GV. ThS',CONVERT(date,'1988-01-12'),'10/2013','dinhphai88@gmail.com','DA_GHI_NHAN'),
('KY070',N'Vũ Thị Ly',N'Trung tá',N'GV. TS',CONVERT(date,'1987-08-22'),'8/2012','vu.ly@lqdtu.edu.vn','DA_GHI_NHAN');

MERGE dbo.CAN_BO AS target
USING @ChiTietKyYeu AS source ON target.HoTen=source.HoTen
WHEN MATCHED THEN UPDATE SET QuanHam=source.QuanHam,HocHamHocVi=source.HocHamHocVi,NgaySinh=source.NgaySinh,NgayVeDonVi=source.NgayVeDonVi,EmailNguon=source.EmailNguon,TrangThaiEmail=source.TrangThaiEmail,NguonDuLieu=N'Kỷ yếu 2026 – dữ liệu do người dùng tra cứu'
WHEN NOT MATCHED THEN INSERT(MaCanBo,HoTen,QuanHam,HocHamHocVi,NgaySinh,NgayVeDonVi,EmailNguon,TrangThaiEmail,NguonDuLieu)
VALUES(source.MaGoiY,source.HoTen,source.QuanHam,source.HocHamHocVi,source.NgaySinh,source.NgayVeDonVi,source.EmailNguon,source.TrangThaiEmail,N'Kỷ yếu 2026 – dữ liệu do người dùng tra cứu');

DECLARE @PhanCongKyYeu TABLE(HoTen NVARCHAR(120),MaDonVi VARCHAR(30),ChucVu NVARCHAR(150));
INSERT INTO @PhanCongKyYeu VALUES
(N'Nguyễn Việt Hùng','VIEN_CNTT_TT',N'Viện trưởng, Chỉ huy trưởng TTNCXS về ATTT'),
(N'Trần Cao Trưởng','VIEN_CNTT_TT',N'Phó Viện trưởng'),
(N'Nguyễn Quốc Khánh','VIEN_CNTT_TT',N'Phó Viện trưởng'),
(N'Tống Minh Đức','BM_HTTT',N'Giảng viên'),
(N'Nguyễn Hoài Anh','BM_HTTT',N'Giảng viên'),
(N'Nguyễn Mậu Uyên','BM_HTTT',N'Phó CNBM'),
(N'Chu Thị Hường','BM_HTTT',N'Trưởng Phòng thí nghiệm'),
(N'Đỗ Thị Mai Hường','BM_HTTT',N'Giảng viên'),
(N'Tăng Văn Hạ','BM_HTTT',N'Giảng viên'),
(N'Nguyễn Văn Giang','BM_HTTT',N'Chủ nhiệm Bộ môn'),
(N'Trần Văn An','BM_HTTT',N'Giảng viên'),
(N'Trần Minh Thanh','BM_HTTT',N'Kỹ thuật viên'),
(N'Phan Việt Anh','BM_KHMT',N'Chủ nhiệm Bộ môn'),
(N'Nguyễn Quang Uy','BM_KHMT',N'Phó CNBM'),
(N'Trần Cao Trưởng','BM_KHMT',N'Phó Viện trưởng'),
(N'Nguyễn Trung Tín','BM_KHMT',N'Trưởng PTN'),
(N'Ngô Hữu Phúc','BM_KHMT',N'Giảng viên'),
(N'Vi Bảo Ngọc','BM_KHMT',N'Giảng viên'),
(N'Phan Thị Hải Hồng','BM_KHMT',N'Giảng viên'),
(N'Dương Thị Minh Soan','BM_KHMT',N'Giảng viên'),
(N'Vũ Thị Ly','BM_KHMT',N'Giảng viên'),
(N'Nguyễn Chí Công','BM_KHMT',N'Giảng viên'),
(N'Nguyễn Thị Hường','BM_KHMT',N'Kỹ thuật viên'),
(N'Nguyễn Quốc Khánh','BM_CNPM',N'Phó Viện trưởng'),
(N'Đỗ Trung Dũng','BM_CNPM',N'Phó chủ nhiệm Bộ môn'),
(N'Nguyễn Hoàng Sinh','BM_CNPM',N'Giảng viên'),
(N'Phan Nguyên Hải','BM_CNPM',N'Giảng viên'),
(N'Phạm Văn Việt','BM_CNPM',N'Trưởng phòng thí nghiệm'),
(N'Hồ Nhật Quang','BM_CNPM',N'Giảng viên'),
(N'Phạm Thị Bích Vân','BM_CNPM',N'Giảng viên'),
(N'Cao Tuấn Anh','BM_CNPM',N'Giảng viên'),
(N'Trần Hữu Phi','BM_CNPM',N'Giảng viên'),
(N'Nguyễn Thế Hùng','BM_CNPM',N'Giảng viên'),
(N'Đỗ Thị Phương Loan','BM_CNPM',N'Kỹ thuật viên'),
(N'Nguyễn Việt Hùng','BM_ATTT_MANG',N'Viện trưởng, CH TTNCXS ATTT'),
(N'Cao Văn Lợi','BM_ATTT_MANG',N'Chủ nhiệm Bộ môn'),
(N'Lưu Hồng Dũng','BM_ATTT_MANG',N'Giảng viên'),
(N'Dương Hương Liên','BM_ATTT_MANG',N'Kỹ thuật viên'),
(N'Trần Thị Lan','BM_ATTT_MANG',N'Kỹ thuật viên'),
(N'Nguyễn Hữu Nội','BM_ATTT_MANG',N'Trợ giảng'),
(N'Đặng Lê Đình Trang','BM_ATTT_MANG',N'Giảng viên'),
(N'Khuất Văn Thành','BM_ATTT_MANG',N'Giảng viên'),
(N'Vũ Đình Phái','BM_ATTT_MANG',N'Giảng viên'),
(N'Nguyễn Kim Thanh','BM_ATTT_MANG',N'Giảng viên'),
(N'Phạm Thái Hưng','BM_ATTT_MANG',N'Giảng viên'),
(N'Nguyễn Văn Cường','BM_ATTT_MANG',N'Giảng viên'),
(N'Nguyễn Duy Tùng Khánh','BM_ATTT_MANG',N'Giảng viên'),
(N'Trần Tuấn Phong','BM_ATTT_MANG',N'Giảng viên'),
(N'Trần Hồng Quang','BM_ATTT_MANG',N'Giảng viên'),
(N'Nguyễn Thành Công','BM_ATTT_MANG',N'Giảng viên'),
(N'Hoàng Trọng Bình','BM_ATTT_MANG',N'Giảng viên'),
(N'Võ Minh Thiên Long','BM_ATTT_MANG',N'Giảng viên'),
(N'Hoa Tất Thắng','PHONG_KHTH',N'Trưởng phòng'),
(N'Nguyễn Thị Tiên','PHONG_KHTH',N'Kỹ thuật viên'),
(N'Tạ Thị Diệu','PHONG_KHTH',N'Văn thư'),
(N'Nguyễn Thị Nhài','PHONG_KHTH',N'Nhân viên tài chính'),
(N'Nguyễn Ngọc Lực','PHONG_KHTH',N'Trợ lý'),
(N'Lê Đình Sơn','PHONG_TVCGCN',N'Trưởng phòng'),
(N'Nguyễn Thanh Hà','PHONG_TVCGCN',N'Nghiên cứu viên'),
(N'Nguyễn Thị Kim Dung','PHONG_TVCGCN',N'Kỹ thuật viên'),
(N'Hy Đức Mạnh','TT_TUD_TH',N'Chỉ huy trưởng'),
(N'Bùi Văn Định','TT_TUD_TH',N'Phó chỉ huy trưởng'),
(N'Tạ Ngọc Ánh','TT_TUD_TH',N'Giảng viên'),
(N'Nguyễn Thị Thanh Hà','TT_TUD_TH',N'Giảng viên'),
(N'Nguyễn Thị Thu Hương','TT_TUD_TH',N'Giảng viên'),
(N'Phạm Tiến Dũng','TT_TUD_TH',N'Giảng viên'),
(N'Nguyễn Hồng Nam','TT_TUD_TH',N'Giảng viên'),
(N'Phạm Thế Anh','TT_TUD_TH',N'Giảng viên'),
(N'Đỗ Anh Tuấn','TT_TUD_TH',N'Giảng viên'),
(N'Bùi Quốc Hưng','TT_TUD_TH',N'Giảng viên'),
(N'Phan Thị Hương','TT_TUD_TH',N'Giảng viên'),
(N'Vũ Anh Mỹ','TT_TUD_TH',N'Giảng viên'),
(N'Trần Thị Huyền Thanh','TT_TUD_TH',N'Giảng viên');
MERGE dbo.PHAN_CONG_CAN_BO AS target
USING(SELECT cb.MaCanBo,p.MaDonVi,p.ChucVu FROM @PhanCongKyYeu p JOIN dbo.CAN_BO cb ON cb.HoTen=p.HoTen) AS source
ON target.MaCanBo=source.MaCanBo AND target.MaDonVi=source.MaDonVi AND target.ChucVu=source.ChucVu
WHEN NOT MATCHED THEN INSERT(MaCanBo,MaDonVi,ChucVu,LaChucVuChinh) VALUES(source.MaCanBo,source.MaDonVi,source.ChucVu,0);

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

/* PHAN II - 23 BANG NGHIEP VU LOI THEO MO HINH TREN WEBSITE
   Cac bang dbo o tren giu du lieu nguon; core la CSDL van hanh chuan hoa. */
IF SCHEMA_ID(N'core') IS NULL EXEC(N'CREATE SCHEMA core');
GO
IF OBJECT_ID(N'core.DON_VI',N'U') IS NULL CREATE TABLE core.DON_VI(MaDonVi VARCHAR(30) PRIMARY KEY,TenDonVi NVARCHAR(200) NOT NULL,LoaiDonVi VARCHAR(30) NOT NULL,MaDonViCha VARCHAR(30) NULL,NgayThanhLap DATE NULL,SoQuyetDinh NVARCHAR(50) NULL,TinhTrangDuLieu VARCHAR(30) NOT NULL DEFAULT 'DA_TRUY_HOI',FOREIGN KEY(MaDonViCha) REFERENCES core.DON_VI(MaDonVi),CHECK(MaDonViCha IS NULL OR MaDonViCha<>MaDonVi),CHECK(TinhTrangDuLieu IN('DA_TRUY_HOI','CHUA_TRUY_HOI_DANH_SACH')));
IF OBJECT_ID(N'core.KHOA_DAO_TAO',N'U') IS NULL CREATE TABLE core.KHOA_DAO_TAO(MaKhoaDT VARCHAR(20) PRIMARY KEY,TenKhoaDT NVARCHAR(100) NOT NULL,NamBatDau INT NULL,NamKetThuc INT NULL,CHECK(NamKetThuc IS NULL OR NamBatDau IS NULL OR NamKetThuc>=NamBatDau));
IF OBJECT_ID(N'core.LOP_HOC',N'U') IS NULL CREATE TABLE core.LOP_HOC(MaLop VARCHAR(30) PRIMARY KEY,TenLop NVARCHAR(120) NOT NULL,MaDonVi VARCHAR(30) NOT NULL,MaKhoaDT VARCHAR(20) NOT NULL,HeDaoTao NVARCHAR(100) NOT NULL,QuanSoTheoPhieu INT NULL,FOREIGN KEY(MaDonVi) REFERENCES core.DON_VI(MaDonVi),FOREIGN KEY(MaKhoaDT) REFERENCES core.KHOA_DAO_TAO(MaKhoaDT));
IF OBJECT_ID(N'core.NGUOI',N'U') IS NULL CREATE TABLE core.NGUOI(MaNguoi VARCHAR(30) PRIMARY KEY,HoTen NVARCHAR(120) NOT NULL,NgaySinh DATE NULL,GioiTinh NVARCHAR(10) NULL,QueQuan NVARCHAR(200) NULL,SoDienThoai VARCHAR(15) NULL,Email VARCHAR(150) NULL,NguonDuLieu NVARCHAR(200) NULL,TrangThaiXacMinh VARCHAR(20) NOT NULL DEFAULT 'CHUA_XAC_MINH',CHECK(TrangThaiXacMinh IN('CHUA_XAC_MINH','DA_XAC_MINH')));
IF NOT EXISTS(SELECT 1 FROM sys.indexes WHERE name='UX_NGUOI_EMAIL_CO_GIA_TRI' AND object_id=OBJECT_ID('core.NGUOI')) CREATE UNIQUE INDEX UX_NGUOI_EMAIL_CO_GIA_TRI ON core.NGUOI(Email) WHERE Email IS NOT NULL;
IF OBJECT_ID(N'core.[USER]',N'U') IS NULL CREATE TABLE core.[USER](MaUser VARCHAR(40) PRIMARY KEY,TenDangNhap VARCHAR(60) NOT NULL UNIQUE,MatKhauHash VARCHAR(255) NULL,TrangThai VARCHAR(20) NOT NULL,MaNguoi VARCHAR(30) NOT NULL UNIQUE,FOREIGN KEY(MaNguoi) REFERENCES core.NGUOI(MaNguoi),CHECK(TrangThai IN('CHO_KICH_HOAT','HOAT_DONG','KHOA')));
IF OBJECT_ID(N'core.ROLE',N'U') IS NULL CREATE TABLE core.ROLE(MaRole VARCHAR(20) PRIMARY KEY,TenRole NVARCHAR(80) NOT NULL UNIQUE,MoTa NVARCHAR(300) NULL);
IF OBJECT_ID(N'core.PERMISSION',N'U') IS NULL CREATE TABLE core.PERMISSION(MaPermission VARCHAR(50) PRIMARY KEY,TenPermission NVARCHAR(120) NOT NULL,MoTa NVARCHAR(300) NULL);
IF OBJECT_ID(N'core.USER_ROLE',N'U') IS NULL CREATE TABLE core.USER_ROLE(MaUser VARCHAR(40),MaRole VARCHAR(20),PRIMARY KEY(MaUser,MaRole),FOREIGN KEY(MaUser) REFERENCES core.[USER](MaUser),FOREIGN KEY(MaRole) REFERENCES core.ROLE(MaRole));
IF OBJECT_ID(N'core.ROLE_PERMISSION',N'U') IS NULL CREATE TABLE core.ROLE_PERMISSION(MaRole VARCHAR(20),MaPermission VARCHAR(50),PRIMARY KEY(MaRole,MaPermission),FOREIGN KEY(MaRole) REFERENCES core.ROLE(MaRole),FOREIGN KEY(MaPermission) REFERENCES core.PERMISSION(MaPermission));
IF OBJECT_ID(N'core.NGANH',N'U') IS NULL CREATE TABLE core.NGANH(MaNganh VARCHAR(20) PRIMARY KEY,TenNganh NVARCHAR(120) NOT NULL);
IF OBJECT_ID(N'core.CHUYEN_NGANH',N'U') IS NULL CREATE TABLE core.CHUYEN_NGANH(MaChuyenNganh VARCHAR(20) PRIMARY KEY,TenChuyenNganh NVARCHAR(120) NOT NULL,MaNganh VARCHAR(20) NOT NULL FOREIGN KEY REFERENCES core.NGANH(MaNganh));
IF OBJECT_ID(N'core.CAP_BAC',N'U') IS NULL CREATE TABLE core.CAP_BAC(MaCapBac VARCHAR(20) PRIMARY KEY,TenCapBac NVARCHAR(60) NOT NULL,ThuTu INT NOT NULL);
IF OBJECT_ID(N'core.CHUC_VU',N'U') IS NULL CREATE TABLE core.CHUC_VU(MaChucVu VARCHAR(20) PRIMARY KEY,TenChucVu NVARCHAR(100) NOT NULL,MoTa NVARCHAR(300) NULL);
IF OBJECT_ID(N'core.HOC_VIEN',N'U') IS NULL CREATE TABLE core.HOC_VIEN(MaHV VARCHAR(30) PRIMARY KEY,MaNguoi VARCHAR(30) NOT NULL UNIQUE,MaLop VARCHAR(30) NOT NULL,MaChuyenNganh VARCHAR(20) NOT NULL,MaCapBac VARCHAR(20) NOT NULL,MaChucVu VARCHAR(20) NOT NULL,NgayNhapHoc DATE NULL,TrangThai VARCHAR(20) NOT NULL,FOREIGN KEY(MaNguoi) REFERENCES core.NGUOI(MaNguoi),FOREIGN KEY(MaLop) REFERENCES core.LOP_HOC(MaLop),FOREIGN KEY(MaChuyenNganh) REFERENCES core.CHUYEN_NGANH(MaChuyenNganh),FOREIGN KEY(MaCapBac) REFERENCES core.CAP_BAC(MaCapBac),FOREIGN KEY(MaChucVu) REFERENCES core.CHUC_VU(MaChucVu));
IF OBJECT_ID(N'core.BO_MON',N'U') IS NULL CREATE TABLE core.BO_MON(MaBoMon VARCHAR(30) PRIMARY KEY,TenBoMon NVARCHAR(200) NOT NULL,MaDonVi VARCHAR(30) NOT NULL FOREIGN KEY REFERENCES core.DON_VI(MaDonVi));
IF OBJECT_ID(N'core.GIANG_VIEN',N'U') IS NULL CREATE TABLE core.GIANG_VIEN(MaGV VARCHAR(30) PRIMARY KEY,MaNguoi VARCHAR(30) NOT NULL UNIQUE,MaBoMon VARCHAR(30) NOT NULL,QuanHam NVARCHAR(40) NULL,HocVi NVARCHAR(60) NULL,ChucVuNguon NVARCHAR(150) NULL,ChuyenMon NVARCHAR(150) NULL,TrangThai VARCHAR(20) NOT NULL,FOREIGN KEY(MaNguoi) REFERENCES core.NGUOI(MaNguoi),FOREIGN KEY(MaBoMon) REFERENCES core.BO_MON(MaBoMon));
IF OBJECT_ID(N'core.MON_HOC',N'U') IS NULL CREATE TABLE core.MON_HOC(MaMonHoc VARCHAR(30) PRIMARY KEY,TenMonHoc NVARCHAR(150) NULL,SoTinChi TINYINT NULL,SoTiet INT NULL,LoaiMonHoc NVARCHAR(50) NULL,TrangThaiNguon VARCHAR(30) NOT NULL,CHECK(SoTinChi IS NULL OR SoTinChi>0),CHECK(SoTiet IS NULL OR SoTiet>0));
IF OBJECT_ID(N'core.HOC_KY',N'U') IS NULL CREATE TABLE core.HOC_KY(MaHocKy VARCHAR(30) PRIMARY KEY,TenHocKy NVARCHAR(100) NULL,NamHoc VARCHAR(20) NULL,NgayBatDau DATE NULL,NgayKetThuc DATE NULL,TrangThaiNguon VARCHAR(30) NOT NULL,CHECK(NgayKetThuc IS NULL OR NgayBatDau IS NULL OR NgayKetThuc>=NgayBatDau));
IF OBJECT_ID(N'core.PHAN_CONG',N'U') IS NULL CREATE TABLE core.PHAN_CONG(MaPhanCong VARCHAR(30) PRIMARY KEY,MaGV VARCHAR(30) NULL,MaMonHoc VARCHAR(30) NOT NULL,MaLop VARCHAR(30) NOT NULL,MaHocKy VARCHAR(30) NOT NULL,NhomHoc VARCHAR(30) NOT NULL,SoTiet INT NULL,TrangThai VARCHAR(30) NOT NULL,UNIQUE(MaMonHoc,MaLop,MaHocKy,NhomHoc),FOREIGN KEY(MaGV) REFERENCES core.GIANG_VIEN(MaGV),FOREIGN KEY(MaMonHoc) REFERENCES core.MON_HOC(MaMonHoc),FOREIGN KEY(MaLop) REFERENCES core.LOP_HOC(MaLop),FOREIGN KEY(MaHocKy) REFERENCES core.HOC_KY(MaHocKy));
IF OBJECT_ID(N'core.LOAI_DIEM',N'U') IS NULL CREATE TABLE core.LOAI_DIEM(MaLoaiDiem VARCHAR(20) PRIMARY KEY,TenLoaiDiem NVARCHAR(60) NOT NULL,TrongSo DECIMAL(4,2) NOT NULL CHECK(TrongSo BETWEEN 0 AND 1));
IF OBJECT_ID(N'core.KET_QUA_HOC_TAP',N'U') IS NULL CREATE TABLE core.KET_QUA_HOC_TAP(MaKQ VARCHAR(40) PRIMARY KEY,MaHV VARCHAR(30) NOT NULL,MaPhanCong VARCHAR(30) NOT NULL,DiemTongKet DECIMAL(3,1) NULL,XepLoai NVARCHAR(30) NULL,TrangThai VARCHAR(20) NOT NULL,UNIQUE(MaHV,MaPhanCong),FOREIGN KEY(MaHV) REFERENCES core.HOC_VIEN(MaHV),FOREIGN KEY(MaPhanCong) REFERENCES core.PHAN_CONG(MaPhanCong),CHECK(DiemTongKet IS NULL OR DiemTongKet BETWEEN 0 AND 10));
IF OBJECT_ID(N'core.DOT_THI',N'U') IS NULL CREATE TABLE core.DOT_THI(MaDotThi VARCHAR(30) PRIMARY KEY,MaPhanCong VARCHAR(30) NOT NULL,TenDotThi NVARCHAR(120) NOT NULL,LoaiDotThi VARCHAR(20) NOT NULL,NgayThi DATE NULL,FOREIGN KEY(MaPhanCong) REFERENCES core.PHAN_CONG(MaPhanCong),CHECK(LoaiDotThi IN('LAN_1','THI_LAI','THI_PHU')));
IF OBJECT_ID(N'core.DIEM',N'U') IS NULL CREATE TABLE core.DIEM(MaDiem VARCHAR(50) PRIMARY KEY,MaKQ VARCHAR(40) NOT NULL,MaLoaiDiem VARCHAR(20) NOT NULL,MaDotThi VARCHAR(30) NULL,Diem DECIMAL(3,1) NULL,NgayNhap DATETIME2 NULL,MaNguoiNhap VARCHAR(30) NULL,TrangThaiDiem VARCHAR(20) NOT NULL,MaNguoiDuyet VARCHAR(30) NULL,NgayDuyet DATETIME2 NULL,UNIQUE(MaKQ,MaLoaiDiem,MaDotThi),FOREIGN KEY(MaKQ) REFERENCES core.KET_QUA_HOC_TAP(MaKQ),FOREIGN KEY(MaLoaiDiem) REFERENCES core.LOAI_DIEM(MaLoaiDiem),FOREIGN KEY(MaDotThi) REFERENCES core.DOT_THI(MaDotThi),FOREIGN KEY(MaNguoiNhap) REFERENCES core.NGUOI(MaNguoi),FOREIGN KEY(MaNguoiDuyet) REFERENCES core.NGUOI(MaNguoi),CHECK(Diem IS NULL OR Diem BETWEEN 0 AND 10),CHECK(TrangThaiDiem IN('CHO_NHAP','NHAP','DA_DUYET','DA_KHOA')));
GO

BEGIN TRANSACTION;
IF COL_LENGTH('core.DON_VI','TinhTrangDuLieu') IS NULL ALTER TABLE core.DON_VI ADD TinhTrangDuLieu VARCHAR(30) NOT NULL CONSTRAINT DF_CORE_DON_VI_TTDL DEFAULT 'DA_TRUY_HOI';
MERGE core.DON_VI t USING(SELECT MaDonVi,TenDonVi,LoaiDonVi,MaDonViCha,NgayThanhLap,SoQuyetDinh,TinhTrangDuLieu FROM dbo.DON_VI)s ON t.MaDonVi=s.MaDonVi WHEN MATCHED THEN UPDATE SET TenDonVi=s.TenDonVi,LoaiDonVi=s.LoaiDonVi,MaDonViCha=s.MaDonViCha,NgayThanhLap=s.NgayThanhLap,SoQuyetDinh=s.SoQuyetDinh,TinhTrangDuLieu=s.TinhTrangDuLieu WHEN NOT MATCHED THEN INSERT(MaDonVi,TenDonVi,LoaiDonVi,MaDonViCha,NgayThanhLap,SoQuyetDinh,TinhTrangDuLieu) VALUES(s.MaDonVi,s.TenDonVi,s.LoaiDonVi,s.MaDonViCha,s.NgayThanhLap,s.SoQuyetDinh,s.TinhTrangDuLieu);
MERGE core.KHOA_DAO_TAO t USING(VALUES('K60',N'Khóa 60 Đại học Quân sự',NULL,NULL))s(Ma,Ten,BD,KT) ON t.MaKhoaDT=s.Ma WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.Ten,s.BD,s.KT);
MERGE core.LOP_HOC t USING(VALUES('CNTT2_K60',N'Lớp Công nghệ thông tin 2 – Khóa 60','VIEN_CNTT_TT','K60',N'Đại học – Quân sự',24))s(Ma,Ten,DV,Khoa,He,QS) ON t.MaLop=s.Ma WHEN MATCHED THEN UPDATE SET QuanSoTheoPhieu=s.QS WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.Ten,s.DV,s.Khoa,s.He,s.QS);
MERGE core.NGANH t USING(VALUES('NG_CNTT',N'Công nghệ thông tin'))s(Ma,Ten)ON t.MaNganh=s.Ma WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.Ten);
MERGE core.CHUYEN_NGANH t USING(VALUES('CN_CNTT2',N'Công nghệ thông tin 2','NG_CNTT'))s(Ma,Ten,Nganh)ON t.MaChuyenNganh=s.Ma WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.Ten,s.Nganh);
MERGE core.CAP_BAC t USING(VALUES('CB_CHUA_CAP_NHAT',N'Chưa có trong phiếu nguồn',0))s(Ma,Ten,TT)ON t.MaCapBac=s.Ma WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.Ten,s.TT);
MERGE core.CHUC_VU t USING(VALUES('CV_HOC_VIEN',N'Học viên',N'Phiếu nguồn không cung cấp chức vụ lớp'))s(Ma,Ten,MT)ON t.MaChucVu=s.Ma WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.Ten,s.MT);
MERGE core.NGUOI t USING(SELECT 'NG_'+MaHocVien MaNguoi,HoTen,NgaySinh,CAST(NULL AS VARCHAR(150)) Email,N'Phiếu điểm CNTT2/c160 do người dùng cung cấp' Nguon,'CHUA_XAC_MINH' XacMinh FROM dbo.HOC_VIEN UNION ALL SELECT 'NG_'+MaCanBo,HoTen,NgaySinh,EmailNguon,COALESCE(NguonDuLieu,N'Danh sách cán bộ tham khảo do người dùng cung cấp'),'DA_XAC_MINH' FROM dbo.CAN_BO)s ON t.MaNguoi=s.MaNguoi WHEN MATCHED THEN UPDATE SET HoTen=s.HoTen,NgaySinh=s.NgaySinh,Email=s.Email,NguonDuLieu=s.Nguon,TrangThaiXacMinh=s.XacMinh WHEN NOT MATCHED THEN INSERT(MaNguoi,HoTen,NgaySinh,Email,NguonDuLieu,TrangThaiXacMinh)VALUES(s.MaNguoi,s.HoTen,s.NgaySinh,s.Email,s.Nguon,s.XacMinh);
MERGE core.HOC_VIEN t USING(SELECT MaHocVien,'NG_'+MaHocVien MaNguoi,MaLop FROM dbo.HOC_VIEN)s ON t.MaHV=s.MaHocVien WHEN NOT MATCHED THEN INSERT VALUES(s.MaHocVien,s.MaNguoi,s.MaLop,'CN_CNTT2','CB_CHUA_CAP_NHAT','CV_HOC_VIEN',NULL,'DANG_HOC');
MERGE core.BO_MON t USING(SELECT MaDonVi,TenDonVi FROM dbo.DON_VI WHERE LoaiDonVi IN('BO_MON','TRUNG_TAM'))s ON t.MaBoMon=s.MaDonVi WHEN MATCHED THEN UPDATE SET TenBoMon=s.TenDonVi WHEN NOT MATCHED THEN INSERT VALUES(s.MaDonVi,s.TenDonVi,s.MaDonVi);
;WITH C AS(SELECT cb.*,pc.MaDonVi,pc.ChucVu,ROW_NUMBER()OVER(PARTITION BY cb.MaCanBo ORDER BY pc.LaChucVuChinh DESC,pc.MaDonVi)rn FROM dbo.CAN_BO cb JOIN dbo.PHAN_CONG_CAN_BO pc ON pc.MaCanBo=cb.MaCanBo WHERE pc.MaDonVi<>'VIEN_CNTT_TT' AND (cb.HocHamHocVi LIKE N'%GV%' OR cb.HocHamHocVi LIKE N'%PGS%' OR cb.HocHamHocVi LIKE N'%TG.%' OR pc.ChucVu IN(N'Giảng viên',N'Trợ giảng'))) MERGE core.GIANG_VIEN t USING(SELECT*FROM C WHERE rn=1)s ON t.MaGV='GV_'+s.MaCanBo WHEN MATCHED THEN UPDATE SET QuanHam=s.QuanHam,HocVi=s.HocHamHocVi,ChucVuNguon=s.ChucVu WHEN NOT MATCHED THEN INSERT VALUES('GV_'+s.MaCanBo,'NG_'+s.MaCanBo,s.MaDonVi,s.QuanHam,s.HocHamHocVi,s.ChucVu,N'Theo đơn vị trong Kỷ yếu 2026','DANG_CONG_TAC');
MERGE core.ROLE t USING(VALUES('ROLE_HV',N'Học viên',N'Xem điểm cá nhân'),('ROLE_GV',N'Giảng viên',N'Nhập điểm lớp được phân công'),('ROLE_DT',N'Phòng Đào tạo',N'Duyệt và quản lý điểm'),('ROLE_CH',N'Chỉ huy',N'Xem báo cáo toàn Học viện'))s(Ma,Ten,MT)ON t.MaRole=s.Ma WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.Ten,s.MT);
MERGE core.PERMISSION t USING(VALUES('XEM_DIEM_CA_NHAN',N'Xem điểm cá nhân'),('NHAP_DIEM_CC',N'Nhập điểm chuyên cần'),('NHAP_DIEM_TX',N'Nhập điểm thường xuyên'),('NHAP_DIEM_CK',N'Nhập điểm cuối kỳ'),('DUYET_DIEM',N'Duyệt điểm'),('KHOA_DIEM',N'Khóa điểm'),('MO_KHOA_DIEM',N'Mở khóa điểm'),('DIEU_CHINH_DIEM',N'Điều chỉnh điểm'),('XEM_BAO_CAO_TOAN_HV',N'Xem báo cáo toàn Học viện'))s(Ma,Ten)ON t.MaPermission=s.Ma WHEN NOT MATCHED THEN INSERT(MaPermission,TenPermission)VALUES(s.Ma,s.Ten);
MERGE core.ROLE_PERMISSION t USING(VALUES('ROLE_HV','XEM_DIEM_CA_NHAN'),('ROLE_GV','NHAP_DIEM_CC'),('ROLE_GV','NHAP_DIEM_TX'),('ROLE_GV','NHAP_DIEM_CK'),('ROLE_DT','DUYET_DIEM'),('ROLE_DT','KHOA_DIEM'),('ROLE_DT','MO_KHOA_DIEM'),('ROLE_DT','DIEU_CHINH_DIEM'),('ROLE_CH','XEM_BAO_CAO_TOAN_HV'))s(R,Q)ON t.MaRole=s.R AND t.MaPermission=s.Q WHEN NOT MATCHED THEN INSERT VALUES(s.R,s.Q);
MERGE core.[USER] t USING(SELECT MaGV,MaNguoi FROM core.GIANG_VIEN)s ON t.MaNguoi=s.MaNguoi WHEN NOT MATCHED THEN INSERT VALUES('USR_'+s.MaGV,LOWER(REPLACE(s.MaGV,'GV_','gv.')),NULL,'CHO_KICH_HOAT',s.MaNguoi);
MERGE core.USER_ROLE t USING(SELECT MaUser FROM core.[USER])s ON t.MaUser=s.MaUser AND t.MaRole='ROLE_GV' WHEN NOT MATCHED THEN INSERT VALUES(s.MaUser,'ROLE_GV');
MERGE core.MON_HOC t USING(VALUES('MH_CNTT2_C160',NULL,NULL,NULL,NULL,'CHO_BO_SUNG_TU_PHIEU'))s(Ma,Ten,TC,Tiet,Loai,TT)ON t.MaMonHoc=s.Ma WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.Ten,s.TC,s.Tiet,s.Loai,s.TT);
MERGE core.HOC_KY t USING(VALUES('HK_CNTT2_C160',NULL,NULL,NULL,NULL,'CHO_BO_SUNG_TU_PHIEU'))s(Ma,Ten,Nam,BD,KT,TT)ON t.MaHocKy=s.Ma WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.Ten,s.Nam,s.BD,s.KT,s.TT);
MERGE core.PHAN_CONG t USING(VALUES('PC_CNTT2_C160',NULL,'MH_CNTT2_C160','CNTT2_K60','HK_CNTT2_C160','CNTT2/c160',NULL,'CHO_BO_SUNG_GIANG_VIEN'))s(Ma,GV,MH,Lop,HK,Nhom,Tiet,TT)ON t.MaPhanCong=s.Ma WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.GV,s.MH,s.Lop,s.HK,s.Nhom,s.Tiet,s.TT);
MERGE core.LOAI_DIEM t USING(VALUES('LD_CC',N'Chuyên cần',0.10),('LD_TX',N'Thường xuyên',0.30),('LD_CK',N'Cuối kỳ',0.60))s(Ma,Ten,TS)ON t.MaLoaiDiem=s.Ma WHEN MATCHED THEN UPDATE SET TrongSo=s.TS WHEN NOT MATCHED THEN INSERT VALUES(s.Ma,s.Ten,s.TS);
MERGE core.KET_QUA_HOC_TAP t USING(SELECT 'KQ_'+MaHV MaKQ,MaHV FROM core.HOC_VIEN WHERE MaLop='CNTT2_K60')s ON t.MaKQ=s.MaKQ WHEN NOT MATCHED THEN INSERT VALUES(s.MaKQ,s.MaHV,'PC_CNTT2_C160',NULL,NULL,'CHO_BO_SUNG');
/* Không tạo trước dòng DIEM rỗng. Bản ghi DIEM chỉ sinh khi giảng viên thực sự nhập điểm. */
COMMIT;
GO

IF(SELECT COUNT(*)FROM core.HOC_VIEN WHERE MaLop='CNTT2_K60')<>24 THROW 51001,N'Phải có đúng 24 học viên CNTT2.',1;
IF ABS((SELECT SUM(TrongSo)FROM core.LOAI_DIEM)-1)>0.001 THROW 51002,N'Tổng trọng số phải bằng 1.',1;
IF EXISTS(SELECT MaNguoi FROM core.[USER] GROUP BY MaNguoi HAVING COUNT(*)>1) THROW 51003,N'Mỗi giảng viên chỉ có một tài khoản.',1;
GO
CREATE OR ALTER VIEW core.vw_BANG_DIEM_CNTT2_C160 AS SELECT ROW_NUMBER()OVER(ORDER BY hv.MaHV)TT,n.HoTen,n.NgaySinh,l.TenLop,MAX(CASE WHEN d.MaLoaiDiem='LD_CC'THEN d.Diem END)DiemChuyenCan,MAX(CASE WHEN d.MaLoaiDiem='LD_TX'THEN d.Diem END)DiemThuongXuyen,MAX(CASE WHEN d.MaLoaiDiem='LD_CK'THEN d.Diem END)DiemThi,k.DiemTongKet,k.XepLoai,k.TrangThai FROM core.KET_QUA_HOC_TAP k JOIN core.HOC_VIEN hv ON hv.MaHV=k.MaHV JOIN core.NGUOI n ON n.MaNguoi=hv.MaNguoi JOIN core.LOP_HOC l ON l.MaLop=hv.MaLop LEFT JOIN core.DIEM d ON d.MaKQ=k.MaKQ WHERE k.MaPhanCong='PC_CNTT2_C160' GROUP BY hv.MaHV,n.HoTen,n.NgaySinh,l.TenLop,k.DiemTongKet,k.XepLoai,k.TrangThai;
GO
SELECT * FROM core.vw_BANG_DIEM_CNTT2_C160 ORDER BY TT;
GO

/* Nhat ky la bang mo rong phuc vu truy vet, khong lam thay doi bo 23 bang loi. */
IF OBJECT_ID(N'core.NHAT_KY_DIEM',N'U') IS NULL CREATE TABLE core.NHAT_KY_DIEM(
 MaNhatKy BIGINT IDENTITY(1,1) PRIMARY KEY,MaDiem VARCHAR(50) NOT NULL,
 DiemCu DECIMAL(3,1) NULL,DiemMoi DECIMAL(3,1) NULL,
 TrangThaiCu VARCHAR(20) NULL,TrangThaiMoi VARCHAR(20) NULL,
 MaNguoiThucHien VARCHAR(30) NULL,ThoiDiem DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
 LyDo NVARCHAR(500) NULL);
GO
CREATE OR ALTER TRIGGER core.trg_DIEM_LuuLichSu ON core.DIEM AFTER UPDATE AS
BEGIN
 SET NOCOUNT ON;
 INSERT core.NHAT_KY_DIEM(MaDiem,DiemCu,DiemMoi,TrangThaiCu,TrangThaiMoi,MaNguoiThucHien,LyDo)
 SELECT i.MaDiem,d.Diem,i.Diem,d.TrangThaiDiem,i.TrangThaiDiem,
        COALESCE(i.MaNguoiDuyet,i.MaNguoiNhap),N'Thay đổi điểm hoặc trạng thái điểm'
 FROM inserted i JOIN deleted d ON d.MaDiem=i.MaDiem
 WHERE ISNULL(i.Diem,-1)<>ISNULL(d.Diem,-1) OR i.TrangThaiDiem<>d.TrangThaiDiem;
END;
GO

/* Giang vien chi nhap CC/TX/CK cho lop duoc phan cong va diem chua khoa. */
CREATE OR ALTER PROCEDURE core.sp_NhapDiem
 @MaUser VARCHAR(40),@MaKQ VARCHAR(40),@MaLoaiDiem VARCHAR(20),@Diem DECIMAL(3,1),@MaDotThi VARCHAR(30)=NULL
AS
BEGIN
 SET NOCOUNT ON; SET XACT_ABORT ON;
 IF @Diem NOT BETWEEN 0 AND 10 THROW 52001,N'Điểm phải trong khoảng 0–10.',1;
 DECLARE @MaNguoi VARCHAR(30),@MaGV VARCHAR(30),@MaPhanCong VARCHAR(30);
 SELECT @MaNguoi=MaNguoi FROM core.[USER] WHERE MaUser=@MaUser AND TrangThai='HOAT_DONG';
 SELECT @MaGV=MaGV FROM core.GIANG_VIEN WHERE MaNguoi=@MaNguoi;
 SELECT @MaPhanCong=MaPhanCong FROM core.KET_QUA_HOC_TAP WHERE MaKQ=@MaKQ;
 IF NOT EXISTS(SELECT 1 FROM core.USER_ROLE WHERE MaUser=@MaUser AND MaRole='ROLE_GV')
    OR NOT EXISTS(SELECT 1 FROM core.PHAN_CONG WHERE MaPhanCong=@MaPhanCong AND MaGV=@MaGV AND TrangThai='HIEU_LUC')
    THROW 52002,N'Giảng viên không được phân công lớp học phần này.',1;
 IF EXISTS(SELECT 1 FROM core.DIEM WHERE MaKQ=@MaKQ AND MaLoaiDiem=@MaLoaiDiem AND TrangThaiDiem='DA_KHOA')
    THROW 52003,N'Điểm đã khóa; chỉ Phòng Đào tạo được mở khóa.',1;
 MERGE core.DIEM AS target
 USING(SELECT @MaKQ MaKQ,@MaLoaiDiem MaLoaiDiem,@MaDotThi MaDotThi) AS source
 ON target.MaKQ=source.MaKQ AND target.MaLoaiDiem=source.MaLoaiDiem
    AND ISNULL(target.MaDotThi,'')=ISNULL(source.MaDotThi,'')
 WHEN MATCHED THEN UPDATE SET Diem=@Diem,NgayNhap=SYSDATETIME(),MaNguoiNhap=@MaNguoi,TrangThaiDiem='NHAP'
 WHEN NOT MATCHED THEN INSERT(MaDiem,MaKQ,MaLoaiDiem,MaDotThi,Diem,NgayNhap,MaNguoiNhap,TrangThaiDiem)
 VALUES(CONCAT('D_',@MaKQ,'_',@MaLoaiDiem),@MaKQ,@MaLoaiDiem,@MaDotThi,@Diem,SYSDATETIME(),@MaNguoi,'NHAP');
END;
GO

/* Phong Dao tao doc quyen duyet, khoa hoac mo khoa diem. */
CREATE OR ALTER PROCEDURE core.sp_QuanLyTrangThaiDiem
 @MaUser VARCHAR(40),@MaDiem VARCHAR(50),@TrangThaiMoi VARCHAR(20)
AS
BEGIN
 SET NOCOUNT ON;
 IF @TrangThaiMoi NOT IN('DA_DUYET','DA_KHOA','NHAP') THROW 52004,N'Trạng thái không hợp lệ.',1;
 IF NOT EXISTS(SELECT 1 FROM core.USER_ROLE WHERE MaUser=@MaUser AND MaRole='ROLE_DT')
    THROW 52005,N'Chỉ Phòng Đào tạo có quyền duyệt, khóa hoặc mở khóa điểm.',1;
 DECLARE @MaNguoi VARCHAR(30); SELECT @MaNguoi=MaNguoi FROM core.[USER] WHERE MaUser=@MaUser AND TrangThai='HOAT_DONG';
 UPDATE core.DIEM SET TrangThaiDiem=@TrangThaiMoi,MaNguoiDuyet=@MaNguoi,NgayDuyet=SYSDATETIME() WHERE MaDiem=@MaDiem;
END;
GO

/* Tong ket dung trong so 10%-30%-60%; NULL neu con thieu bat ky dau diem nao. */
CREATE OR ALTER PROCEDURE core.sp_TinhDiemTongKet @MaKQ VARCHAR(40)
AS
BEGIN
 SET NOCOUNT ON;
 DECLARE @Du INT=(SELECT COUNT(*) FROM core.DIEM WHERE MaKQ=@MaKQ AND Diem IS NOT NULL);
 IF @Du<3 BEGIN UPDATE core.KET_QUA_HOC_TAP SET DiemTongKet=NULL,XepLoai=NULL,TrangThai='DANG_HOC' WHERE MaKQ=@MaKQ; RETURN; END;
 DECLARE @Tong DECIMAL(3,1)=(SELECT ROUND(SUM(d.Diem*l.TrongSo),1) FROM core.DIEM d JOIN core.LOAI_DIEM l ON l.MaLoaiDiem=d.MaLoaiDiem WHERE d.MaKQ=@MaKQ);
 UPDATE core.KET_QUA_HOC_TAP SET DiemTongKet=@Tong,
 XepLoai=CASE WHEN @Tong>=8.5 THEN N'Giỏi' WHEN @Tong>=7 THEN N'Khá' WHEN @Tong>=5.5 THEN N'Trung bình' WHEN @Tong>=4 THEN N'Yếu' ELSE N'Kém' END,
 TrangThai=CASE WHEN @Tong>=4 THEN 'HOAN_THANH' ELSE 'HOC_LAI' END WHERE MaKQ=@MaKQ;
END;
GO
