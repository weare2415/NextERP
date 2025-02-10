/*
package com.nexterp.product;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexterp.product.dto.ProductDTO;
import com.nexterp.product.entity.Product;
import com.nexterp.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
class ProductControllerTest {

    @Autowired
    private ApplicationContext context;  // WebApplicationContext를 주입받음

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    private MockMvc mockMvc;  // MockMvc 객체

    @BeforeEach
    void setUp() {
        // MockMvc 수동 초기화
        mockMvc = MockMvcBuilders.webAppContextSetup((WebApplicationContext) context).build();
    }

    @Test
    void testGetAllProducts() throws Exception {
        // 실제 데이터가 있는 상태에서 테스트
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].productName").value("생활 용품"))
                .andExpect(jsonPath("$[0].price").value(1000));
    }

    @Test
    void testCreateProduct() throws Exception {
        // 새로운 제품 DTO
        ProductDTO newProductDTO = ProductDTO.builder()
                .productName("생활 용품")
                .purchaseprice(1000)
                .saleprice(1000)
                .stock(100)
                .specifications("이상 없음")
                .memo("일상용")
                .build();

        // API 호출 및 제품 생성
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProductDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.productName").value("생활 용품"))
                .andExpect(jsonPath("$.price").value(1000));

        // 생성된 제품을 GET으로 조회하여 검증
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].productName").value("생활 용품"))
                .andExpect(jsonPath("$[0].price").value(1000));
    }

    @Test
    void testUpdateProduct() throws Exception {
        // 기존 데이터 가져오기
        Product existingProduct = productRepository.findAll().get(0);

        // 업데이트 요청 데이터
        ProductDTO updatedProductDTO = ProductDTO.builder()
                .productName("Updated Product Name")
                .purchaseprice(1300)
                .saleprice(1300)
                .build();

        // API 호출 및 검증
        mockMvc.perform(put("/products/{id}", existingProduct.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedProductDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productName").value("Updated Product Name"))
                .andExpect(jsonPath("$.price").value(1300));
    }

    @Test
    void testDeleteProduct() throws Exception {
        // 기존 데이터 가져오기
        Product existingProduct = productRepository.findAll().get(0);

        // API 호출 및 검증
        mockMvc.perform(delete("/products/{id}", existingProduct.getId()))
                .andExpect(status().isNoContent());
    }
}
*/
