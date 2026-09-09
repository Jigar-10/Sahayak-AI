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

        // 1. Risk Distribution
        List<Map<String, Object>> riskDistribution = new ArrayList<>();
        for (RiskCategory category : RiskCategory.values()) {
            long count = activeCases.stream()
                    .filter(c -> c.getRiskCategory() == category)
                    .count();

            Map<String, Object> entry = new HashMap<>();
            entry.put("name", category.getValue().substring(0, 1).toUpperCase() + category.getValue().substring(1));
            entry.put("value", count);
            entry.put("category", category.getValue());
            riskDistribution.add(entry);
        }

        // 2. Cases Over Time (last 7 days)
        List<Map<String, Object>> casesOverTime = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM", Locale.ENGLISH);
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            String dayStr = day.format(formatter);

            long count = allCases.stream().filter(c -> {
                if (c.getCreatedAt() == null) return false;
                try {
                    return c.getCreatedAt().startsWith(day.toString());
                } catch (Exception e) {
                    return false;
                }
            }).count();

            Map<String, Object> point = new HashMap<>();
            point.put("date", dayStr);
            point.put("count", count);
            casesOverTime.add(point);
        }

        // 3. Support Allocation
        Map<String, Long> supportCounts = new LinkedHashMap<>();
        supportCounts.put("counselling", 0L);
        supportCounts.put("legal", 0L);
        supportCounts.put("medical", 0L);
        supportCounts.put("police", 0L);
        supportCounts.put("witness", 0L);

        for (CaseRecord c : activeCases) {
            if (c.getRecommendedActions() != null) {
                for (String action : c.getRecommendedActions()) {
                    String actionKey = action.toLowerCase().trim();
                    if (supportCounts.containsKey(actionKey)) {
                        supportCounts.put(actionKey, supportCounts.get(actionKey) + 1);
                    }
                }
            }
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
        dto.setRiskDistribution(riskDistribution);
        dto.setCasesOverTime(casesOverTime);
        dto.setSupportAllocation(supportAllocation);

        return dto;
    }
}
