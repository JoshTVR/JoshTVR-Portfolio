/* ==============================================
   i18n.js — Bilingual EN/ES system
   ============================================== */

const translations = {
  en: {
    /* Navbar */
    'nav.about':          'About',
    'nav.skills':         'Skills',
    'nav.projects':       'Projects',
    'nav.experience':     'Experience',
    'nav.certifications': 'Certifications',
    'nav.contact':        'Contact',

    /* Hero */
    'hero.greeting':     "Hi, I'm",
    'hero.building':     'Building',
    'hero.subtitle':     'VR & Digital Business Application Developer — turning ideas into immersive realities across VR, AI, Backend, and Design.',
    'hero.cta-projects': 'View Projects',
    'hero.cta-contact':  'Get in Touch',

    /* About */
    'about.title': 'About Me',
    'about.p1': "I'm a passionate developer with expertise spanning Virtual Reality, Artificial Intelligence, Database systems, and Digital Design. I thrive at the intersection of technology and creativity — building immersive experiences that solve real-world problems.",
    'about.p2': "Currently pursuing an Engineering Degree in Information Technologies, I've led projects that reduced operational costs, built data-driven models, and created engaging 3D environments. I collaborate effectively in cross-functional teams and bring a detail-oriented approach to every project.",
    'about.p3': "My multi-domain background means I can bridge the gap between design, engineering, and business — a rare advantage I bring to every team I join.",
    'about.stat1': 'Onboarding Time Reduced',
    'about.stat2': 'Tech Domains',
    'about.stat3': 'Projects Shipped',
    'about.stat4': 'Years Experience',

    /* Skills */
    'skills.title': 'Skills',
    'skills.cat1':  'VR / 3D Development',
    'skills.cat2':  'Data Science / AI / ML',
    'skills.cat3':  'Backend / Databases',
    'skills.cat4':  'Design / Multimedia',

    /* Projects */
    'projects.title':          'Projects',
    'projects.filter.all':     'All',
    'projects.filter.vr':      'VR / 3D',
    'projects.filter.data':    'Data Science',
    'projects.filter.backend': 'Backend',
    'projects.filter.design':  'Design',
    'projects.badge.vr':       'VR / 3D',
    'projects.badge.data':     'Data Science',
    'projects.badge.backend':  'Backend',
    'projects.badge.design':   'Design',
    'projects.btn.demo':       'Live Demo',

    'projects.p1.title': 'VR Onboarding App',
    'projects.p1.desc':  'Led development of an immersive VR training application that reduced employee onboarding time by 30%. Managed system validation, code reviews, user documentation, and resolved testing issues.',

    'projects.p2.title': 'ML Predictive Model',
    'projects.p2.desc':  'Built and trained a machine learning model using TensorFlow and Python for predictive analysis. Data exploration and preprocessing with Pandas, and model evaluation with Scikit-Learn.',

    'projects.p3.title': 'Database Management System',
    'projects.p3.desc':  'Designed and implemented a relational database system using SQL Server. Built stored procedures, optimized queries, and integrated with a Java application to manage institutional records.',

    'projects.p4.title': 'Digital Brand Identity',
    'projects.p4.desc':  'Created a complete visual identity system including logo design, brand guidelines, social media assets, and promotional materials using the Adobe Creative Suite.',

    'projects.p5.title': '3D Environment Simulation',
    'projects.p5.desc':  'Designed and modeled a detailed 3D interactive environment using Blender and Maya. Exported assets into Unity for a real-time simulation with custom lighting, shaders, and physics interactions.',

    /* Experience */
    'exp.title':   'Experience',
    'exp.role1':   'VR Application Developer',
    'exp.desc1':   'Led end-to-end development of an immersive VR onboarding application. Responsibilities included system validation, code reviews, user documentation, stakeholder communication, and testing. Achieved a 30% reduction in employee onboarding time.',
    'exp.role2':   'Engineering Student — Information Technologies',
    'exp.desc2':   'Pursuing a degree in Information Technologies with coursework covering software engineering, database design, artificial intelligence, and digital systems. Active participant in applied research and institutional development projects.',

    /* Certifications */
    'certs.title':   'Certifications',
    'certs.c1.name': 'Unity Essentials Pathway',
    'certs.c2.name': 'Python for Data Science',
    'certs.c3.name': 'SQL Server Fundamentals',
    'certs.c4.name': 'Adobe Creative Suite',

    /* Testimonials */
    'testimonials.title': 'Testimonials',
    'testimonials.q1':    '"Joshua\'s VR work exceeded all expectations. His ability to coordinate the technical and documentation aspects of the project while maintaining high quality was impressive."',
    'testimonials.name1': 'Academic Supervisor',
    'testimonials.role1': 'Zimapan Mining Technological University',
    'testimonials.q2':    '"A highly versatile developer. Joshua brings creative thinking to technical challenges and delivers across multiple domains — from 3D design to data analysis."',
    'testimonials.name2': 'Team Colleague',
    'testimonials.role2': 'Project Collaborator',

    /* Contact */
    'contact.title':        'Get in Touch',
    'contact.subtitle':     "I'm open to new opportunities, collaborations, and conversations. Let's build something great together.",
    'contact.form.name':    'Your name',
    'contact.form.email':   'Your email',
    'contact.form.message': 'Your message',
    'contact.form.send':    'Send Message',
    'contact.form.success': "Message sent! I'll get back to you soon.",

    /* Footer */
    'footer.cv':   'Download CV',
    'footer.made': 'Made with passion · Deployed on GitHub Pages',
  },

  es: {
    /* Navbar */
    'nav.about':          'Sobre mí',
    'nav.skills':         'Habilidades',
    'nav.projects':       'Proyectos',
    'nav.experience':     'Experiencia',
    'nav.certifications': 'Certificaciones',
    'nav.contact':        'Contacto',

    /* Hero */
    'hero.greeting':     'Hola, soy',
    'hero.building':     'Construyendo',
    'hero.subtitle':     'Desarrollador de Aplicaciones VR y Negocios Digitales — convirtiendo ideas en realidades inmersivas en VR, IA, Backend y Diseño.',
    'hero.cta-projects': 'Ver Proyectos',
    'hero.cta-contact':  'Contáctame',

    /* About */
    'about.title': 'Sobre Mí',
    'about.p1': 'Soy un desarrollador apasionado con experiencia en Realidad Virtual, Inteligencia Artificial, sistemas de bases de datos y Diseño Digital. Me desarrollo mejor en la intersección entre tecnología y creatividad — construyendo experiencias inmersivas que resuelven problemas del mundo real.',
    'about.p2': 'Actualmente cursando Ingeniería en Tecnologías de la Información, he liderado proyectos que redujeron costos operativos, construí modelos basados en datos y creé entornos 3D atractivos. Colaboro eficazmente en equipos multifuncionales con un enfoque orientado al detalle.',
    'about.p3': 'Mi experiencia multidisciplinaria me permite tender puentes entre el diseño, la ingeniería y el negocio — una ventaja única que aporto a cada equipo que integro.',
    'about.stat1': 'Tiempo de Inducción Reducido',
    'about.stat2': 'Dominios Tecnológicos',
    'about.stat3': 'Proyectos Entregados',
    'about.stat4': 'Años de Experiencia',

    /* Skills */
    'skills.title': 'Habilidades',
    'skills.cat1':  'VR / Desarrollo 3D',
    'skills.cat2':  'Ciencia de Datos / IA / ML',
    'skills.cat3':  'Backend / Bases de Datos',
    'skills.cat4':  'Diseño / Multimedia',

    /* Projects */
    'projects.title':          'Proyectos',
    'projects.filter.all':     'Todos',
    'projects.filter.vr':      'VR / 3D',
    'projects.filter.data':    'Ciencia de Datos',
    'projects.filter.backend': 'Backend',
    'projects.filter.design':  'Diseño',
    'projects.badge.vr':       'VR / 3D',
    'projects.badge.data':     'Ciencia de Datos',
    'projects.badge.backend':  'Backend',
    'projects.badge.design':   'Diseño',
    'projects.btn.demo':       'Ver Demo',

    'projects.p1.title': 'App VR de Inducción',
    'projects.p1.desc':  'Lideré el desarrollo de una aplicación de entrenamiento VR inmersiva que redujo el tiempo de inducción de empleados un 30%. Gestioné validación del sistema, revisiones de código, documentación de usuario y resolución de problemas de pruebas.',

    'projects.p2.title': 'Modelo Predictivo ML',
    'projects.p2.desc':  'Construí y entrené un modelo de aprendizaje automático usando TensorFlow y Python para análisis predictivo. Exploración y preprocesamiento de datos con Pandas, y evaluación del modelo con Scikit-Learn.',

    'projects.p3.title': 'Sistema de Gestión de Bases de Datos',
    'projects.p3.desc':  'Diseñé e implementé un sistema de base de datos relacional con SQL Server. Construí procedimientos almacenados, optimicé consultas e integré con una aplicación Java para gestionar registros institucionales.',

    'projects.p4.title': 'Identidad de Marca Digital',
    'projects.p4.desc':  'Creé un sistema completo de identidad visual que incluye diseño de logo, guías de marca, activos para redes sociales y materiales promocionales usando Adobe Creative Suite.',

    'projects.p5.title': 'Simulación de Entorno 3D',
    'projects.p5.desc':  'Diseñé y modelé un entorno 3D interactivo detallado usando Blender y Maya. Exporté los activos a Unity para una simulación en tiempo real con iluminación personalizada, shaders e interacciones físicas.',

    /* Experience */
    'exp.title':   'Experiencia',
    'exp.role1':   'Desarrollador de Aplicaciones VR',
    'exp.desc1':   'Lideré el desarrollo integral de una aplicación VR de inducción inmersiva. Las responsabilidades incluyeron validación del sistema, revisiones de código, documentación de usuario, comunicación con stakeholders y pruebas. Se logró una reducción del 30% en el tiempo de inducción.',
    'exp.role2':   'Estudiante de Ingeniería — Tecnologías de la Información',
    'exp.desc2':   'Cursando Ingeniería en Tecnologías de la Información con materias de ingeniería de software, diseño de bases de datos, inteligencia artificial y sistemas digitales. Participante activo en investigación aplicada y proyectos de desarrollo institucional.',

    /* Certifications */
    'certs.title':   'Certificaciones',
    'certs.c1.name': 'Unity Essentials Pathway',
    'certs.c2.name': 'Python para Ciencia de Datos',
    'certs.c3.name': 'Fundamentos de SQL Server',
    'certs.c4.name': 'Adobe Creative Suite',

    /* Testimonials */
    'testimonials.title': 'Testimonios',
    'testimonials.q1':    '"El trabajo VR de Joshua superó todas las expectativas. Su capacidad para coordinar los aspectos técnicos y de documentación del proyecto manteniendo alta calidad fue impresionante."',
    'testimonials.name1': 'Supervisor Académico',
    'testimonials.role1': 'Universidad Tecnológica Minera de Zimapán',
    'testimonials.q2':    '"Un desarrollador muy versátil. Joshua aporta pensamiento creativo a los desafíos técnicos y entrega resultados en múltiples dominios — desde diseño 3D hasta análisis de datos."',
    'testimonials.name2': 'Compañero de Equipo',
    'testimonials.role2': 'Colaborador de Proyecto',

    /* Contact */
    'contact.title':        'Contacto',
    'contact.subtitle':     'Estoy abierto a nuevas oportunidades, colaboraciones y conversaciones. Construyamos algo increíble juntos.',
    'contact.form.name':    'Tu nombre',
    'contact.form.email':   'Tu correo',
    'contact.form.message': 'Tu mensaje',
    'contact.form.send':    'Enviar Mensaje',
    'contact.form.success': '¡Mensaje enviado! Me pondré en contacto pronto.',

    /* Footer */
    'footer.cv':   'Descargar CV',
    'footer.made': 'Hecho con pasión · Desplegado en GitHub Pages',
  }
};

/* ---- Typewriter word arrays per language ---- */
const typewriterWords = {
  en: ['VR Experiences', 'AI Solutions', 'Digital Worlds', '3D Environments', 'Data Models'],
  es: ['Experiencias VR', 'Soluciones IA', 'Mundos Digitales', 'Entornos 3D', 'Modelos de Datos']
};

let currentLang = 'en';

function applyTranslations(lang) {
  /* 1. Swap text content for [data-i18n] elements */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key] !== undefined) {
      el.textContent = translations[lang][key];
    }
  });

  /* 2. Swap placeholder attributes */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key] !== undefined) {
      el.placeholder = translations[lang][key];
    }
  });

  /* 3. Update <html> lang attribute */
  document.documentElement.lang = lang;

  /* 4. Update toggle button labels */
  const active   = document.querySelector('.lang-active');
  const inactive = document.querySelector('.lang-inactive');
  if (active && inactive) {
    active.textContent   = lang.toUpperCase();
    inactive.textContent = lang === 'en' ? 'ES' : 'EN';
  }

  /* 5. Persist preference */
  try { localStorage.setItem('preferred-lang', lang); } catch (_) {}
  currentLang = lang;
}

function initI18n() {
  let saved = 'en';
  try { saved = localStorage.getItem('preferred-lang') || 'en'; } catch (_) {}
  applyTranslations(saved);

  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      applyTranslations(currentLang === 'en' ? 'es' : 'en');
    });
  }
}

/* Export typewriterWords for animations.js */
window.__i18nWords = typewriterWords;
window.__currentLang = () => currentLang;

document.addEventListener('DOMContentLoaded', initI18n);
