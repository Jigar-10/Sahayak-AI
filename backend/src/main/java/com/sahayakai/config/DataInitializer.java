package com.sahayakai.config;

import com.sahayakai.model.*;
import com.sahayakai.repository.CaseRepository;
import com.sahayakai.repository.EmergencyNumberRepository;
import com.sahayakai.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final EmergencyNumberRepository emergencyNumberRepository;
    private final PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${app.owner.email:owner@sahayak.ai}")
    private String ownerEmail;

    @org.springframework.beans.factory.annotation.Value("${app.owner.password:Password@123}")
    private String ownerPassword;

    @org.springframework.beans.factory.annotation.Value("${app.owner.name:Sahayak Case Officer}")
    private String ownerName;

    public DataInitializer(UserRepository userRepository,
                           CaseRepository caseRepository,
                           EmergencyNumberRepository emergencyNumberRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.caseRepository = caseRepository;
        this.emergencyNumberRepository = emergencyNumberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            initUsers();
            initEmergencyNumbers();
            initCases();
            logger.info("Sahayak AI MongoDB Data Initialization Complete.");
        } catch (Exception e) {
            logger.warn("Database initialization skipped or MongoDB is currently offline: {}", e.getMessage());
        }
    }

    private void initUsers() {
        String normalizedOwnerEmail = ownerEmail != null ? ownerEmail.toLowerCase().trim() : "owner@sahayak.ai";
        if (!userRepository.existsByEmail(normalizedOwnerEmail)) {
            User owner = new User(
                    ownerName != null ? ownerName.trim() : "Sahayak Case Officer",
                    normalizedOwnerEmail,
                    "9876543210",
                    passwordEncoder.encode(ownerPassword != null ? ownerPassword : "Password@123"),
                    Role.ROLE_OWNER
            );
            userRepository.save(owner);
            logger.info("Seeded initial owner account: {}", normalizedOwnerEmail);
        }

        if (!userRepository.existsByEmail("admin@sahayak.ai")) {
            User admin = new User("System Administrator", "admin@sahayak.ai", "9876543211",
                    passwordEncoder.encode("Password@123"), Role.ROLE_ADMIN);
            userRepository.save(admin);
            logger.info("Seeded default admin: admin@sahayak.ai / Password@123");
        }

        if (!userRepository.existsByEmail("user@sahayak.ai")) {
            User user = new User("Ananya Patel", "user@sahayak.ai", "9876543212",
                    passwordEncoder.encode("Password@123"), Role.ROLE_USER);
            userRepository.save(user);
            logger.info("Seeded default user (User A): user@sahayak.ai / Password@123");
        }

        if (!userRepository.existsByEmail("citizen2@sahayak.ai")) {
            User user2 = new User("Pooja Sharma", "citizen2@sahayak.ai", "9876543213",
                    passwordEncoder.encode("Password@123"), Role.ROLE_USER);
            userRepository.save(user2);
            logger.info("Seeded second citizen (User B): citizen2@sahayak.ai / Password@123");
        }
    }

    private void initEmergencyNumbers() {
        if (emergencyNumberRepository.count() == 0) {
            List<EmergencyNumber> numbers = Arrays.asList(
                    new EmergencyNumber("112", "Emergency Response Support System", "112",
                            "Police, fire, medical and other urgent emergency response across India.",
                            "Emergency", true, "Siren", "Available 24/7 across India"),

                    new EmergencyNumber("108", "Ambulance / Emergency Medical Services", "108",
                            "Ambulance and urgent medical assistance where the service is available.",
                            "Emergency", true, "HeartPulse", "Availability may vary by state; call 112 for unified emergency response"),

                    new EmergencyNumber("181", "Women Helpline", "181",
                            "Support and referrals for women experiencing violence, distress or harassment.",
                            "Women & Child Support", false, "HeartHandshake", "24/7 in participating states and Union Territories"),

                    new EmergencyNumber("1091", "Women Police Helpline", "1091",
                            "Police assistance for women facing immediate safety concerns or violence.",
                            "Women & Child Support", false, "Shield", "Available 24/7"),

                    new EmergencyNumber("1098", "Child Helpline", "1098",
                            "Help for children in distress, at risk or in need of protection.",
                            "Women & Child Support", false, "Baby", "Available 24/7"),

                    new EmergencyNumber("14566", "National Helpline Against Atrocities", "14566",
                            "Information, complaint registration and support related to atrocities against SC/ST communities.",
                            "SC/ST Support", false, "Scale", "Available round the clock across India"),

                    new EmergencyNumber("1930", "Cyber Crime Helpline", "1930",
                            "Report cybercrime and financial fraud for prompt assistance and complaint registration.",
                            "Cyber Crime", false, "MonitorSmartphone", "Available 24/7")
            );

            emergencyNumberRepository.saveAll(numbers);
            logger.info("Seeded 7 official emergency helplines into MongoDB.");
        }
    }

    private void initCases() {
        if (caseRepository.count() == 0) {
            Instant now = Instant.now();

            User userA = userRepository.findByEmail("user@sahayak.ai").orElse(null);
            String userAId = userA != null ? userA.getId() : null;

            User userB = userRepository.findByEmail("citizen2@sahayak.ai").orElse(null);
            String userBId = userB != null ? userB.getId() : null;

            List<CaseRecord> cases = Arrays.asList(
                    createSeedCase("CASE-2026-00122", userAId, "moderate", "workplace-harassment",
                            "Workplace Hostility & Harassment Grievance",
                            "Counsellor Meera Sharma", CaseStatus.INVESTIGATION, false, "text", now.minus(14, ChronoUnit.DAYS),
                            "Experiencing ongoing verbal hostility and discriminatory remarks in the workplace. Facing intimidation and anxious about job security."),

                    createSeedCase("CASE-2026-00123", userAId, "high", "community-atrocity",
                            "Community Intimidation & Retaliation Concern",
                            "Officer Rajesh Kumar", CaseStatus.ASSIGNED, false, "voice", now.minus(7, ChronoUnit.DAYS),
                            "Targeted harassment and threats of retaliation from local community members after filing an official grievance."),

                    createSeedCase("CASE-2026-00124", null, "critical", "domestic-violence",
                            "Urgent Safety & Domestic Protection Request",
                            null, CaseStatus.SUBMITTED, true, "text", now.minus(2, ChronoUnit.DAYS),
                            "Immediate physical safety threat at home. Requires urgent protection and emergency shelter assistance."),

                    createSeedCase("CASE-2026-00125", userAId, "low", "other",
                            "Administrative Redressal & RTI Assistance",
                            "Counsellor Ananya Patel", CaseStatus.RESOLVED, false, "text", now.minus(21, ChronoUnit.DAYS),
                            "Seeking administrative guidance on filing right-to-information request and general social support."),

                    createSeedCase("CASE-2026-00126", null, "high", "sexual-harassment",
                            "Digital Stalking & Electronic Harassment",
                            "Legal Officer Priya Singh", CaseStatus.UNDER_REVIEW, false, "voice", now.minus(4, ChronoUnit.DAYS),
                            "Repeated stalking and digital harassment by a senior colleague. Needs legal restraining advice and trauma counselling."),

                    // Case belonging to User B (citizen2@sahayak.ai) for verification of strict data isolation
                    createSeedCase("CASE-2026-00200", userBId, "high", "cyber-crime",
                            "Online Banking Impersonation & Financial Extortion",
                            "Officer Rajesh Kumar", CaseStatus.INVESTIGATION, false, "text", now.minus(3, ChronoUnit.DAYS),
                            "Unauthorized account takeover and threatening extortion messages received via encrypted messaging channels.")
            );

            caseRepository.saveAll(cases);
            logger.info("Seeded demonstration cases into MongoDB with strict user-case associations.");
        }
    }

    private CaseRecord createSeedCase(String id, String userId, String riskStr, String category, String title,
                                      String officer, CaseStatus status, boolean immediateDanger, String channel,
                                      Instant createdAt, String narrative) {
        RiskCategory risk = RiskCategory.fromValue(riskStr);
        String createdStr = createdAt.toString();

        CaseRecord c = new CaseRecord();
        c.setId(id);
        c.setCaseNumber(id);
        c.setUserId(userId);
        c.setTitle(title);
        c.setCategory(category);
        c.setDescription(narrative);
        c.setAssessmentId("ASMT-SEED-" + id.substring(id.length() - 3));
        c.setCreatedAt(createdStr);
        c.setChannel(channel);
        c.setLanguage("en");
        c.setRiskCategory(risk);
        c.setPriority(risk.getValue());
        c.setSvi(risk == RiskCategory.CRITICAL ? 92 : risk == RiskCategory.HIGH ? 78 : risk == RiskCategory.MODERATE ? 54 : 22);
        c.setImmediateDanger(immediateDanger);
        c.setIncidentCategory(category);
        c.setAssignedOfficer(officer);
        c.setStatus(status);
        c.setNarrative(narrative);
        c.setEscalated(risk == RiskCategory.CRITICAL || risk == RiskCategory.HIGH || immediateDanger);
        c.setAiConfidence(84);

        if (officer != null) {
            if (officer.toLowerCase().contains("legal")) c.setAssignedDepartment("Legal Services Division");
            else if (officer.toLowerCase().contains("counsellor")) c.setAssignedDepartment("Counselling & Support Services");
            else c.setAssignedDepartment("Public Grievance Redressal");
        } else {
            c.setAssignedDepartment("Grievance Redressal Cell");
        }

        List<Indicator> indicators = new ArrayList<>();
        indicators.add(new Indicator("ind-1", "Emotional Distress", c.getSvi()));
        indicators.add(new Indicator("ind-2", "Interpersonal Threat", immediateDanger ? 90 : 60));
        indicators.add(new Indicator("ind-3", "Institutional Vulnerability", 55));
        c.setIndicators(indicators);

        c.setExplainableIndicators(Arrays.asList(
                "Elevated indicators of psychological strain and fear of retaliation detected",
                immediateDanger ? "Immediate physical safety risk flagged" : "Screener recommends professional intervention"
        ));

        List<String> actions = new ArrayList<>();
        actions.add("counselling");
        actions.add("legal");
        if (immediateDanger) actions.add("police");
        c.setRecommendedActions(actions);

        // Timeline events
        List<TimelineEvent> timeline = new ArrayList<>();
        timeline.add(new TimelineEvent("1", "Complaint Submitted", createdStr));
        timeline.add(new TimelineEvent("2", "Consent Recorded", createdStr));
        timeline.add(new TimelineEvent("3", "AI Screening Completed", createdStr));
        timeline.add(new TimelineEvent("4", "Risk Categorized as " + risk.getValue(), createdStr));
        if (officer != null) {
            timeline.add(new TimelineEvent("5", "Case Assigned to " + officer, createdAt.plus(1, ChronoUnit.DAYS).toString()));
        }
        if (status == CaseStatus.INVESTIGATION) {
            timeline.add(new TimelineEvent("6", "Investigation in Progress", createdAt.plus(2, ChronoUnit.DAYS).toString()));
        } else if (status == CaseStatus.RESOLVED) {
            timeline.add(new TimelineEvent("6", "Support Provided & Case Resolved", createdAt.plus(10, ChronoUnit.DAYS).toString()));
        }
        c.setTimeline(timeline);

        // Case Updates Feed
        List<CaseUpdate> updates = new ArrayList<>();
        updates.add(new CaseUpdate("1", id, CaseStatus.SUBMITTED, "Complaint Submitted",
                "Your grievance has been safely logged in the Sahayak AI portal.", createdStr, "Sahayak System", c.getAssignedDepartment()));

        if (officer != null) {
            updates.add(new CaseUpdate("2", id, CaseStatus.ASSIGNED, "Case Assigned",
                    "Case assigned to " + officer + " for coordinated review.", createdAt.plus(1, ChronoUnit.DAYS).toString(), officer, c.getAssignedDepartment()));
        }

        if (status == CaseStatus.INVESTIGATION) {
            updates.add(new CaseUpdate("3", id, CaseStatus.INVESTIGATION, "Investigation Started",
                    "Initial enquiry and trauma-informed safety consultation in progress.", createdAt.plus(2, ChronoUnit.DAYS).toString(), officer, c.getAssignedDepartment()));
        } else if (status == CaseStatus.RESOLVED) {
            updates.add(new CaseUpdate("3", id, CaseStatus.RESOLVED, "Case Resolved",
                    "Administrative assistance completed and formal confirmation issued.", createdAt.plus(10, ChronoUnit.DAYS).toString(), officer, c.getAssignedDepartment()));
        }

        c.setUpdates(updates);

        return c;
    }
}
