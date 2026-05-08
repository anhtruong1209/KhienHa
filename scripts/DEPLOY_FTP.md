# Deploy KhienHaFull qua FTP

Remote hiện tại theo FileZilla:

```text
/home/khienha/htdocs
```

Folder này đã chứa `app`, `bootstrap`, `config`, `public`, `vendor`, `.env`, nên script sẽ upload **nội dung bên trong** `KhienHaFull` vào đó.

## Cấu hình một lần

File local `.env.deploy.local` nằm ở repo root và bị `.gitignore`.

```env
FTP_HOST=103.162.30.89
FTP_PORT=21
FTP_USER=khienha
FTP_PASSWORD=dien_mat_khau_ftp_o_day
FTP_REMOTE_DIR=/home/khienha/htdocs
FTP_SSL=false
DEPLOY_PUBLIC_URL=https://khienha.vn:8443
```

Nếu để trống `FTP_PASSWORD`, script sẽ hỏi mật khẩu khi chạy.

## Chạy deploy

Từ repo root:

```powershell
.\deploy-khienhafull-ftp-fast.bat
```

Script sẽ:

- build FE static vào `KhienHaFull/public`
- nén `KhienHaFull` thành 1 file ZIP
- upload ZIP và một file PHP tạm để giải nén trên hosting
- không ghi đè `.env` production mặc định
- bỏ qua log/cache/session runtime trong `storage`

## Chỉ upload, không build lại

```powershell
.\deploy-khienhafull-ftp-fast.bat -SkipBuild
```

## Xem trước cấu hình upload

```powershell
.\deploy-khienhafull-ftp-fast.bat -SkipBuild -DryRun
```

## Upload từng file trực tiếp

Chỉ dùng khi hosting không bật PHP `ZipArchive`:

```powershell
.\deploy-khienhafull-ftp.bat
```
