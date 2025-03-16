# Next-ERP

----

## 팀원 

### 각 팀원은 기능별로 백엔드와 프론트엔드 하이브리드로 개발

|                    (팀장) [이정현](https://github.com/paesir-i-am)                    |                     [박남수](https://github.com/Namsu-park)                     |                      [황수림](https://github.com/SuLim0813)                     |                      [정우성](https://github.com/weare2415)                     |
|:-------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|
| [<img src="https://avatars.githubusercontent.com/u/183713556?v=4" width="200" />](https://github.com/paesir-i-am) | [<img src="https://avatars.githubusercontent.com/u/184890981?v=4" width="200" />](https://github.com/Namsu-park) | [<img src="https://avatars.githubusercontent.com/u/183588723?v=4" width="200" />](https://github.com/SuLim0813) | [<img src="https://avatars.githubusercontent.com/u/177728506?v=4" width="200" />](https://github.com/weare2415) |

#### 정우성 :
챗봇	"  Python을 사용해서 OpenAI 및 LangChain을 사용하여 자연어 처리를 수행하고, 사용자의 질문에 맞는 정보를 제공하도록 구현
  각 부서, 직급별 권한을 고려 하여 맞춤형 답변 및 OpenAI 프롬프트를 통해 자연스럽게 응답 처리
  MariaDB 데이터를 조회하여 근태, 공지사항, 직원 정보, 거래내역을 실시간으로 확인"
사내 메신저	"  Python과 Socket, Restful을 사용하여 실시간으로 메세지 전달 가능
  생성된 채팅방과 그 채팅방에 나눈 대화는 DB에 저장되며 채팅방을 나갔다가 다시 생성할 때 이전 기록이 남아있기 때문에 이전 채팅 내역 확인 가능
  읽지 않은 메시지의 경우 베이직 레이아웃에 있는 '메신저'옆, 채팅 목록에서 실시간으로 확인 가능"
SMTP	"  비밀번호를 잊어버린 사용자가 비밀번호를 찾기 위해 1차적으로 사원ID를 입력하여 회사의 사원임을 인증
  이후 이름과 이메일을 입력해서 2차 검증을 받은 이후 사용자가 입력한 메일주소로 임시 비밀번호 전송
  전송 된 임시 비밀번호를 입력하면 로그인 가능"
CRUD	"  인사팀(공지사항, 근태관리, 직원관리) 기본적인 CURD 구현
  스케줄러 이용한 퇴사 자동처리 구현
  단 수정을 할 때에는 권한 설정을 했기 때문에 바로 수정이 불가능하고 수정에 대한 승인 요청을 보내고 '승인' 처리가 돼야 실제 데이터가 수정됨
  페이지네이션을 컴포넌트화해서 여러 컴포넌트에서 손쉽게 페이지네이션 기능 적용"
권한 처리	"  로그인 시 Redux의 로그인 슬라이스를 활용하여 사용자 정보를 조회하고, 
  해당 회원의 부서 ID 및 직급 ID를 식별하여 동적으로 권한을 부여하도록 구현
  이를 통해 각 사용자가 소속된 부서 및 직급에 따라 접근 가능한 메뉴 및 기능을 제어하며, 사용자별 맞춤형 시스템 환경을 제공함"
API	  Spring Mail, Redux Toolkit, Axios,

---

## 🛠️ 주요 기능
  1. 항공권 조회 및 결제
  2. SNS 커뮤니티
  3. 이미지검색을 통한 여행지 추천
  4. API 사용 페이지
  5. 로그인 시큐리티 및 소셜로그인
  6. 모바일 반응형 웹페이지 제작
  7. 무한 스크롤 구현
  8. JWT 토큰 사용 보안처리
  9. AWS 이용한 서버 배포

###  📚사용 스택
<div>
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
<img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=Spring Boot&logoColor=white">
<img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=MariaDB&logoColor=white">
<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=white">
<img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white">
<br/><img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=Sass&logoColor=white">
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">
<img src="https://img.shields.io/badge/Tensorflow-FF6F00?style=for-the-badge&logo=Tensorflow&logoColor=white">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white">
<br/><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">
<img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white">
<img src="https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jQuery&logoColor=white">
<img src="https://img.shields.io/badge/Amazon S3-569A31?style=for-the-badge&logo=Amazon S3&logoColor=white">
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=white"><br/><br/> </div>


💻  OS : window, Mac

🖥️ Front-end : React

🗄️ back-end : Spring Boot

💾 Database : MariaDB

📡 Server : AWS

----

# 기능 소개

## 시연영상 및 팀 프로젝트 PDF


## 🎥 [유튜브 시연영상](https://youtu.be/FkKbrmHiR6Y?si=i88SdIl2fiTTzo5w)

## 📋 [PDF 보기](https://nbviewer.org/github/paesir-i-am/Wanderlust/blob/main/Wanderlust_%E1%84%89%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC.pdf)


## 계층구조

<img src="https://github.com/user-attachments/assets/d74967c4-cbd6-407a-99fa-9c8c243e3561" />


## 구현 기능

### 항공권 조회 및 결제

실제 항공권 데이터를 조회하고 필터링이 가능하며

포트원 api 를 사용하여 실제 결제까지 가능하도록 구현

<img src="https://github.com/user-attachments/assets/5280402b-e995-4337-8536-e5fe9ac53c7c" width="512" /><br/>

### [플로우차트 및 주요 코드 확인](https://github.com/paesir-i-am/Wanderlust/blob/main/readMe/flight.md)

### SNS 커뮤니티

게시글, 댓글 등과 개인별 프로필 페이지를 이용하여 본인의 포스트나 자기소개 프로필 이미지 등을 구성하고

팔로우 서비스를 통한 멤버별로의 관계를 형성해서 소셜 네트워크 서비스를 구현하였고

실시간 알림 서비스를 통해 본인을 팔로우하거나 새로운 글, 댓글 등의 정보를 실시간으로 제공받을 수 있음

#### 포스트 작성, 팔로우, 댓글
<img src="https://github.com/user-attachments/assets/e86c3640-a8e4-4d6f-893c-5a6d70caf59c" width="512" /><br/>

#### 대댓글 작성, 실시간 알림
<img src="https://github.com/user-attachments/assets/618a5006-dc84-48df-8f66-15fe0a09435a" width="512" /><br/>

#### 프로필 페이지, 프로필 정보 수정
<img src="https://github.com/user-attachments/assets/3569f4b0-f93a-4745-9fee-18ff9780e04d" width="512" /><br/>

### [SNS 커뮤니티 플로우 및 주요 코드](https://github.com/paesir-i-am/Wanderlust/blob/main/readMe/community.md)

---

### 추천 여행지 리스트

추천 여행지 리스트를 만들어서 사용자들이 주변 여행지를 찾을 수 있고 해당 지역 주변 정보들을 구글 맵 api를 이용하여 필터링 및 경로 안내를 가능하도록 구현

<img src="https://github.com/user-attachments/assets/c18c7607-ed1c-4dc0-b777-7701ff95f614" width="512" /><br/>

### 이미지 검색

파이썬의 TensorFlow 를 이용하여 사진 검색 엔진을 개발 및 학습시켜 추천 여행지의 리스트들을 학습시켰고 모델링하여 해당 리스트 페이지로 리다이렉트

<img src="https://github.com/user-attachments/assets/931dcee0-35c4-462b-92a4-641a7d6838a6" width="512" /><br/>

### [이미지 검색 주요 코드](https://github.com/paesir-i-am/Wanderlust/blob/main/readMe/searchImage.md)

---

### 회원가입/로그인 및 소셜로그인

로컬서버를 통한 회원가입 및 소셜로그인을 구현

<img src="https://github.com/user-attachments/assets/e345a2f2-792c-448d-a50e-b8a7a8d9d56b" width="512" /><br/>

### [로그인 플로우 및 주요 코드](https://github.com/paesir-i-am/Wanderlust/blob/main/readMe/login.md)

----

### API를 통한 항공 정보 페이지 제공

공공데이터포탈 및 여러 항공 관련 api의 정보를 제공하여 사용자의 이용성 증가

<img src="https://github.com/user-attachments/assets/4cdb0dde-bae5-44a3-9141-24014786cf9d" width="512" /><br/>

---

### 모바일 반응형 웹페이지

반응형 웹페이지 및 무한스크롤을 구현하여 모바일 시장에 맞춘 사용자 이용성 증가

<img src="https://github.com/user-attachments/assets/c3b258ef-7fc4-42f0-ae28-e7bd5b2444bf" width="512" /><br/>


---
