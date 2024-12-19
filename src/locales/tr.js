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
      lessonDuration: "Ders Süresi (Saat)"
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
        frequency: "Tekrar sıklığı gerekli"
      },
      endDateAfterStart: "Bitiş tarihi başlangıç tarihinden sonra olmalı",
      minDuration: "Ders süresi en az 1 saat olmalı"
    }
  },
  studentList: {
    columns: {
      student: "Öğrenci",
      startDate: "Başlangıç Tarihi",
      frequency: "Ders Sıklığı",
      duration: "Ders Süresi"
    },
    actions: {
      edit: "Düzenle",
      delete: "Sil"
    },
    deleteConfirm: "Bu dersi silmek istediğinizden emin misiniz?"
  },
  login: {
    title: 'Öğretmen Girişi',
    email: 'E-posta',
    password: 'Şifre',
    signIn: 'Giriş Yap',
    invalidCredentials: 'Geçersiz e-posta veya şifre'
  },
  header: {
    logout: 'Çıkış Yap'
  },
  admin: {
    teacherList: 'Öğretmen Listesi',
    backToList: 'Listeye Dön',
    teacherCalendar: '{name} - Ders Takvimi'
  }
} 