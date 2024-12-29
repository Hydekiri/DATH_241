document.addEventListener("DOMContentLoaded", () => {
    console.log("Trang đã tải xong, đang khởi tạo...");

    // Fetch and render user info
    fetchUserInfo();

    // Event listener for delete history button
    const deleteButton = document.querySelector(".delete-history-btn");
    if (deleteButton) {
        deleteButton.addEventListener("click", handleDeleteHistory);
    }

    // Event listener for the return button
    const returnButton = document.querySelector(".return button");
    if (returnButton) {
        returnButton.addEventListener("click", () => {
            window.history.back();
        });
    }
});

// Extract userID from URL parameters
const getUserIDFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("user_ID");
};

// Fetch user information and print history
const fetchUserInfo = async () => {
    const userID = getUserIDFromURL();
    if (!userID) {
        alert("Không tìm thấy ID người dùng!");
        return;
    }

    try {
        // Fetch user data
        const userResponse = await fetch(`http://localhost:3000/api/d1/users/${userID}`);
        if (!userResponse.ok) throw new Error("Không thể lấy thông tin người dùng.");
        const userData = await userResponse.json();
        renderUserInfo(userData.data);

        // Fetch user print history
        const historyResponse = await fetch(`http://localhost:3000/api/d1/printconfigs/user/${userID}/history`);
        if (!historyResponse.ok) throw new Error("Không thể lấy lịch sử in.");
        const historyData = await historyResponse.json();
        renderPrintHistory(historyData.data);

    } catch (error) {
        console.error("Lỗi khi tải thông tin:", error);
        alert(error.message);
    }
};

// Render user information
const renderUserInfo = (user) => {
    if (!user) return console.error("Dữ liệu người dùng không hợp lệ.");

    document.querySelector(".uName span + span").textContent = user.name || "Không xác định";
    document.querySelector(".uID span + span").textContent = user.user_ID || "Không xác định";
    document.querySelector(".pageBalance span + span").textContent = user.pageBalance || "Không có";
    document.querySelector(".eMail span + span").textContent = user.email || "Không có email";
    document.querySelector(".status span + span").textContent =
        user.status === "active" ? "Hoạt động" : "Không hoạt động";
};

// Render print history
const renderPrintHistory = (history) => {
    const tableBody = document.querySelector(".printer-history tbody");
    tableBody.innerHTML = ""; // Clear old content

    if (!history || history.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>Không có lịch sử in nào</td></tr>";
        return;
    }

    history.forEach((record) => {
        const row = document.createElement("tr");
        row.classList.add(record.status === "success" ? "success" : "failed");

        row.innerHTML = `
            <td>${record.printer?.branchName || "Không rõ"}</td>
            <td>${new Date(record.printStart).toLocaleString("vi-VN")}</td>
            <td>${record.numPages} / ${record.paperSize}</td>
            <td>${record.fileName || "Không rõ"}</td>
            <td>${record.status === "success" ? "In thành công" : "Thất bại"}</td>
        `;

        tableBody.appendChild(row);
    });
};

// Handle history deletion
const handleDeleteHistory = async () => {
    const userID = getUserIDFromURL();
    if (!userID) {
        alert("Không tìm thấy ID người dùng!");
        return;
    }

    const confirmation = window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử in?");
    if (!confirmation) return;

    try {
        const response = await fetch(`http://localhost:3000/api/d1/printconfigs/user/${userID}/history`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${yourToken}` // Replace with your actual token
            }
        });

        if (!response.ok) throw new Error("Không thể xóa lịch sử in.");
        alert("Xóa lịch sử thành công!");
        fetchUserInfo(); // Reload updated data

    } catch (error) {
        console.error("Lỗi khi xóa lịch sử:", error);
        alert(error.message);
    }
};
