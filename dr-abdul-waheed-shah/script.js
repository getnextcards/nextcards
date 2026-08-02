// Interactive Script for Dr. Abdul Waheed Shah Clinic
document.addEventListener('DOMContentLoaded', () => {
    console.log("Dr. Abdul Waheed Shah Clinic Page Loaded.");
});

function handleAppointmentSubmit(event) {
    event.preventDefault();
    
    const patientName = document.getElementById('patientName').value.trim();
    const patientPhone = document.getElementById('patientPhone').value.trim();
    const serviceType = document.getElementById('serviceType').value;
    const notes = document.getElementById('notes').value.trim();

    if (!patientName || !patientPhone) {
        alert("براہ کرم اپنا نام اور فون نمبر درج کریں۔ Please enter your name and phone number.");
        return;
    }

    // Format WhatsApp message
    const message = `*نئی اپائنٹمنٹ درخواست / New Appointment Request*\n\n` +
                    `*نام (Patient Name):* ${patientName}\n` +
                    `*فون نمبر (Phone):* ${patientPhone}\n` +
                    `*سہولت (Service):* ${serviceType}\n` +
                    `*تفصیل (Notes):* ${notes || 'N/A'}\n\n` +
                    `_ڈاکٹر عبدالوحیود شاہ کلینک - ملتان روڈ، اڈا شاہ نال_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/923001234567?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
}
