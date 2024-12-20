export default {
  calendar: {
    title: "Ders Takvimi",
    tabs: {
      calendar: "Takvim",
      students: "Öğrenciler",
      newStudent: "Yeni Öğrenci"
    }
  },
  studentForm: {
    title: "Yeni Öğrenci Dersi Ekle",
    editTitle: "Öğrenci Dersini Düzenle",
    fields: {
      firstName: "İsim",
      lastName: "Soyisim",
      startDate: "Başlangıç Tarihi",
      endDate: "Bitiş Tarihi",
      noEndDate: "Süresiz Ders",
      recurring: "Tekrarlanan Ders",
      frequency: "Tekrar Sıklığı",
      lessonDuration: "Ders Süresi (Saat)",
      studentId: "Öğrenci No"
    },
    frequency: {
      weekly: "Haftalık",
      biweekly: "İki Haftada Bir",
      monthly: "Aylık",
      oneTime: "Tek Seferlik"
    },
    buttons: {
      save: "Kaydet",
      cancel: "İptal"
    },
    validation: {
      required: {
        firstName: "İsim gerekli",
        lastName: "Soyisim gerekli",
        startDate: "Başlangıç tarihi gerekli",
        endDate: "Bitiş tarihi gerekli",
        frequency: "Tekrar sıklığı gerekli",
        studentId: "Öğrenci no gerekli"
      }
    }
  },
  login: {
    title: "Öğretmen Girişi",
    email: "E-posta",
    password: "Şifre",
    signIn: "Giriş Yap",
    invalidCredentials: "Geçersiz e-posta veya şifre",
    teacherLogin: "Öğretmen Girişi",
    studentQuery: "Öğrenci Sorgula",
    queryTitle: "Ders Programı Sorgula",
    studentId: "Öğrenci No",
    queryButton: "Sorgula",
    studentIdRequired: "Öğrenci no gerekli"
  },
  admin: {
    teacherList: "Öğretmen Listesi",
    backToList: "Listeye Dön",
    teacherCalendar: (params: { name: string }) => `${params.name} - Ders Takvimi`
  },
  error: {
    title: 'Bir Hata Oluştu',
    message: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
    retry: 'Tekrar Dene'
  }
} as const 