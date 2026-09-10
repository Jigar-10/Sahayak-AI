package com.sahayakai.repository;

import com.sahayakai.model.CaseRecord;
import com.sahayakai.model.CaseStatus;
import com.sahayakai.model.RiskCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaseRepository extends MongoRepository<CaseRecord, String> {
    Optional<CaseRecord> findByCaseNumber(String caseNumber);
    Page<CaseRecord> findByUserId(String userId, Pageable pageable);
    List<CaseRecord> findByUserId(String userId);

    long countByStatus(CaseStatus status);
    long countByRiskCategoryAndStatusNot(RiskCategory riskCategory, CaseStatus status);
    long countByEscalatedTrueAndStatusNot(CaseStatus status);
    long countByStatusNot(CaseStatus status);

    @org.springframework.data.mongodb.repository.Query(value = "{ $or: [ { 'isEmergency': true }, { 'emergency': true } ] }", sort = "{ 'createdAt': -1 }")
    List<CaseRecord> findByIsEmergencyTrueOrderByCreatedAtDesc();

    @org.springframework.data.mongodb.repository.Query(value = "{ $or: [ { 'isEmergency': true }, { 'emergency': true } ], 'emergencyStatus': { $ne: ?0 } }", count = true)
    long countByIsEmergencyTrueAndEmergencyStatusNot(String emergencyStatus);
}
