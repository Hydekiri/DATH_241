document.addEventListener("DOMContentLoaded", () => {
    document.cookie = "";

    const signButton = document.querySelector('.submit-button');

    signButton.addEventListener("click", async () => {
        const usn = document.getElementById('username').value;
        const pwd = document.getElementById('password').value;

        if(!usn || !pwd ){
            alert("Missing email or password !");
            return;
        }

        try {
            const data = await signIn(usn, pwd);

            if (data === null) {
                alert("Wrong email or password");
                return;
            } else if (data === "Error fetching data!") {
                alert("Failed to sign in: Error fetching data.");
                return;
            } else {
                const role = data.role;
                if(role === "spso" || !role){
                    alert("Wrong email or password");
                    return;
                } 

                console.log("Login successfull");

                const accesstoken = data.Access_token;
                document.cookie = "token=" + `${accesstoken}`;

                const userID = data.id;
                document.cookie = "id=" + `${userID}`;

                window.location.href = "./student-print-home.html";
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    });
});

async function signIn(userName, passWord) {
    try {
        const response = await fetch('http://localhost:3000/api/d1/auth/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": userName,
                "password": passWord
            })
        });

        if (!response.ok) {
            console.error(`Server responded with status: ${response.status}`);
            return null;
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error during fetch operation:", error);
        return "Error fetching data!";
    }
}
