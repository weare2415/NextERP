import matplotlib
matplotlib.use('Agg')  # ✅ 백엔드를 Agg로 설정 (GUI 비활성화)

import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import db  # ✅ MariaDB 연결 모듈
import pandas as pd
import uuid  # ✅ UUID로 차트 이미지 관리
import re  # ✅ 정규 표현식 사용
from difflib import get_close_matches  # ✅ 유사 단어 검색

# ✅ 한글 폰트 설정
import platform
if platform.system() == 'Windows':
    plt.rc('font', family='Malgun Gothic')  # Windows 환경: 맑은 고딕
elif platform.system() == 'Darwin':
    plt.rc('font', family='AppleGothic')  # Mac 환경: 애플 고딕
else:
    plt.rc('font', family='NanumGothic')  # 리눅스 환경: 나눔고딕

plt.rcParams['axes.unicode_minus'] = False  # 마이너스 기호 깨짐 방지

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ✅ OpenAI API 키 설정
OPENAI_API_KEY = ""
openai.api_key = OPENAI_API_KEY

@app.route('/chat', methods=['POST'])
def chat():
    """ 텍스트 입력을 처리하는 엔드포인트 """
    data = request.get_json()
    user_input = data.get("message", "").strip()

    if not user_input:
        return jsonify({"response": "❌ 입력된 메시지가 없습니다."})

    chatbot_response = process_user_message(user_input)
    return jsonify({"response": chatbot_response})

def process_user_message(user_input):
    """ 사용자의 질문을 분석하여 적절한 데이터 조회 또는 OpenAI API 호출 """
    products = db.show_data("product")  # ✅ MariaDB에서 상품 데이터 조회
    user_input = user_input.lower()

    # ✅ 다양한 표현 인식
    stock_related = ["재고", "수량", "남은", "최소", "최대","많이","적게"]
    price_related = ["가격", "비싼", "싼", "저렴한", "높은", "낮은"]

    # ✅ '재고' 관련 질문
    if any(word in user_input for word in stock_related):
        if any(word in user_input for word in ["제일 많은", "가장 많은", "최대", "많이 남은", "제일 남은", "가장 남은"]):
            return get_product_max_stock(products)
        if any(word in user_input for word in ["제일 적은", "가장 적은", "최소", "적게 남은"]):
            return get_product_min_stock(products)
        return get_product_stock(user_input, products)

    # ✅ '가격' 관련 질문
    if any(word in user_input for word in price_related):
        if any(word in user_input for word in ["제일 싼", "가장 저렴한", "가장 싼", "낮은 가격"]):
            return get_cheapest_product(products)
        if any(word in user_input for word in ["제일 비싼", "가장 비싼", "높은 가격"]):
            return get_most_expensive_product(products)
        return get_product_price(user_input, products)

    # ✅ 제품명과 유사한 제품 추천
    closest_match = fuzzy_matching(user_input, products["product_name"].tolist())
    if closest_match:
        return f"❓ '{user_input}'을 찾을 수 없습니다. 혹시 '{closest_match}'을(를) 찾고 계신가요?"

    # ✅ 기본 챗봇 응답 (GPT 호출)
    return get_chatbot_response(user_input)

def get_product_stock(user_input, products):
    """ 상품의 남은 재고 조회 (부분 일치 + 단어 토큰화) """
    user_input = user_input.lower()
    product_names = [str(name).lower() for name in products["product_name"].dropna().tolist()]
    tokenized_products = {name: name.split() for name in product_names}

    for product, tokens in tokenized_products.items():
        for word in tokens:
            if word in user_input:
                product_data = products[products["product_name"].str.lower() == product].iloc[0]
                return f"📦 '{product_data['product_name']}'의 남은 재고는 {product_data['stock']}개입니다."

    return "❌ 해당 제품의 재고 정보를 찾을 수 없습니다. 다른 제품을 찾으시나요?"

def get_product_price(user_input, products):
    """ 상품의 가격 조회 (부분 일치 + 단어 토큰화) """
    user_input = user_input.lower()
    product_names = [str(name).lower() for name in products["product_name"].dropna().tolist()]
    tokenized_products = {name: name.split() for name in product_names}

    for product, tokens in tokenized_products.items():
        for word in tokens:
            if word in user_input:
                product_data = products[products["product_name"].str.lower() == product].iloc[0]
                return f"💰 '{product_data['product_name']}'의 판매 가격은 {product_data['sale_price']}원입니다."

    return "❌ 해당 제품의 가격 정보를 찾을 수 없습니다."

def get_cheapest_product(products):
    """ 가격이 가장 저렴한 제품 조회 """
    cheapest_product = products.loc[products["sale_price"].idxmin()]
    return f"💰 가장 저렴한 제품은 '{cheapest_product['product_name']}'이며, 가격은 {cheapest_product['sale_price']}원입니다."

def get_most_expensive_product(products):
    """ 가격이 가장 비싼 제품 조회 """
    most_expensive_product = products.loc[products["sale_price"].idxmax()]
    return f"💰 가장 비싼 제품은 '{most_expensive_product['product_name']}'이며, 가격은 {most_expensive_product['sale_price']}원입니다."

def get_product_max_stock(products):
    """ 재고가 가장 많은 제품 조회 """
    max_stock_product = products.loc[products["stock"].idxmax()]
    return f"📦 재고가 가장 많은 제품은 '{max_stock_product['product_name']}'이며, 현재 {max_stock_product['stock']}개 남아 있습니다."

def get_product_min_stock(products):
    """ 재고가 가장 적은 제품 조회 """
    min_stock_product = products.loc[products["stock"].idxmin()]
    return f"📦 재고가 가장 적은 제품은 '{min_stock_product['product_name']}'이며, 현재 {min_stock_product['stock']}개 남아 있습니다."

def fuzzy_matching(user_input, product_names):
    """ 유사한 제품명을 찾아주는 함수 """
    matches = get_close_matches(user_input, product_names, n=1, cutoff=0.5)  # ✅ 유사한 제품 찾기 (최소 50% 이상 일치)
    return matches[0] if matches else None

def get_chatbot_response(user_input):
    """ OpenAI API를 활용한 기본 챗봇 응답 """
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": user_input}]
    )
    return response.choices[0].message.content

if __name__ == '__main__':
    app.run(port=6000)
