
// student-buy.js

const GetCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Chọn số lượng trang in (thay đổi giá trị input khi bấm nút +/-)

document.querySelector(".minus").addEventListener("click", () => {
  const numInput = document.getElementById("numpage");
  let currentValue = parseInt(numInput.value) || 0;
  if (currentValue > 1) {
    numInput.value = currentValue - 1; // Giảm giá trị
  }
});

document.querySelector(".plus").addEventListener("click", () => {
  const numInput = document.getElementById("numpage");
  let currentValue = parseInt(numInput.value) || 0;
  numInput.value = currentValue + 1; // Tăng giá trị
});

// Xử lý khi nhấn nút "Thanh toán"
document.querySelector(".button-pay").addEventListener("click", async () => {
  const numInput = document.getElementById("numpage");
  const pages = parseInt(numInput.value);
  const userId = parseInt(GetCookie('id'));
  const token = GetCookie('token');

  if (isNaN(pages) || pages <= 0) {
    alert("Vui lòng nhập số lượng trang in hợp lệ!");
    return;
  }

  if (!userId) {
    alert("Bạn cần đăng nhập để thực hiện chức năng này!");
    window.location.href = "../fe/login-student.html"; // Điều hướng về trang đăng nhập
    return;
  }

  try {
    // Gửi yêu cầu mua trang in đến backend
    const buyResponse = await fetch("http://localhost:3000/api/d1/buypages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: userId, // Gửi userId đã đăng nhập
        pagesToBuy: pages
      }),
    });

    if (!buyResponse.ok) {
      throw new Error("Failed to purchase pages. Please try again.");
    }

    const buyData = await buyResponse.json();
    console.log("Mua trang in thành công:", buyData);

    // Bước 2: Gửi yêu cầu tạo liên kết thanh toán
    const orderCode = buyData.order.id + 100; // Lấy mã đơn hàng và tạo mã đơn thanh toán payos
    const paymentResponse = await fetch("http://localhost:3000/api/d1/create-payment-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        code: orderCode,
        pagesToBuy: pages
      }),
    });

    if (!paymentResponse.ok) {
      throw new Error("Failed to create payment link. Please try again.");
    }
    const paymentData = await paymentResponse.json(); // Chuyển đổi phản hồi thành JSON
    const paymentLink = paymentData.paymentLink; 
    console.log("Điều hướng đến liên kết thanh toán.");
    window.open(paymentLink, '_blank'); // mở trang thanh toán ở 1 tab khác

  } catch (error) {
    console.error("Lỗi khi xử lý thanh toán:", error);
    alert("Có lỗi xảy ra. Vui lòng thử lại!");
  }
});
