// Static site stub - no backend needed
export const trpc = {
  bookings: {
    submitLessonBooking: {
      useMutation: () => ({
        mutateAsync: async (data: any) => {
          // For static deployment: open mailto
          window.location.href = `mailto:info@amusicva.com?subject=Lesson Booking - ${data.teacherName}&body=Name: ${data.studentName}%0AEmail: ${data.studentEmail}%0ATeacher: ${data.teacherName}%0ADuration: ${data.duration} min`;
          return {};
        },
        isPending: false,
        isError: false,
      }),
    },
    submitPracticeRoomBooking: {
      useMutation: () => ({
        mutateAsync: async (data: any) => {
          window.location.href = `mailto:info@amusicva.com?subject=Practice Room Booking&body=Name: ${data.studentName}%0AEmail: ${data.studentEmail}%0ARoom: ${data.roomType}%0AHours: ${data.hours}`;
          return {};
        },
        isPending: false,
        isError: false,
      }),
    },
  },
};
