from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import db  # ✅ MariaDB 연결 모듈
import requests
from langchain_openai import ChatOpenAI
from langchain_experimental.agents import create_pandas_dataframe_agent
import sys
sys.stdout.reconfigure(encoding='utf-8')  # ✅ UTF-8 인코딩 강제 설정


SPRING_BOOT_API_BASE = "http://localhost:8080/api"  # ✅ Spring Boot API 주소

app = Flask(__name__)
CORS(app)

# ✅ OpenAI API Key 설정
OPENAI_API_KEY = ""

# ✅ 부서 ID 매핑 (ID → 부서명)
DEPARTMENT_MAPPING = {
    1: "영업팀",
    2: "회계팀",
    3: "인사팀"
}


# ------------------ ✅ 사원 정보 조회 ------------------ #
@app.route('/employee-info', methods=['POST'])
def get_employee_info():
    """📌 사원 정보 조회 (본인 정보만 조회 가능, 인사팀은 전체 조회 가능)"""
    try:
        data = request.json
        employee_id = data.get("employeeId")  # 로그인한 사원 ID
        department_id = data.get("departmentId")  # 로그인한 사원의 부서 ID
        query_employee_id = data.get("queryEmployeeId", employee_id)  # 조회할 직원 ID (기본값은 본인)

        # ✅ employee_id와 department_id를 정수형(int)으로 변환
        try:
            employee_id = int(employee_id)
            department_id = int(department_id)
            query_employee_id = int(query_employee_id)
        except ValueError:
            return jsonify({"response": "❌ 직원 ID 또는 부서 ID가 올바르지 않습니다."}), 400

        # ✅ 데이터 가져오기
        df = db.get_all_data()

        if df.empty:
            return jsonify({"response": "❌ 사원 데이터를 가져올 수 없습니다."})

        # ✅ 각 테이블 필터링
        employee_df = df[df["table_name"] == "employee"]
        department_df = df[df["table_name"] == "department"]
        position_df = df[df["table_name"] == "position"]

        # ✅ 사원, 부서, 직급 데이터 병합
        merged_df = employee_df.merge(department_df, left_on="department_id", right_on="department_id", suffixes=("_emp", "_dept"))
        merged_df = merged_df.merge(position_df, left_on="position_id", right_on="position_id")

        # ✅ 인사팀(부서 ID = 3)일 경우 전체 직원 조회 가능
        if department_id == 3:
            employee_info = merged_df.to_dict(orient="records")
            return jsonify({"response": employee_info})

        # ✅ 일반 직원이 본인 정보를 조회하는 경우
        if query_employee_id == employee_id:
            personal_info = merged_df[merged_df["employee_id"] == employee_id]
            if personal_info.empty:
                return jsonify({"response": "❌ 본인의 사원 정보를 찾을 수 없습니다."})
            return jsonify({"response": personal_info.to_dict(orient="records")})

        # ✅ 일반 직원이 다른 직원 정보를 요청하는 경우 차단
        return jsonify({"response": "❌ 다른 사원의 정보를 조회할 권한이 없습니다."})

    except Exception as e:
        print(f"❌ 서버 오류 발생: {str(e)}")
        return jsonify({"response": "🚨 서버 오류가 발생했습니다. 관리자에게 문의하세요."}), 500



# ------------------ ✅ 부서 정보 조회 ------------------ #
@app.route('/department-info', methods=['POST'])
def get_department_info():
    """📌 전체 부서 정보 조회 (모든 사용자 가능)"""
    try:
        # ✅ 부서 테이블 직접 조회
        department_df = db.show_data("department")

        if department_df.empty:
            return jsonify({"response": "❌ 부서 정보를 가져올 수 없습니다."})

        # ✅ 부서 정보 목록 생성 (컬럼명 수정: department_name → name)
        department_list = [
            f"📌 {row['department_id']}번 부서: {row['name']} (연락처: {row['contact_email']})"
            for _, row in department_df.iterrows()
        ]
        department_info = "\n".join(department_list)

        # ✅ OpenAI 프롬프트 생성 (자연어 처리)
        prompt = f"""
        너는 기업 내부 시스템의 챗봇이야. 사용자가 부서 정보를 요청했어.

        현재 시스템에 등록된 부서는 다음과 같아:
        {department_info}

        사용자가 '부서 정보'라고 입력했어.  
        1. 먼저 현재 등록된 부서 목록을 제공하고,  
        2. 사용자가 특정 부서 정보를 알고 싶다면 **부서명을 입력하면** 상세 정보를 제공해줘.  
        3. 추가 질문으로 '특정 부서에 대한 정보가 필요하시면 부서명을 입력해주세요.' 라고 안내해줘.  
        """

        # ✅ OpenAI 호출
        chat = ChatOpenAI(temperature=0.3, model="gpt-4o-mini")
        response = chat.invoke(prompt)

        # ✅ 응답이 JSON 직렬화 가능하도록 변환
        final_response = response.content if hasattr(response, "content") else "📢 부서 정보를 가져올 수 없습니다."

        print(f"📢 Flask에서 응답할 데이터: {final_response}")

        return jsonify({"response": final_response})

    except Exception as e:
        print(f"❌ 서버 오류 발생: {str(e)}")
        return jsonify({"response": "🚨 서버 오류가 발생했습니다. 관리자에게 문의하세요."}), 500


# ------------------ ✅ 근태 정보 조회 ------------------ #
@app.route('/attendance', methods=['POST'])
def get_attendance():
    """ 📌 직원 근태 정보 조회 (본인만 조회 가능) 또는 전체 조회 (인사팀만 가능) """
    try:
        data = request.json
        print(f"🔍 Flask에서 받은 요청 데이터: {data}")

        # ✅ 데이터 정수 변환
        try:
            employee_id = int(data.get("employeeId"))
            department_id = int(data.get("departmentId"))
        except ValueError as e:
            print(f"❌ [오류] employeeId 또는 departmentId 변환 실패: {e}")
            return jsonify({"response": "❌ 직원 ID 또는 부서 ID가 올바르지 않습니다."}), 400

        # ✅ 근태 데이터 조회
        df = db.get_attendance_data()
        print(f"📌 근태 데이터 조회 완료 (총 {len(df)}개)")

        if df.empty:
            print("❌ 근태 데이터가 없습니다.")
            return jsonify({"response": "❌ 근태 데이터를 가져올 수 없습니다."})

        # ✅ 데이터프레임 컬럼 확인
        print(f"🔍 데이터프레임 컬럼 목록: {df.columns.tolist()}")

        # ✅ overtime_hours 변환 전 출력
        print("🔍 변환 전 데이터:")
        print(df[["overtime_hours"]].to_string(index=False))  # ✅ 데이터 출력 강제

        # ✅ overtime_hours 변환 (None → 0 변환)
        df["overtime_hours"] = pd.to_numeric(df["overtime_hours"], errors="coerce").fillna(0).astype(float)

        # ✅ 변환 후 출력
        print("✅ 변환 후 데이터:")
        print(df[["overtime_hours"]].to_string(index=False))

        # ✅ status 필드 변환
        df["status"] = df["status"].astype(str).str.strip().fillna("UNKNOWN")
        print(f"🔍 status 필드 값 목록:\n{df['status'].unique()}")

        # ✅ 일반 직원은 본인 근태 정보만 조회 가능
        personal_attendance = df[df["employee_id"] == employee_id]
        print(f"🔍 필터링된 근태 데이터 (총 {len(personal_attendance)}개):\n{personal_attendance}")

        if personal_attendance.empty:
            print("❌ 본인의 근태 정보가 없습니다.")
            return jsonify({"response": "❌ 본인의 근태 정보를 찾을 수 없습니다."})

        # ✅ 근태 데이터 처리
        attendance_info_list = []
        for _, row in personal_attendance.iterrows():
            status = row["status"]
            check_in = row["check_in_time"] if pd.notna(row["check_in_time"]) else "출근 기록 없음"
            check_out = row["check_out_time"] if pd.notna(row["check_out_time"]) else "퇴근 기록 없음"
            overtime_hours = row["overtime_hours"] if pd.notna(row["overtime_hours"]) else 0
            overtime = f"{overtime_hours}시간 초과 근무" if overtime_hours > 0 else "초과 근무 없음"
            approval_status = row.get("request_status", "APPROVED")  # ✅ 승인 여부 추가



        print("✅ 근태 정보 응답 준비 완료")
        return jsonify({"response": "\n\n".join(attendance_info_list)})

    except Exception as e:
        print(f"❌ 서버 오류 발생: {str(e)}", flush=True)  # ✅ 콘솔 출력 강제
        return jsonify({"response": "🚨 서버 오류가 발생했습니다. 관리자에게 문의하세요."}), 500





# ------------------ ✅ 공지사항 조회 ------------------ #

@app.route('/announcements', methods=['POST'])
def get_announcements():
    """ 📌 로그인한 사용자의 부서 공지사항 조회 """
    data = request.json
    department_id = data.get("departmentId")  # 로그인한 사용자의 부서 ID

    # ✅ Flask에서 받은 데이터 확인
    print(f"🔍 Flask에서 받은 요청 데이터: {data}")

    if not department_id:
        return jsonify({"response": "❌ 부서 ID가 필요합니다."}), 400

    # ✅ department_id를 int로 변환
    try:
        department_id = int(department_id)
    except ValueError:
        return jsonify({"response": "❌ 부서 ID가 올바르지 않습니다."}), 400

    print(f"📌 요청된 department_id: {department_id}")

    # ✅ 공지사항 데이터 가져오기
    df = db.show_data("announcement")

    if df.empty:
        return jsonify({"response": "❌ 공지사항 데이터를 가져올 수 없습니다."})

    # ✅ department_id 필터링 (로그인한 사용자의 부서 ID만)
    filtered_announcements = df[df["department_id"] == department_id]



    # ✅ 필터링된 데이터 로그 확인
    print(f"📢 필터링된 공지사항 데이터 ({department_id}번 부서):\n{filtered_announcements}")

    if filtered_announcements.empty:
        return jsonify({"response": f"📢 '{department_id}번 부서'에 해당하는 공지사항이 없습니다."})

    return jsonify({"response": filtered_announcements.to_dict(orient="records")})






#영업팀 /제품 
# 영업팀 /제품 /거래내역
@app.route('/chat/sales', methods=['POST'])
def chatbot_sales_response():
    """📌 영업팀 전용 챗봇 요청 처리 (제품 재고 + 거래처 정보 + 거래 내역)"""
    try:
        data = request.json
        print(f"🔍 Flask에서 받은 요청 데이터: {data}")

        user_query = data.get("message", "").strip()
        employee_id = data.get("employeeId")
        department_id = data.get("departmentId")

        if not user_query or not employee_id or department_id is None:
            return jsonify({"response": "❌ 메시지, 직원 ID, 부서 ID 정보를 모두 입력하세요."})

        if department_id != 1:
            return jsonify({"response": "❌ 영업팀 직원만 이 정보를 조회할 수 있습니다."}), 403

        # ✅ 제품 재고 조회 (영업팀만 가능)
        if any(keyword in user_query for keyword in ["제품", "재고", "가격"]):
            inventory_df = db.show_data("product")
            print(f"🔍 [DEBUG] product 테이블 조회 결과:\n{inventory_df}")

            if inventory_df.empty:
                inventory_info = "📢 현재 재고 정보가 없습니다."
            else:
                inventory_list = [
                    f"📌 {row['product_name']} - 남은 재고: {row['stock']}개 (규격: {row['specifications']})\n"
                    f"   💰 매입가: {row['purchase_price']}원 | 판매가: {row['sale_price']}원"
                    for _, row in inventory_df.iterrows()
                ]
                inventory_info = "\n".join(inventory_list)

        else:
            inventory_info = "📢 제품 관련 요청이 없습니다."

        # ✅ 거래처 정보 조회 (영업팀만 가능)
        if any(keyword in user_query for keyword in ["거래처", "거래처 목록", "거래처 정보"]):
            client_df = db.show_data("client")

            print(f"🔍 [DEBUG] client 테이블 컬럼명: {client_df.columns.tolist()}")

            if client_df.empty:
                client_info = "📢 현재 등록된 거래처가 없습니다."
            else:
                client_list = [
                    f"🏢 거래처명: {row['client_name']} (코드: {row['client_code']})\n"
                    f"   📞 연락처: {row['client_phone']}"
                    for _, row in client_df.iterrows()
                ]
                client_info = "\n".join(client_list)

            print(f"🔍 [DEBUG] client 정보 결과:\n{client_info}")

        else:
            client_info = "📢 거래처 관련 요청이 없습니다."

        # ✅ 거래 내역 조회 (영업팀만 가능)
        if any(keyword in user_query for keyword in ["거래 내역", "판매 내역", "구매 내역"]):
            transactions_df = db.show_data("transactions")
            client_df = db.show_data("client")

            if transactions_df.empty or client_df.empty:
                transaction_info = "📢 현재 등록된 거래 내역이 없습니다."
            else:
                # 거래처 정보와 결합하여 거래 내역 조회
                merged_df = transactions_df.merge(client_df, left_on="client_code", right_on="client_code", suffixes=("_transaction", "_client"))

                # ✅ 판매 및 구매 내역 구분
                sales_transactions = merged_df[merged_df["type"] == "SALE"]
                purchase_transactions = merged_df[merged_df["type"] == "PURCHASE"]

                sales_list = [
                    f"🏢 거래처명: {row['client_name']} (코드: {row['client_code']})\n"
                    f"   💰 판매 금액: {row['amount']}원\n"
                    f"   📅 거래 날짜: {row['date']} | 담당자: {row['employee_id']}"
                    for _, row in sales_transactions.iterrows()
                ]

                purchase_list = [
                    f"🏢 거래처명: {row['client_name']} (코드: {row['client_code']})\n"
                    f"   💰 구매 금액: {row['amount']}원\n"
                    f"   📅 거래 날짜: {row['date']} | 담당자: {row['employee_id']}"
                    for _, row in purchase_transactions.iterrows()
                ]

                transaction_info = "**✅ 판매 내역:**\n" + "\n\n".join(sales_list) if sales_list else "📌 판매 내역이 없습니다."
                transaction_info += "\n\n**✅ 구매 내역:**\n" + "\n\n".join(purchase_list) if purchase_list else "\n📌 구매 내역이 없습니다."

            print(f"🔍 [DEBUG] 거래 내역 결과:\n{transaction_info}")

        else:
            transaction_info = "📢 거래 내역 관련 요청이 없습니다."

        # ✅ OpenAI 프롬프트 생성
        prompt = f"""
        너는 기업 내부 시스템의 챗봇이야. 사용자가 제품 재고, 거래처 정보 또는 거래 내역을 요청했어.

        🏢 현재 제품 재고 현황:
        {inventory_info}

        📌 현재 등록된 거래처 목록:
        {client_info}

        💳 거래 내역:
        {transaction_info}

        사용자가 '{user_query}'라고 입력했어.  
        제품 가격을 물어보면 정보를 제공하고, 특정 제품을 검색할 수 있도록 안내해줘.  
        거래처 정보를 요청하면 거래처 목록을 제공하고 특정 거래처 검색 방법을 안내해줘.  
        거래 내역을 요청하면 판매 및 구매 내역을 구분하여 보여줘.
        """

        # ✅ OpenAI 호출
        chat = ChatOpenAI(temperature=0.3, model="gpt-4o-mini")
        response = chat.invoke(prompt)

        # ✅ 응답이 JSON 직렬화 가능하도록 변환
        final_response = response.content if hasattr(response, "content") else "📢 요청한 정보를 가져올 수 없습니다."

        print(f"📢 Flask에서 응답할 데이터: {final_response}")

        return jsonify({"response": final_response})

    except Exception as e:
        print(f"❌ 서버 오류 발생: {str(e)}")
        return jsonify({"response": "🚨 서버 오류가 발생했습니다. 관리자에게 문의하세요."}), 500






# ------------------ ✅ 챗봇 OpenAI 활용 ------------------ #


@app.route('/chat', methods=['POST'])
def chatbot_response():
    """📌 Spring Boot에서 받은 챗봇 요청을 처리"""
    try:
        data = request.json
        print(f"🔍 Flask에서 받은 요청 데이터: {data}")

        user_query = data.get("message", "").strip()
        employee_id = data.get("employeeId")
        department_id = data.get("departmentId")

        if not user_query or not employee_id or department_id is None:
            return jsonify({"response": "❌ 메시지, 직원 ID, 부서 ID 정보를 모두 입력하세요."})

        #  employee_id와 department_id를 정수형(int)으로 변환
        try:
            employee_id = int(employee_id)
            department_id = int(department_id)
        except ValueError:
            return jsonify({"response": "❌ 직원 ID 또는 부서 ID가 올바르지 않습니다."}), 400

        print(f"📌 로그인한 사용자 부서 ID: {department_id}")

        #  부서 ID 매핑
        DEPARTMENT_MAPPING = {
            1: "영업팀",
            2: "회계팀",
            3: "인사팀",
        }
        department_name = DEPARTMENT_MAPPING.get(department_id, "알 수 없는 부서")

        #  사원 정보 조회 (현재 로그인한 사용자만 조회)
        employee_df = db.show_data("employee")

        if employee_df.empty:
            return jsonify({"response": "📢 현재 확인할 수 있는 사원 정보가 없습니다."})

        # 사용자가 "다른 사원 정보"를 요청하면 즉시 권한 없음 응답 반환
        if "다른 사원 정보" in user_query:
            return jsonify({"response": "📢 다른 사원의 정보는 조회할 권한이 없습니다."})

        personal_employee =None
        if any(keyword in user_query for keyword in ["내 정보", "내 사원 정보"]):
            try:
                personal_employee = employee_df[employee_df["employee_id"] == employee_id]
            except Exception as e:
                print(f"❌ 사원 정보 조회 오류: {e}")
                return jsonify({"response": "📢 사원 정보를 조회하는 중 오류가 발생했습니다."})

            if personal_employee is None or personal_employee.empty:
                return jsonify({"response": "📢 본인의 사원 정보를 찾을 수 없습니다."})

            employee_info = personal_employee.to_dict(orient="records")[0]

            prompt = f"""
            너는 기업 내부 시스템의 챗봇이야. 사용자가 자신의 사원 정보를 요청했어.

            📌 사원 정보:
            {employee_info}

            사용자가 '{user_query}'라고 입력했어.  
            그리고 다른 사원의 정보는 보여주면 안될 거 같아.
            자연스럽게 사원 정보를 정리해서 전달하고, 추가로 '부서 정보도 확인하시겠어요?' 라고 물어봐.
            """

        elif "사원" in user_query:
            return jsonify({"response": "📢 다른 사원의 정보는 조회할 권한이 없습니다."})




        elif "부서" in user_query or "부서 정보" in user_query:
            department_df = db.show_data("department")
            if department_df.empty:
                department_info = "📢 현재 확인할 수 있는 부서 정보가 없습니다."
            else:
                department_list = [
                    f"📌 {row['department_id']}번 부서: {row['name']} (연락처: {row['contact_email']})"
                    for _, row in department_df.iterrows()
                ]
                department_info = "\n".join(department_list)

            prompt = f"""
            너는 기업 내부 시스템의 챗봇이야. 사용자가 부서 정보를 요청했어.

            현재 시스템에 등록된 부서는 다음과 같아:
            {department_info}

            사용자가 '부서 정보'라고 입력했어.  
            자연스럽게 부서 정보를 전달하고, 추가로 '특정 부서에 대한 정보가 필요하시면 부서명을 입력해주세요.' 라고 안내해줘.
            """
        elif "공지" in user_query or "공지사항" in user_query:
            announcement_df = db.show_data("announcement")
            if announcement_df.empty:
                announcement_info = "📢 공지사항이 없습니다."
            else:
                announcement_df["department_id"] = pd.to_numeric(
                    announcement_df["department_id"], errors="coerce"
                ).fillna(0).astype(int)

                print(f"📌 변환 후 department_id 데이터:\n{announcement_df[['announcement_id', 'department_id']]}")

                filtered_announcements = announcement_df[
                    (announcement_df["department_id"] == department_id) |
                    (announcement_df["department_id"] == 0)
                    ]
                if filtered_announcements.empty:
                    announcement_info = f"📢 '{department_name}({department_id}번 부서)'에 해당하는 공지사항이 없습니다."
                else:
                    announcement_list = [
                        f"📌 [{row['title']}] - {row['content']} (작성일: {row['created_at']})"
                        for _, row in filtered_announcements.iterrows()
                    ]
                    announcement_info = "\n\n".join(announcement_list)

            prompt = f"""
            너는 기업 내부 시스템의 챗봇이야. 사용자가 공지사항을 요청했어.

            현재 로그인한 사용자는 '{department_name}({department_id}번 부서)'에 속해 있어.

            🏢 최근 공지사항은 다음과 같아:
            {announcement_info}

            사용자가 '{user_query}'라고 입력했어.
            공지사항 내용을 요약해서 전달해줘.

            그리고 추가 질문으로 '근태 정보도 확인하시겠어요?' 라고 물어봐.
            """
        elif "근태" in user_query or "출퇴근" in user_query or "휴가" in user_query or "병가" in user_query or "재택" in user_query:
            attendance_df = db.get_attendance_data()
            if attendance_df.empty:
                attendance_info = "📌 근태 정보가 없습니다."
            else:
                personal_attendance = attendance_df[attendance_df["employee_id"] == employee_id]
                if personal_attendance.empty:
                    attendance_info = "📌 본인의 근태 정보를 찾을 수 없습니다."
                else:
                    work_attendance_list = []  # 출퇴근 정보
                    leave_attendance_list = []  # 휴가 정보
                    sick_attendance_list = []  # 병가 정보
                    remote_attendance_list = []  # 재택근무 정보

                    # ✅ 근태 상태 한글 변환 맵핑
                    status_mapping = {
                        "PRESENT": "출근",
                        "LATE": "지각",
                        "OFF_WORK": "퇴근",
                        "LEAVE": "휴가",
                        "SICK_LEAVE": "병가",
                        "REMOTE_WORK": "재택근무"
                    }

                    for _, row in personal_attendance.iterrows():
                        status = status_mapping.get(row['status'], "알 수 없음")  # ✅ 한글 변환
                        check_in = row['check_in_time'] if pd.notna(row['check_in_time']) else "출근 기록 없음"
                        check_out = row['check_out_time'] if pd.notna(row['check_out_time']) else "아직 퇴근하지 않음"
                        overtime_hours = row['overtime_hours'] if pd.notna(row['overtime_hours']) else 0
                        overtime = f"{overtime_hours}시간 초과 근무" if overtime_hours > 0 else "초과 근무 없음"
                        approval_status = row.get("request_status", "APPROVED")  # ✅ 승인 상태

                        # ✅ 승인 상태 한글 변환
                        approval_mapping = {
                            "APPROVED": "승인 완료",
                            "PENDING": "승인 대기",
                            "REJECTED": "반려됨"
                        }
                        approval_status_kor = approval_mapping.get(approval_status, "승인 상태 없음")

                        # ✅ 출퇴근 정보만 보기 (출근, 지각, 퇴근)
                        if "출퇴근" in user_query and row["status"] in ["PRESENT", "LATE", "OFF_WORK"]:
                            work_attendance_list.append(
                                f"📅 {row['date']}: **{status}**\n"
                                f"   🕒 출근 시간: {check_in}, 퇴근 시간: {check_out}, {overtime}"
                            )

                        # ✅ 휴가 정보만 보기
                        elif "휴가" in user_query and row["status"] == "LEAVE":
                            leave_attendance_list.append(
                                f"📅 {row['date']}: **{status}** 신청됨\n"
                                f"   ✅ 승인 상태: {approval_status_kor}"
                            )

                        # ✅ 병가 정보만 보기
                        elif "병가" in user_query and row["status"] == "SICK_LEAVE":
                            sick_attendance_list.append(
                                f"📅 {row['date']}: **{status}** 신청됨\n"
                                f"   ✅ 승인 상태: {approval_status_kor}"
                            )

                        # ✅ 재택근무 정보만 보기
                        elif "재택" in user_query and row["status"] == "REMOTE_WORK":
                            remote_attendance_list.append(
                                f"📅 {row['date']}: **{status}** 신청됨\n"
                                f"   ✅ 승인 상태: {approval_status_kor}"
                            )

                    # ✅ 최종 출력 메시지 구성
                    if "출퇴근" in user_query:
                        attendance_info = "\n\n".join(work_attendance_list) if work_attendance_list else "📌 출퇴근 기록이 없습니다."
                    elif "휴가" in user_query:
                        attendance_info = "\n\n".join(leave_attendance_list) if leave_attendance_list else "📌 휴가 기록이 없습니다."
                    elif "병가" in user_query:
                        attendance_info = "\n\n".join(sick_attendance_list) if sick_attendance_list else "📌 병가 기록이 없습니다."
                    elif "재택" in user_query:
                        attendance_info = "\n\n".join(remote_attendance_list) if remote_attendance_list else "📌 재택근무 기록이 없습니다."
                    else:
                        attendance_info = "📌 근태 정보를 찾을 수 없습니다."

            prompt = f"""
            너는 기업 내부 시스템의 챗봇이야. 사용자가 근태 정보를 요청했어.

            현재 로그인한 사용자는 '{department_name}({department_id}번 부서)'에 속해 있어.

            ⏳ 근태 정보:
            {attendance_info}

            사용자가 '{user_query}'라고 입력했어.
            이 내용을 반영하여 자연스럽게 안내해줘.

            그리고 추가 질문으로 '공지사항도 확인하시겠어요?' 라고 물어봐.
            """



        #  거래처 정보 요청 시 처리 (영업팀만 가능)
        elif any(keyword in user_query for keyword in ["거래처", "거래처 목록", "거래처 정보"]):
            print(f"🔍 [DEBUG] 거래처 관련 요청 감지됨: {user_query}")
            print(f"🔍 [DEBUG] 로그인한 사용자의 부서 ID: {department_id}")

            if department_id != 1:
                print("❌ [ERROR] 영업팀이 아닌 사용자가 거래처 정보를 조회하려 했음")
                return jsonify({"response": "❌ 거래처 정보는 영업팀 직원만 조회할 수 있습니다."})

            print("✅ [SUCCESS] 영업팀 사용자가 거래처 정보를 조회하려 함, chatbot_sales_response() 실행")
            return chatbot_sales_response()  # 🚀 실행


        elif any(keyword in user_query for keyword in ["제품", "재고", "주문", "판매", "구매", "가격"]):
            print(f"🔍 [DEBUG] 제품 관련 요청 감지됨: {user_query}")
            print(f"🔍 [DEBUG] 로그인한 사용자의 부서 ID: {department_id}")


            #  영업팀 직원만 제품 정보 조회 가능
            if department_id == 1:
                print("✅ [SUCCESS] 영업팀 사용자가 제품 정보를 조회하려 함, chatbot_sales_response() 실행")
                return chatbot_sales_response()  # 🚀 실행

            print("❌ [ERROR] 영업팀이 아닌 사용자가 제품 정보를 조회하려 했음")
            return jsonify({
                "response": "❌ 영업팀이 아닌 사용자는 제품 정보를 조회할 수 없습니다."
            })


        # ✅ 거래내역 조회 요청 처리 (영업팀만 가능)
        elif any(keyword in user_query for keyword in ["거래내역", "거래 기록", "거래 리스트"]):
            print(f"🔍 [DEBUG] 거래내역 조회 요청 감지됨: {user_query}")
            print(f"🔍 [DEBUG] 로그인한 사용자의 부서 ID: {department_id}")

            if department_id != 1:
                print("❌ [ERROR] 영업팀이 아닌 사용자가 거래내역을 조회하려 했음")
                return jsonify({"response": "❌ 거래내역은 영업팀 직원만 조회할 수 있습니다."})

            # ✅ 거래내역 테이블 조회 (client 병합 X)
            transactions_df = db.show_data("transactions")

            # ✅ 테이블 컬럼 확인 (디버깅용)
            print(f"📌 테이블 'transactions'의 컬럼: {transactions_df.columns.tolist()}")

            if transactions_df.empty:
                return jsonify({"response": "📢 현재 등록된 거래내역이 없습니다."})

            # ✅ 거래내역 정보 정리
            transaction_list = [
                f"💰 거래 ID: {row['id']}\n"
                f"   💵 금액: {row['amount']}원 | 유형: {row['type']}\n"
                f"   📅 거래 날짜: {row['date']}\n"
                f"   📝 설명: {row['description']}"
                for _, row in transactions_df.iterrows()
            ]
            transaction_info = "\n\n".join(transaction_list)

            print(f"🔍 [DEBUG] 거래내역 정보 결과:\n{transaction_info}")

            return jsonify({"response": transaction_info})









        else:
            prompt = f"""
            너는 기업 내부 시스템의 챗봇이야. 사용자가 정보를 요청했어.

            현재 로그인한 사용자는 '{department_name}({department_id}번 부서)'에 속해 있어.

            사용자가 '{user_query}'라고 입력했어.
            공지사항, 근태 정보, 부서 정보, 사원 정보 중 어떤 정보를 찾고 계신가요?

            그리고 해당 부분을 요청했을때 없으면 없다고 이야기해주면 될거 같아
            '공지사항', '근태 정보', '부서 정보', '사원 정보','거래 내역' 중 하나를 선택할 수 있도록 안내해줘.
            """





        #  OpenAI 호출
        chat = ChatOpenAI(temperature=0.3, model="gpt-4o-mini")
        response = chat.invoke(prompt)

        # ✅ 응답이 JSON 직렬화 가능하도록 변환
        final_response = response.content if hasattr(response, "content") else "📢 요청한 정보를 가져올 수 없습니다."

        print(f"📢 Flask에서 응답할 데이터: {final_response}")

        return jsonify({"response": final_response})

    except Exception as e:
        print(f"❌ 서버 오류 발생: {str(e)}")
        return jsonify({"response": "🚨 서버 오류가 발생했습니다. 관리자에게 문의하세요."}), 500













# ------------------ ✅ Flask 실행 ------------------ #
if __name__ == '__main__':
    os.environ['OPENAI_API_KEY'] = OPENAI_API_KEY
    app.run(port=6000, debug=True)
