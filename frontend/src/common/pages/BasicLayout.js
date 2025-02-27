import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import "../pages/scss/BasicLayout.scss";
import { getEmployeeById } from "../../common/member/api/memberApi";
import { useSelector } from "react-redux";
import { useCustomLogin } from "../../common/member/hook/useCustomLogin";
import { Link, useLocation, useNavigate } from "react-router-dom";

//웹소켓 부분
import io from "socket.io-client";
import { getUnreadMessages } from "../../message/api/chatApi";

//  WebSocket 서버 연결
const socket = io("http://localhost:5000");

const BasicLayout = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    positionTitle: "",
    departmentName: "",
    departmentId: null,
    positionId: null,
  });

  //메신저 부분
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  const id = useSelector((state) => state.loginSlice.id);
  const { doLogout, moveToPath } = useCustomLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // ✅ 챗봇 상태 추가
  const [forceRender, setForceRender] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const unreadMessages = await getUnreadMessages(id);
        console.log("📩 초기 읽지 않은 메시지:", unreadMessages);
        const total = Object.values(unreadMessages).reduce(
          (sum, count) => sum + count,
          0
        );
        setTotalUnreadMessages(total);
      } catch (error) {
        console.error("❌ 읽지 않은 메시지 로드 실패:", error);
      }
    };

    if (id) {
      fetchUnreadMessages();
    }
  }, [id]);

  // 웹소켓 연결 및 메시지 수신 처리
  useEffect(() => {
    if (!id) return;

    console.log("🔌 웹소켓 연결 설정 - 사용자 ID:", id);

    // ✅ 사용자 등록
    socket.emit("register", { user_id: id });

    // ✅ 새 메시지 수신 이벤트 감지
    socket.on("message", (newMessage) => {
      console.log("📨 새 메시지 수신:", newMessage);

      if (Number(newMessage.receiverId) === Number(id)) {
        setTotalUnreadMessages((prev) => prev + 1);
      }
    });

    // ✅ 메시지 읽음 처리 이벤트 감지
    socket.on("messagesRead", (data) => {
      console.log("👀 [BasicLayout] messagesRead 이벤트 감지:", data);

      if (Number(data.userId) === Number(id)) {
        console.log(
          "📉 [BasicLayout] 기존 읽지 않은 메시지 개수:",
          totalUnreadMessages
        );
        setTotalUnreadMessages((prev) => {
          const newTotal = Math.max(0, prev - data.count);
          console.log("📉 [BasicLayout] 읽지 않은 메시지 감소 후:", newTotal);
          return newTotal;
        });

        // ✅ API에서 최신 데이터를 반영할 시간을 주기 위해 500ms 후에 실행
        setTimeout(() => {
          console.log(
            "⏳ [BasicLayout] 최신 읽지 않은 메시지 개수 다시 확인 중..."
          );
          socket.emit("updateUnreadMessages"); // 🚀 `updateUnreadMessages` 실행을 지연
        }, 1000);
      }
    });

    // ✅ `updateUnreadMessages` 이벤트 감지 (강제 UI 업데이트 적용)
    socket.on("updateUnreadMessages", async () => {
      console.log("🔄 [BasicLayout] updateUnreadMessages 이벤트 감지됨!");

      try {
        // ✅ 1초 대기 후 최신 데이터 가져오기 (DB 반영 시간 확보)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // ✅ 최신 읽지 않은 메시지 개수 API 요청
        const unreadMessages = await getUnreadMessages(id);
        const total = Object.values(unreadMessages).reduce(
          (sum, count) => sum + count,
          0
        );

        console.log("🔄 [BasicLayout] 최신 읽지 않은 메시지 개수:", total);

        setTotalUnreadMessages((prev) => {
          if (prev !== total) {
            console.log(
              "📢 [BasicLayout] 상태 업데이트 필요! 업데이트 실행 🚀"
            );
            return total;
          } else {
            console.log("✅ [BasicLayout] 상태가 동일하므로 업데이트 생략");
            return prev;
          }
        });
      } catch (error) {
        console.error("❌ 읽지 않은 메시지 개수 업데이트 실패:", error);

        console.log("히히히히히히히히");
      }
    });

    return () => {
      socket.off("message");
      socket.off("messagesRead");
      socket.off("updateUnreadMessages");
    };
  }, [id]);

  //  `toggleChat` 함수 추가
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  //  `handleOpenChatList` 함수 추가
  const handleOpenChatList = () => {
    window.open(
      "/message/list",
      "ChatList",
      "width=380,height=600,resizable=no,scrollbars=no"
    );
  };

  // 사이드바 토글
  const handleSidebarToggle = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    console.log("📍 현재 경로:", location.pathname);
    console.log("🆔 로그인한 사용자 ID:", id);
  }, [location, id]);

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
        const employeeData = await getEmployeeById(id);
        console.log("🔄 가져온 사용자 정보:", employeeData);
        setUser(employeeData);
      } catch (error) {
        console.error("❌ 사용자 정보 조회 실패:", error);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  //  가져온 사용자 정보에서 departmentId, positionId 가져오기
  const departmentId = user.departmentId ?? 0;
  const positionId = user.positionId ?? 0;

  console.log("🔎 현재 유효한 departmentId:", departmentId);
  console.log("🔎 현재 유효한 positionId:", positionId);

  //  이사(7), 사장(8)은 모든 메뉴 접근 가능
  const isSupervisor = positionId >= 7;

  const filteredMenuItems = {
    HOME: [{ name: "HOME", path: "/" }],
    공지사항: [{ name: "공지 사항", path: "/announcement" }],
    마이페이지: [
      { name: "My 출/퇴근 조회", path: "/employee/myattendance" },
      { name: "근태 신청", path: "/employee/attendance/request" },
    ],
    회계:
      isSupervisor || departmentId === 2
        ? [{ name: "급여 관리", path: "/payroll" }]
        : [],
    영업:
      isSupervisor || departmentId === 1
        ? [
            { name: "거래처 관리", path: "/clients" },
            { name: "제품 관리", path: "/product" },
            { name: "주문 내역 조회", path: "/product/order" },
          ]
        : [],
    인사:
      isSupervisor || departmentId === 3
        ? [
            { name: "직원 관리", path: "/employee" },
            { name: "출/퇴근 관리", path: "/employee/attendance" },
            { name: "근태 신청 내역", path: "/employee/attendance/history" },
          ]
        : [],
    운영관리: [
      ...(isSupervisor || (positionId >= 5 && departmentId === 1)
        ? [
            { name: "거래처 수정 승인", path: "/clients/request" },
            { name: "주문 승인", path: "/product/request" },
          ]
        : []),
      ...(isSupervisor || (positionId >= 5 && departmentId === 3)
        ? [
            { name: "근태 승인", path: "/employee/attendance/approval" },
            { name: "사원 수정 승인", path: "/employee/approval-status" },
          ]
        : []),
    ],
  };

  return (
    <div className="basic-layout">
      <div className="main-layout">
        <nav
          className={`sidebar ${sidebarActive ? "active" : ""} ${
            isHomePage ? "sticky" : ""
          }`}
        >
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
            {Object.entries(filteredMenuItems).map(([category, items]) => {
              if (items.length === 0) return null;
              // ✅ 현재 URL과 비교하여 해당 카테고리 내 메뉴 중 하나라도 활성화되어 있는지 확인
              const isCategoryActive = items.some(
                (item) => location.pathname === item.path
              );
              // ✅ 사용자가 클릭하여 openMenu 상태거나 현재 경로에 해당 카테고리의 메뉴가 포함되면 탭을 열어둠
              const isTabOpen =
                openMenu === category ||
                (openMenu === null && isCategoryActive);

              return (
                <li key={category}>
                  {category === "HOME" || category === "공지사항" ? (
                    // "HOME"과 "공지사항"은 클릭 시 바로 페이지 이동
                    <div
                      className="menu-item"
                      onClick={() => (window.location.href = items[0].path)}
                    >
                      {category}
                    </div>
                  ) : (
                    <div
                      className={`menu-item ${isTabOpen ? "active" : ""}`}
                      onClick={() =>
                        setOpenMenu(openMenu === category ? null : category)
                      }
                    >
                      {category}
                    </div>
                  )}
                  {isTabOpen &&
                    category !== "HOME" &&
                    category !== "공지사항" && (
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
              );
            })}
          </ul>
        </nav>

        {/* Right Container */}
        <div className="right-container">
          <header className="header">
            <div className="header-left">
              <button onClick={handleSidebarToggle} className="menu-toggle">
                ☰
              </button>
            </div>

            <div className="header-buttons">
              <button onClick={handleOpenChatList}>
                메신저
                {totalUnreadMessages > 0 && (
                  <span className="unread-badge">{totalUnreadMessages}</span>
                )}
              </button>
              <button
                onClick={() => navigate("/member/change-password")}
                style={{ cursor: "pointer" }}
              >
                비밀번호 변경
              </button>
              <button className="logout-btn">
                <FiLogOut onClick={handleClickLogout} />
              </button>
            </div>
          </header>
          <main className="content">{children}</main>

          {/* ✅ 메인 페이지에서 + 버튼 안 보이게 설정 */}
          {location.pathname !== "/" && (
            <>
              <button className="chatbot-btn" onClick={toggleChat}>
                {isChatOpen ? "×" : "+"}
              </button>
              {isChatOpen && (
                <div className="chat-window">
                  <iframe
                    src="/chatbot"
                    title="Chatbot"
                    className="chat-iframe"
                  ></iframe>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicLayout;
