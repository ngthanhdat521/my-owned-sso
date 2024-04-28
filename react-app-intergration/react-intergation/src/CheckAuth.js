import React from "react";

function CheckAuthPage() {
  React.useEffect(() => {
    setTimeout(() => {
      window.location = "http://localhost:5000/protected_page";
    }, 2000);
  }, []);

  return <div className="App">Chưa đăng nhập</div>;
}

export default CheckAuthPage;
