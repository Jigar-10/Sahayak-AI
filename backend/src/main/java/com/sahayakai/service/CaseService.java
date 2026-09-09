package com.sahayakai.service;

import com.sahayakai.dto.*;
import com.sahayakai.exception.ResourceNotFoundException;
import com.sahayakai.model.*;
import com.sahayakai.repository.CaseRepository;
import com.sahayakai.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CaseService {

    private final CaseRepository caseRepository;

    private static final List<String> DEFAULT_OFFICERS = Arrays.asList(
            "Counsellor Meera Sharma",
            "Counsellor Ananya Patel",
            "Officer Rajesh Kumar",
            "Legal Officer Priya Singh",
            "Protection Officer Vikram Das"
    );

    public CaseService(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    public PagedResponse<CaseRecord> getAllCases(String risk, String status, String channel, Pageable pageable) {
        List<CaseRecord> allCases = caseRepository.findAll();

        List<CaseRecord> filtered = allCases.stream().filter(c -> {
            boolean matchRisk = risk == null || risk.equalsIgnoreCase("all") ||
                    (c.getRiskCategory() != null && c.getRiskCategory().getValue().equalsIgnoreCase(risk)) ||
                    (c.getPriority() != null && c.getPriority().equalsIgnoreCase(risk));

            boolean matchStatus = status == null || status.equalsIgnoreCase("all") ||
                    (c.getStatus() != null && c.getStatus().getValue().equalsIgnoreCase(status));

            boolean matchChannel = channel == null || channel.equalsIgnoreCase("all") ||
                    (c.getChannel() != null && c.getChannel().equalsIgnoreCase(channel));

            return matchRisk && matchStatus && matchChannel;
        }).collect(Collectors.toList());

        // In-memory pagination for filtered results
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());

        List<CaseRecord> pagedContent = (start <= end) ? filtered.subList(start, end) : new ArrayList<>();
        Page<CaseRecord> page = new PageImpl<>(pagedContent, pageable, filtered.size());

        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    public CaseRecord getCaseById(String id) {
        return caseRepository.findById(id)
                .or(() -> caseRepository.findByCaseNumber(id))
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + id));
    }

    /**
     * Securely fetches case details, enforcing that a citizen user may only view their own case.
     * Staff members (ROLE_OWNER, ROLE_ADMIN) can inspect any case.
     */
    public CaseRecord getCaseById(String id, UserPrincipal currentUser) {
        CaseRecord caseRecord = getCaseById(id);

        if (currentUser != null) {
            boolean isStaff = currentUser.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_OWNER") || a.getAuthority().equals("ROLE_ADMIN"));

            if (!isStaff) {
                // If it is a citizen user, strictly verify ownership
                if (caseRecord.getUserId() == null || !caseRecord.getUserId().equals(currentUser.getId())) {
                    throw new AccessDeniedException("Access denied. You do not have permission to view this case.");
                }
            }
        }

        return caseRecord;
    }

    public List<CaseRecord> getUserCases(String userId) {
        return caseRepository.findByUserId(userId);
    }

    public List<CaseUpdate> getCaseUpdates(String id, UserPrincipal currentUser) {
        CaseRecord caseRecord = getCaseById(id, currentUser);
        return caseRecord.getUpdates();
    }

    public CaseRecord addCaseUpdate(String id, CaseUpdateDto dto, UserPrincipal currentUser) {
        CaseRecord caseRecord = getCaseById(id);

        String author = currentUser != null ? currentUser.getName() : "Case Officer";
        String now = Instant.now().toString();

        String department = dto.getDepartment();
        if (department == null || department.isBlank()) {
            department = caseRecord.getAssignedDepartment();
        }

        CaseUpdate update = new CaseUpdate(
                String.valueOf(caseRecord.getUpdates().size() + 1),
                id,
                dto.getStatus(),
                dto.getTitle(),
                dto.getMessage(),
                now,
                author,
                department
        );

        caseRecord.getUpdates().add(update);
        caseRecord.setStatus(dto.getStatus());
        caseRecord.setUpdatedAt(Instant.now());

        // Append to timeline as well
        List<TimelineEvent> timeline = caseRecord.getTimeline();
        timeline.add(new TimelineEvent(String.valueOf(timeline.size() + 1), dto.getTitle(), now));
        caseRecord.setTimeline(timeline);

        return caseRepository.save(caseRecord);
    }

    public CaseRecord createCase(CaseCreateDto dto, UserPrincipal currentUser) {
        if (currentUser == null) {
            throw new AccessDeniedException("Authentication required: You must be signed in to file a complaint.");
        }

        String caseId = generateCaseNumber();
        String now = Instant.now().toString();

        CaseRecord record = new CaseRecord();
        record.setId(caseId);
        record.setCaseNumber(caseId);
        // Strictly associate the case with the authenticated user — client cannot spoof ownership
        record.setUserId(currentUser.getId());

        record.setAssessmentId(dto.getAssessmentId() != null ? dto.getAssessmentId() : "APPL-" + System.currentTimeMillis());
        record.setCreatedAt(now);
        record.setChannel(dto.getChannel() != null ? dto.getChannel() : "portal");
        record.setLanguage(dto.getLanguage() != null ? dto.getLanguage() : "en");
        record.setSvi(dto.getSvi());

        // Category mapping
        String category = dto.getCategory() != null && !dto.getCategory().isBlank()
                ? dto.getCategory()
                : (dto.getIncidentCategory() != null ? dto.getIncidentCategory() : "General Grievance");
        record.setCategory(category);
        record.setIncidentCategory(category);

        // Title mapping
        String title = dto.getTitle() != null && !dto.getTitle().isBlank()
                ? dto.getTitle()
                : category + " Complaint";
        record.setTitle(title);

        // Description / Narrative mapping
        String desc = dto.getDescription() != null && !dto.getDescription().isBlank()
                ? dto.getDescription()
                : (dto.getNarrative() != null ? dto.getNarrative() : "");
        record.setDescription(desc);
        record.setNarrative(desc);

        // Priority / Risk mapping
        if (dto.getPriority() != null && !dto.getPriority().isBlank()) {
            record.setPriority(dto.getPriority());
            String pLower = dto.getPriority().toLowerCase();
            if (pLower.contains("critical") || pLower.contains("urgent") || pLower.contains("danger")) {
                record.setRiskCategory(RiskCategory.CRITICAL);
                record.setImmediateDanger(true);
            } else if (pLower.contains("high")) {
                record.setRiskCategory(RiskCategory.HIGH);
            } else if (pLower.contains("low")) {
                record.setRiskCategory(RiskCategory.LOW);
            } else {
                record.setRiskCategory(RiskCategory.MODERATE);
            }
        } else {
            record.setRiskCategory(dto.getRiskCategory() != null ? dto.getRiskCategory() : RiskCategory.MODERATE);
            record.setPriority(record.getRiskCategory().getValue());
            record.setImmediateDanger(dto.isImmediateDanger());
        }

        // Assigned Department
        if (dto.getDepartment() != null && !dto.getDepartment().isBlank()) {
            record.setAssignedDepartment(dto.getDepartment());
        } else {
            record.setAssignedDepartment("Citizen Support & Redressal Cell");
        }

        record.setIndicators(dto.getIndicators() != null ? dto.getIndicators() : new ArrayList<>());
        record.setExplainableIndicators(dto.getExplainableIndicators() != null ? dto.getExplainableIndicators() : new ArrayList<>());
        record.setAiConfidence(dto.getAiConfidence() > 0 ? dto.getAiConfidence() : 88);
        record.setStatus(CaseStatus.SUBMITTED);
        record.setRecommendedActions(dto.getRecommendedActions() != null ? dto.getRecommendedActions() : new ArrayList<>());
        record.setEscalated(
                record.getRiskCategory() == RiskCategory.CRITICAL ||
                record.getRiskCategory() == RiskCategory.HIGH ||
                record.isImmediateDanger()
        );

        // Build standard initial timeline
        List<TimelineEvent> timeline = new ArrayList<>();
        timeline.add(new TimelineEvent("1", "Complaint Filed by " + currentUser.getName(), now));
        timeline.add(new TimelineEvent("2", "Confidential Record Encrypted", now));
        timeline.add(new TimelineEvent("3", "Assigned Priority: " + record.getPriority(), now));
        timeline.add(new TimelineEvent("4", "Routed to " + record.getAssignedDepartment(), now));
        timeline.add(new TimelineEvent("5", "Awaiting Officer Review", now));
        record.setTimeline(timeline);

        // Initial Case Update entry
        CaseUpdate initialUpdate = new CaseUpdate(
                "1",
                caseId,
                CaseStatus.SUBMITTED,
                "Complaint Formally Registered",
                "Your application has been safely recorded under " + caseId + " and queued for immediate human review.",
                now,
                "Sahayak Portal System",
                record.getAssignedDepartment()
        );
        record.setUpdates(new ArrayList<>(Collections.singletonList(initialUpdate)));

        return caseRepository.save(record);
    }

    public CaseRecord assignOfficer(String id, CaseAssignDto dto) {
        CaseRecord caseRecord = getCaseById(id);
        caseRecord.setAssignedOfficer(dto.getOfficer());
        caseRecord.setStatus(CaseStatus.ASSIGNED);

        String now = Instant.now().toString();
        List<TimelineEvent> timeline = caseRecord.getTimeline();
        timeline.add(new TimelineEvent(String.valueOf(timeline.size() + 1), "Case assigned to " + dto.getOfficer(), now));
        caseRecord.setTimeline(timeline);

        // Append CaseUpdate
        CaseUpdate update = new CaseUpdate(
                String.valueOf(caseRecord.getUpdates().size() + 1),
                id,
                CaseStatus.ASSIGNED,
                "Case Assigned to Officer",
                "Your case has been formally assigned to " + dto.getOfficer() + " for coordination and evaluation.",
                now,
                dto.getOfficer(),
                caseRecord.getAssignedDepartment()
        );
        caseRecord.getUpdates().add(update);

        return caseRepository.save(caseRecord);
    }

    public CaseRecord addNote(String id, CaseNoteDto dto, UserPrincipal currentUser) {
        CaseRecord caseRecord = getCaseById(id);

        String author = dto.getAuthor();
        if (author == null || author.isBlank()) {
            author = currentUser != null ? currentUser.getName() : "Officer / Reviewer";
        }

        String now = Instant.now().toString();
        CaseNote note = new CaseNote(
                String.valueOf(caseRecord.getNotes().size() + 1),
                author,
                dto.getText(),
                now
        );

        caseRecord.getNotes().add(note);

        List<TimelineEvent> timeline = caseRecord.getTimeline();
        timeline.add(new TimelineEvent(String.valueOf(timeline.size() + 1), "Case note added by " + author, now));
        caseRecord.setTimeline(timeline);

        return caseRepository.save(caseRecord);
    }

    public CaseRecord escalateCase(String id) {
        CaseRecord caseRecord = getCaseById(id);
        caseRecord.setEscalated(true);
        if (caseRecord.getStatus() == CaseStatus.CLOSED) {
            caseRecord.setStatus(CaseStatus.UNDER_REVIEW);
        }

        String now = Instant.now().toString();
        List<TimelineEvent> timeline = caseRecord.getTimeline();
        timeline.add(new TimelineEvent(String.valueOf(timeline.size() + 1), "Case escalated for immediate human review", now));
        caseRecord.setTimeline(timeline);

        return caseRepository.save(caseRecord);
    }

    public CaseRecord updateStatus(String id, CaseStatusDto dto) {
        CaseRecord caseRecord = getCaseById(id);
        caseRecord.setStatus(dto.getStatus());

        String now = Instant.now().toString();
        List<TimelineEvent> timeline = caseRecord.getTimeline();
        timeline.add(new TimelineEvent(String.valueOf(timeline.size() + 1), "Case status updated to " + dto.getStatus().getDisplayName(), now));
        caseRecord.setTimeline(timeline);

        CaseUpdate update = new CaseUpdate(
                String.valueOf(caseRecord.getUpdates().size() + 1),
                id,
                dto.getStatus(),
                "Status: " + dto.getStatus().getDisplayName(),
                "Case status transitioned to " + dto.getStatus().getDisplayName() + ".",
                now,
                "Case Officer",
                caseRecord.getAssignedDepartment()
        );
        caseRecord.getUpdates().add(update);

        return caseRepository.save(caseRecord);
    }

    public List<String> getAvailableOfficers() {
        return DEFAULT_OFFICERS;
    }

    private synchronized String generateCaseNumber() {
        long count = caseRepository.count();
        long nextNum = 122 + count;
        return String.format("CASE-2026-%05d", nextNum);
    }
}
