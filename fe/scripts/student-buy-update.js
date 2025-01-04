
// student-buy.js

const GetCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Xử lý khi nhấn nút "Thanh toán"
document.addEventListener('DOMContentLoaded', async function() {
  const userId = parseInt(GetCookie('id'));
  const token = GetCookie('token');
  const pages = parseInt(sessionStorage.getItem('pagesToBuy'));

  if (!userId) {
    alert("Bạn cần đăng nhập để thực hiện chức năng này!");
    window.location.href = "../fe/login-student.html"; // Điều hướng về trang đăng nhập
    return;
  }

  try {
    // Gửi yêu cầu mua trang in đến backend
    const buyUpdate = await fetch("http://localhost:3000/api/d1/updatepages", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: userId, // Gửi userId đã đăng nhập
        pagesToBuy: pages
      }),
    });

    if (!buyUpdate.ok) {
      throw new Error("lỗi khi tiến hành update.");
    }

    const buyData = await buyUpdate.json();
    console.log("Update trang in thành công", buyData);
    const initialPage = sessionStorage.getItem('initialPage');

    if (initialPage) {
       // Quay lại trang ban đầu
       window.location.href = initialPage;
    } else {
       // Nếu không tìm thấy URL ban đầu (có thể đã bị mất do đóng trình duyệt), điều hướng về trang mặc định
       console.log("Không tìm thấy trang ban đầu.");
       window.location.href = "/";  // Điều hướng đến trang chủ hoặc trang mặc định
    }



  } catch (error) {
    console.error("Lỗi khi cập nhật trang in:", error);
    alert("Có lỗi xảy ra khi update pages. Vui lòng thử lại!");
  }
});

