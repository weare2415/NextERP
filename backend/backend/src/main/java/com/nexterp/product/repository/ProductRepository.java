package com.nexterp.product.repository;

import com.nexterp.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByProductNameContainingAndIsDeletedFalse(String productName, Pageable pageable);

    Page<Product> findByIsDeletedFalse(Pageable pageable);

    Product findByIdAndIsDeletedFalse(Long id);
}
