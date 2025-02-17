package com.nexterp.product.service;

import com.nexterp.product.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<ProductDTO> getAllProducts(Pageable pageable);
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    ProductDTO getProductById(Long id);
    void deleteProductById(Long id);
    Page<ProductDTO> getProductsByName(String productName, Pageable pageable);
}