
import eventlet
eventlet.monkey_patch()
import sys

sys.stdout.reconfigure(encoding='utf-8')  # UTF-8 인코딩 설정


from flask import Flask, request
from flask_socketio import SocketIO, emit
import requests
import json
import datetime

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

SPRING_BOOT_URL = "http://127.0.0.1:8080/messages/send"
MESSAGE_LIMIT = 600

connected_users = {}  # ✅ WebSocket 연결된 사용자 목록 (set 사용)

@socketio.on("connect")
def handle_connect(sid):
    print(f" 새로운 클라이언트 연결됨: SID = {sid}")


@socketio.on("register")
def handle_register(data):
    user_id = data.get("user_id")

    try:
        user_id = int(user_id)  #  문자열이 아닌 정수로 변환
    except ValueError:
        print(f" WebSocket 등록 실패: user_id 변환 오류 → {data.get('user_id')}")
        return

    if user_id:
        # 기존 sid 제거
        if user_id in connected_users:
            connected_users[user_id].discard(request.sid)

        if user_id not in connected_users:
            connected_users[user_id] = set()
        connected_users[user_id].add(request.sid)

        print(f" 사용자 {user_id} WebSocket 등록 완료")
        print(f" 현재 WebSocket 연결된 사용자 목록: {connected_users}")


@socketio.on("disconnect")
def handle_disconnect(sid):
    print(f" 사용자 연결 종료: SID = {sid}")

    user_id = None
    for uid, sid_list in connected_users.items():
        if request.sid in sid_list:
            user_id = uid
            sid_list.remove(request.sid)
            if not sid_list:  # 연결된 세션이 없다면 삭제
                del connected_users[uid]
            break

    print(f" 사용자 {user_id} 연결 종료")
    print(f" 현재 WebSocket 연결된 사용자 목록: {connected_users}")


@socketio.on("message")
def handle_message(data):
    chat_room_id = data.get("chatRoomId")
    sender_id = data.get("senderId")
    receiver_id = data.get("receiverId")
    message_text = data.get("messageText")

    print(f" [Flask] 수신 데이터: {json.dumps(data, indent=2, ensure_ascii=False)}")

    if not message_text:
        print(" 메시지가 비어 있습니다.")
        return

    # WebSocket으로 보낼 메시지
    websocket_message = {
        "chatRoomId": chat_room_id,
        "senderId": sender_id,
        "receiverId": receiver_id,
        "messageText": message_text,
        "content": message_text,  # React에서 사용
        "timestamp": datetime.datetime.now().isoformat(),  # ✅ 현재 시간 추가
    }

    # ✅ 수신자(receiver_id)에게만 메시지 전송 (보낸 사람에게는 안 보냄)
    if receiver_id in connected_users:
        for sid in connected_users[receiver_id]:
            print(f" WebSocket 메시지 전송 → 수신자 {receiver_id}, SID: {sid}")
            socketio.emit("message", websocket_message, room=sid)
            socketio.sleep(0)  # WebSocket 이벤트 강제 실행
        print(f"📡 WebSocket 메시지 전송 완료 → 수신자 {receiver_id}")
    else:
        print(f"⚠️ 수신자 {receiver_id}가 WebSocket에 연결되지 않음.")

    # ✅ sender_id에게는 메시지를 보내지 않음 (self-message 차단)


@socketio.on("messagesRead")
def handle_messages_read(data):
    try:
        print(f" [DEBUG] messagesRead 이벤트 핸들러 실행됨! 수신 데이터: {data}")

        if not data:
            print(" [Flask] messagesRead 이벤트 수신 실패: 데이터가 없음")
            return
        
        user_id = data.get("userId")
        chat_room_id = data.get("chatRoomId")
        count = data.get("count", 0)

        print(f" [Flask] messagesRead 이벤트 수신: user_id={user_id}, chat_room_id={chat_room_id}, count={count}")

        if not user_id or not chat_room_id:
            print(f" [Flask] messagesRead 데이터가 유효하지 않음: {data}")
            return

        print(f"📡 [Flask] messagesRead WebSocket 브로드캐스트 실행!")

        # ✅ WebSocket 메시지를 모든 클라이언트에게 전송 (broadcast 대신 `include_self=False` 사용)
        socketio.emit("messagesRead", {
            "userId": user_id,
            "chatRoomId": chat_room_id,
            "count": count
        }, include_self=False)

        socketio.sleep(0)  #🚀 WebSocket 이벤트 강제 실행
        print(f"✅ [Flask] messagesRead 이벤트 브로드캐스트 완료!")

        print(f"📡 [Flask] updateUnreadMessages 이벤트 브로드캐스트 실행!!")

        # ✅ `updateUnreadMessages`도 같은 방식으로 수정
        socketio.emit("updateUnreadMessages", include_self=False)

        socketio.sleep(0)  # 🚀 WebSocket 이벤트 강제 실행
        print(f" [Flask] updateUnreadMessages 이벤트 브로드캐스트 완료!!")

    except Exception as e:
        print(f" [Flask] messagesRead 처리 중 오류 발생: {str(e)}")


@socketio.on("chat_left")  # leave_chat을 chat_left로 변경
def handle_chat_left(data):  # 함수 이름도 일관성 있게 변경
    print(f" chat_left 이벤트 수신")
    chat_room_id = data.get("chatRoomId")
    user_id = data.get("userId")
    
    print(f"👋 사용자 {user_id}가 채팅방 {chat_room_id}에서 나감")
    
    # 모든 클라이언트에게 채팅방 나가기 이벤트를 브로드캐스트
    socketio.emit("chat_left", {
        "chatRoomId": chat_room_id,
        "userId": user_id
    })
    
    print(f" 채팅방 나가기 이벤트 브로드캐스트 완료")

# 서버 시작 시 기존 WebSocket 연결 정보 초기화
def clear_connected_users():
    global connected_users
    connected_users = {}
    print(" 서버 시작: 기존 WebSocket 연결 정보 초기화 완료")

clear_connected_users()


if __name__ == "__main__":
    socketio.run(app, port=5000, debug=True, use_reloader=False)

        # # ✅ receiver_id에 연결된 모든 sid에 메시지를 전송
    # if receiver_id != sender_id and receiver_id in connected_users:  # ✅ sender와 receiver가 다를 때만
    #     unique_sids = list(set(connected_users[receiver_id]))  # ✅ 중복 제거
    #     for sid in unique_sids:
    #         print(f"📡 [Flask] WebSocket 메시지 전송 시도 → 사용자 {receiver_id}, sid: {sid}")
    #         emit("message", websocket_message, room=sid)
    #     print(f"📡 [Flask] 메시지 전송 완료 → 사용자 {receiver_id}")

    # # ✅ 내가 보낸 메시지도 내 화면에 즉시 표시
    # if sender_id in connected_users:
    #     unique_sids = list(set(connected_users[sender_id]))  # ✅ 중복 제거
    #     for sid in unique_sids:
    #         emit("message", websocket_message, room=sid)
    #     print(f"📡 [Flask] 메시지 내 화면 업데이트 → 사용자 {sender_id}")