package com.sahayakai.service;

import com.sahayakai.dto.DashboardStatsDto;
import com.sahayakai.model.CaseRecord;
import com.sahayakai.model.CaseStatus;
import com.sahayakai.model.RiskCategory;
import com.sahayakai.repository.CaseRepository;
import com.sahayakai.repository.EmergencyNumberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {

    private final CaseRepository caseRepository;
    private final EmergencyNumberRepository emergencyNumberRepository;

    public DashboardService(CaseRepository caseRepository, EmergencyNumberRepository emergencyNumberRepository) {
        this.caseRepository = caseRepository;
        this.emergencyNumberRepository = emergencyNumberRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        List<CaseRecord> allCases = caseRepository.findAll();

        List<CaseRecord> activeCases = allCases.stream()
                .filter(c -> c.getStatus() != CaseStatus.CLOSED && c.getStatus() != CaseStatus.RESOLVED && c.getStatus() != CaseStatus.REJECTED)
                .toList();

        long totalActive = activeCases.size();

        long critical = activeCases.stream()
                .filter(c -> c.getRiskCategory() == RiskCategory.CRITICAL)
                .count();

        long highRisk = activeCases.stream()
                .filter(c -> c.getRiskCategory() == RiskCategory.HIGH)
                .count();

        long lowRisk = activeCases.stream()
                .filter(c -> c.getRiskCategory() == RiskCategory.LOW)
                .count();

        long modRisk = activeCases.stream()
                .filter(c -> c.getRiskCategory() == RiskCategory.MODERATE)
                .count();

        long pendingCounselling = activeCases.stream()
                .filter(c -> (c.getAssignedOfficer() == null || !c.getAssignedOfficer().toLowerCase().contains("counsellor"))
                        && (c.getRiskCategory() == RiskCategory.MODERATE || c.getRiskCategory() == RiskCategory.HIGH || c.getRiskCategory() == RiskCategory.CRITICAL))
                .count();

        long pendingLegalAid = activeCases.stream()
                .filter(c -> (c.getRiskCategory() == RiskCategory.HIGH || c.getRiskCategory() == RiskCategory.CRITICAL)
                        && (c.getAssignedOfficer() == null || !c.getAssignedOfficer().toLowerCase().contains("legal")))
                .count();

        long emergencyEscalations = activeCases.stream()
                .filter(CaseRecord::isEscalated)
                .count();

        long totalCases = allCases.size();
        long pendingCases = allCases.stream()
                .filter(c -> c.getStatus() == CaseStatus.SUBMITTED || c.getStatus() == CaseStatus.OPEN)
                .count();
        long underReviewCases = allCases.stream()
                .filter(c -> c.getStatus() == CaseStatus.UNDER_REVIEW || c.getStatus() == CaseStatus.IN_REVIEW)
                .count();
        long assignedCases = allCases.stream()
                .filter(c -> c.getStatus() == CaseStatus.ASSIGNED || c.getStatus() == CaseStatus.INVESTIGATION || c.getStatus() == CaseStatus.ACTION_TAKEN)
                .count();
        long resolvedCases = allCases.stream()
                .filter(c -> c.getStatus() == CaseStatus.RESOLVED || c.getStatus() == CaseStatus.CLOSED)
                .count();
        long rejectedCases = allCases.stream()
                .filter(c -> c.getStatus() == CaseStatus.REJECTED)
                .count();
        long emergencyNumbersCount = emergencyNumberRepository.count();

        long activeEmergencies = allCases.stream()
                .filter(c -> c.isEmergency() && !"RESOLVED".equalsIgnoreCase(c.getEmergencyStatus()))
                .count();

        // 1. Risk Distribution
        List<Map<String, Object>> riskDistribution = new ArrayList<>();
        riskDistribution.add(Map.of("name", "Low Risk", "value", lowRisk));
        riskDistribution.add(Map.of("name", "Moderate Risk", "value", modRisk));
        riskDistribution.add(Map.of("name", "High Risk", "value", highRisk));
        riskDistribution.add(Map.of("name", "Critical", "value", critical));

        // 2. Cases Over Time (Last 7 Days)
        Map<String, Long> timelineCounts = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateLabel = date.format(formatter);
            timelineCounts.put(dateLabel, 0L);
        }

        allCases.forEach(c -> {
            try {
                if (c.getCreatedAt() != null) {
                    LocalDate createdDate = LocalDate.parse(c.getCreatedAt().substring(0, 10));
                    String label = createdDate.format(formatter);
                    if (timelineCounts.containsKey(label)) {
                        timelineCounts.put(label, timelineCounts.get(label) + 1);
                    }
                }
            } catch (Exception ignored) {
            }
        });

        List<Map<String, Object>> casesOverTime = new ArrayList<>();
        timelineCounts.forEach((date, count) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", date);
            map.put("cases", count);
            casesOverTime.add(map);
        });

        // 3. Support Allocation By Category
        Map<String, Long> supportCounts = new HashMap<>();
        for (CaseRecord c : allCases) {
            String cat = c.getCategory();
            if (cat == null || cat.isBlank()) cat = "General";
            supportCounts.put(cat, supportCounts.getOrDefault(cat, 0L) + 1);
        }

        List<Map<String, Object>> supportAllocation = new ArrayList<>();
        supportCounts.forEach((key, count) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", key.substring(0, 1).toUpperCase() + key.substring(1));
            map.put("value", count);
            supportAllocation.add(map);
        });

        DashboardStatsDto dto = new DashboardStatsDto();
        dto.setTotalActive(totalActive);
        dto.setCritical(critical);
        dto.setHighRisk(highRisk);
        dto.setPendingCounselling(pendingCounselling);
        dto.setPendingLegalAid(pendingLegalAid);
        dto.setEmergencyEscalations(emergencyEscalations);
        dto.setTotalCases(totalCases);
        dto.setResolvedCases(resolvedCases);
        dto.setPendingCases(pendingCases);
        dto.setUnderReviewCases(underReviewCases);
        dto.setAssignedCases(assignedCases);
        dto.setRejectedCases(rejectedCases);
        dto.setEmergencyNumbersCount(emergencyNumbersCount);
        dto.setActiveEmergencies(activeEmergencies);
        dto.setRiskDistribution(riskDistribution);
        dto.setCasesOverTime(casesOverTime);
        dto.setSupportAllocation(supportAllocation);

        return dto;
    }
}
