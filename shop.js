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

let currentVisibleDropdowns = 1; // Number of visible dropdowns

// Add a new dropdown on button click
document.getElementById('add-book').addEventListener('click', () => {
    const bookDropdowns = document.querySelectorAll('.book-dropdown');

    if (currentVisibleDropdowns < bookDropdowns.length) {
        // Display the next hidden dropdown
        bookDropdowns[currentVisibleDropdowns].style.display = '';
        currentVisibleDropdowns++;

        // Add event listener for the new dropdown
        bookDropdowns[currentVisibleDropdowns - 1].addEventListener('change', calculateTotal);
    } else {
        alert('ไม่สามารถเพิ่มได้มากกว่านี้');
    }
});

// Calculate total price
function calculateTotal() {
    const selectedBooks = document.querySelectorAll('.book-dropdown');
    let totalPrice = 0;

    selectedBooks.forEach((select, index) => {
        if (index < currentVisibleDropdowns && select.value) {
            totalPrice += bookPrices[select.value] || 0;
        }
    });

    // Add shipping cost
    totalPrice += 50;
    document.getElementById('money_price').value = `฿${totalPrice}`;
}

// Attach change event to initially visible dropdowns
document.querySelectorAll('.book-dropdown').forEach((select, index) => {
    if (index < currentVisibleDropdowns) {
        select.addEventListener('change', calculateTotal);
    }
});

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


// Form submission handling
const form = document.getElementById("shop-form");
const messageDiv = document.getElementById("form-message");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    fetch(form.action, {
        method: "POST",
        body: new FormData(form),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                form.reset();
                messageDiv.style.display = "block";
                messageDiv.style.color = "green";
                messageDiv.innerText = "ทำการบันทึกข้อมูลการสั่งซื้อแล้ว";
            }
        })
        .catch(error => {
            console.error("ข้อผิดพลาด:", error);
            messageDiv.style.display = "block";
            messageDiv.style.color = "red";
            messageDiv.innerText = "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
        });
});
