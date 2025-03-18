# Next-ERP

----

## 팀원 

### 각 팀원은 기능별로 백엔드와 프론트엔드 하이브리드로 개발

|                    (팀장) [이정현](https://github.com/paesir-i-am)                    |                     [박남수](https://github.com/Namsu-park)                     |                      [황수림](https://github.com/SuLim0813)                     |                      [정우성](https://github.com/weare2415)                     |
|:-------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|
| [<img src="https://avatars.githubusercontent.com/u/183713556?v=4" width="200" />](https://github.com/paesir-i-am) | [<img src="https://avatars.githubusercontent.com/u/184890981?v=4" width="200" />](https://github.com/Namsu-park) | [<img src="https://avatars.githubusercontent.com/u/183588723?v=4" width="200" />](https://github.com/SuLim0813) | [<img src="https://avatars.githubusercontent.com/u/177728506?v=4" width="200" />](https://github.com/weare2415) |


## 🛠️ 나의역할 및  주요기능

- **채팅봇**: OpenAI 및 LangChain을 사용하여 자연어 처리를 수행하고, 사용자의 질문에 맞는 정보를 제공합니다.
- **사내 메신저**: Python과 Socket, RESTful을 사용하여 실시간 메시지 전달 기능을 구현합니다.
- **비밀번호 찾기**: 사용자가 사원 ID로 인증한 후, 이메일로 임시 비밀번호를 전송합니다.
- **CRUD 기능**: 인사팀(공지사항, 근태관리, 직원관리)의 기본적인 CRUD 기능을 제공합니다.
- **권한 처리**: Redux의 로그인 슬라이스를 활용하여 사용자 정보를 조회하고, 동적으로 권한을 부여합니다.



###  📚사용 스택
<div>
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
<img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=Spring Boot&logoColor=white">
<img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=MariaDB&logoColor=white">
<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=white">
<img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white">
<br/><img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=Sass&logoColor=white">
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white">
<br/><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">
<img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white">
<img src="https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jQuery&logoColor=white">
<img src="https://img.shields.io/badge/Amazon S3-569A31?style=for-the-badge&logo=Amazon S3&logoColor=white">
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=white">
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=OpenAI&logoColor=white">
<img src="https://img.shields.io/badge/LangChain-0077FF?style=for-the-badge&logo=LangChain&logoColor=white">
<img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white"><br/><br/> </div>


💻  OS : window, Mac

🖥️ Front-end : React

🗄️ back-end : Spring Boot

💾 Database : MariaDB

📡 Server : AWS

----

# 기능 소개

## 시연영상 및 팀 프로젝트 PDF


## 🎥 [유튜브 시연영상](https://www.youtube.com/watch?si=pwBtcg6jGeqpiEuJ&v=M5hPxD0m3Sk&feature=youtu.be)

## 📋 [PDF 보기](https://github.com/weare2415/NextERP/blob/develop/NEXTERP(%EA%B0%9C%EC%9D%B8%20pdf).pdf)




## 구현 기능

### 챗봇

Python을 사용해서 OpenAI 및 LangChain을 사용하여 자연어 처리를 수행하고, 사용자의 질문에 맞는 정보를 제공하도록 구현하였습니다. 각 부서, 직급별 권한을 고려하여 맞춤형 답변 및 OpenAI 프롬프트를 통해 자연스럽게 응답 처리하며, MariaDB 데이터를 조회하여 근태, 공지사항, 직원 정보, 거래내역을 실시간으로 확인할 수 있습니다.


<img src="https://github.com/user-attachments/assets/c3b258ef-7fc4-42f0-ae28-e7bd5b2444bf" width="512" /><br/>




### 사내 메신저

Python과 Socket, RESTful을 사용하여 실시간으로 메시지를 전달할 수 있도록 구현하였습니다. 생성된 채팅방과 그 채팅방에 나눈 대화는 DB에 저장되며, 채팅방을 나갔다가 다시 생성할 때 이전 기록이 남아 있어 이전 채팅 내역을 확인할 수 있습니다. 읽지 않은 메시지는 베이직 레이아웃에 있는 '메신저' 옆, 채팅 목록에서 실시간으로 확인할 수 있습니다.

<img src="https://github.com/user-attachments/assets/0d25cd17-79dc-4b87-95c8-035019e0c801" width="512" />
<br/>

### SMTP

비밀번호를 잊어버린 사용자가 비밀번호를 찾기 위해 1차적으로 사원 ID를 입력하여 회사의 사원임을 인증합니다. 이후 이름과 이메일을 입력해서 2차 검증을 받은 후 사용자가 입력한 메일주소로 임시 비밀번호를 전송합니다. 전송된 임시 비밀번호를 입력하면 로그인할 수 있습니다.

<img src="https://github.com/user-attachments/assets/your_smtp_image.png" width="512" /><br/>

### CRUD

인사팀(공지사항, 근태 관리, 직원 관리)의 기본적인 CRUD 기능을 구현하였습니다. 스케줄러를 이용한 퇴사 자동처리 기능도 구현하였으며, 수정을 할 때에는 권한 설정이 되어 있어 바로 수정이 불가능하고 수정에 대한 승인 요청을 보내야 실제 데이터가 수정됩니다. 페이지네이션을 컴포넌트화하여 여러 컴포넌트에서 손쉽게 페이지네이션 기능을 적용할 수 있습니다.

<img src="https://github.com/user-attachments/assets/your_crud_image.png" width="512" /><br/>

### 권한 처리

로그인 시 Redux의 로그인 슬라이스를 활용하여 사용자 정보를 조회하고, 해당 회원의 부서 ID 및 직급 ID를 식별하여 동적으로 권한을 부여하도록 구현하였습니다. 이를 통해 각 사용자가 소속된 부서 및 직급에 따라 접근 가능한 메뉴 및 기능을 제어하며, 사용자별 맞춤형 시스템 환경을 제공합니다.

<img src="https://github.com/user-attachments/assets/your_permission_image.png" width="512" /><br/>

---

### 모바일 반응형 웹페이지

반응형 웹페이지 및 무한스크롤을 구현하여 모바일 시장에 맞춘 사용자 이용성 증가

<img src="https://github.com/user-attachments/assets/c3b258ef-7fc4-42f0-ae28-e7bd5b2444bf" width="512" /><br/>


---
