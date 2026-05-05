package com.trustbridge.policy.service;

import com.trustbridge.policy.domain.Policy;
import com.trustbridge.policy.domain.Product;
import com.trustbridge.policy.domain.User;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PdfCertificateService {
    public byte[] generate(Policy policy, Product product, User user) {
        List<String> lines = List.of(
                "TrustBridge Insurance",
                "Official Policy Certificate",
                "Policy Number: " + policy.policyNumber(),
                "Policyholder: " + user.name(),
                "Product: " + product.name(),
                "Status: " + policy.status(),
                "Coverage: INR " + policy.coverage(),
                "Annual Premium: INR " + policy.annualPremium(),
                "Start Date: " + policy.startDate(),
                "Renewal Date: " + policy.expiryDate(),
                "KYC: " + policy.kyc().type() + " / " + policy.kyc().fileName(),
                "QR Verification: " + policy.policyNumber() + "|" + policy.id(),
                "Terms: " + product.terms());
        return simplePdf(lines);
    }

    private byte[] simplePdf(List<String> lines) {
        List<byte[]> objects = new ArrayList<>();
        objects.add("<< /Type /Catalog /Pages 2 0 R >>".getBytes(StandardCharsets.US_ASCII));
        objects.add("<< /Type /Pages /Kids [3 0 R] /Count 1 >>".getBytes(StandardCharsets.US_ASCII));
        objects.add(
                "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>"
                        .getBytes(StandardCharsets.US_ASCII));
        objects.add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>".getBytes(StandardCharsets.US_ASCII));

        StringBuilder stream = new StringBuilder("BT\n/F1 22 Tf\n72 730 Td\n");
        for (int index = 0; index < lines.size(); index += 1) {
            if (index == 1) {
                stream.append("/F1 16 Tf\n");
            }
            stream.append("(").append(escape(lines.get(index))).append(") Tj\n0 -28 Td\n");
        }
        stream.append("ET\n");
        byte[] streamBytes = stream.toString().getBytes(StandardCharsets.US_ASCII);
        objects.add(("<< /Length " + streamBytes.length + " >>\nstream\n" + stream + "endstream")
                .getBytes(StandardCharsets.US_ASCII));

        ByteArrayOutputStream pdf = new ByteArrayOutputStream();
        List<Integer> offsets = new ArrayList<>();
        write(pdf, "%PDF-1.4\n");
        for (int i = 0; i < objects.size(); i += 1) {
            offsets.add(pdf.size());
            write(pdf, (i + 1) + " 0 obj\n");
            write(pdf, new String(objects.get(i), StandardCharsets.US_ASCII));
            write(pdf, "\nendobj\n");
        }
        int xref = pdf.size();
        write(pdf, "xref\n0 " + (objects.size() + 1) + "\n0000000000 65535 f \n");
        for (Integer offset : offsets) {
            write(pdf, String.format("%010d 00000 n \n", offset));
        }
        write(pdf, "trailer\n<< /Size " + (objects.size() + 1) + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF");
        return pdf.toByteArray();
    }

    private String escape(String text) {
        return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)");
    }

    private void write(ByteArrayOutputStream out, String value) {
        out.writeBytes(value.getBytes(StandardCharsets.US_ASCII));
    }
}
