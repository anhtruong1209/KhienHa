# Khien Ha Backend

## Ban giao cho ServBay

Frontend da duoc build san thanh file tinh trong `public/`. Khi gui thu muc `KhienHaFull` cho nguoi khac, ho chi can:

1. Copy `.env.quickstart.example` thanh `.env`
2. Sua nhom `DB_*` trong `.env`
3. Double click `import-db.bat`
4. Tro `Website Root Directory` cua ServBay vao thu muc `public`

Tai khoan admin mac dinh:

```text
Email: admin@khienha.vn
Password: KhienHa@123456
```

## Cach import DB

File SQL hien tai nam tai:

```text
database/dumps/khienha-current.sql
```

Cach de nhat:

```text
Double click import-db.bat
```

Script nay se:

- doc `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` trong `.env`
- import file `database/dumps/khienha-current.sql`
- chay `php artisan optimize:clear`

Neu nguoi nhan dung ServBay mac dinh, `.env` co the de:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=khienha
DB_USERNAME=root
DB_PASSWORD=ServBay.dev
```

## Cau hinh ServBay

Trong ServBay:

- `Website Type`: `PHP`
- `Rewrite Rule`: `Laravel`
- `Website Root Directory`: `KhienHaFull/public`

Sau do vao domain da tao, vi du:

```text
https://khienha.host
```

## Neu muon chay bang artisan

```bash
cd KhienHaFull
setup.bat
```

Mac dinh `setup.bat` dung cho local backend va se mo server tai `http://127.0.0.1:8000`.
