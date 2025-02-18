package com.nexterp.product.service;

import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.product.dto.ProductDTO;
import com.nexterp.product.entity.Product;
import com.nexterp.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final EmployeeRepository employeeRepository;

    // 제품 생성
    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        if (productDTO == null) {
            throw new IllegalArgumentException("ProductDTO cannot be null");
        }

        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);

        return convertToDTO(savedProduct);
    }

    // 제품 수정
    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        if (productDTO == null) {
            throw new IllegalArgumentException("ProductDTO cannot be null");
        }

        return productRepository.findById(id).map(existingProduct -> {
            Product updatedProduct = Product.builder()
                .id(existingProduct.getId())
                .productName(productDTO.getProductName() != null ? productDTO.getProductName() : existingProduct.getProductName())
                .purchasePrice(productDTO.getPurchasePrice() != null && productDTO.getPurchasePrice().compareTo(BigDecimal.ZERO) != 0
                    ? productDTO.getPurchasePrice()
                    : existingProduct.getPurchasePrice())

                .salePrice(productDTO.getSalePrice() != null && productDTO.getSalePrice().compareTo(BigDecimal.ZERO) != 0
                    ? productDTO.getSalePrice()
                    : existingProduct.getSalePrice()).createdDate(existingProduct.getCreatedDate())
                .stock(productDTO.getStock() != 0 ? productDTO.getStock() : existingProduct.getStock())
                .specifications(productDTO.getSpecifications() != null ? productDTO.getSpecifications() : existingProduct.getSpecifications())
                .memo(productDTO.getMemo() != null ? productDTO.getMemo() : existingProduct.getMemo())
                .isDeleted(productDTO.isDeleted())
                .employee(existingProduct.getEmployee())
                .build();

            // Employee 설정: 직원 ID가 있으면 새로 설정, 없으면 기존 값 유지
            if (productDTO.getEmployeeId() != null) {
                Employee employee = employeeRepository.findById(productDTO.getEmployeeId())
                    .orElseThrow(() -> new IllegalArgumentException("Employee with ID " + productDTO.getEmployeeId() + " not found"));
                updatedProduct.updateEmployee(employee);
            }

            Product savedProduct = productRepository.save(updatedProduct);
            return convertToDTO(savedProduct);
        }).orElseThrow(() -> new IllegalArgumentException("Product with ID " + id + " not found"));
    }

    // 제품 상세 조회
    @Override
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findByIdAndIsDeletedFalse(id);
        return convertToDTO(product);
    }

    // 모든 제품 조회
    @Override
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findByIsDeletedFalse(pageable)
            .map(this::convertToDTO);
    }

    // 제품 논리 삭제
    @Override
    public void deleteProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Product with ID " + id + " not found"));

        product.markAsDeleted();
        productRepository.save(product);
    }

    // 제품명으로 검색
    @Override
    public Page<ProductDTO> getProductsByName(String productName, Pageable pageable) {
        return productRepository.findByProductNameContainingAndIsDeletedFalse(productName, pageable)
            .map(this::convertToDTO);
    }

    // Entity → DTO 변환
    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
            .id(product.getId())
            .productName(product.getProductName())
            .purchasePrice(product.getPurchasePrice())
            .salePrice(product.getSalePrice())
            .createdDate(product.getCreatedDate())
            .stock(product.getStock())
            .specifications(product.getSpecifications())
            .memo(product.getMemo())
            .isDeleted(product.isDeleted())
            .employeeId(product.getEmployee() != null ? product.getEmployee().getId() : null)
            .build();
    }

    // DTO → Entity 변환
    private Product convertToEntity(ProductDTO dto) {
        Employee employee = null;
        if (dto.getEmployeeId() != null) {
            employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee with ID " + dto.getEmployeeId() + " not found"));
        }

        return Product.builder()
            .productName(dto.getProductName())
            .purchasePrice(dto.getPurchasePrice())
            .salePrice(dto.getSalePrice())
            .createdDate(dto.getCreatedDate())
            .stock(dto.getStock())
            .specifications(dto.getSpecifications())
            .memo(dto.getMemo())
            .isDeleted(dto.isDeleted())
            .employee(employee)
            .build();
    }
}