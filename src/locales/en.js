export default {
  calendar: {
    title: "Lesson Calendar",
    tabs: {
      calendar: "Calendar",
      students: "Students",
      newStudent: "New Student"
    }
  },
  studentForm: {
    title: "Add New Student Lesson",
    editTitle: "Edit Student Lesson",
    fields: {
      firstName: "First Name",
      lastName: "Last Name",
      startDate: "Start Date",
      endDate: "End Date",
      noEndDate: "No End Date",
      recurring: "Recurring Lesson",
      frequency: "Frequency",
      lessonDuration: "Lesson Duration (Hours)",
      studentId: "Student ID"
    },
    frequency: {
      weekly: "Weekly",
      biweekly: "Biweekly",
      monthly: "Monthly",
      oneTime: "One Time"
    },
    buttons: {
      save: "Save",
      cancel: "Cancel"
    },
    validation: {
      required: {
        firstName: "First name is required",
        lastName: "Last name is required",
        startDate: "Start date is required",
        endDate: "End date is required",
        frequency: "Frequency is required",
        studentId: "Student ID is required"
      },
      endDateAfterStart: "End date must be after start date",
      minDuration: "Lesson duration must be at least 1 hour"
    }
  },
  studentList: {
    columns: {
      student: "Student",
      startDate: "Start Date",
      frequency: "Frequency",
      duration: "Duration"
    },
    actions: {
      edit: "Edit",
      delete: "Delete"
    },
    deleteConfirm: "Are you sure you want to delete this lesson?"
  },
  login: {
    title: 'Teacher Login',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    invalidCredentials: 'Invalid email or password',
    teacherLogin: 'Teacher Login',
    studentQuery: 'Student Query',
    queryTitle: 'Query Lesson Schedule',
    studentId: 'Student ID',
    queryButton: 'Query',
    studentIdRequired: 'Student ID is required'
  },
  header: {
    logout: 'Logout'
  },
  admin: {
    teacherList: 'Teacher List',
    backToList: 'Back to List',
    teacherCalendar: '{name} - Lesson Calendar'
  }
} 