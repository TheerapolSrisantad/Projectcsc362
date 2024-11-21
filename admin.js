// ชื่อผู้ใช้และรหัสผ่านที่กำหนดไว้
const adminCredentials = {
    username: "admin",
    password: "1234"
};

// ข้อมูลสินค้า
const books = [
    { title: "Bullet & Beast เล่ม 1", status: "มีสินค้า" },
    { title: "เวทรักษาที่ไหนเขาใช้กันแบบนี้ เล่ม 4 (Mg)", status: "มีสินค้า" },
    { title: "Your Name. เธอคือ...(Manga) 2 + Earthbound", status: "มีสินค้า" },
    { title: "Suzume การผนึกประตูของซุซุเมะ 1 (Mg)", status: "มีสินค้า" },
    { title: "ขอต้อนรับสู่ห้องเรียนนิยม (เฉพาะ) ยอดคน ปี 2 เล่ม 3 (Mg)", status: "มีสินค้า" },
    { title: "ชีวิตไม่ง่ายของนางร้าย LV99 เล่ม 4 (Mg)", status: "มีสินค้า" },
    { title: "เกิดใหม่เป็นขุนนางขึ้นเป็นใหญ่ด้วยสกิล เล่ม 6", status: "มีสินค้า" },
    { title: "เกิดใหม่เป็นท่านลอร์ดมาบุกเบิกดินแดน เล่ม 9 จบ", status: "มีสินค้า" },
    { title: "ไอน์ ซอฟ กับโลกแห่งขีดจำกัด เล่ม 1", status: "มีสินค้า" },
    { title: "นางกำนัลมือสังหารแห่งวังหลัง เล่ม 1", status: "มีสินค้า" },
    { title: "พ่อบ้านสุดแกร่งไร้เทียมทาน เล่ม 1", status: "มีสินค้า" },
    { title: "Suzume การผนึกประตูของซุซุเมะ เล่ม 3 (จบ)(Mg)", status: "มีสินค้า" },
    { title: "Weathering With You ฤดูฝัน ฉันมีเธอ เล่ม 1 Mg", status: "มีสินค้า" },
    { title: "Weathering With You ฤดูฝัน ฉันมีเธอ เล่ม 2 Mg", status: "มีสินค้า" },
    { title: "Weathering With You ฤดูฝัน ฉันมีเธอ เล่ม 3 ฉบับจบ (Mg)", status: "มีสินค้า" },
    { title: "Your name. เธอคือ เล่ม 3 (บาร์ใหม่) (Mg", status: "มีสินค้า" },
    { title: "สายลับซินเดอเรลลากับนักฆ่าคลั่งรัก เล่ม 2 (Mg)", status: "มีสินค้า" },
    { title: "เกิดใหม่ทั้งทีก็เป็นสไลม์ไปซะแล้ว เล่ม 24", status: "มีสินค้า" },
    { title: "รักครั้งนี้มีคนนกเยอะไปมั้ย เล่ม 1", status: "มีสินค้า" },
    { title: "อ่านชะตาวันสิ้นโลก 1 (Mg)", status: "มีสินค้า" },
];

// ฟังก์ชันเข้าสู่ระบบ
function handleLogin(event) {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("admin-container").style.display = "block";
        renderProducts(); // แสดงข้อมูลสินค้า
    } else {
        const errorElement = document.getElementById("login-error");
        errorElement.style.display = "block";
        errorElement.innerText = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
    }
}

// ฟังก์ชันแสดงสินค้าในหน้า Admin
function renderProducts() {
    const tableBody = document.querySelector("#product-table tbody");
    tableBody.innerHTML = ""; // ล้างตาราง

    books.forEach((book, index) => {
        const row = document.createElement("tr");

        // ชื่อสินค้า
        const titleCell = document.createElement("td");
        titleCell.innerText = book.title;
        row.appendChild(titleCell);

        // สถานะสินค้า
        const statusCell = document.createElement("td");
        statusCell.innerText = book.status;
        row.appendChild(statusCell);

        // ปุ่มแก้ไข
        const actionCell = document.createElement("td");
        const toggleButton = document.createElement("button");
        toggleButton.innerText = book.status === "มีสินค้า" ? "ตั้งค่าสินค้าหมด" : "ตั้งค่ามีสินค้า";
        toggleButton.addEventListener("click", () => toggleStatus(index));
        actionCell.appendChild(toggleButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    // บันทึกข้อมูลสินค้าไปยัง Local Storage
    localStorage.setItem("books", JSON.stringify(books));
}

// ฟังก์ชันสลับสถานะสินค้า
function toggleStatus(index) {
    books[index].status = books[index].status === "มีสินค้า" ? "สินค้าหมด" : "มีสินค้า";
    renderProducts(); // อัปเดตตาราง
}

// ผูกฟังก์ชัน handleLogin กับฟอร์ม
document.getElementById("admin-login").addEventListener("submit", handleLogin);
