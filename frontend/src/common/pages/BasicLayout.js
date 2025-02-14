import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import "../pages/scss/BasicLayout.scss";
import { getEmployeeById } from "../member/api/memberApi";
import { useSelector } from "react-redux";
import { useCustomLogin } from "../member/hook/useCustomLogin";
import { Link, useLocation, useNavigate } from "react-router-dom";

const BasicLayout = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    positionTitle: "",
    departmentName: "",
  });

  const id = useSelector((state) => state.loginSlice.id);
  const { doLogout, moveToPath } = useCustomLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const handleClickLogout = () => {
    doLogout();
    alert("로그아웃되었습니다.");
    moveToPath("/member/login");
  };
  const handleGoHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const employeeData = await getEmployeeById(id); // API 호출
        // console.log(employeeData);
        setUser(employeeData); // 사용자 데이터 저장
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    // 현재 경로가 포함된 상위 메뉴 찾기
    const activeMenu = Object.entries(menuItems).find(([category, items]) =>
      items.some((item) => item.path === location.pathname)
    );

    if (activeMenu) {
      setOpenMenu(activeMenu[0]); // 해당 상위 메뉴를 열어둠
    }
  }, [location.pathname]);

  const menuItems = {
    마이페이지: [
      { name: "출/퇴근 조회", path: "/mypage/platform" },
      { name: "근태 신청", path: "/mypage/group" },
      { name: "급여 조회", path: "/mypage/salary" },
      { name: "공지 사항", path: "/hr/notices" },
    ],
    회계: [
      { name: "대쉬보드", path: "/accounting/dashboard" },
      { name: "급여 정보 관리", path: "/payroll" },
      { name: "거래 명세서 조회", path: "/accounting/transaction" },
      { name: "재무 보고서 관리", path: "/accounting/financial" },
      { name: "분개장", path: "/accounting/price" },
      { name: "부가세 납부", path: "/accounting/tax" },
      { name: "거래 내역 관리", path: "/accounting/history" },
    ],
    영업: [
      { name: "대쉬보드", path: "/sales/dashboard" },
      { name: "거래처 관리", path: "/clients" },
      { name: "제품 관리", path: "/product" },
      { name: "주문 내역 조회", path: "/product/order" },
    ],
    인사: [
      { name: "대쉬보드", path: "/hr/dashboard" },
      { name: "출/퇴근 관리", path: "/hr/platform" },
      { name: "직원 관리", path: "/employee" },
      { name: "근태 관리", path: "/hr/salary" },
    ],
    운영관리: [
      { name: "거래처 수정 승인", path: "/clients/request" },
      { name: "주문 승인 요청", path: "/product/request" },
    ],
  };

  return (
    <div className="basic-layout">
      <div className="main-layout">
        <nav className="sidebar">
          <div className="logo">
            <img
              src="/NextERP_layoutLogo.png"
              alt="Logo"
              onClick={handleGoHome}
            />
          </div>
          <div className="user-info">
            <div className="user-name-position">
              <span className="user-name">{user.name} </span>
              <span className="user-position">{user.positionTitle}님</span>
            </div>
            <span className="user-department">{user.departmentName}</span>
          </div>
          <ul>
            {Object.entries(menuItems).map(([category, items]) => (
              <li key={category}>
                <div
                  className={`menu-item ${
                    openMenu === category ? "active" : ""
                  }`}
                  onClick={() =>
                    setOpenMenu(openMenu === category ? null : category)
                  }
                >
                  {category}
                </div>
                {openMenu === category && (
                  <ul className="submenu">
                    {items.map((item) => (
                      <li
                        key={item.path}
                        className={
                          location.pathname === item.path
                            ? "active-submenu"
                            : ""
                        }
                      >
                        <Link to={item.path}>{item.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Container */}
        <div className="right-container">
          {/* Header */}
          <header className="header">
            <div className="header-buttons">
              <div>메신저</div>
              <div>비밀번호 변경</div>
              <button className="logout-btn">
                <FiLogOut onClick={handleClickLogout} />
              </button>
            </div>
          </header>
          <main className="content">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default BasicLayout;
