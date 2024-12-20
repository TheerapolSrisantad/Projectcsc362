const bookPrices = {
    "Bullet & Beast เล่ม 1": 115,
     "เวทรักษาที่ไหนเขาใช้กันแบบนี้ เล่ม 4 (Mg)": 175,
     "Your Name. เธอคือ...(Manga) 2 + Earthbound": 360,
     "Suzume การผนึกประตูของซุซุเมะ 1 (Mg)": 140,
     "ขอต้อนรับสู่ห้องเรียนนิยม (เฉพาะ) ยอดคน ปี 2 เล่ม 3 (Mg)": 175,
     "ชีวิตไม่ง่ายของนางร้าย LV99 เล่ม 4 (Mg)": 175,
     "เกิดใหม่เป็นขุนนางขึ้นเป็นใหญ่ด้วยสกิล เล่ม 6": 125,
     "เกิดใหม่เป็นท่านลอร์ดมาบุกเบิกดินแดน เล่ม 9 จบ": 95,
     "ไอน์ ซอฟ กับโลกแห่งขีดจำกัด เล่ม 1": 115,
     "นางกำนัลมือสังหารแห่งวังหลัง เล่ม 1": 110,
     "พ่อบ้านสุดแกร่งไร้เทียมทาน เล่ม 1": 110,
     "Suzume การผนึกประตูของซุซุเมะ เล่ม 3 (จบ)(Mg)": 175,
     "Weathering With You ฤดูฝัน ฉันมีเธอ เล่ม 1 Mg": 145,
     "Weathering With You ฤดูฝัน ฉันมีเธอ เล่ม 2 Mg": 145,
     "Weathering With You ฤดูฝัน ฉันมีเธอ เล่ม 3 ฉบับจบ (Mg)": 145,
     "Your name. เธอคือ เล่ม 3 (บาร์ใหม่) (Mg)": 135,
     "สายลับซินเดอเรลลากับนักฆ่าคลั่งรัก เล่ม 2 (Mg)": 175,
     "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว เล่ม 24": 125,
     "รักครั้งนี้มีคนนกเยอะไปมั้ย เล่ม 1": 135,
     "อ่านชะตาวันสิ้นโลก 1 (Mg)": 495,
    };

let books = JSON.parse(localStorage.getItem('books')) || [];

// ฟังก์ชันแสดงตัวเลือกสินค้า
function renderBookOptions() {
    const dropdowns = document.querySelectorAll('.book-dropdown');
    dropdowns.forEach((dropdown) => {
        dropdown.innerHTML = `<option value="">เลือกหนังสือ</option>`;
        books.forEach((book) => {
            if (book.status === "มีสินค้า") {
                const option = document.createElement('option');
                option.value = book.title;
                option.textContent = `${book.title} - ${bookPrices[book.title]} บาท`;
                dropdown.appendChild(option);
            }
        });
    });
}

let currentVisibleDropdowns = 1;

// เพิ่มช่อง dropdown ใหม่
document.getElementById('add-book').addEventListener('click', () => {
    const bookDropdowns = document.querySelectorAll('.book-dropdown');

    if (currentVisibleDropdowns < bookDropdowns.length) {
        bookDropdowns[currentVisibleDropdowns].style.display = 'block'; // แสดง dropdown ใหม่
        currentVisibleDropdowns++;

        // เพิ่ม event listener สำหรับ dropdown ที่เพิ่มใหม่
        bookDropdowns[currentVisibleDropdowns - 1].addEventListener('change', calculateTotal);
    } else {
        alert('ไม่สามารถเพิ่มช่องเลือกหนังสือได้มากกว่านี้');
    }
});

// คำนวณราคารวม
function calculateTotal() {
    const selectedBooks = document.querySelectorAll('.book-dropdown');
    let totalPrice = 0;

    selectedBooks.forEach((select, index) => {
        if (index < currentVisibleDropdowns && select.value) {
            totalPrice += bookPrices[select.value] || 0;
        }
    });

    totalPrice += 50; // บวกค่าจัดส่ง
    document.getElementById('money_price').value = `฿${totalPrice}`;
}

// การอัปโหลดภาพไปยัง Imgur
document.getElementById('payment_slip').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const status = document.getElementById('upload-status');
    status.textContent = 'กำลังอัปโหลด...';

    fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            Authorization: 'Client-ID 1b912ae13a4c35a'
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const imgurLink = data.data.link;
                const deleteHash = data.data.deletehash; // ดึง deleteHash จาก API Response

                // ใส่ลิงก์ในช่องซ่อน
                document.getElementById('imgur_link').value = imgurLink;

                // ซ่อนข้อความสถานะ
                status.textContent = ''; // ลบข้อความสถานะเมื่ออัปโหลดสำเร็จ

                console.log('Image URL:', imgurLink);
                console.log('Delete Hash:', deleteHash);

                // ตั้งเวลาลบภาพหลัง 24 ชั่วโมง
                setTimeout(() => {
                    autoDeleteImage(deleteHash);
                }, 24 * 60 * 60 * 1000); // 24 ชั่วโมง
            } else {
                status.textContent = 'เกิดข้อผิดพลาดในการอัปโหลด';
                console.error(data);
            }
        })
        .catch(error => {
            status.textContent = 'เกิดข้อผิดพลาดในการอัปโหลด';
            console.error('Error:', error);
        });
});

// ฟังก์ชันสำหรับลบภาพโดยอัตโนมัติ
function autoDeleteImage(deleteHash) {
    fetch(`https://api.imgur.com/3/image/${deleteHash}`, {
        method: 'DELETE',
        headers: {
            Authorization: 'Client-ID 1b912ae13a4c35a'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Image deleted automatically:', data);
        })
        .catch(err => console.error('Error deleting image:', err));
}

// ฟังก์ชันส่งข้อมูลฟอร์ม
document.getElementById("shop-form").addEventListener("submit", function (e) {
    e.preventDefault(); // ป้องกันการโหลดหน้าใหม่

    const form = e.target; // ดึงข้อมูลฟอร์ม
    const formData = new FormData(form); // เก็บข้อมูลฟอร์มในรูปแบบ FormData
    const messageDiv = document.getElementById("form-message"); // ส่วนแสดงข้อความสถานะ

    fetch(form.action, {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                // แสดงข้อความสำเร็จ
                form.reset(); // รีเซ็ตฟอร์ม
                messageDiv.style.display = "block";
                messageDiv.style.color = "green";
                messageDiv.innerText = "ทำการบันทึกข้อมูลการสั่งซื้อเรียบร้อยแล้ว!";
            }
        })
        .catch((error) => {
            // แสดงข้อความผิดพลาด
            messageDiv.style.display = "block";
            messageDiv.style.color = "red";
            messageDiv.innerText = "เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง!";
            console.error("Error:", error);
        });
});

// โหลดข้อมูลเมื่อเริ่มต้น
window.onload = () => {
    renderBookOptions();

    const dropdowns = document.querySelectorAll('.book-dropdown');
    dropdowns.forEach((dropdown) => {
        dropdown.addEventListener('change', calculateTotal);
    });
};
