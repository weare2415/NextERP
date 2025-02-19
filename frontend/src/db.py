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
    "local_infile": True  # 반드시 추가해야 함
}

def load_csv_with_infile(csv_file, table, data):
    conn = mariadb.connect(**DB_CONFIG)
    cur = conn.cursor()\
    
    # CSV 파일 읽기
    # skiprows=1, 
    df = pd.read_csv(csv_file, encoding='cp949', delimiter='\t')  # 첫 번째 행은 헤더이므로 건너뜀
    column_name = [str(x) for x in df.columns]
    print(df)

    try:
        # 데이터 삽입
        cur.execute(f"""CREATE TABLE {table} (
        {data}
        """)

        for _, row in df.iterrows():
            cur.execute(f"""
                INSERT INTO {table} (
                    {column_name}
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, tuple(row))

        conn.commit()
        cur.close()
        conn.close()
        print("✅ 데이터 삽입 완료!")
    except mariadb.Error as e:
        print(f"❌ 삽입 실패: {e}")

    cur.close()
    conn.close()


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
    "local_infile": True  # 반드시 추가해야 함
}

def show_data(table):
    conn = None
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        # 데이터 조회
        cur.execute(f"SELECT * FROM {table}")
        columns = [x[0] for x in cur.description]

        rows = cur.fetchall()
        result = []

        if rows:
            for r in rows:
                new_row = []
                for v in r:
                    # ✅ 날짜 타입인지 확인하고 변환
                    if isinstance(v, (datetime.date, datetime.datetime)):
                        val = v.strftime("%Y-%m-%d")  # 날짜 변환
                    else:
                        val = v  # 날짜가 아니면 그대로 사용
                    new_row.append(val)
                result.append(new_row)

        result = pd.DataFrame(result, columns=columns)
        return result

    except mariadb.Error as e:
        print(f"❌ 데이터 조회 실패: {e}")

    finally:
        if conn:
            cur.close()
            conn.close()




def get_all_data():
    conn = None
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        # 데이터 조회
        cur.execute(f"SHOW Tables")
        rows = cur.fetchall()
        
        table_names = [x[0] for x in rows]
        #print(table_names)

        DB = pd.DataFrame()
        for i in range(len(table_names)):
            df = show_data(table_names[i])
            DB = pd.concat([DB, df])

        # print(DB)
        # DB.to_csv('./temp.csv')
        return DB

    
    except mariadb.Error as e:
        print(f"❌ 데이터 조회 실패: {e}")

    finally:
        if conn:
            cur.close()
            conn.close()

# CSV파일 연결 
# if __name__ == '__main__':
#     df = get_all_data()
#     df.to_csv('./temp2.csv', encoding='cp949')
#     print(df)


    # path='C:/Users/sh/IdeaProjects/front_point/chat_point/부동산.csv'
    # table='real_estate'
    # # 컬럼 생성, 타입 설정 
    # data ='''매물 VARCHAR(20),
    #         예산 INT NOT NULL,
    #         대출가능금액 INT NOT NULL,
    #         위치조건 VARCHAR(20)'''
    # load_csv_with_infile(path, table, data)

    # show_data('stock')