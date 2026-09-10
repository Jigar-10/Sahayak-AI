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

        // Handle Emergency / GPS Geolocation if passed during standard complaint filing
        if (dto.isEmergency() || "critical".equalsIgnoreCase(dto.getPriority()) || dto.isImmediateDanger()) {
            record.setEmergency(true);
            record.setLatitude(dto.getLatitude());
            record.setLongitude(dto.getLongitude());
            record.setLocationAccuracy(dto.getLocationAccuracy());
            record.setLocationTimestamp(dto.getLocationTimestamp() != null ? dto.getLocationTimestamp() : now);
            record.setLocationStatus(dto.getLocationStatus() != null ? dto.getLocationStatus() : (dto.getLatitude() != null ? "LOCATION_RECEIVED" : "PENDING"));
            record.setEmergencyStatus(dto.getLatitude() != null ? "LOCATION_RECEIVED" : "EMERGENCY_TRIGGERED");
            record.setEmergencyType("CRITICAL_COMPLAINT");
        }

        // Build standard initial timeline
        List<TimelineEvent> timeline = new ArrayList<>();
        timeline.add(new TimelineEvent("1", "Complaint Filed by " + currentUser.getName(), now));
        timeline.add(new TimelineEvent("2", "Confidential Record Encrypted", now));
        timeline.add(new TimelineEvent("3", "Assigned Priority: " + record.getPriority(), now));
        if (record.isEmergency() && record.getLatitude() != null) {
            timeline.add(new TimelineEvent(String.valueOf(timeline.size() + 1), "📍 Live GPS Coordinates Captured: " + record.getLatitude() + ", " + record.getLongitude(), now));
        }
        timeline.add(new TimelineEvent(String.valueOf(timeline.size() + 1), "Routed to " + record.getAssignedDepartment(), now));
        timeline.add(new TimelineEvent(String.valueOf(timeline.size() + 1), "Awaiting Officer Review", now));
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

    public CaseRecord triggerEmergency(EmergencyTriggerDto dto, UserPrincipal currentUser) {
        String caseId = generateEmergencyCaseNumber();
        String now = Instant.now().toString();

        CaseRecord record = new CaseRecord();
        record.setId(caseId);
        record.setCaseNumber(caseId);
        if (currentUser != null) {
            record.setUserId(currentUser.getId());
        }

        record.setAssessmentId("EMG-" + System.currentTimeMillis());
        record.setCreatedAt(now);
        record.setChannel(dto.getChannel() != null ? dto.getChannel() : "sos_button");
        record.setLanguage(dto.getPreferredLanguage() != null ? dto.getPreferredLanguage() : "en");
        record.setSvi(95); // Critical severity index

        record.setCategory(dto.getCategory() != null ? dto.getCategory() : "Emergency Response & Rescue");
        record.setIncidentCategory(record.getCategory());
        record.setTitle("🚨 SOS EMERGENCY: " + dto.getEmergencyType().replace('_', ' '));
        
        String desc = dto.getNotes() != null && !dto.getNotes().isBlank()
                ? dto.getNotes()
                : "Real-time emergency SOS triggered by user device. Immediate response required.";
        record.setDescription(desc);
        record.setNarrative(desc);

        record.setRiskCategory(RiskCategory.CRITICAL);
        record.setPriority("critical");
        record.setImmediateDanger(true);
        record.setEscalated(true);
        record.setStatus(CaseStatus.SUBMITTED);
        record.setAssignedDepartment("Rapid Emergency & Police/Ambulance Response Cell");

        // Emergency Location Details
        record.setEmergency(true);
        record.setEmergencyType(dto.getEmergencyType());
        record.setLatitude(dto.getLatitude());
        record.setLongitude(dto.getLongitude());
        record.setLocationAccuracy(dto.getLocationAccuracy());
        record.setLocationTimestamp(dto.getLocationTimestamp() != null ? dto.getLocationTimestamp() : now);
        
        String locStatus = dto.getLocationStatus();
        if (locStatus == null || locStatus.isBlank()) {
            locStatus = (dto.getLatitude() != null && dto.getLongitude() != null) ? "LOCATION_RECEIVED" : "LOCATION_UNAVAILABLE";
        }
        record.setLocationStatus(locStatus);

        String emgStatus = "LOCATION_RECEIVED".equalsIgnoreCase(locStatus) ? "LOCATION_RECEIVED" : "EMERGENCY_TRIGGERED";
        record.setEmergencyStatus(emgStatus);

        // Timeline
        List<TimelineEvent> timeline = new ArrayList<>();
        timeline.add(new TimelineEvent("1", "🚨 Emergency SOS Signal Initiated", now));
        if (record.getLatitude() != null && record.getLongitude() != null) {
            String accStr = record.getLocationAccuracy() != null ? " (Accuracy: ±" + record.getLocationAccuracy() + "m)" : "";
            timeline.add(new TimelineEvent("2", "📍 Device GPS Coordinates Transmitted: " + record.getLatitude() + ", " + record.getLongitude() + accStr, now));
        } else {
            timeline.add(new TimelineEvent("2", "⚠️ Location Status: " + locStatus, now));
        }
        timeline.add(new TimelineEvent("3", "🚨 Dispatched to Police & Emergency Command Center", now));
        record.setTimeline(timeline);

        // Initial Update
        CaseUpdate initialUpdate = new CaseUpdate(
                "1",
                caseId,
                CaseStatus.SUBMITTED,
                "Emergency SOS Alert Broadcast",
                "Emergency distress signal successfully registered with live device telemetry. Responders alerted.",
                now,
                "Emergency Dispatch System",
                record.getAssignedDepartment()
        );
        record.setUpdates(new ArrayList<>(Collections.singletonList(initialUpdate)));

        return caseRepository.save(record);
    }

    public CaseRecord updateEmergencyLocation(String id, EmergencyLocationUpdateDto dto) {
        CaseRecord caseRecord = getCaseById(id);
        caseRecord.setLatitude(dto.getLatitude());
        caseRecord.setLongitude(dto.getLongitude());
        caseRecord.setLocationAccuracy(dto.getLocationAccuracy());
        caseRecord.setLocationTimestamp(dto.getLocationTimestamp() != null ? dto.getLocationTimestamp() : Instant.now().toString());
        caseRecord.setLocationStatus(dto.getLocationStatus() != null ? dto.getLocationStatus() : "LOCATION_RECEIVED");

        if ("EMERGENCY_TRIGGERED".equalsIgnoreCase(caseRecord.getEmergencyStatus()) || caseRecord.getEmergencyStatus() == null) {
            caseRecord.setEmergencyStatus("LOCATION_RECEIVED");
        }

        String now = Instant.now().toString();
        List<TimelineEvent> timeline = caseRecord.getTimeline();
        timeline.add(new TimelineEvent(String.valueOf(timeline.size() + 1), "📍 Live GPS Updated: " + dto.getLatitude() + ", " + dto.getLongitude(), now));
        caseRecord.setTimeline(timeline);
        caseRecord.setUpdatedAt(Instant.now());

        return caseRepository.save(caseRecord);
    }

    public List<CaseRecord> getActiveEmergencies() {
        return caseRepository.findByIsEmergencyTrueOrderByCreatedAtDesc();
    }

    public CaseRecord updateEmergencyStatus(String id, EmergencyStatusUpdateDto dto, UserPrincipal currentUser) {
        CaseRecord caseRecord = getCaseById(id);
        caseRecord.setEmergencyStatus(dto.getEmergencyStatus());
        if (dto.getResponderNotes() != null && !dto.getResponderNotes().isBlank()) {
            caseRecord.setResponderNotes(dto.getResponderNotes());
        }

        String author = currentUser != null ? currentUser.getName() : "Emergency Responder";
        String now = Instant.now().toString();

        if ("RESOLVED".equalsIgnoreCase(dto.getEmergencyStatus())) {
            caseRecord.setStatus(CaseStatus.RESOLVED);
        } else if ("IN_PROGRESS".equalsIgnoreCase(dto.getEmergencyStatus()) || "RESPONDERS_NOTIFIED".equalsIgnoreCase(dto.getEmergencyStatus())) {
            if (caseRecord.getStatus() == CaseStatus.SUBMITTED || caseRecord.getStatus() == CaseStatus.OPEN) {
                caseRecord.setStatus(CaseStatus.UNDER_REVIEW);
            }
        }

        List<TimelineEvent> timeline = caseRecord.getTimeline();
        timeline.add(new TimelineEvent(String.valueOf(timeline.size() + 1), "🚨 Emergency Status: " + dto.getEmergencyStatus().replace('_', ' ') + " (by " + author + ")", now));
        caseRecord.setTimeline(timeline);

        CaseUpdate update = new CaseUpdate(
                String.valueOf(caseRecord.getUpdates().size() + 1),
                id,
                caseRecord.getStatus(),
                "Emergency Lifecycle: " + dto.getEmergencyStatus().replace('_', ' '),
                dto.getResponderNotes() != null ? dto.getResponderNotes() : "Emergency status transitioned to " + dto.getEmergencyStatus(),
                now,
                author,
                caseRecord.getAssignedDepartment()
        );
        caseRecord.getUpdates().add(update);
        caseRecord.setUpdatedAt(Instant.now());

        return caseRepository.save(caseRecord);
    }

    public List<String> getAvailableOfficers() {
        return DEFAULT_OFFICERS;
    }

    private synchronized String generateEmergencyCaseNumber() {
        long count = caseRepository.count();
        long nextNum = 100 + count;
        return String.format("EMG-2026-%05d", nextNum);
    }

    private synchronized String generateCaseNumber() {
        long count = caseRepository.count();
        long nextNum = 122 + count;
        return String.format("CASE-2026-%05d", nextNum);
    }
}
