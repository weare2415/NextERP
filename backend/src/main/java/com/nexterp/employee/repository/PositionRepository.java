package com.nexterp.employee.repository;

import com.nexterp.employee.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PositionRepository  extends JpaRepository<Position, Integer> {
}