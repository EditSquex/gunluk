export const MOTIVATIONAL_QUOTES = [
  "Her duygu ruhun bir rengidir, karanlık da ışık da insana dairdir.",
  "Karanlık olmadan yıldızlar parlamaz.",
  "Melankoli, hüzünlü olma sevincidir.",
  "Ruhun derinliklerinde fırtınalar kopar, ama yağmur toprağı besler.",
  "Gece, düşüncelerin en dürüst olduğu zamandır.",
  "Sessizlik, çığlıklardan daha yüksek sesle konuşur.",
  "Her gölge, yakınlarda bir ışık olduğunun kanıtıdır.",
  "Güllerin dikenleri vardır, ama dikenlerin arasında açarlar.",
  "Zaman her şeyi yıpratır, ama anılar mermere kazınır.",
  "Kendi içindeki labirentte kaybolmak, kendini bulmanın ilk adımıdır."
];

export const MOODS = [
  // Melankolik / Depresif / Karanlık (BAŞTA)
  { emoji: "🖤", label: "Melankolik", color: "#9333EA" },
  { emoji: "🥀", label: "Solgun", color: "#E11D48" },
  { emoji: "🌧️", label: "Kederli", color: "#475569" },
  { emoji: "🕯️", label: "Karanlık / Derin", color: "#78350F" },
  { emoji: "😔", label: "Üzgün", color: "#0284C7" },
  { emoji: "💔", label: "Kırgın", color: "#BE123C" },
  { emoji: "😰", label: "Kaygılı", color: "#A855F7" },
  { emoji: "😤", label: "Sinirli", color: "#DC2626" },

  // Nötr / Karmaşık
  { emoji: "😐", label: "Nötr / Dalgın", color: "#64748B" },
  { emoji: "🤔", label: "Düşünceli", color: "#0EA5E9" },
  { emoji: "😴", label: "Yorgun", color: "#6366F1" },

  // Güzel / Neşeli / Olumlu
  { emoji: "☕", label: "Sakin / Huzurlu", color: "#D97706" },
  { emoji: "✨", label: "Umutlu", color: "#8B5CF6" },
  { emoji: "😊", label: "Neşeli / İyi", color: "#3B82F6" },
  { emoji: "🥰", label: "Mutlu", color: "#EC4899" },
  { emoji: "😄", label: "Harika", color: "#10B981" },
  { emoji: "🤩", label: "Heyecanlı", color: "#F59E0B" }
];

export const WEATHERS = [
  { emoji: "🌙", label: "Gece" },
  { emoji: "🌧️", label: "Yağmurlu" },
  { emoji: "🌩️", label: "Fırtınalı" },
  { emoji: "🌫️", label: "Sisli" },
  { emoji: "☀️", label: "Güneşli" },
  { emoji: "🌤️", label: "Parçalı Bulutlu" }
];

export const INITIAL_ENTRIES = [
  {
    id: "demo-entry-1",
    date: new Date().toISOString().split('T')[0],
    time: "22:30",
    title: "Günün Özeti 📜",
    content: "Bugün hem sakin hem de biraz düşünceli bir gündü. Kahvemi yudumlarken zihnimdeki düşünceleri sayfaya dökmek iyi geldi...",
    mood: "🖤",
    moodLabel: "Melankolik",
    weather: "🌧️",
    isPrivate: true,
    wordCount: 24,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
