package com.nexterp.accounting.repository;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.accounting.repository
 * FileName       : TransactionRepository
 * Author         : paesir
 * Date           : 25. 1. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 16.오후 2:43  paesir      최초 생성
 */


import com.nexterp.accounting.dto.MonthlyProductSalesDTO;
import com.nexterp.accounting.dto.MonthlySalesDTO;
import com.nexterp.accounting.dto.TransactionDTO;
import com.nexterp.accounting.entity.Transaction;
import com.nexterp.accounting.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
  List<Transaction> findByType(TransactionType type);
  TransactionDTO findTransactionById(long id);
  Page<Transaction> findByDateBetweenOrderByDate(LocalDate dateAfter, LocalDate dateBefore, Pageable pageable);

//  월별 판매수량 및 판매액 조회
@Query("""
SELECT new com.nexterp.accounting.dto.MonthlySalesDTO(
    CONCAT(YEAR(t.date), '-', LPAD(CAST(MONTH(t.date) AS string), 2, '0')),
    SUM(t.amount),
    CAST(SUM(o.orderCount) AS int))
FROM Transaction t
JOIN Order o ON t.id = o.transaction.id
WHERE t.type = 'SALE'
GROUP BY YEAR(t.date), MONTH(t.date)
ORDER BY YEAR(t.date), MONTH(t.date)
""")
List<MonthlySalesDTO> getMonthlySales();

// 월별 제품별 판매비율 조회
@Query("""
        SELECT new com.nexterp.accounting.dto.MonthlyProductSalesDTO(
            CONCAT(YEAR(t.date), '-', LPAD(CAST(MONTH(t.date) AS string), 2, '0')),
            p.id,
            p.productName,
            CAST(SUM(o.orderCount) AS int)
        )
        FROM Transaction t
        JOIN Order o ON t.id = o.transaction.id
        JOIN Product p ON o.product.id = p.id
        WHERE t.type = 'SALE'
        GROUP BY YEAR(t.date), MONTH(t.date), p.id, p.productName
        ORDER BY YEAR(t.date), MONTH(t.date) DESC , SUM(o.orderCount)
    """)
List<MonthlyProductSalesDTO> getMonthlyProductSales();

}
