package com.nexterp.member.service;

import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.member.dto.MemberResponseDTO;
import com.nexterp.member.entity.Member;
import com.nexterp.member.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    private final JavaMailSender mailSender; // ✅ JavaMailSender 사용 (Spring Boot가 관리)


    private static final Logger logger = LoggerFactory.getLogger(MemberServiceImpl.class);

    // **Member 생성**
    @Override
    public Member createMember(Employee employee) {
        String role = employee.getPosition().getRole();

        Member member = Member.builder()
                .id(employee.getId().toString())
                .password(passwordEncoder.encode("00000000")) // 초기 비밀번호 설정
                .name(employee.getName())
                .role(role)
                .isInitialPassword(true)
                .employee(employee)
                .build();

        return memberRepository.save(member);
    }

    //업데이트 로직 추가
    @Transactional
    public void updateMemberName(Integer employeeId, String newName) {
        Optional<Member> optionalMember = memberRepository.findByEmployeeId(employeeId.toString()); // ✅ Integer 사용

        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            member.setName(newName); // ✅ 이름 변경
            memberRepository.save(member); // ✅ 저장
            System.out.println("✅ Member 이름 변경 완료: " + newName);
        } else {
            System.out.println("⚠️ Member를 찾을 수 없습니다. employeeId: " + employeeId);
        }}


    // **비밀번호 변경**
    public void changePassword(String id, String newPassword) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("이름 또는 이메일이 일치하지 않습니다."));

        member.setPassword(passwordEncoder.encode(newPassword));
        member.setInitialPassword(false);
        memberRepository.save(member);
    }

    // **비밀번호 초기화**
    public void resetPassword(String name, String email) {
        // ✅ 1. 이름과 이메일로 Employee 조회 (id 찾기)
        Employee employee = employeeRepository.findByNameAndEmail(name, email)
                .orElseThrow(() -> new IllegalArgumentException("이름 또는 이메일이 일치하는 회원이 없습니다."));
        logger.info("Employee 정보: {}", employee);

        Integer employeeId = employee.getId();
        String employeeIdString = String.valueOf(employeeId);
        logger.info("변환된 Employee ID (String): {}", employeeIdString);

        // ✅ 2. Member 조회
        Member member = memberRepository.findByEmployeeId(employeeIdString)
                .orElseThrow(() -> new IllegalArgumentException("해당 직원의 계정 정보가 없습니다."));
        logger.info("Member 정보: {}", member);

        // ✅ 3. 랜덤 비밀번호 생성
        String newPassword = generateRandomPassword(8);
        System.out.println("새 비밀번호 (암호화 전): " + newPassword);

        // ✅ 4. 이메일 전송 (환경 변수에서 발신 이메일 정보 가져오기)
        sendPasswordResetEmail(employee.getEmail(), employee.getName(), newPassword);

        // ✅ 5. 비밀번호 암호화 후 저장
        member.setPassword(passwordEncoder.encode(newPassword));
        member.setInitialPassword(true);
        memberRepository.save(member);
    }

    // **랜덤 비밀번호 생성**
    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }

    private void sendPasswordResetEmail(String recipientEmail, String recipientName, String newPassword) {
        try {
            // 🔍 수신자 이메일 로그 확인
            logger.info("🔍 이메일 전송 시도 - 받는 사람: [{}]", recipientEmail);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // ✅ 수신자 이메일 공백 및 특수문자 제거
            String cleanEmail = recipientEmail.replaceAll("[^\\x00-\\x7F]", "").trim();
            helper.setTo(cleanEmail);

            // ✅ 발신자는 SMTP 설정과 동일해야 함
            helper.setFrom("useongj490@gmail.com");

            helper.setSubject("비밀번호 초기화 안내");

            // ✅ HTML 형식 이메일 내용
            String emailContent = String.format(
                    "<html><body>" +
                            "<h3>안녕하세요, %s님.</h3>" +
                            "<p>비밀번호가 초기화되었습니다.</p>" +
                            "<p><strong>새 비밀번호:</strong> <span style='color:blue;'>%s</span></p>" +
                            "<p>로그인 후 반드시 변경해 주세요.</p>" +
                            "</body></html>",
                    recipientName, newPassword
            );

            helper.setText(emailContent, true);

            mailSender.send(message);
            logger.info("✅ 비밀번호 초기화 이메일 전송 완료: [{}]", cleanEmail);

        } catch (MessagingException e) {
            logger.error("❌ 이메일 전송 실패: ", e);
            throw new RuntimeException("이메일 전송 실패", e);
        }
    }
}