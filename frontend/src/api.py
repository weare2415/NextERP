from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import db  # ✅ MariaDB 연결 모듈
import requests
from langchain_openai import ChatOpenAI
from langchain_experimental.agents import create_pandas_dataframe_agent

SPRING_BOOT_API_BASE = "http://localhost:8080/api"  # ✅ Spring Boot API 주소

app = Flask(__name__)
CORS(app)

# ✅ OpenAI API Key 설정
OPENAI_API_KEY = ""
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

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

        # ✅ employee_id와 department_id를 정수형(int)으로 변환
        try:
            employee_id = int(employee_id)
            department_id = int(department_id)
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
        else:
            # ✅ 일반 직원은 본인 정보만 조회 가능
            personal_info = merged_df[merged_df["employee_id"] == employee_id]
            if personal_info.empty:
                return jsonify({"response": "❌ 본인의 사원 정보를 찾을 수 없습니다."})
            employee_info = personal_info.to_dict(orient="records")

        return jsonify({"response": employee_info})

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
    data = request.json
    employee_id = data.get("employeeId")
    department_id = data.get("departmentId")

    # ✅ 근태 테이블에서 데이터 가져오기
    df = db.get_attendance_data()
    print(f"🔍 근태 데이터 조회 결과:\n{df}")  # ⬅ 데이터 출력 확인

    if df.empty:
        return jsonify({"response": "❌ 근태 데이터를 가져올 수 없습니다."})

    # ✅ 인사팀(3)만 전체 근태 정보 조회 가능
    if department_id == 3:
        return jsonify({"response": df.to_dict(orient="records")})
    
    # ✅ 일반 직원은 본인 근태 정보만 조회 가능
    personal_attendance = df[df["employee_id"] == employee_id]
    print(f"🔍 필터링된 근태 데이터:\n{personal_attendance}")  # ⬅ 필터링된 데이터 확인

    return jsonify({"response": personal_attendance.to_dict(orient="records")}) if not personal_attendance.empty else jsonify({"response": "❌ 본인의 근태 정보를 찾을 수 없습니다."})




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

        # ✅ employee_id와 department_id를 정수형(int)으로 변환
        try:
            employee_id = int(employee_id)
            department_id = int(department_id)
        except ValueError:
            return jsonify({"response": "❌ 직원 ID 또는 부서 ID가 올바르지 않습니다."}), 400

        print(f"📌 로그인한 사용자 부서 ID: {department_id}")

        # ✅ 부서 ID 매핑
        DEPARTMENT_MAPPING = {
            1: "영업팀",
            2: "회계팀",
            3: "인사팀",
        }
        department_name = DEPARTMENT_MAPPING.get(department_id, "알 수 없는 부서")

        # ✅ 사원 정보 조회 (현재 로그인한 사용자만 조회)
        employee_df = db.show_data("employee")

        if employee_df.empty:
            employee_info = "📢 현재 확인할 수 있는 사원 정보가 없습니다."
        else:
            # ✅ 요청한 사원의 ID가 로그인한 사용자 ID와 다르면 조회 불가
            if "사원" in user_query and str(employee_id) not in user_query:
                return jsonify({"response": "다른 사원의 정보를 조회할 권한이 없습니다."})
            personal_employee = employee_df[employee_df["employee_id"] == employee_id]
            if personal_employee.empty:
                employee_info = "📢 본인의 사원 정보를 찾을 수 없습니다."
            else:
                employee_info = personal_employee.to_dict(orient="records")[0]  # JSON 형태로 변환

        # ✅ OpenAI 프롬프트 생성 (LangChain 활용)
        if "사원" in user_query or "내 정보" in user_query:
            prompt = f"""
            너는 기업 내부 시스템의 챗봇이야. 사용자가 자신의 사원 정보를 요청했어.

            📌 사원 정보:
            {employee_info}

            사용자가 '{user_query}'라고 입력했어.  
            그리고 다른 사원의 정보는 보여주면안될거 같아
            자연스럽게 사원 정보를 정리해서 전달하고, 추가로 '부서 정보도 확인하시겠어요?' 라고 물어봐.
            """
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
        elif "근태" in user_query or "출퇴근" in user_query:
            attendance_df = db.get_attendance_data()
            if attendance_df.empty:
                attendance_info = "📌 근태 정보가 없습니다."
            else:
                personal_attendance = attendance_df[attendance_df["employee_id"] == employee_id]
                if personal_attendance.empty:
                    attendance_info = "📌 본인의 근태 정보를 찾을 수 없습니다."
                else:
                    attendance_info_list = []
                    for _, row in personal_attendance.iterrows():
                        check_in = row['check_in_time']
                        check_out = row['check_out_time'] if pd.notna(row['check_out_time']) else "아직 퇴근하지 않음"
                        overtime = f"{row['overtime_hours']}시간 초과 근무" if row['overtime_hours'] > 0 else "초과 근무 없음"
                        status = row['status']
                        attendance_info_list.append(f"📅 {row['date']}에 {status} 상태로 출근하였으며, 출근 시간은 {check_in}, 퇴근 시간은 {check_out}입니다. {overtime}.")
                    attendance_info = "\n".join(attendance_info_list)

            prompt = f"""
            너는 기업 내부 시스템의 챗봇이야. 사용자가 근태 정보를 요청했어.

            현재 로그인한 사용자는 '{department_name}({department_id}번 부서)'에 속해 있어.

            ⏳ 근태 정보:
            {attendance_info}

            사용자가 '{user_query}'라고 입력했어.
            이 내용을 반영하여 자연스럽게 안내해줘.

            그리고 추가 질문으로 '공지사항도 확인하시겠어요?' 라고 물어봐.
            """
        else:
            prompt = f"""
            너는 기업 내부 시스템의 챗봇이야. 사용자가 정보를 요청했어.

            현재 로그인한 사용자는 '{department_name}({department_id}번 부서)'에 속해 있어.

            사용자가 '{user_query}'라고 입력했어.
            공지사항, 근태 정보, 부서 정보, 사원 정보 중 어떤 정보를 찾고 계신가요?

            '공지사항', '근태 정보', '부서 정보', '사원 정보' 중 하나를 선택할 수 있도록 안내해줘.
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













# ------------------ ✅ Flask 실행 ------------------ #
if __name__ == '__main__':
    app.run(port=6000, debug=True)
