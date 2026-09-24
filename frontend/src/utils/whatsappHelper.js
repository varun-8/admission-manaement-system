/**
 * High-Conversion Admission Counseling WhatsApp Message Templates & Utility
 * Tailored specifically for Educational Institution Admission Lead Management CRM
 */

export const DEFAULT_STATUS_TEMPLATES = {
  followup: `Hello {studentName}! 👋✨\n\nThank you for expressing interest in *{appName}*! 🎓\nWe are excited to share details about our degree programs, campus facilities, and admission counseling process.\n\nRegarding your inquiry for *{preferredCourse}*,\nour senior academic counselor is ready to assist you with course details, fee structures, and scholarship options.\n\n📍 Visit our campus admission office or reply here for course brochure.\n📞 Admission Helpline: {helplinePhone}\n\nHave a great day!`,

  counseling: `Hello {studentName}! 📄✨\n\nHere is your requested admission counseling summary from *{appName}*:\n\n🎓 *Program*: {preferredCourse}\n\nWe offer industry-oriented curriculum, state-of-the-art labs, top placements, and flexible fee plans!\n\nFeel free to schedule a campus tour or talk with our dean of admissions.\n\n📞 Admission Helpline: {helplinePhone}`,

  scholarship: `Hello {studentName}! 🎓✨\n\nGreat news from *{appName}*!\nFollowing our counseling session regarding *{preferredCourse}*, your application has been processed for a *Merit Scholarship / Fee Waiver*!\n\n✨ *Exclusive Perk*: Reserved seat preference & counseling fee exemption!\n\nPlease confirm your seat booking to lock in this fee structure.\n\n📞 Admission Office: {helplinePhone}`,

  enrolled: `🎉 *ADMISSION SEAT CONFIRMED!* 🎉\n\nDear {studentName},\n\nCongratulations and welcome to *{appName}*! 🏆✨\n\nYour seat for *{preferredCourse}* has been officially booked!\n\n📚 *Next Steps*: Our academic team will issue your provisional admission letter and document verification schedule shortly.\n\nWarm regards,\n*{appName}* Admissions\n📞 Helpline: {helplinePhone}`,

  lost: `Hello {studentName}! 🌸\n\nGreetings from *{appName}*!\nWe noticed your admission application process was on hold. We would love to assist you if you are considering academic options for the upcoming session!\n\n✨ Feel free to consult with our career guidance expert anytime.\n\nReach us at 📞 {helplinePhone}.\nBest wishes for your academic journey!`,
};

export const getStatusTemplates = () => {
  try {
    const saved = localStorage.getItem('admission_crm_wa_status_templates');
    if (saved) {
      return { ...DEFAULT_STATUS_TEMPLATES, ...JSON.parse(saved) };
    }
  } catch (e) {}
  return DEFAULT_STATUS_TEMPLATES;
};

export const saveStatusTemplates = (templates) => {
  try {
    localStorage.setItem('admission_crm_wa_status_templates', JSON.stringify(templates));
  } catch (e) {}
};

export const generateWhatsAppMessage = (
  leadData = {},
  appName = 'EduMerge Admission CRM',
  helplinePhone = '+91 9876543210'
) => {
  const studentName = leadData.studentName || leadData.name || 'Prospective Student';
  const status = leadData.status || 'New Inquiry';
  const preferredCourse = leadData.preferredCourseName || leadData.preferredCourse || 'Academic Program';

  const templates = getStatusTemplates();
  let key = 'followup';
  if (status === 'Enrolled') key = 'enrolled';
  else if (status === 'Counseling Scheduled' || status === 'Campus Visit') key = 'scholarship';
  else if (status === 'Application Submitted') key = 'counseling';
  else if (status === 'Lost') key = 'lost';

  const rawTemplate = templates[key] || DEFAULT_STATUS_TEMPLATES[key] || DEFAULT_STATUS_TEMPLATES.followup;

  const interpolated = rawTemplate
    .replace(/\{studentName\}/g, studentName)
    .replace(/\{customerName\}/g, studentName)
    .replace(/\{appName\}/g, appName)
    .replace(/\{helplinePhone\}/g, helplinePhone)
    .replace(/\{storePhone\}/g, helplinePhone)
    .replace(/\{preferredCourse\}/g, preferredCourse)
    .replace(/\{requirement\}/g, preferredCourse);

  return encodeURIComponent(interpolated);
};

export const getWhatsAppUrl = (phone, leadData, appName = 'EduMerge Admission CRM', helplinePhone = '+91 9876543210') => {
  if (!phone) return '#';
  const cleanPhone = String(phone).replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedMsg = generateWhatsAppMessage(leadData, appName, helplinePhone);
  return `https://wa.me/${waNumber}?text=${encodedMsg}`;
};
