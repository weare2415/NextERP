/*
package com.nexterp.product;

import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.product.dto.ProductDTO;
import com.nexterp.product.entity.Product;
import com.nexterp.product.repository.ProductRepository;
import com.nexterp.product.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    private ProductDTO productDTO;
    private Employee employee;

    @BeforeEach
    public void setUp() {
        // 실제 데이터베이스에서 Employee를 가져오기
        employee = employeeRepository.findById(80001234).orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        // ProductDTO 생성 (기존 Employee를 사용)
        productDTO = ProductDTO.builder()
                .productName("갤럭시")
                .purchaseprice(10000)
                .saleprice(10000)
                .stock(100)
                .specifications("**")
                .memo("삼성 제품")
                .createdDate(new Date())  // 현재 날짜를 설정
                .isDeleted(false)
                .employeeId(employee.getId())  // 방금 생성한 employee의 ID를 설정
                .build();
    }

    @Test
    public void testCreateProduct() {
        // 제품 생성 테스트
        Product createdProduct = productService.createProduct(productDTO);
        assertNotNull(createdProduct);
        assertEquals("갤럭시", createdProduct.getProductName());
        assertTrue(createdProduct.getId() > 0);  // ID가 0보다 커야 함
        assertEquals(employee.getId(), createdProduct.getEmployee().getId());  // 해당 직원 ID 확인
    }

    @Test
    public void testUpdateProduct() {
        // 기존 제품을 데이터베이스에서 가져오기 (예시로 ID 119 사용)
        Product existingProduct = productRepository.findById(2L).orElseThrow(() -> new RuntimeException("Product not found"));

        // ProductDTO 업데이트에 필요한 값들 추가
        ProductDTO updatedDTO = ProductDTO.builder()
                .productName("전자 제품")
                .purchaseprice(1200)  // 매입가격 변경
                .saleprice(1200) // 판매가격 변경
                .stock(150)   // 재고 변경
                .specifications("규격에 맞지 않음")  // 사양 변경
                .memo("깨짐 위험")  // 메모 변경
                .employeeId(existingProduct.getEmployee().getId()) // 기존 제품의 employeeId 유지
                .build();

        // 업데이트 실행
        Product updatedProduct = productService.updateProduct(existingProduct.getId(), updatedDTO);

        // 업데이트된 제품 확인
        assertNotNull(updatedProduct);
        assertEquals("전자 제품", updatedProduct.getProductName()); // 제품명 갱신 확인
        assertEquals(1200, updatedProduct.getPurchaseprice());  // 매입가격 갱신 확인
        assertEquals(1200, updatedProduct.getSaleprice()); // 판매가격 갱신 확인
        assertEquals(150, updatedProduct.getStock());  // 재고 갱신 확인
        assertEquals("규격에 맞지 않음", updatedProduct.getSpecifications());  // 사양 갱신 확인
        assertEquals("깨짐 위험", updatedProduct.getMemo());  // 메모 갱신 확인
        assertEquals(existingProduct.getEmployee().getId(), updatedProduct.getEmployee().getId());  // 해당 직원 ID 확인
    }

    @Test
    public void testDeleteProduct() {
        // 1. 테스트용 제품 생성
        Long productId = 12L; // 테스트에 사용할 기존 제품 ID (예: 1번 제품)


        // 2. 삭제 실행
        boolean isDeleted = productService.deleteProductById(productId);

        // 3. 논리적 삭제된 제품이 조회되지 않도록 확인
        assertTrue(isDeleted, "제품이 삭제되지 않았습니다.");

        Product deletedProduct = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        // 논리적 삭제 여부 확인
        assertTrue(deletedProduct.isDeleted(), "삭제된 제품의 'deleted' 플래그가 true가 아닙니다.");
    }
}
*/