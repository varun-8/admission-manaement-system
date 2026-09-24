/**
 * High-Conversion Admission Counseling WhatsApp Message Templates & Utility
 * Tailored specifically for Educational Institution Admission Lead Management CRM
 */

export const DEFAULT_STATUS_TEMPLATES = {
  followup: `Hello {customerName}! 👋✨\n\nThank you for expressing interest in *{appName}*! 🎓\nWe are excited to share details about our degree programs, campus facilities, and admission counseling process.\n\nRegarding your inquiry for *{requirement}*,\nour senior academic counselor is ready to assist you with course details, fee structures, and scholarship options.\n\n📍 Visit our campus admission office or reply here for course brochure.\n📞 Admission Helpline: {storePhone}\n\nHave a great day!`,

  quotation: `Hello {customerName}! 📄✨\n\nHere is your requested admission counseling summary from *{appName}*:\n\n🎓 *Program*: {requirement}\n\nWe offer industry-oriented curriculum, state-of-the-art labs, top placements, and flexible fee plans!\n\nFeel free to schedule a campus tour or talk with our dean of admissions.\n\n📞 Admission Helpline: {storePhone}`,

  negotiation: `Hello {customerName}! 🎓✨\n\nGreat news from *{appName}*!\nFollowing our counseling session regarding *{requirement}*, your application has been processed for a *Merit Scholarship / Fee Waiver*!\n\n✨ *Exclusive Perk*: Reserved seat preference & counseling fee exemption!\n\nPlease confirm your seat booking to lock in this fee structure.\n\n📞 Admission Office: {storePhone}`,

  order_confirmed: `🎉 *ADMISSION SEAT CONFIRMED!* 🎉\n\nDear {customerName},\n\nCongratulations and welcome to *{appName}*! 🏆✨\n\nYour seat for *{requirement}* has been officially booked!\n\n📚 *Next Steps*: Our academic team will issue your provisional admission letter and document verification schedule shortly.\n\nWarm regards,\n*{appName}* Admissions\n📞 Helpline: {storePhone}`,

  lost: `Hello {customerName}! 🌸\n\nGreetings from *{appName}*!\nWe noticed your admission application process was on hold. We would love to assist you if you are considering academic options for the upcoming session!\n\n✨ Feel free to consult with our career guidance expert anytime.\n\nReach us at 📞 {storePhone}.\nBest wishes for your academic journey!`,
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
  customerData = {},
  appName = 'Admission Pro Institution',
  storePhone = '+91 9876543210'
) => {
  const customerName = customerData.name || customerData.studentName || customerData.customerName || 'Prospective Student';
  const status = customerData.status || 'New Inquiry';
  
  let requirement = customerData.courseInterested || customerData.requirement || 'Academic Program';

  const templates = getStatusTemplates();
  let key = 'followup';
  if (status === 'Admitted' || status === 'Enrolled' || status === 'Order Confirmed') key = 'order_confirmed';
  else if (status === 'Counseling Scheduled' || status === 'Negotiation') key = 'negotiation';
  else if (status === 'Application Submitted' || status === 'Quotation') key = 'quotation';
  else if (status === 'Closed' || status === 'Lost') key = 'lost';

  const rawTemplate = templates[key] || DEFAULT_STATUS_TEMPLATES[key] || DEFAULT_STATUS_TEMPLATES.followup;

  const interpolated = rawTemplate
    .replace(/\{customerName\}/g, customerName)
    .replace(/\{appName\}/g, appName)
    .replace(/\{storePhone\}/g, storePhone)
    .replace(/\{phone\}/g, storePhone)
    .replace(/\{requirement\}/g, requirement)
    .replace(/\{products\}/g, requirement);

  return encodeURIComponent(interpolated);
};

export const getWhatsAppUrl = (phone, customerData, appName = 'Admission Pro Institution', storePhone = '+91 9876543210') => {
  if (!phone) return '#';
  const cleanPhone = String(phone).replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedMsg = generateWhatsAppMessage(customerData, appName, storePhone);
  return `https://wa.me/${waNumber}?text=${encodedMsg}`;
};

