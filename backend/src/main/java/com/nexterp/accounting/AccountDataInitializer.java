package com.nexterp.accounting;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.accounting
 * FileName       : AccountDataInitializer
 * Author         : paesir
 * Date           : 25. 1. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 16.오전 11:37  paesir      최초 생성
 */

import com.nexterp.accounting.entity.Account;
import com.nexterp.accounting.entity.AccountType;
import com.nexterp.accounting.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class AccountDataInitializer {

  @Bean
  CommandLineRunner initializeAccounts(AccountRepository accountRepository) {
    return args -> {
      // 데이터 초기화 확인: 첫 페이지를 조회해 데이터가 있는지 확인
      Page<Account> firstPage = accountRepository.findAll(PageRequest.of(0, 1));
      if (firstPage.isEmpty()) {
        // 최상위 계정 생성
                    Account asset = new Account("100", "자산", AccountType.ASSET, null, "자산 계정", BigDecimal.ZERO);
            Account liability = new Account("200", "부채", AccountType.LIABILITY, null, "부채 계정", BigDecimal.ZERO);
            Account equity = new Account("300", "자본", AccountType.EQUITY, null, "자본 계정", BigDecimal.ZERO);
            Account revenue = new Account("400", "수익", AccountType.REVENUE, null, "수익 계정", BigDecimal.ZERO);
            Account expense = new Account("500", "비용", AccountType.EXPENSE, null, "비용 계정", BigDecimal.ZERO);

            accountRepository.saveAll(List.of(asset, liability, equity, revenue, expense));

            // 하위 계정 생성
            accountRepository.saveAll(List.of(
                new Account("101", "현금", AccountType.ASSET, asset, "현금 계정", BigDecimal.valueOf(20000000)),
                new Account("102", "보통예금", AccountType.ASSET, asset, "보통예금 계정", BigDecimal.valueOf(30000000)),
                new Account("103", "당좌예금", AccountType.ASSET, asset, "당좌예금 계정", BigDecimal.valueOf(10000000)),
                new Account("110", "매출채권", AccountType.ASSET, asset, "매출채권 계정", BigDecimal.valueOf(25000000)),
                new Account("120", "재고자산", AccountType.ASSET, asset, "재고자산 계정", BigDecimal.valueOf(30000000)),
                new Account("130", "유형자산", AccountType.ASSET, asset, "유형자산 계정", BigDecimal.valueOf(15000000)),
                new Account("140", "매도가능금융자산", AccountType.ASSET, asset, "매도가능금융자산 계정", BigDecimal.valueOf(5000000)),
                new Account("150", "기타유동자산", AccountType.ASSET, asset, "기타유동자산 계정", BigDecimal.valueOf(5000000)),
                new Account("160", "무형자산", AccountType.ASSET, asset, "무형자산 계정", BigDecimal.valueOf(5000000)),
                new Account("170", "장기금융자산", AccountType.ASSET, asset, "장기금융자산 계정", BigDecimal.valueOf(5000000)),
                new Account("180", "관계기업투자", AccountType.ASSET, asset, "관계기업투자 계정", BigDecimal.valueOf(5000000))
            ));

            accountRepository.saveAll(List.of(
                new Account("201", "매입채무", AccountType.LIABILITY, liability, "매입채무 계정", BigDecimal.valueOf(20000000)),
                new Account("202", "미지급금", AccountType.LIABILITY, liability, "미지급금 계정", BigDecimal.valueOf(5000000)),
                new Account("210", "단기차입금", AccountType.LIABILITY, liability, "단기차입금 계정", BigDecimal.valueOf(10000000)),
                new Account("220", "장기차입금", AccountType.LIABILITY, liability, "장기차입금 계정", BigDecimal.valueOf(15000000)),
                new Account("230", "단기미지급비용", AccountType.LIABILITY, liability, "단기미지급비용 계정", BigDecimal.valueOf(5000000)),
                new Account("240", "단기충당부채", AccountType.LIABILITY, liability, "단기충당부채 계정", BigDecimal.valueOf(5000000)),
                new Account("250", "퇴직급여충당부채", AccountType.LIABILITY, liability, "퇴직급여충당부채 계정", BigDecimal.valueOf(5000000)),
                new Account("260", "이연법인세부채", AccountType.LIABILITY, liability, "이연법인세부채 계정", BigDecimal.valueOf(5000000))
            ));

            accountRepository.saveAll(List.of(
                new Account("301", "자본금", AccountType.EQUITY, equity, "자본금 계정", BigDecimal.valueOf(30000000)),
                new Account("310", "이익잉여금", AccountType.EQUITY, equity, "이익잉여금 계정", BigDecimal.valueOf(10000000)),
                new Account("320", "영업이익", AccountType.EQUITY, equity, "영업이익 계정", BigDecimal.valueOf(5000000)),
                new Account("330", "순이익", AccountType.EQUITY, equity, "순이익 계정", BigDecimal.ZERO),
                new Account("340", "기타포괄손익누계액", AccountType.EQUITY, equity, "기타포괄손익누계액 계정", BigDecimal.ZERO),
                new Account("350", "자본조정", AccountType.EQUITY, equity, "자본조정 계정", BigDecimal.ZERO)
            ));

            accountRepository.saveAll(List.of(
                new Account("401", "제품매출", AccountType.REVENUE, revenue, "제품매출 계정", BigDecimal.ZERO),
                new Account("402", "서비스매출", AccountType.REVENUE, revenue, "서비스매출 계정", BigDecimal.ZERO),
                new Account("410", "이자수익", AccountType.REVENUE, revenue, "이자수익 계정", BigDecimal.ZERO),
                new Account("411", "상품매출", AccountType.REVENUE, revenue, "상품매출 계정", BigDecimal.ZERO),
                new Account("412", "기타영업수익", AccountType.REVENUE, revenue, "기타영업수익 계정", BigDecimal.ZERO)
            ));

        accountRepository.saveAll(List.of(
            new Account("501", "급여", AccountType.EXPENSE, expense, "급여 계정", new BigDecimal("10000000")),
    new Account("502", "임차료", AccountType.EXPENSE, expense, "임차료 계정", new BigDecimal("5000000")),
    new Account("503", "감가상각비", AccountType.EXPENSE, expense, "감가상각비 계정", new BigDecimal("2000000")),
    new Account("510", "이자비용", AccountType.EXPENSE, expense, "이자비용 계정", new BigDecimal("1500000")),
    new Account("520", "매출원가", AccountType.EXPENSE, expense, "매출원가 계정", new BigDecimal("30000000"))
        ));
      }
    };
  }
}
