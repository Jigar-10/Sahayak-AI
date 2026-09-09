package com.sahayakai.repository;

import com.sahayakai.model.EmergencyNumber;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyNumberRepository extends MongoRepository<EmergencyNumber, String> {
    List<EmergencyNumber> findByActiveTrue();
    List<EmergencyNumber> findByActiveTrueOrderByIsPrimaryDescNameAsc();
    List<EmergencyNumber> findByCategoryAndActiveTrue(String category);
}
