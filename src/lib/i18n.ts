import type { Language } from "@/contexts/LanguageContext"

export const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
  { code: "th", label: "TH" },
  { code: "en", label: "EN" },
]

type TranslationMap = Record<string, Partial<Record<Language, string>>>

const translations: TranslationMap = {
  "booking.header.subtitle": {
    en: "Customer queue board",
  },
  "booking.header.new": {
    en: "New booking",
  },
  "booking.header.mine": {
    en: "My bookings",
  },
  "booking.banner.description": {
    en: "Professional nail care with premium imported gel colors. Clean, safe, and 100% quality focused.",
  },
  "booking.banner.selected": {
    en: "Selected details",
  },
  "booking.banner.service": {
    en: "Service:",
  },
  "booking.banner.staff": {
    en: "Technician:",
  },
  "booking.banner.date": {
    en: "Date:",
  },
  "booking.banner.time": {
    en: "Time:",
  },
  "booking.banner.total": {
    en: "Total:",
  },
  "booking.banner.location": {
    en: "📍 Prasert-Manukitch Alley · Open 10:00 - 20:00",
  },
  "booking.greeting.title": {
    en: "Online Nail Booking",
  },
  "booking.greeting.subtitle": {
    en: "Book in 4 quick steps. No waiting at the salon.",
  },
  "booking.greeting.item1": {
    en: "✨ Choose your favorite nail art or extension style",
  },
  "booking.greeting.item2": {
    en: "⏰ Pick the technician, date, and time that suit you",
  },
  "booking.greeting.item3": {
    en: "📱 Save your details and track booking status anytime",
  },
  "booking.greeting.cta": {
    en: "Start booking →",
  },
  "booking.service.title": {
    en: "Choose a service",
  },
  "booking.service.subtitle": {
    en: "Price and duration are calculated from the selected service.",
  },
  "booking.service.empty": {
    en: "No services are available from the system yet.",
  },
  "booking.service.duration": {
    en: "minutes",
  },
  "booking.service.price": {
    en: "Price",
  },
  "booking.service.next": {
    en: "Choose technician",
  },
  "booking.staff.title": {
    en: "Choose your nail technician",
  },
  "booking.staff.subtitle": {
    en: "Our skilled technicians are ready to take care of you.",
  },
  "booking.staff.empty": {
    en: "No nail technicians are available from the system yet.",
  },
  "booking.staff.next": {
    en: "Choose date and time",
  },
  "booking.datetime.title": {
    en: "Choose date and time",
  },
  "booking.datetime.subtitle": {
    en: "The salon is open every day.",
  },
  "booking.datetime.dateLabel": {
    en: "Preferred date",
  },
  "booking.datetime.timeLabel": {
    en: "Time slot",
  },
  "booking.datetime.loading": {
    en: "Checking availability...",
  },
  "booking.datetime.offline": {
    en: "Unable to check availability. Please try again.",
  },
  "booking.datetime.next": {
    en: "Enter contact details",
  },
  "booking.contact.title": {
    en: "Confirm contact details",
  },
  "booking.contact.subtitle": {
    en: "We use these details for booking updates and booking history.",
  },
  "booking.contact.name": {
    en: "Booking name",
  },
  "booking.contact.namePlaceholder": {
    en: "Enter your name or nickname",
  },
  "booking.contact.phone": {
    en: "Contact phone number",
  },
  "booking.contact.phonePlaceholder": {
    en: "Mobile number, e.g. 0891234567",
  },
  "booking.contact.note": {
    en: "Note to technician (optional)",
  },
  "booking.contact.notePlaceholder": {
    en: "Tell us your preferred color or style.",
  },
  "booking.contact.submit": {
    en: "Confirm booking",
  },
  "booking.success.title": {
    en: "Booking request sent!",
  },
  "booking.success.subtitle": {
    en: "You can track your booking status in the My bookings tab.",
  },
  "booking.success.details": {
    en: "Your booking details",
  },
  "booking.success.customer": {
    en: "Customer:",
  },
  "booking.success.phone": {
    en: "Phone:",
  },
  "booking.success.service": {
    en: "Service:",
  },
  "booking.success.staff": {
    en: "Technician:",
  },
  "booking.success.dateTime": {
    en: "Date/time:",
  },
  "booking.success.total": {
    en: "Total:",
  },
  "booking.success.viewMine": {
    en: "View my bookings",
  },
  "booking.success.new": {
    en: "Book another appointment",
  },
  "booking.history.title": {
    en: "My bookings",
  },
  "booking.history.subtitle": {
    en: "Enter the phone number used for your booking.",
  },
  "booking.history.placeholder": {
    en: "Enter phone number to search bookings...",
  },
  "booking.history.clear": {
    en: "Clear search",
  },
  "booking.history.emptyTitle": {
    en: "No booking history found for this phone number.",
  },
  "booking.history.emptySubtitle": {
    en: "Please try another phone number or create a new booking.",
  },
  "booking.history.statusPending": {
    en: "Pending",
  },
  "booking.history.staff": {
    en: "Technician:",
  },
  "booking.history.date": {
    en: "Appointment:",
  },
  "booking.history.customer": {
    en: "Booked by:",
  },
  "booking.history.noPhone": {
    en: "No phone",
  },
  "booking.history.price": {
    en: "Service price:",
  },
  "booking.history.back": {
    en: "Back to booking",
  },
  "booking.closed.title": {
    en: "Sorry, the salon is temporarily closed",
  },
  "booking.closed.description": {
    en: "The salon is currently closed or under maintenance. We apologize for the inconvenience. You can still check your booking history from the My bookings menu above.",
  },
  "booking.closed.phone": {
    en: "Call us:",
  },
  "admin.nav.dashboard": {
    en: "Dashboard",
  },
  "admin.nav.appointments": {
    en: "Appointments",
  },
  "admin.nav.services": {
    en: "Services",
  },
  "admin.nav.technicians": {
    en: "Technicians",
  },
  "admin.nav.customers": {
    en: "Customers",
  },
  "admin.nav.reports": {
    en: "Reports",
  },
  "admin.nav.settings": {
    en: "Settings",
  },
  "admin.nav.management": {
    en: "Management",
  },
  "admin.nav.newBooking": {
    en: "New booking",
  },
  "admin.nav.storeSettings": {
    en: "Store settings",
  },
  "admin.nav.logout": {
    en: "Log out",
  },
  "admin.nav.adminUser": {
    en: "Administrator",
  },
  "admin.common.offline": {
    en: "Showing offline data because the server is unavailable.",
  },
  "admin.common.loadingDashboard": {
    en: "Loading dashboard data...",
  },
  "admin.dashboard.greeting": {
    en: "Hello",
  },
  "admin.dashboard.defaultName": {
    en: "Admin",
  },
  "admin.dashboard.addAppointment": {
    en: "Add appointment",
  },
  "admin.dashboard.todayAppointments": {
    en: "Today's appointments",
  },
  "admin.dashboard.totalCustomers": {
    en: "Total customers",
  },
  "admin.dashboard.activeServices": {
    en: "Active services",
  },
  "admin.dashboard.serviceTypes": {
    en: "types",
  },
  "admin.dashboard.todayRevenue": {
    en: "Today's revenue",
  },
  "admin.dashboard.viewAll": {
    en: "View all",
  },
  "admin.dashboard.noAppointments": {
    en: "No appointments today.",
  },
  "admin.dashboard.popularServices": {
    en: "Popular services",
  },
  "admin.appointments.title": {
    en: "Appointments",
  },
  "admin.appointments.loading": {
    en: "Loading appointments...",
  },
  "admin.appointments.offline": {
    en: "Waiting for Booking API from backend.",
  },
  "admin.appointments.add": {
    en: "Add appointment",
  },
  "admin.appointments.search": {
    en: "Search customer name or service...",
  },
  "admin.appointments.empty": {
    en: "No appointments found.",
  },
  "admin.status.all": {
    en: "All",
  },
  "admin.status.confirmed": {
    en: "Confirmed",
  },
  "admin.status.pending": {
    en: "Pending",
  },
  "admin.status.done": {
    en: "Completed",
  },
  "admin.status.cancelled": {
    en: "Cancelled",
  },
  "admin.status.active": {
    en: "In service",
  },
  "admin.reports.title": {
    en: "Reports",
  },
  "admin.reports.subtitle": {
    en: "Revenue summary and usage statistics",
  },
  "admin.reports.loading": {
    en: "Summarizing reports...",
  },
  "admin.reports.offline": {
    en: "Unable to connect to the server. Showing mock data.",
  },
  "admin.reports.download": {
    en: "Download report",
  },
  "admin.reports.revenue": {
    en: "Revenue",
  },
  "admin.reports.weekly": {
    en: "weekly",
  },
  "admin.reports.monthly": {
    en: "monthly",
  },
  "admin.reports.total": {
    en: "Total",
  },
  "admin.reports.appointments": {
    en: "appointments",
  },
  "admin.reports.average": {
    en: "Avg.",
  },
  "admin.reports.perDay": {
    en: "day",
  },
  "admin.reports.week": {
    en: "Week",
  },
  "admin.reports.month": {
    en: "Month",
  },
  "admin.settings.loading": {
    en: "Loading settings...",
  },
  "admin.settings.title": {
    en: "Store settings",
  },
  "admin.settings.subtitle": {
    en: "Set store availability, business hours, and contact details.",
  },
  "admin.settings.statusTitle": {
    en: "Store open/closed status",
  },
  "admin.settings.openStatus": {
    en: "The store is currently open",
  },
  "admin.settings.closedStatus": {
    en: "The store is temporarily closed",
  },
  "admin.settings.openDescription": {
    en: "Customers can use the online booking flow normally.",
  },
  "admin.settings.closedDescription": {
    en: "Customers cannot create new bookings and the homepage will show the temporary closure screen.",
  },
  "admin.settings.hoursTitle": {
    en: "Business hours and contact details",
  },
  "admin.settings.openTime": {
    en: "Opening time",
  },
  "admin.settings.closeTime": {
    en: "Closing time",
  },
  "admin.settings.phone": {
    en: "Store phone number",
  },
  "admin.settings.phonePlaceholder": {
    en: "e.g. 02-123-4567",
  },
  "admin.settings.saving": {
    en: "Saving...",
  },
  "admin.settings.save": {
    en: "Save settings",
  },
  "admin.settings.warningTitle": {
    en: "Administrator warning",
  },
  "admin.settings.warningBody": {
    en: "If you switch the store to temporarily closed, external customers will not be able to start a new booking until you switch the store back to open.",
  },
  "admin.settings.successTitle": {
    en: "Settings saved",
  },
  "admin.settings.successBody": {
    en: "Business hours and store open/closed status have been saved successfully.",
  },
  "admin.common.ok": {
    en: "OK",
  },
}

export function translate(key: string, language: Language, fallback: string) {
  return translations[key]?.[language] ?? fallback
}
