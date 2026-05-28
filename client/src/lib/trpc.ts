import { sendEmail } from './emailjs';

export const trpc = {
  bookings: {
    submitLessonBooking: {
      useMutation: () => ({
        mutateAsync: async (data: any) => {
          await sendEmail({
            fromName:  data.studentName,
            fromEmail: data.studentEmail,
            subject:   `Lesson Booking Request – ${data.teacherName}`,
            message: [
              `Teacher: ${data.teacherName}`,
              `Duration: ${data.duration} minutes`,
              '',
              `Student Name: ${data.studentName}`,
              `Email: ${data.studentEmail}`,
            ].join('\n'),
          });
          return {};
        },
        isPending: false,
        isError: false,
      }),
    },
    submitPracticeRoomBooking: {
      useMutation: () => ({
        mutateAsync: async (data: any) => {
          await sendEmail({
            fromName:  data.studentName,
            fromEmail: data.studentEmail,
            subject:   'Practice Room Booking Request',
            message: [
              `Room Type: ${data.roomType}`,
              `Hours: ${data.hours}`,
              '',
              `Name: ${data.studentName}`,
              `Email: ${data.studentEmail}`,
            ].join('\n'),
          });
          return {};
        },
        isPending: false,
        isError: false,
      }),
    },
  },
  practiceRoomCalendar: {
    getAvailableSlots: {
      useQuery: (_params: any, _opts: any) => ({ data: undefined as any }),
    },
    submitCalendarBooking: {
      useMutation: () => ({
        mutateAsync: async (data: any) => {
          await sendEmail({
            fromName:  data.studentName,
            fromEmail: data.studentEmail,
            subject:   'Practice Room Calendar Booking',
            message: [
              `Date: ${data.bookingDate}`,
              `Time: ${data.startTime} – ${data.endTime}`,
              `Duration: ${data.durationHours} hour(s)`,
              `Room Type: ${data.roomType}`,
              '',
              `Name: ${data.studentName}`,
              `Email: ${data.studentEmail}`,
              data.studentPhone ? `Phone: ${data.studentPhone}` : null,
            ].filter(Boolean).join('\n'),
          });
          return { bookingId: `BK-${Date.now()}`, studentEmail: data.studentEmail };
        },
      }),
    },
  },
};
