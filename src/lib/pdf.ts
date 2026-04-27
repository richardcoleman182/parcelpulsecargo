import path from "node:path";
import PDFDocument from "pdfkit";
import type { Parcel } from "@/types/parcel";

export async function createParcelPdf(parcel: Parcel) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ margin: 48, size: "A4" });
    const logoPath = path.join(process.cwd(), "logo.jpg");
    const currency = parcel.currency || "GBP";

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.roundedRect(36, 36, 523, 110, 18).fillAndStroke("#f2f8f7", "#dbe3ea");
    doc.image(logoPath, 54, 50, { fit: [58, 58] });
    doc.fillColor("#0f766e").fontSize(24).font("Helvetica-Bold").text("Parcel Pulse Cargo", 126, 54);
    doc.fillColor("#475569").fontSize(11).font("Helvetica").text("International courier and cargo movement record", 126, 82);
    doc.text("support@parcelpulsecargo.com | +44 7828 243421", 126, 98);
    doc.fillColor("#111827").fontSize(20).font("Helvetica-Bold").text(`Tracking: ${parcel.trackingNumber}`, 54, 166);
    doc.fillColor("#64748b").fontSize(10).font("Helvetica").text(`Generated ${new Date().toLocaleString("en-GB")}`, 54, 193);

    doc.roundedRect(54, 220, 505, 132, 14).fillAndStroke("#ffffff", "#dbe3ea");
    doc.fillColor("#0f172a").fontSize(13).font("Helvetica-Bold").text("Shipment Summary", 72, 238);
    doc.fontSize(10).font("Helvetica");
    [
      ["Service", parcel.serviceLevel || parcel.service],
      ["Parcel Type", parcel.parcelType],
      ["Description", parcel.itemDescription || "Shipment"],
      ["Origin", parcel.origin],
      ["Destination", parcel.destination],
      ["Current Status", parcel.currentStatus],
      ["Current Location", parcel.currentLocation],
      ["Currency", currency],
      ["Declared Value", parcel.declaredValue ? `${currency} ${parcel.declaredValue}` : "Not provided"],
      ["Insurance", parcel.insuranceValue ? `${currency} ${parcel.insuranceValue}` : "Not provided"],
      ["Shipment Notes", parcel.notes || "No extra shipment notes recorded"],
    ].forEach(([label, value], index) => {
      const columnX = index % 2 === 0 ? 72 : 320;
      const rowY = 260 + Math.floor(index / 2) * 18;
      doc.fillColor("#64748b").text(label, columnX, rowY);
      doc.fillColor("#111827").font("Helvetica-Bold").text(String(value), columnX + 88, rowY);
      doc.font("Helvetica");
    });

    const senderY = 376;
    doc.roundedRect(54, senderY, 240, 118, 14).fillAndStroke("#f8fafc", "#dbe3ea");
    doc.roundedRect(319, senderY, 240, 118, 14).fillAndStroke("#f8fafc", "#dbe3ea");
    doc.fillColor("#0f172a").fontSize(13).font("Helvetica-Bold").text("Sender Details", 72, senderY + 18);
    doc.font("Helvetica").fontSize(10).fillColor("#334155")
      .text(parcel.sender.name, 72, senderY + 42)
      .text(parcel.sender.email, 72, senderY + 58)
      .text(parcel.sender.phone || "", 72, senderY + 74)
      .text([parcel.sender.address, parcel.sender.country].filter(Boolean).join(", "), 72, senderY + 90, { width: 200 })
      .text(parcel.sender.dispatchBranch ? `Branch: ${parcel.sender.dispatchBranch}` : "", 72, senderY + 106, { width: 200 });

    doc.fillColor("#0f172a").fontSize(13).font("Helvetica-Bold").text("Receiver Details", 337, senderY + 18);
    doc.font("Helvetica").fontSize(10).fillColor("#334155")
      .text(parcel.receiver.name, 337, senderY + 42)
      .text(parcel.receiver.email, 337, senderY + 58)
      .text(parcel.receiver.phone || "", 337, senderY + 74)
      .text([parcel.receiver.address, parcel.receiver.country].filter(Boolean).join(", "), 337, senderY + 90, { width: 200 });

    let cursorY = 522;
    doc.fillColor("#0f172a").fontSize(14).font("Helvetica-Bold").text("Movement History", 54, cursorY);
    cursorY += 24;

    parcel.statuses.forEach((status) => {
      if (cursorY > 725) {
        doc.addPage();
        cursorY = 54;
      }

      doc.roundedRect(54, cursorY, 505, 58, 12).fillAndStroke("#ffffff", "#e2e8f0");
      doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold").text(status.title, 72, cursorY + 12);
      doc.fillColor("#0f766e").fontSize(10).text(new Date(status.date).toLocaleString("en-GB"), 392, cursorY + 12, { width: 148, align: "right" });
      const movementText = status.internalNote
        ? `${status.location} | ${status.note} | Operations note: ${status.internalNote}`
        : `${status.location} | ${status.note}`;
      doc.fillColor("#475569").font("Helvetica").text(movementText, 72, cursorY + 30, { width: 460 });
      cursorY += 72;
    });

    doc.end();
  });
}
