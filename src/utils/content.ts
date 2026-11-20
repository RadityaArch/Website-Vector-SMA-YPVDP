import type {
  AboutOledScreen,
  OledPatternType,
  SiteContent,
} from '../types.ts';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  landing: {
    heroKicker: 'Vidatra Engineering, Coding, Technology of Robotics',
    heroImageUrl: '/images/hero-vector-lab.svg',
    heroHeadline: 'Merancang Masa Depan Lewat Kode, Rangkaian, dan Robotika.',
    heroSubheadline:
      'VECTOR (Vidatra Engineering, Coding, Technology of Robotics) adalah organisasi ekstrakurikuler siswa yang menumbuhkan keterampilan praktis di bidang elektronika, mikrokontroler ESP32, sistem IoT, dan robotika otonom.',
    introSectionTitle: 'Dari Rangkaian Pertama Menuju Prototipe Nyata.',
    introSectionBody:
      'VECTOR menjembatani teori di kelas dengan praktik rekayasa langsung. Anggota memulai dari merangkai komponen dasar, mempelajari pemrograman mikrokontroler ESP32 dengan debugging berbantuan AI, hingga membangun prototipe IoT dan robotika secara kolaboratif.',
    disciplines: [
      {
        index: '01',
        title: 'Elektronika Dasar',
        description:
          'Tegangan, arus, resistansi, perakitan breadboard, keselamatan rangkaian, dan pengukuran multimeter.',
      },
      {
        index: '02',
        title: 'Mikrokontroler & ESP32',
        description:
          'Logika pemrograman tertanam, kendali GPIO, debugging serial, dan iterasi firmware berbantuan AI.',
      },
      {
        index: '03',
        title: 'Sensor & Aktuator',
        description:
          'Array inframerah, sensor gas dan suhu, layar OLED, motor gear DC, dan penggerak servo.',
      },
      {
        index: '04',
        title: 'Konektivitas & IoT',
        description:
          'Telemetri Wi-Fi, dasbor web, pencatatan data daring, dan penerapan prototipe di dunia nyata.',
      },
    ],
    featuredProjectsTitle: 'Proyek Pilihan',
    featuredProjectsSubtitle:
      'Perangkat keras, firmware tertanam, dan prototipe otonom karya anggota VECTOR di bidang elektronika, IoT, dan robotika.',
    featuredDocsTitle: 'Dokumentasi Aktivitas & Workshop',
    featuredDocsSubtitle:
      'Cuplikan kegiatan workshop laboratorium, peninjauan prototipe, dan sesi perakitan ekstrakurikuler.',
    previewPhotos: [
      {
        id: 'lp-1',
        imageUrl: '/images/doc-workshop-esp32.svg',
        caption: 'Sesi Dasar ESP32 & Perakitan Breadboard',
        categoryLabel: 'Workshop',
      },
      {
        id: 'lp-2',
        imageUrl: '/images/project-oled-keychain.svg',
        caption: 'Karya Perdana Anggota: Gantungan Kunci OLED 0,96"',
        categoryLabel: 'Perangkat Keras',
      },
      {
        id: 'lp-3',
        imageUrl: '/images/doc-prototype-review.svg',
        caption: 'Peninjauan Proposal Inovasi Kelompok & Skematik',
        categoryLabel: 'Aktivitas',
      },
    ],
    ctaKicker: 'Periode Organisasi 2027 · Ketua Ekskul: Radithya Archietilla',
    ctaTitle: 'Pembelajaran Terstruktur, Perangkat Nyata, dan Program Kerja 2027.',
    ctaBody:
      'Pelajari bagaimana VECTOR membimbing anggota mulai dari proyek perdana Gantungan Kunci OLED 0,96 inci hingga workshop ESP32, projek grup inovasi teknologi, media edukasi, dan web portofolio pribadi anggota.',
  },
  projects: [
    {
      id: 'proj-oled-keychain',
      slug: 'vector-identity-keychain',
      title: 'Gantungan Kunci Identitas VECTOR (OLED 0,96")',
      category: 'Electronics',
      year: '2027',
      status: 'Proyek Pembuka Aktif',
      shortDescription:
        'Gantungan kunci PCB khusus yang dilengkapi layar OLED I2C 0,96 inci sebagai lencana identitas sekaligus proyek mikrokontroler perdana bagi setiap anggota.',
      thumbnailUrl: '/images/project-oled-keychain.svg',
      overview:
        'Dirancang sebagai proyek perdana bagi anggota baru VECTOR, Gantungan Kunci Identitas VECTOR menggabungkan pemrograman layar tertanam dengan perakitan perangkat keras yang rapi menjadi lencana identitas sehari-hari.',
      problemStatement:
        'Siswa pemula sering merasa kewalahan saat memulai dari mikrokontroler polos dan keluaran terminal yang abstrak. Dibutuhkan perangkat fisik nyata yang mengajarkan penyolderan, komunikasi I2C, dan pengunggahan firmware sejak sesi awal.',
      objectives: [
        'Memperkenalkan keselamatan kelistrikan dasar, polaritas pin, dan teknik penyolderan.',
        'Mendemonstrasikan pengkabelan jalur I2C (SDA/SCL) antara mikrokontroler ringkas dan modul OLED SSD1306 0,96".',
        'Memungkinkan setiap anggota menyesuaikan tampilan grafis piksel pada layar OLED di dalam firmware.',
      ],
      howItWorks:
        'Mikrokontroler ringkas berkomunikasi melalui protokol I2C (alamat 0x3C) untuk mengendalikan panel OLED monokrom 128x64 piksel. Menekan tombol mode taktil pada papan akan mengganti tampilan grafis piksel seperti wajah smiley, ekspresi kedip, ikon robot, dan gelombang sinyal.',
      components: [
        { name: 'Modul OLED SSD1306 0,96"', role: 'Layar grafis I2C 128x64 piksel' },
        { name: 'PCB Pembawa MCU Ringkas', role: 'Regulasi daya dan jalur I2C' },
        { name: 'Sakelar Taktil 6x6mm', role: 'Mengganti tampilan grafis layar OLED' },
        { name: 'Tahap Daya CR2032 / LiPo', role: 'Catu daya portabel 3,3V teregulasi' },
        { name: 'Lubang Ring Kuningan', role: 'Pengait gantungan kunci mekanis yang kuat' },
      ],
      developmentProcess: [
        {
          step: '01. Purwarupa Breadboard',
          detail: 'Memverifikasi alamat pemindai I2C dan uji nyala piksel awal menggunakan kabel jumper.',
        },
        {
          step: '02. Firmware Bitmap & Grafis',
          detail: 'Mengonversi ikon grafis ke array bitmap byte C dan menerapkan tombol mode dengan debounce.',
        },
        {
          step: '03. Penyolderan & Perakitan PCB',
          detail: 'Menyolder header pin, sakelar taktil, serta memasang bezel OLED rapi pada PCB biru khusus.',
        },
      ],
      galleryImages: ['/images/project-oled-keychain.svg', '/images/doc-workshop-esp32.svg'],
      videoUrl: '',
      resultsOutcomes:
        'Setiap anggota baru menyelesaikan gantungan kunci OLED VECTOR yang berfungsi penuh sambil membangun kepercayaan diri dalam pengkabelan, debugging I2C, dan unggah firmware.',
      featuredOnLanding: true,
    },
    {
      id: 'proj-line-follower',
      slug: 'pid-line-follower-robot',
      title: 'Robot Line Follower PID Otonom',
      category: 'Robotics',
      year: '2027',
      status: 'Uji Prototipe',
      shortDescription:
        'Robot penggerak diferensial respons tinggi menggunakan array 5 sensor inframerah dan kendali umpan balik PID untuk melacak lintasan berliku.',
      thumbnailUrl: '/images/project-line-follower.svg',
      overview:
        'Platform robotika dasar yang dibangun untuk mengajarkan teori kendali umpan balik tertutup, modulasi PWM driver motor, dan distribusi bobot mekanis.',
      problemStatement:
        'Logika pengikut garis sederhana tipe on-off menimbulkan guncangan kasar dan keluar jalur pada tikungan tajam. Pengaturan kecepatan yang presisi membutuhkan perhitungan galat berkelanjutan serta penalaan umpan balik.',
      objectives: [
        'Membangun sasis pembawa ringan dengan titik pusat gravitasi rendah.',
        'Membaca array pantulan inframerah 5 kanal berkecepatan tinggi untuk menghitung posisi garis.',
        'Menala konstanta Proporsional-Integral-Derivatif (PID) agar tikungan dilalui mulus dan cepat.',
      ],
      howItWorks:
        'Lima sensor inframerah di batang depan mengukur kontras pantulan permukaan. Mikrokontroler menghitung galat posisi berbobot relatif terhadap sensor tengah, memprosesnya melalui loop kendali PID, lalu mengirim sinyal duty cycle PWM berbeda ke driver motor H-bridge yang menggerakkan dua motor gear N20.',
      components: [
        { name: 'ESP32 / Arduino Nano', role: 'Pembacaan sensor waktu nyata dan perhitungan PID' },
        { name: 'Array IR TCRT5000 5 Kanal', role: 'Deteksi posisi garis kontras tinggi' },
        { name: 'Driver Motor Ganda TB6612FNG', role: 'Kendali motor PWM dua arah yang efisien' },
        { name: 'Motor Gear Mikro Logam N20 (2x)', role: 'Penggerak roda diferensial torsi tinggi' },
        { name: 'Baterai LiPo 2S 7,4V', role: 'Sumber daya stabil berarus tinggi' },
      ],
      developmentProcess: [
        {
          step: '01. Geometri Sasis & Sensor',
          detail: 'Menempatkan batang IR di depan poros roda agar waktu respons belokan maksimal.',
        },
        {
          step: '02. Rutinitas Kalibrasi Sensor',
          detail: 'Merekam ambang batas pantulan putih/hitam pada berbagai kondisi pencahayaan ruang.',
        },
        {
          step: '03. Uji Coba Penalaan PID',
          detail: 'Menyesuaikan nilai Kp, Ki, dan Kd secara bertahap pada tikungan 90 derajat dan lintasan S.',
        },
      ],
      galleryImages: ['/images/project-line-follower.svg'],
      videoUrl: '',
      resultsOutcomes:
        'Menyelesaikan putaran lintasan multi-tikungan dengan mulus tanpa osilasi, menjadi tolok ukur utama kesiapan kompetisi robotika VECTOR.',
      featuredOnLanding: true,
    },
    {
      id: 'proj-food-freshness',
      slug: 'iot-food-freshness-detector',
      title: 'Simpul Sensor Kesegaran Makanan IoT',
      category: 'IoT & ESP32',
      year: '2027',
      status: 'Prototipe Selesai',
      shortDescription:
        'Pemantau lingkungan berbasis ESP32 yang menggabungkan sensor gas VOC dan telemetri suhu-kelembapan untuk mengelompokkan tingkat kesegaran bahan pangan.',
      thumbnailUrl: '/images/project-food-freshness.svg',
      overview:
        'Dikembangkan sebagai prototipe inovasi IoT terapan di sekolah, unit ini memantau senyawa organik volatil dan kelembapan mikro di sekitar bahan pangan tersimpan lalu mengirim peringatan kesegaran secara langsung.',
      problemStatement:
        'Pemeriksaan visual saja sering melewatkan pembusukan kimiawi tahap awal di wadah penyimpanan kantin atau dapur sekolah, sehingga memicu pemborosan bahan makanan.',
      objectives: [
        'Mengukur emisi gas organik volatil bersamaan dengan suhu dan kelembapan sekitar.',
        'Menetapkan kurva acuan sensor antara bahan segar dan bahan yang mulai membusuk.',
        'Menampilkan status langsung di panel lokal sembari mengirim telemetri melalui Wi-Fi.',
      ],
      howItWorks:
        'ESP32 membaca perubahan tegangan analog dari sensor gas MQ-135 dan data digital dari sensor DHT22. Algoritma kalibrasi menormalisasi bacaan terhadap kelembapan sekitar dan menentukan indeks kesegaran yang ditampilkan lokal serta dicatat melalui endpoint HTTP Wi-Fi.',
      components: [
        { name: 'ESP32-WROOM-32', role: 'Pencuplikan ADC, kalkulasi kalibrasi, dan telemetri Wi-Fi' },
        { name: 'Sensor Gas MQ-135', role: 'Mendeteksi uap NH3, alkohol, dan gas VOC pembusukan' },
        { name: 'Sensor DHT22', role: 'Kompensasi suhu dan kelembapan relatif' },
        { name: 'Casing Cetak 3D Berventilasi', role: 'Pelindung sensor dengan aliran udara terarah' },
      ],
      developmentProcess: [
        {
          step: '01. Pemanasan Awal & Acuan Sensor',
          detail: 'Memanaskan elemen MQ-135 selama 24 jam dan mencatat resistansi acuan udara bersih.',
        },
        {
          step: '02. Pencatatan Sampel Multi-Hari',
          detail: 'Mengumpulkan data VOC dan kelembapan per jam dalam uji coba penyimpanan buah terkendali.',
        },
        {
          step: '03. Integrasi Casing & Dasbor',
          detail: 'Merakit rangka berventilasi dan menyusun indikator ambang peringatan.',
        },
      ],
      galleryImages: ['/images/project-food-freshness.svg'],
      videoUrl: '',
      resultsOutcomes:
        'Menunjukkan kenaikan terukur pada sinyal VOC 18–24 jam sebelum tanda pembusukan terlihat secara visual pada uji coba buah jeruk dan pisang.',
      featuredOnLanding: true,
    },
    {
      id: 'proj-object-grabber',
      slug: 'articulated-object-grabber',
      title: 'Lengan Penjepit Objek Servo 4-DOF',
      category: 'Robotics',
      year: '2027',
      status: 'Dalam Pengembangan',
      shortDescription:
        'Lengan robotik meja dengan empat derajat kebebasan servo, penjepit rahang paralel, dan interpolasi gerak yang halus.',
      thumbnailUrl: '/images/project-object-grabber.svg',
      overview:
        'Proyek manipulasi mekanis yang memperkenalkan siswa pada perhitungan torsi servo, konsep kinematika terbalik, dan pengendalian gerak multi-sumbu.',
      problemStatement:
        'Mengajarkan sambungan mekanis dan gerak aktuator terkoordinasi membutuhkan lengan meja yang stabil agar terhindar dari hentakan mendadak dan reset akibat jatuh tegangan.',
      objectives: [
        'Merancang rakitan sambungan 4-DOF yang stabil dengan regulator buck 5V khusus.',
        'Menerapkan interpolasi sudut bertahap untuk siklus ambil-dan-letak yang halus.',
        'Menyediakan mode kendali manual joystick sekaligus urutan otomatis berulang.',
      ],
      howItWorks:
        'Driver PWM 16-kanal PCA9685 mengambil alih pewaktuan sinyal dari mikrokontroler untuk menggerakkan servo putar dasar, bahu, siku, dan penjepit paralel yang ditenagai regulator terisolasi 5V 3A.',
      components: [
        { name: 'Kontroler ESP32', role: 'Penghalusan lintasan dan memori urutan gerak' },
        { name: 'Driver PWM PCA9685', role: 'Pembangkit pulsa servo I2C bebas getaran' },
        { name: 'Servo MG996R & SG90', role: 'Torsi lengan/dasar dan aktuasi penjepit' },
        { name: 'Konverter Buck 5V 3A', role: 'Jalur daya aktuator yang terisolasi' },
      ],
      developmentProcess: [
        {
          step: '01. Perhitungan Sambungan & Torsi',
          detail: 'Memverifikasi jangkauan lengan terhadap batas torsi tahan MG996R dengan margin aman.',
        },
        {
          step: '02. Isolasi Jalur Daya',
          detail: 'Memisahkan suplai logika 3,3V dari bus servo berarus tinggi guna mencegah brownout.',
        },
        {
          step: '03. Firmware Gerak Halus',
          detail: 'Menulis interpolasi sudut kubik antar titik koordinat yang tersimpan.',
        },
      ],
      galleryImages: ['/images/project-object-grabber.svg'],
      videoUrl: '',
      resultsOutcomes:
        'Mampu mengambil dan memindahkan balok uji seberat 120g di area kerja 22cm secara berulang dan stabil.',
      featuredOnLanding: false,
    },
  ],
  documentation: [
    {
      id: 'doc-1',
      title: 'Workshop Dasar ESP32 & Perakitan Breadboard',
      type: 'photo',
      category: 'Workshop',
      date: '2027-01-24',
      description:
        'Anggota merangkai sirkuit LED dan sensor awal di atas breadboard sambil menelusuri aliran arus serta pinout GPIO ESP32 dengan debugging berbantuan AI.',
      imageUrl: '/images/doc-workshop-esp32.svg',
      externalUrl: '',
      featuredOnLanding: true,
    },
    {
      id: 'doc-2',
      title: 'Peninjauan Proposal Inovasi Kelompok & Daftar Komponen',
      type: 'photo',
      category: 'Activity',
      date: '2027-04-10',
      description:
        'Tim siswa mempresentasikan rumusan masalah, diagram blok, daftar komponen (BOM), dan jadwal pembagian peran sebelum memasuki tahap pembuatan prototipe.',
      imageUrl: '/images/doc-prototype-review.svg',
      externalUrl: '',
      featuredOnLanding: true,
    },
    {
      id: 'doc-3',
      title: 'Sesi Penyolderan & Perakitan Gantungan Kunci OLED',
      type: 'photo',
      category: 'Development',
      date: '2027-02-14',
      description:
        'Praktik penyolderan langsung untuk mengintegrasikan layar OLED SSD1306 0,96 inci ke papan PCB gantungan kunci khusus anggota VECTOR.',
      imageUrl: '/images/project-oled-keychain.svg',
      externalUrl: '',
      featuredOnLanding: true,
    },
    {
      id: 'doc-4',
      title: 'Cuplikan Pameran Robotika & ESP32 VECTOR',
      type: 'youtube',
      category: 'Event',
      date: '2027-05-18',
      description:
        'Sorotan video yang menampilkan uji lintasan robot line follower dan demonstrasi prototipe IoT siswa pada pekan pameran sekolah.',
      imageUrl: '/images/project-line-follower.svg',
      externalUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      featuredOnLanding: false,
    },
    {
      id: 'doc-5',
      title: 'Seri Infografik & Tips Rangkaian Mingguan',
      type: 'instagram',
      category: 'Activity',
      date: '2027-03-08',
      description:
        'Seri karosel edukatif dan video singkat yang diterbitkan di kanal Instagram resmi VECTOR membahas resistor pull-up dan pengkabelan I2C.',
      imageUrl: '/images/project-food-freshness.svg',
      externalUrl: 'https://www.instagram.com/',
      featuredOnLanding: false,
    },
  ],
  about: {
    introTitle: 'Vidatra Engineering, Coding, Technology of Robotics',
    introParagraph1:
      'VECTOR adalah organisasi ekstrakurikuler sekolah yang berfokus pada inovasi teknologi melalui elektronika, pemrograman, Internet of Things (IoT), dan robotika. Anggota belajar langsung melalui praktik: menggabungkan pemahaman rangkaian listrik, pemrograman mikrokontroler, serta perakitan sistem otonom.',
    introParagraph2:
      'Alih-alih memisahkan perangkat lunak dan perangkat keras, VECTOR melatih siswa menghubungkan kode program langsung ke sensor, layar, dan aktuator fisik untuk memecahkan persoalan nyata di lingkungan sekolah dan masyarakat.',
    charterPeriodLabel: 'Identitas Organisasi · Periode 2027',
    organizationName: 'VECTOR',
    chairpersonName: 'Radithya Archietilla',
    coreFocus: 'Rekayasa · Coding · IoT · Robotika',
    primaryPlatform: 'ESP32 & Sensor Modular',
    footerDescription:
      'Vidatra Engineering, Coding, Technology of Robotics. Organisasi ekstrakurikuler siswa yang mengembangkan keterampilan praktis di bidang elektronika, pemrograman tertanam, inovasi IoT, dan robotika.',
    possibilities: [
      {
        id: 'line-follower',
        title: 'Robot Pengikut Garis (Line Follower)',
        summary:
          'Kendaraan otonom pelacak lintasan yang menggabungkan array sensor inframerah, driver motor ganda, dan modulasi kecepatan PID berumpan balik tertutup.',
        focus: 'Logika Kendali & Penggerak Diferensial',
        hardware: 'ESP32 / Nano · Array IR 5-Ch · TB6612FNG · Motor N20',
      },
      {
        id: 'object-grabber',
        title: 'Lengan Penjepit Objek (Object Grabber)',
        summary:
          'Manipulator robotik artikulasi yang dirancang untuk mengambil, mengangkat, dan memindahkan objek fisik dengan gerakan servo multi-sumbu yang halus.',
        focus: 'Kinematika & Manajemen Daya Aktuator',
        hardware: 'ESP32 · Driver PWM PCA9685 · Servo MG996R · Buck 5V',
      },
      {
        id: 'food-freshness',
        title: 'Deteksi Kesegaran Makanan Berbasis Sensor',
        summary:
          'Perangkat IoT terapan yang mengukur senyawa gas volatil dan kelembapan mikro untuk mendeteksi tanda awal penurunan kesegaran bahan pangan.',
        focus: 'Kalibrasi Sensor Analog & Telemetri Wi-Fi',
        hardware: 'ESP32 · Sensor Gas MQ-135 · DHT22 · Wadah Berventilasi',
      },
      {
        id: 'campus-iot',
        title: 'Simpul Telemetri Ruang Kelas Pintar',
        summary:
          'Pemantau kualitas udara, pencahayaan, dan penggunaan daya terhubung yang dibangun kelompok siswa untuk menjawab kebutuhan nyata di sekolah.',
        focus: 'Perumusan Masalah & Penerapan Praktis',
        hardware: 'ESP32 · Sensor Lingkungan · Layar OLED',
      },
    ],
    roadmapStages: [
      {
        stage: '01',
        title: 'Elektronika Dasar',
        duration: 'Fondasi',
        summary:
          'Membangun literasi kelistrikan dan kebiasaan praktik lab yang aman sebelum menyentuh mikrokontroler.',
        topics: [
          'Tegangan, arus, hambatan, dan Hukum Ohm',
          'Tata letak breadboard, resistor, LED, sakelar, dan polaritas',
          'Pengujian kontinuitas multimeter dan pelacakan gangguan rangkaian',
        ],
      },
      {
        stage: '02',
        title: 'Mikrokontroler',
        duration: 'Logika Inti',
        summary:
          'Mempelajari arsitektur ESP32, alur penulisan firmware, dan debugging berbantuan AI.',
        topics: [
          'Input/output digital GPIO ESP32 dan pengaturan waktu PWM',
          'Logika pemrograman C++ / Arduino yang terstruktur',
          'Membaca pesan kesalahan dan memperbaiki bug dengan bantuan AI',
        ],
      },
      {
        stage: '03',
        title: 'Sensor dan Aktuator',
        duration: 'Interaksi Fisik',
        summary:
          'Menghubungkan lingkungan fisik dengan kode program melalui transduser dan penggerak mekanis.',
        topics: [
          'Komunikasi I2C dengan layar OLED 0,96" dan sensor lingkungan',
          'Kalibrasi sensor analog gas, cahaya, dan inframerah',
          'Menggerakkan motor DC dan aktuator servo dengan jalur daya terisolasi',
        ],
      },
      {
        stage: '04',
        title: 'Konektivitas dan IoT',
        duration: 'Jaringan',
        summary:
          'Menghubungkan perangkat tertanam ke jaringan lokal serta antarmuka web secara langsung.',
        topics: [
          'Konfigurasi stasiun Wi-Fi ESP32 dan telemetri HTTP/JSON',
          'Menampilkan pembacaan sensor secara langsung ke dasbor peramban',
          'Merancang penanganan koneksi ulang dan ketahanan perangkat',
        ],
      },
      {
        stage: '05',
        title: 'Pengembangan & Penerapan Produk',
        duration: 'Integrasi',
        summary:
          'Menghasilkan prototipe tim yang utuh beserta dokumentasi dan website portofolio pribadi.',
        topics: [
          'Perumusan masalah, penyusunan proposal, dan daftar komponen (BOM)',
          'Desain casing mekanis, penyolderan akhir, dan uji keandalan',
          'Publikasi dokumentasi proyek dan web portofolio individu anggota',
        ],
      },
    ],
    keychainTitle: 'Gantungan Kunci OLED 0,96 Inci VECTOR',
    keychainDescription:
      'Proyek pembuka bagi setiap anggota baru berupa gantungan kunci PCB khusus yang dilengkapi layar grafis OLED 0,96 inci. Proyek ini mengenalkan dasar elektronika, penyolderan, komunikasi I2C, dan pemrograman piksel bitmap untuk menampilkan animasi ikon ekspresi pada layar OLED secara langsung.',
    keychainProjectSlug: 'vector-identity-keychain',
    oledScreens: [
      { label: 'Smiley', pattern: 'smiley' },
      { label: 'Kedip', pattern: 'wink' },
      { label: 'Robot', pattern: 'robot' },
      { label: 'Gelombang', pattern: 'wave' },
    ],
    workPrograms: [
      {
        number: '01',
        title:
          'Workshop IoT, ESP32, Komponen Elektronik, dan Pemrograman dengan Artificial Intelligence',
        period: 'Januari – Maret',
        mentor: 'Ketua Ekskul & Pembina',
        objectives:
          'Memahami ESP32 dan logika pemrograman dengan memanfaatkan Artificial Intelligence sebagai asisten menulis kode, serta memahami kelistrikan dasar, merangkai rangkaian, dan mengenal fungsi komponen (resistor, LED, sensor, breadboard, dan lainnya).',
        outcomes:
          'Setiap anggota mampu menjelaskan alur dan fungsi tiap bagian kode yang dibuat serta memperbaiki error sederhana (debugging), dan merangkai rangkaian dengan benar serta aman.',
      },
      {
        number: '02',
        title: 'Projek Grup Inovasi Teknologi',
        period: 'April – Mei',
        mentor: 'Ketua Ekskul & Pembina',
        objectives:
          'Melatih anggota merumuskan masalah nyata dan merancang solusi IoT sederhana, sekaligus menerapkan kompetensi yang telah dicapai dalam proyek kelompok yang utuh.',
        outcomes:
          'Setiap kelompok menyerahkan 1 proposal (masalah, rancangan, daftar komponen, pembagian peran, jadwal) dan mencapai prototipe yang berfungsi dengan laporan progres berkala.',
      },
      {
        number: '03',
        title: 'Pembentukan Media dan Identitas Media Sosial VECTOR',
        period: 'Januari – Desember',
        mentor: 'Ketua Ekskul & Pembina',
        objectives:
          'Menyiapkan wadah publikasi VECTOR (Instagram, TikTok, dan YouTube) beserta identitas visualnya, membagikan materi dalam bentuk infografik, video singkat, atau tutorial, serta menambah wawasan tentang IoT, AI, dan robotika.',
        outcomes:
          'Merealisasikan akun dan identitas media sosial yang aktif dengan minimal 1 konten pembelajaran per satu atau dua pekan dan minimal 2 konten update teknologi per bulan.',
      },
      {
        number: '04',
        title: 'Pembentukan Web Portofolio Anggota',
        period: 'Oktober – Desember',
        mentor: 'Ketua Ekskul & Pembina',
        objectives:
          'Membekali setiap anggota agar memiliki website pribadi (profil, daftar proyek, dokumentasi karya) sebagai rekam jejak dan bekal lomba maupun jenjang berikutnya dengan memanfaatkan AI sebagai asisten coding dan hosting gratis.',
        outcomes:
          'Seluruh anggota memiliki web portofolio yang dapat diakses online, berisi minimal profil diri dan 1 proyek terdokumentasi.',
      },
    ],
    workProgramPdfUrl:
      '/assets/aistudio/PROGRAM_KERJA_EKSTRAKURIKULER_VECTOR_PERIODE_2027_3091cc05.pdf',
  },
};

const VALID_PATTERNS: OledPatternType[] = [
  'smiley',
  'wink',
  'robot',
  'heart',
  'wave',
];

function normalizeOledScreens(raw: unknown): AboutOledScreen[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return structuredClone(DEFAULT_SITE_CONTENT.about.oledScreens);
  }
  const normalized: AboutOledScreen[] = raw.map((item, idx) => {
    const obj = (item || {}) as Record<string, unknown>;
    const rawPattern = obj.pattern;
    const pattern: OledPatternType = VALID_PATTERNS.includes(
      rawPattern as OledPatternType
    )
      ? (rawPattern as OledPatternType)
      : VALID_PATTERNS[idx % VALID_PATTERNS.length];
    const defaultLabel =
      pattern === 'smiley'
        ? 'Smiley'
        : pattern === 'wink'
          ? 'Kedip'
          : pattern === 'robot'
            ? 'Robot'
            : pattern === 'heart'
              ? 'Hati'
              : 'Gelombang';
    return {
      label:
        typeof obj.label === 'string' && obj.label.trim()
          ? obj.label.trim()
          : defaultLabel,
      pattern,
    };
  });
  return normalized;
}

export function normalizeSiteContent(parsed: Partial<SiteContent> | null | undefined): SiteContent {
  const defaults = structuredClone(DEFAULT_SITE_CONTENT);
  if (!parsed || typeof parsed !== 'object') {
    return defaults;
  }

  const landingInput = (parsed.landing || {}) as Partial<SiteContent['landing']>;
  const aboutInput = (parsed.about || {}) as Partial<SiteContent['about']>;

  return {
    landing: {
      ...defaults.landing,
      ...landingInput,
      disciplines:
        Array.isArray(landingInput.disciplines) && landingInput.disciplines.length > 0
          ? landingInput.disciplines
          : defaults.landing.disciplines,
      previewPhotos: Array.isArray(landingInput.previewPhotos)
        ? landingInput.previewPhotos
        : defaults.landing.previewPhotos,
    },
    projects: Array.isArray(parsed.projects)
      ? parsed.projects
      : defaults.projects,
    documentation: Array.isArray(parsed.documentation)
      ? parsed.documentation
      : defaults.documentation,
    about: {
      ...defaults.about,
      ...aboutInput,
      possibilities: Array.isArray(aboutInput.possibilities)
        ? aboutInput.possibilities
        : defaults.about.possibilities,
      roadmapStages: Array.isArray(aboutInput.roadmapStages)
        ? aboutInput.roadmapStages
        : defaults.about.roadmapStages,
      oledScreens: normalizeOledScreens(aboutInput.oledScreens),
      workPrograms: Array.isArray(aboutInput.workPrograms)
        ? aboutInput.workPrograms
        : defaults.about.workPrograms,
    },
  };
}
