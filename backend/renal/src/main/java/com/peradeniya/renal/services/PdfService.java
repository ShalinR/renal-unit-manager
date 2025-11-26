package com.peradeniya.renal.services;

import com.peradeniya.renal.model.Allergy;
import com.peradeniya.renal.model.DischargeSummary;
import com.peradeniya.renal.model.MedicalProblem;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.model.Admission;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {

    private static final float MARGIN_LEFT = 40f;
    private static final float MARGIN_RIGHT = 555f;
    private static final float PAGE_WIDTH = 595f;
    private static final float START_Y = 760f;
    private static final float LINE_HEIGHT = 20f;
    private static final float SECTION_SPACING = 15f;
    private static final float CARD_PADDING = 20f;
    private static final float CARD_MARGIN = 5f;
    private static final float HEADER_BOTTOM_SPACING = 12f;
    private static final float COLUMN_WIDTH = 245f;
    private static final float MIN_Y = 80f;

    private static final Color HEADER_BG = new Color(41, 128, 185);
    private static final Color CARD_BG = new Color(255, 255, 255);
    private static final Color CARD_BORDER = new Color(220, 225, 230);
    private static final Color SECTION_HEADER_BG = new Color(100, 170, 220);
    private static final Color SECTION_HEADER_TEXT = new Color(255, 255, 255);
    private static final Color LABEL_COLOR = new Color(100, 110, 120);
    private static final Color ACCENT_COLOR = new Color(41, 128, 185);

    private PDDocument document;
    private PDPageContentStream currentContent;

    public byte[] generateDischargeSummaryPdf(DischargeSummary ds) {
        try {
            document = new PDDocument();
            PDPage page = new PDPage();
            document.addPage(page);
            currentContent = new PDPageContentStream(document, page);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Patient patient = ds.getPatient();
            Admission adm = ds.getAdmission();

            float y = START_Y;
            float leftCol = MARGIN_LEFT + CARD_PADDING + CARD_MARGIN;
            float rightCol = leftCol + COLUMN_WIDTH;

            y = drawHeaderBanner(currentContent, "Renal Unit Manager", "Discharge Summary", y);

            // 1. PATIENT DETAILS
            y = checkNewPage(y, 150);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "1. Patient Details", y);
            y -= HEADER_BOTTOM_SPACING;
            float cardHeight = calculateCardHeight(4);
            float cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);

            float startY = y;
            float tempY = y;

            tempY = drawField(currentContent, "Name", safe(patient.getName()), leftCol, tempY);
            tempY = drawField(currentContent, "Age", safeInt(patient.getAge()), leftCol, tempY);
            tempY = drawField(currentContent, "Date of Birth", safeDate(patient.getDateOfBirth()), leftCol, tempY);
            tempY = drawField(currentContent, "Status", safe(patient.getStatus()), leftCol, tempY);

            tempY = startY;
            tempY = drawField(currentContent, "PHN", safe(patient.getPhn()), rightCol, tempY);
            tempY = drawField(currentContent, "Sex", safe(patient.getGender()), rightCol, tempY);
            tempY = drawField(currentContent, "BHT Number", safe(adm.getBhtNumber()), rightCol, tempY);

            y = cardStartY - cardHeight;

            // 2. ADMISSION DETAILS
            y = checkNewPage(y, 180);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "2. Admission Details", y);
            y -= HEADER_BOTTOM_SPACING;
            cardHeight = calculateCardHeight(6);
            cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);

            startY = y;
            tempY = y;

            tempY = drawField(currentContent, "Ward", safe(adm.getWard()), leftCol, tempY);
            tempY = drawField(currentContent, "Ward / Bed", safe(adm.getWardNumber()) + " / " + safe(adm.getBedId()), leftCol, tempY);
            tempY = drawField(currentContent, "Admission Type", safe(adm.getAdmissionType()), leftCol, tempY);
            tempY = drawField(currentContent, "Date of Admission", safeDate(adm.getAdmittedOn()), leftCol, tempY);
            tempY = drawField(currentContent, "Presenting Complaints", safe(adm.getPresentingComplaints()), leftCol, tempY);

            tempY = startY;
            tempY = drawField(currentContent, "Consultant", safe(adm.getConsultantName()), rightCol, tempY);
            tempY = drawField(currentContent, "Admitting Officer", safe(adm.getAdmittingOfficer()), rightCol, tempY);
            tempY = drawField(currentContent, "Referred From", safe(adm.getReferredBy()), rightCol, tempY);
            tempY = drawField(currentContent, "Time of Admission", safeTime(adm.getAdmissionTime()), rightCol, tempY);

            y = cardStartY - cardHeight;

            // 3. MEDICAL HISTORY
            y = checkNewPage(y, 120);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "3. Medical History", y);
            y -= HEADER_BOTTOM_SPACING;
            List<MedicalProblem> medHistory = patient.getMedicalHistory();
            int medHistoryLines = (medHistory == null || medHistory.isEmpty()) ? 1 : medHistory.size();
            cardHeight = calculateCardHeight(medHistoryLines);
            cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);

            if (medHistory == null || medHistory.isEmpty()) {
                y = drawParagraph(currentContent, "No medical history recorded.", leftCol, y);
            } else {
                for (MedicalProblem mp : medHistory) {
                    y = drawBulletPoint(currentContent, safe(mp.getProblem()), leftCol, y);
                }
            }
            y = cardStartY - cardHeight;

            // 4. ALLERGIES
            y = checkNewPage(y, 120);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "4. Allergies", y);
            y -= HEADER_BOTTOM_SPACING;
            List<Allergy> allergies = patient.getAllergies();
            int allergyLines = (allergies == null || allergies.isEmpty()) ? 1 : allergies.size();
            cardHeight = calculateCardHeight(allergyLines);
            cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);

            if (allergies == null || allergies.isEmpty()) {
                y = drawParagraph(currentContent, "No allergies recorded.", leftCol, y);
            } else {
                for (Allergy al : allergies) {
                    y = drawBulletPoint(currentContent, safe(al.getAllergy()), leftCol, y);
                }
            }
            y = cardStartY - cardHeight;

            // 5. EXAMINATIONS
            y = checkNewPage(y, 150);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "5. Examinations", y);
            y -= HEADER_BOTTOM_SPACING;
            cardHeight = calculateCardHeight(4);
            cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);

            startY = y;
            tempY = y;

            tempY = drawField(currentContent, "Temperature", safeDouble(adm.getExamTempC()) + " °C", leftCol, tempY);
            tempY = drawField(currentContent, "Height", safeDouble(adm.getExamHeightCm()) + " cm", leftCol, tempY);
            tempY = drawField(currentContent, "Weight", safeDouble(adm.getExamWeightKg()) + " kg", leftCol, tempY);

            tempY = startY;
            tempY = drawField(currentContent, "BMI", safeDouble(adm.getExamBMI()) + " kg/m²", rightCol, tempY);
            tempY = drawField(currentContent, "Blood Pressure", safe(adm.getExamBloodPressure()), rightCol, tempY);
            tempY = drawField(currentContent, "Heart Rate", safeInt(adm.getExamHeartRate()) + " bpm", rightCol, tempY);

            y = cardStartY - cardHeight;

            // 6. DIAGNOSIS
            y = checkNewPage(y, 100);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "6. Diagnosis", y);
            y -= HEADER_BOTTOM_SPACING;
            cardHeight = calculateTextCardHeight(safe(ds.getDiagnosis()));
            cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);
            y = drawParagraph(currentContent, safe(ds.getDiagnosis()), leftCol, y);
            y = cardStartY - cardHeight;

            // 7. ICD-10 CODE
            y = checkNewPage(y, 100);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "7. ICD-10 Code", y);
            y -= HEADER_BOTTOM_SPACING;
            cardHeight = calculateTextCardHeight(safe(ds.getIcd10()));
            cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);
            y = drawHighlightedText(currentContent, safe(ds.getIcd10()), leftCol, y);
            y = cardStartY - cardHeight;

            // 8. PROGRESS SUMMARY
            y = checkNewPage(y, 100);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "8. Progress Summary", y);
            y -= HEADER_BOTTOM_SPACING;
            cardHeight = calculateTextCardHeight(safe(ds.getProgressSummary()));
            cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);
            y = drawParagraph(currentContent, safe(ds.getProgressSummary()), leftCol, y);
            y = cardStartY - cardHeight;

            // 9. MANAGEMENT
            y = checkNewPage(y, 100);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "9. Management", y);
            y -= HEADER_BOTTOM_SPACING;
            cardHeight = calculateTextCardHeight(safe(ds.getManagement()));
            cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);
            y = drawParagraph(currentContent, safe(ds.getManagement()), leftCol, y);
            y = cardStartY - cardHeight;

            // 10. DISCHARGE PLAN
            y = checkNewPage(y, 100);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "10. Discharge Plan", y);
            y -= HEADER_BOTTOM_SPACING;
            cardHeight = calculateTextCardHeight(safe(ds.getDischargePlan()));
            cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);
            y = drawParagraph(currentContent, safe(ds.getDischargePlan()), leftCol, y);
            y = cardStartY - cardHeight;

            // 11. DRUGS ON DISCHARGE
            y = checkNewPage(y, 100);
            y -= SECTION_SPACING;
            y = drawSectionHeader(currentContent, "11. Drugs on Discharge", y);
            y -= HEADER_BOTTOM_SPACING;
            cardHeight = calculateTextCardHeight(safe(ds.getDrugsFreeHand()));
            cardStartY = y;
            y = drawCardBackground(currentContent, y, cardHeight);
            y = drawParagraph(currentContent, safe(ds.getDrugsFreeHand()), leftCol, y);

            currentContent.close();
            document.save(out);
            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage(), e);
        }
    }

    private float checkNewPage(float y, float requiredHeight) throws Exception {
        if (y - requiredHeight < MIN_Y) {
            currentContent.close();
            PDPage newPage = new PDPage();
            document.addPage(newPage);
            currentContent = new PDPageContentStream(document, newPage);
            return START_Y;
        }
        return y;
    }

    private float drawHeaderBanner(PDPageContentStream content, String title,
                                   String subtitle, float y) throws Exception {
        float bannerHeight = 65f;

        content.setNonStrokingColor(HEADER_BG);
        content.addRect(0, y - bannerHeight + 10, PAGE_WIDTH, bannerHeight);
        content.fill();

        content.beginText();
        content.setNonStrokingColor(Color.WHITE);
        content.setFont(PDType1Font.HELVETICA_BOLD, 18);
        content.newLineAtOffset(MARGIN_LEFT, y - 20);
        content.showText(title);
        content.endText();

        content.beginText();
        content.setFont(PDType1Font.HELVETICA, 13);
        content.newLineAtOffset(MARGIN_LEFT, y - 42);
        content.showText(subtitle);
        content.endText();

        content.setNonStrokingColor(Color.BLACK);
        return y - bannerHeight - 5;
    }

    private float drawCardBackground(PDPageContentStream content, float y, float height) throws Exception {
        float cardY = y - height + LINE_HEIGHT;

        content.setNonStrokingColor(CARD_BG);
        content.addRect(MARGIN_LEFT, cardY, MARGIN_RIGHT - MARGIN_LEFT, height);
        content.fill();

        content.setStrokingColor(CARD_BORDER);
        content.setLineWidth(1f);
        content.addRect(MARGIN_LEFT, cardY, MARGIN_RIGHT - MARGIN_LEFT, height);
        content.stroke();

        content.setNonStrokingColor(Color.BLACK);
        return y;
    }

    private float drawSectionHeader(PDPageContentStream content, String text, float y) throws Exception {
        float headerHeight = 36f;
        float headerY = y - 8;

        content.setNonStrokingColor(SECTION_HEADER_BG);
        content.addRect(MARGIN_LEFT, headerY - headerHeight + 8,
                MARGIN_RIGHT - MARGIN_LEFT, headerHeight);
        content.fill();

        content.setStrokingColor(ACCENT_COLOR);
        content.setLineWidth(3f);
        content.moveTo(MARGIN_LEFT, headerY - headerHeight + 8);
        content.lineTo(MARGIN_LEFT, headerY + 8);
        content.stroke();

        content.beginText();
        content.setNonStrokingColor(SECTION_HEADER_TEXT);
        content.setFont(PDType1Font.HELVETICA_BOLD, 12);
        content.newLineAtOffset(MARGIN_LEFT + 10, headerY - 9);
        content.showText(text);
        content.endText();

        content.setNonStrokingColor(Color.BLACK);
        return y - headerHeight;
    }

    private float drawField(PDPageContentStream content, String label,
                            String value, float x, float y) throws Exception {
        content.setFont(PDType1Font.HELVETICA, 8);
        content.setNonStrokingColor(LABEL_COLOR);
        content.beginText();
        content.newLineAtOffset(x, y);
        content.showText(label.toUpperCase());
        content.endText();

        y -= 11;

        content.setFont(PDType1Font.HELVETICA, 10);
        content.setNonStrokingColor(Color.BLACK);
        content.beginText();
        content.newLineAtOffset(x, y);
        content.showText(value);
        content.endText();

        return y - LINE_HEIGHT;
    }

    private float drawBulletPoint(PDPageContentStream content, String text,
                                  float x, float y) throws Exception {
        content.setFont(PDType1Font.HELVETICA, 10);
        content.setNonStrokingColor(Color.BLACK);

        content.beginText();
        content.newLineAtOffset(x, y);
        content.showText("• " + text);
        content.endText();

        return y - LINE_HEIGHT;
    }

    private float drawParagraph(PDPageContentStream content, String text,
                                float x, float y) throws Exception {
        if (text == null || text.isEmpty()) return y;

        content.setFont(PDType1Font.HELVETICA, 10);
        content.setNonStrokingColor(Color.BLACK);

        float width = MARGIN_RIGHT - x - CARD_PADDING - CARD_MARGIN;
        String[] words = text.split("\\s+");
        StringBuilder line = new StringBuilder();

        for (String word : words) {
            String testLine = line.isEmpty() ? word : line + " " + word;
            float size = PDType1Font.HELVETICA.getStringWidth(testLine) / 1000 * 10;
            if (size > width) {
                content.beginText();
                content.newLineAtOffset(x, y);
                content.showText(line.toString());
                content.endText();
                y -= LINE_HEIGHT;
                line = new StringBuilder(word);
            } else {
                line = new StringBuilder(testLine);
            }
        }
        if (!line.isEmpty()) {
            content.beginText();
            content.newLineAtOffset(x, y);
            content.showText(line.toString());
            content.endText();
            y -= LINE_HEIGHT;
        }
        return y;
    }

    private float drawHighlightedText(PDPageContentStream content, String text,
                                      float x, float y) throws Exception {
        if (text == null || text.isEmpty()) return y;

        content.setFont(PDType1Font.HELVETICA_BOLD, 11);
        content.setNonStrokingColor(ACCENT_COLOR);

        content.beginText();
        content.newLineAtOffset(x, y);
        content.showText(text);
        content.endText();

        content.setNonStrokingColor(Color.BLACK);
        return y - LINE_HEIGHT;
    }

    private float calculateCardHeight(int lines) {
        return (lines * LINE_HEIGHT) + (2 * CARD_PADDING) + 30;
    }

    private float calculateTextCardHeight(String text) {
        if (text == null || text.isEmpty()) return calculateCardHeight(1);
        int estimatedLines = Math.max(1, (int) Math.ceil(text.length() / 70.0));
        return calculateCardHeight(estimatedLines);
    }

    private String safe(Object v) {
        return v == null ? "–" : v.toString();
    }

    private String safeInt(Integer v) {
        return v == null ? "–" : String.valueOf(v);
    }

    private String safeDouble(Double v) {
        return v == null ? "–" : String.format("%.1f", v);
    }

    private String safeDate(java.time.LocalDate d) {
        return d == null ? "–" : d.toString();
    }

    private String safeTime(LocalDateTime dt) {
        if (dt == null) return "–";
        return dt.format(DateTimeFormatter.ofPattern("HH:mm"));
    }
}