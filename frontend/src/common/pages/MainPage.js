import React, { useEffect } from "react";
import { useCustomLogin } from "../member/hook/useCustomLogin";
import BasicLayout from "./BasicLayout";
import CalendarComponent from "../component/CalenderComponent";
import MonthlySalesChart from "../component/recharts/MonthlySalesChart";
import MonthlyProductSalesPieChart from "../component/recharts/MonthlyProductSalesPieChart";
import QuarterProfitRateChart from "../component/recharts/QuaterProfitRateChart";
import MonthlyCashFlowChart from "../component/recharts/MonthlyCashFlowChart";
import OrderTreeMap from "../component/recharts/OrderTreeMap";
import Chatbot from "../../chatbot/component/chatbot";
import "../pages/scss/MainPage.scss";

const MainPage = () => {
  const { isLogin, moveToLogin } = useCustomLogin();

  useEffect(() => {
    if (!isLogin) {
      moveToLogin();
    }
  }, [isLogin, moveToLogin]);

  return (
    <BasicLayout>
      <div className="main-page">
        <div className="main-page__container">
          {isLogin && (
            <>
              {/* 1. 월별 매출 차트 섹션 */}
              <div className="main-page__sales-section">
                <div className="main-page__sales-section-title">
                  월별 매출 현황
                </div>
                <div className="main-page__sales-section-chart">
                  <MonthlySalesChart />
                </div>
              </div>

              {/* 2. 가운데 섹션 (자동 줄바꿈) */}
              <div className="main-page__middle-section">
                {/* (1) 월별 제품 판매 */}
                <div className="main-page__middle-section-product">
                  <div className="main-page__middle-section-product-title">
                    월별 제품 판매
                  </div>
                  <MonthlyProductSalesPieChart />
                </div>

                {/* (2) 캘린더 */}
                <div className="main-page__middle-section-calendar">
                  <div className="main-page__middle-section-calendar-title">
                    캘린더
                  </div>
                  <CalendarComponent />
                </div>

                {/* (3) 챗봇 */}
                <div className="main-page__middle-section-chatbot">
                  <div className="main-page__middle-section-chatbot-title">
                    챗봇
                  </div>
                  <Chatbot isEmbedded={true} />
                </div>
              </div>

              {/* 3. 캐시플로우 섹션 */}
              <div className="main-page__cashflow-section">
                <MonthlyCashFlowChart />
              </div>

              {/* 4. 하단 2열 (화면 좁으면 1열로 자동 줄바꿈) */}
              <div className="main-page__bottom-section">
                <div>
                  <QuarterProfitRateChart />
                </div>
                <div className="main-page__bottom-section-distribution">
                  <div className="main-page__bottom-section-distribution-title">
                    거래 제품 분포
                  </div>
                  <OrderTreeMap />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
