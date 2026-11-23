// Source reviewed in the supplied SRS checkout. Personal implementation scope
// was confirmed by the portfolio owner; no deployment or outcome metrics inferred.
export const studentShowcase = {
  title: 'SOS Student Record System',
  description: 'A school management web application with student registration, role-specific dashboards, attendance, grading, reporting, and messaging.',
  long_description: 'An academic team project for a secondary-school management workflow. The application brings student registration, academic records, attendance, grades, timetables, and communication into one web interface. Public deployment is pending.',
  technologies: 'JavaScript, HTML, CSS, Bootstrap, Node.js, Express, MySQL, Socket.IO',
  link: 'https://github.com/Girma-Ashetu/SOS-SRS',
  demo_url: '',
  image_url: 'srs-login.jpg',
  featured: true,
  case_study: {
    role: 'Full-stack implementation for an academic team project. I implemented the application across the frontend, Express backend, and MySQL data layer.',
    problem: 'Bring student enrolment and academic record workflows into one school-focused application, with distinct screens for administrative staff, registry staff, teachers, students, and parents.',
    approach: 'Built the frontend with HTML, CSS, JavaScript, and Bootstrap, backed by Node.js/Express APIs and MySQL. The registration controller uses database transactions for related account and student records. The source includes bcrypt password hashing, JWT authentication, role checks on student routes, Socket.IO notifications, and an English/Amharic/Oromo translation engine.',
    outcome: 'Implemented modules for student registration, classes, attendance, grading, reports, timetables, messaging, and school events. The public login and registration interfaces have been previewed locally. Public deployment and a full end-to-end production check are pending.',
  },
};
