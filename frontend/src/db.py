import mariadb
import pandas as pd
import datetime

# 데이터베이스 연결 정보
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "paesir",
    "password": "386500",
    "database": "next-erp",
    "local_infile": True
}

def show_data(table):
    """ 특정 테이블의 데이터를 가져와 Pandas DataFrame으로 변환 """
    conn = None
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        # 데이터 조회
        cur.execute(f"SELECT * FROM {table}")
        columns = [x[0] for x in cur.description]

        # 컬럼명 출력
        print(f"📌 테이블 '{table}'의 컬럼: {columns}")

        rows = cur.fetchall()
        result = []

        if rows:
            for r in rows:
                new_row = []
                for v in r:
                    #  날짜 타입 변환
                    if isinstance(v, (datetime.date, datetime.datetime)):
                        val = v.strftime("%Y-%m-%d")
                    else:
                        val = v
                    new_row.append(val)
                result.append(new_row)

        # ✅ Pandas DataFrame 생성
        df = pd.DataFrame(result, columns=columns)
        return df

    except mariadb.Error as e:
        print(f"❌ 데이터 조회 실패: {e}")
        return pd.DataFrame()

    finally:
        if conn:
            cur.close()
            conn.close()

# 공지사항 테이블
def get_announcements_data():
    return show_data("announcement")


#  근태 테이블 조회
# ✅ 근태 테이블 조회 (employee_id 타입 변환 추가)
def get_attendance_data():
    df = show_data("attendance")

    if df.empty:
        return df  # 빈 DataFrame 반환

    # ✅ employee_id를 정수형(int)으로 변환
    df["employee_id"] = pd.to_numeric(df["employee_id"], errors="coerce").fillna(0).astype(int)

    # ✅ 로그 출력하여 데이터 확인
    print(f"🔍 근태 데이터 조회 결과:\n{df}")
    print(f"🔍 근태 데이터 컬럼명: {df.columns}")

    return df

# ✅ 부서 테이블 조회 추가
def get_department_data():
    df = show_data("department")

    if df.empty:
        return df  # 빈 DataFrame 반환

    # ✅ 로그 출력하여 데이터 확인
    print(f"🔍 부서 데이터 조회 결과:\n{df}")
    print(f"🔍 부서 데이터 컬럼명: {df.columns}")

    return df


# ✅ 사원 테이블 조회 (employee_id 타입 변환 추가)
def get_employee_data():
    df = show_data("employee")

    if df.empty:
        return df  # 빈 DataFrame 반환

    # ✅ employee_id를 정수형(int)으로 변환
    df["employee_id"] = pd.to_numeric(df["employee_id"], errors="coerce").fillna(0).astype(int)

    # ✅ 로그 출력하여 데이터 확인
    print(f"🔍 사원 데이터 조회 결과:\n{df}")
    print(f"🔍 사원 데이터 컬럼명: {df.columns}")

    return df


#영업 부분에서는 판매/구매 금액에서 똑같은게 많음(구분 지어야함/ 필터)
# 재고 개수(영업팀 다 depart) / 판매기록, 구매기록(영업팀 기준으로만) / client 거래처 조회(영업팀기준으로)
#  영업팀 데이터 조회
def get_sales_data():
    """📌 영업팀 전용 데이터 조회 (주문, 제품, 거래처 정보 + 거래 정보)"""
    conn = None
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        # ✅ 영업팀 관련 테이블 조회 (기존 + transactions 추가)
        sales_tables = ["orders", "product", "client", "transactions"]
        data_frames = {}

        for table in sales_tables:
            print(f"🔄 '{table}' 테이블 데이터 조회 중...")
            df = show_data(table)
            if not df.empty:
                data_frames[table] = df  # 각 테이블 별로 저장

        # ✅ 데이터 병합 (orders + product + client + transactions)
        if all(table in data_frames for table in sales_tables):
            orders_df = data_frames["orders"]
            product_df = data_frames["product"]
            client_df = data_frames["client"]
            transactions_df = data_frames["transactions"]

            # ✅ 주문 테이블에 제품 정보 병합
            orders_df = orders_df.merge(product_df, left_on="product_id", right_on="id", suffixes=("_order", "_product"))

            # ✅ 주문 테이블에 거래처 정보 병합
            orders_df = orders_df.merge(client_df, left_on="client_code", right_on="client_code", suffixes=("_order", "_client"))

            # ✅ 주문 테이블에 거래 내역 추가
            orders_df = orders_df.merge(transactions_df, left_on="id_order", right_on="id", suffixes=("_order", "_transaction"))

            sales_data = orders_df
        else:
            sales_data = pd.DataFrame()

        # ✅ 로그 출력하여 데이터 확인
        print(f"🔍 영업팀 데이터 조회 결과:\n{sales_data}")
        print(f"🔍 영업팀 데이터 컬럼명: {sales_data.columns}")

        return sales_data

    except mariadb.Error as e:
        print(f"❌ 영업팀 데이터 조회 실패: {e}")
        return pd.DataFrame()

    finally:
        if conn:
            cur.close()
            conn.close()





def get_all_data():
    """ 데이터베이스의 모든 테이블 데이터를 가져오는 함수 """
    conn = None
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        # 테이블 조회
        cur.execute("SHOW TABLES")
        rows = cur.fetchall()
        
        table_names = [x[0] for x in rows]
        DB = pd.DataFrame()

        # 각 테이블의 데이터를 조회하여 하나의 DataFrame으로 합치기
        data_frames = []
        for table in table_names:
            print(f"🔄 '{table}' 테이블 데이터 조회 중...")
            df = show_data(table)
            
            if not df.empty:  # ✅ 빈 데이터프레임 제외
                data_frames.append(df)

        # ✅ 빈 데이터프레임 제거 후 concat 수행
        if data_frames:
            DB = pd.concat(data_frames, ignore_index=True)

        return DB

    except mariadb.Error as e:
        print(f"❌ 데이터 조회 실패: {e}")
        return pd.DataFrame()  # 실패 시 빈 DataFrame 반환

    finally:
        if conn:
            cur.close()
            conn.close()