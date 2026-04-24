<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use Illuminate\Database\Seeder;

class ContactMessageSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            [
                'name' => 'Nguyen Van Minh',
                'phone' => '0912345678',
                'email' => 'minh.nguyen@phudatmarine.vn',
                'company' => 'Phu Dat Marine',
                'message' => 'Can tu van bao gia dong moi tau dau 3.000 DWT va ke hoach trien khai trong quy III.',
                'status' => 'new',
                'notes' => 'Khach hang uu tien lich hen truc tiep trong tuan nay.',
            ],
            [
                'name' => 'Tran Thi Hoa',
                'phone' => '0988777666',
                'email' => 'hoa.tran@haiphonglogistics.vn',
                'company' => 'Hai Phong Logistics',
                'message' => 'Can kiem tra va sua chua he thong vo thep, son chong an mon cho doi sa lan van tai.',
                'status' => 'in_progress',
                'notes' => 'Da gui ho so ky thuat va anh hien trang qua email.',
            ],
            [
                'name' => 'Le Quoc Bao',
                'phone' => '0903555444',
                'email' => 'bao.le@vietship.com',
                'company' => 'Vietship Service',
                'message' => 'Muon lam viec ve kha nang dai tu may chinh va nang cap ket cau cho tau hang 9.000 DWT.',
                'status' => 'done',
                'notes' => 'Da hen lich khao sat nha may vao ngay mai.',
            ],
            [
                'name' => 'Pham Duc Thanh',
                'phone' => '0911122233',
                'email' => 'thanh.pham@halongmarine.vn',
                'company' => 'Ha Long Marine',
                'message' => 'Can lap phuong an sua chua boi duong dinh ky cho 2 tau keo va 1 sa lan bien trong thang toi.',
                'status' => 'new',
                'notes' => 'Dang cho lich dock va danh muc vat tu.',
            ],
            [
                'name' => 'Do Thi Lan',
                'phone' => '0935566778',
                'email' => 'lan.do@anbinhshipping.com',
                'company' => 'An Binh Shipping',
                'message' => 'Can bao gia thay vo thep, bo tri lai he thong ong va kiem tra dang kiem tau cho tau cho hang 6.500 DWT.',
                'status' => 'in_progress',
                'notes' => 'Can phan hoi truoc 17h de trinh ban giam doc.',
            ],
            [
                'name' => 'Bui Tuan Kiet',
                'phone' => '0909988776',
                'email' => 'kiet.bui@vietport.vn',
                'company' => 'Viet Port Logistics',
                'message' => 'Muon tham khao nang luc dong moi tau dich vu cang va he thong thiet bi nang ha hien co tai nha may.',
                'status' => 'done',
                'notes' => 'Da gui profile nang luc va bo anh nha may.',
            ],
            [
                'name' => 'Nguyen Hoai Nam',
                'phone' => '0868123456',
                'email' => 'nam.nguyen@phuongdongsea.vn',
                'company' => 'Phuong Dong Sea',
                'message' => 'Can ho tro danh gia tong the ket cau than tau sau mua bao va lap du toan sua chua.',
                'status' => 'new',
                'notes' => 'Khach hang de nghi lien he qua Zalo ngoai gio hanh chinh.',
            ],
            [
                'name' => 'Tran Quoc Huy',
                'phone' => '0942233445',
                'email' => 'huy.tran@vinacoastal.vn',
                'company' => 'Vina Coastal',
                'message' => 'Can tu van phuong an cai hoan boong, nang cap he thong cap dien va phong chay chua chay cho tau hang.',
                'status' => 'in_progress',
                'notes' => 'Da xac nhan lich khao sat hien truong trong tuan nay.',
            ],
            [
                'name' => 'Le Thu Trang',
                'phone' => '0904455667',
                'email' => 'trang.le@oceanbridge.vn',
                'company' => 'Ocean Bridge',
                'message' => 'De nghi bao gia dong moi sa lan bien 2.500 tan va tien do du kien giao tau.',
                'status' => 'done',
                'notes' => 'Khach hang da nhan bao gia so bo va hen hop truc tuyen.',
            ],
            [
                'name' => 'Vo Anh Tuan',
                'phone' => '0973344556',
                'email' => 'tuan.vo@haiphongdredging.vn',
                'company' => 'Hai Phong Dredging',
                'message' => 'Can sua chua he truc chan vit va can bang lai he thong dong luc cho tau cong trinh.',
                'status' => 'new',
                'notes' => 'Can phan loai muc do khan de bo tri trien.',
            ],
            [
                'name' => 'Dang Minh Duc',
                'phone' => '0917788990',
                'email' => 'duc.dang@sealink.com.vn',
                'company' => 'Sealink Vietnam',
                'message' => 'Muon tiep nhan danh muc du an dong moi tieu bieu va nang luc sua chua dong thoi nhieu tau.',
                'status' => 'in_progress',
                'notes' => 'Da gui ho so nang luc, dang cho phan hoi ky thuat.',
            ],
            [
                'name' => 'Hoang Gia Linh',
                'phone' => '0986655443',
                'email' => 'linh.hoang@dongbacfleet.vn',
                'company' => 'Dong Bac Fleet',
                'message' => 'De nghi len lich tham quan nha may va trao doi ve hop dong dai tu quy mo lon cho doi tau noi dia.',
                'status' => 'done',
                'notes' => 'Da chot lich tiep don va phan cong bo phan kinh doanh.',
            ],
        ];

        foreach ($messages as $message) {
            ContactMessage::query()->updateOrCreate(
                ['phone' => $message['phone']],
                $message
            );
        }
    }
}
