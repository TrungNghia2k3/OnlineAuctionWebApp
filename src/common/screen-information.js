const screenInformation = {
  common: {
    labels: {
      tenNhanSu: 'Tên nhân sự',
      soThuTu: 'Số thứ tự',
      ghiChu: 'Ghi chú',
      maPhong: 'Mã phòng',
      daKichHoat: 'Đã kích hoạt',
      kichHoat: 'Kích hoạt',
      tenNguoiDung: 'Tên người dùng',
      matKhau: 'Mật khẩu',
      ghiNho: 'Ghi nhớ đăng nhập',
      ngayTao: 'Ngày Tạo',
      capQuyen: 'Cấp Quyền',
      tenDonViTinh: 'Tên đơn vị tính',
    },
    buttons: {
      add: {
        text: 'Thêm mới',
        iconPath: '/images/icon-buttons/add.png',
      },
      save: {
        text: 'Lưu thông tin',
        iconPath: '/images/icon-buttons/save.png',
      },
      clean: {
        text: 'Làm mới',
        iconPath: '/images/icon-buttons/clean.png',
      },
      edit: {
        text: 'Chỉnh sửa',
        iconPath: '/images/icon-buttons/edit.png',
      },
      delete: {
        text: 'Xóa',
        iconPath: '/images/icon-buttons/delete.png',
      },
      permission: {
        text: 'Cấp quyền',
        iconPath: '/images/icon-buttons/permission.png',
      },
      close: {
        text: 'Đóng',
        iconPath: '/images/icon-buttons/close.png',
      },
    },
  },
  danhMuc: {
    nhanSu: {
      headerIcon: '/images/iconnav/nhan_su.png',
      headerTitle: 'Danh Mục Nhân Sự',
    },
    donViTinh: {
      headerIcon: '/images/iconnav/don_vi_tinh.png',
      headerTitle: 'Danh Mục Đơn Vị Tính',
    },
  },
  hethong: {
    nguoiDung: {
      danhNhap: {
        buttons: {
          login: {
            text: 'Đăng nhập',
            iconPath: '/images/icon-buttons/login.png',
          },
          logout: {
            text: 'Đăng xuất',
            iconPath: '/images/icon-buttons/logout.png',
          },
        },
      },
      quanLy: {
        headerIcon: '/images/iconnav/quan_ly_nguoi_dung.png',
        headerTitle: 'Quản lý Người Dùng',
        phanQuyen: {
          headerIcon: '/images/icon-buttons/permission.png',
          headerTitle: 'Danh sách chức năng',
        },
      },
      doiMatKhau: {
        headerIcon: '/images/iconnav/thay_doi_mat_khau.png',
        headerTitle: 'Thay đổi mật khẩu',
        matKhauCu: 'Mật khẩu cũ',
        matKhauMoi: 'Mật khẩu mới',
        xacNhanMatKhauMoi: 'Xác nhận mật khẩu mới',
      },
    },
  },
}

export default screenInformation
