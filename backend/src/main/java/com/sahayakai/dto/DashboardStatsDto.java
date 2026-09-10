package com.sahayakai.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalActive;
    private long critical;
    private long highRisk;
    private long pendingCounselling;
    private long pendingLegalAid;
    private long emergencyEscalations;
    private long totalCases;
    private long resolvedCases;
    private long pendingCases;
    private long underReviewCases;
    private long assignedCases;
    private long rejectedCases;
    private long emergencyNumbersCount;
    private long activeEmergencies;

    private List<Map<String, Object>> riskDistribution;
    private List<Map<String, Object>> casesOverTime;
    private List<Map<String, Object>> supportAllocation;

    public DashboardStatsDto() {
    }

    public long getTotalActive() {
        return totalActive;
    }

    public void setTotalActive(long totalActive) {
        this.totalActive = totalActive;
    }

    public long getCritical() {
        return critical;
    }

    public void setCritical(long critical) {
        this.critical = critical;
    }

    public long getHighRisk() {
        return highRisk;
    }

    public void setHighRisk(long highRisk) {
        this.highRisk = highRisk;
    }

    public long getPendingCounselling() {
        return pendingCounselling;
    }

    public void setPendingCounselling(long pendingCounselling) {
        this.pendingCounselling = pendingCounselling;
    }

    public long getPendingLegalAid() {
        return pendingLegalAid;
    }

    public void setPendingLegalAid(long pendingLegalAid) {
        this.pendingLegalAid = pendingLegalAid;
    }

    public long getEmergencyEscalations() {
        return emergencyEscalations;
    }

    public void setEmergencyEscalations(long emergencyEscalations) {
        this.emergencyEscalations = emergencyEscalations;
    }

    public long getTotalCases() {
        return totalCases;
    }

    public void setTotalCases(long totalCases) {
        this.totalCases = totalCases;
    }

    public long getResolvedCases() {
        return resolvedCases;
    }

    public void setResolvedCases(long resolvedCases) {
        this.resolvedCases = resolvedCases;
    }

    public long getPendingCases() {
        return pendingCases;
    }

    public void setPendingCases(long pendingCases) {
        this.pendingCases = pendingCases;
    }

    public long getUnderReviewCases() {
        return underReviewCases;
    }

    public void setUnderReviewCases(long underReviewCases) {
        this.underReviewCases = underReviewCases;
    }

    public long getAssignedCases() {
        return assignedCases;
    }

    public void setAssignedCases(long assignedCases) {
        this.assignedCases = assignedCases;
    }

    public long getRejectedCases() {
        return rejectedCases;
    }

    public void setRejectedCases(long rejectedCases) {
        this.rejectedCases = rejectedCases;
    }

    public long getEmergencyNumbersCount() {
        return emergencyNumbersCount;
    }

    public void setEmergencyNumbersCount(long emergencyNumbersCount) {
        this.emergencyNumbersCount = emergencyNumbersCount;
    }

    public long getActiveEmergencies() {
        return activeEmergencies;
    }

    public void setActiveEmergencies(long activeEmergencies) {
        this.activeEmergencies = activeEmergencies;
    }

    public List<Map<String, Object>> getRiskDistribution() {
        return riskDistribution;
    }

    public void setRiskDistribution(List<Map<String, Object>> riskDistribution) {
        this.riskDistribution = riskDistribution;
    }

    public List<Map<String, Object>> getCasesOverTime() {
        return casesOverTime;
    }

    public void setCasesOverTime(List<Map<String, Object>> casesOverTime) {
        this.casesOverTime = casesOverTime;
    }

    public List<Map<String, Object>> getSupportAllocation() {
        return supportAllocation;
    }

    public void setSupportAllocation(List<Map<String, Object>> supportAllocation) {
        this.supportAllocation = supportAllocation;
    }
}
