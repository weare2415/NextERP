import eventlet
eventlet.monkey_patch()

from flask import Flask, request
from flask_socketio import SocketIO, emit
import requests
import json

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

SPRING_BOOT_URL = "http://127.0.0.1:8080/messages/send"
MESSAGE_LIMIT = 600

connected_users = {}  # ✅ WebSocket 연결된 사용자 목록 (set 사용)

@socketio.on("connect")
def handle_connect():
    print("✅ 새로운 클라이언트 연결됨")

@socketio.on("disconnect")
def handle_disconnect():
    user_id = None
    for uid, sid_list in connected_users.items():
        if request.sid in sid_list:
            user_id = uid
            sid_list.remove(request.sid)
            if not sid_list:  # ✅ 연결된 세션이 없다면 삭제
                del connected_users[uid]
            break

    print(f"❌ 사용자 {user_id} 연결 종료")
    print(f"🔍 현재 WebSocket 연결된 사용자 목록: {connected_users}")

@socketio.on("register")
def handle_register(data):
    user_id = data.get("user_id")  # ✅ ID를 그대로 숫자로 유지
    if user_id:
        if user_id not in connected_users:
            connected_users[user_id] = set()  # ✅ 중복 방지 → set() 사용
        connected_users[user_id].add(request.sid)  # ✅ 중복된 세션 방지
        print(f"✅ 사용자 {user_id} WebSocket 등록 완료")
        print(f"🔍 현재 WebSocket 연결된 사용자 목록: {connected_users}")

@socketio.on("message")
def handle_message(data):
    chat_room_id = data.get("chatRoomId")
    sender_id = data.get("senderId")
    receiver_id = data.get("receiverId")
    message_text = data.get("messageText")
    jwt_token = data.get("jwtToken")

    if not message_text:
        print("❌ 메시지가 비어있습니다. 확인 필요!")
        return

    print(f"📩 [Flask] 수신 데이터: {json.dumps(data, indent=2, ensure_ascii=False)}")

    if not jwt_token or jwt_token == "undefined":
        print("❌ JWT 토큰이 전달되지 않았습니다. 401 오류 발생!")
        return

    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json"
    }

    try:
        chat_room_id = int(chat_room_id) if chat_room_id is not None else None
        sender_id = int(sender_id) if sender_id is not None else None  # ✅ 정수 변환 유지
        receiver_id = int(receiver_id) if receiver_id is not None else None  # ✅ 정수 변환 유지
    except ValueError:
        print("❌ senderId 또는 receiverId를 정수로 변환할 수 없음!")
        return

    # ✅ Spring Boot로 저장할 메시지 데이터 (정수 유지)
    new_message = {
        "chatRoomId": chat_room_id,
        "senderId": sender_id,
        "receiverId": receiver_id,
        "messageText": message_text
    }

    print(f"📡 [Flask] Spring Boot 저장 데이터: {json.dumps(new_message, indent=2, ensure_ascii=False)}")

    response = requests.post(SPRING_BOOT_URL, json=new_message, headers=headers)

    print(f"📡 [Flask] Spring Boot 응답 코드: {response.status_code}")
    print(f"📡 [Flask] Spring Boot 응답 데이터: {response.text}")

    print(f"🔍 현재 WebSocket 연결된 사용자 목록: {connected_users}")

    # ✅ WebSocket으로 보내줄 메시지 (React에서 content 사용하도록 추가)
    websocket_message = {
        "chatRoomId": chat_room_id,
        "senderId": sender_id,
        "receiverId": receiver_id,
        "messageText": message_text,
        "content": message_text  # ✅ React에서 `content` 사용하도록 추가
    }

    # ✅ WebSocket 메시지 전송 (중복 방지)
    if receiver_id in connected_users:
        unique_sids = list(set(connected_users[receiver_id]))  # ✅ 중복 제거
        for sid in unique_sids:
            print(f"📡 [Flask] WebSocket 메시지 전송 시도 → 사용자 {receiver_id}, sid: {sid}")
            emit("message", websocket_message, room=sid)
        print(f"📡 [Flask] 메시지 전송 완료 → 사용자 {receiver_id}")

    # ✅ 내가 보낸 메시지도 내 화면에 즉시 표시
    if sender_id in connected_users:
        unique_sids = list(set(connected_users[sender_id]))  # ✅ 중복 제거
        for sid in unique_sids:
            emit("message", websocket_message, room=sid)
        print(f"📡 [Flask] 메시지 내 화면 업데이트 → 사용자 {sender_id}")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, use_reloader=False)
