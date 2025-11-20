package com.peradeniya.renal.service.pdf;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.peradeniya.renal.model.DischargeSummary;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generateDischargeSummaryPdf(DischargeSummary ds) {
        try {
            Document document = new Document();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font normal = new Font(Font.FontFamily.HELVETICA, 12);

            document.add(new Paragraph("Discharge Summary", titleFont));
            document.add(new Paragraph(" ", normal));

            document.add(new Paragraph("Diagnosis: " + ds.getDiagnosis(), normal));
            document.add(new Paragraph("ICD-10 Code: " + ds.getIcd10(), normal));
            document.add(new Paragraph("Discharge Date: " + ds.getDischargeDate(), normal));
            document.add(new Paragraph(" ", normal));

            document.add(new Paragraph("Progress Summary:", titleFont));
            document.add(new Paragraph(ds.getProgressSummary(), normal));
            document.add(new Paragraph(" ", normal));

            document.add(new Paragraph("Management:", titleFont));
            document.add(new Paragraph(ds.getManagement(), normal));
            document.add(new Paragraph(" ", normal));

            document.add(new Paragraph("Discharge Plan:", titleFont));
            document.add(new Paragraph(ds.getDischargePlan(), normal));
            document.add(new Paragraph(" ", normal));

            document.add(new Paragraph("Drugs:", titleFont));
            document.add(new Paragraph(ds.getDrugsFreeHand(), normal));

            document.close();

            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed");
        }
    }
}
