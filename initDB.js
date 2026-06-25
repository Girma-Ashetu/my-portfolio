const fs = require('fs');
const db = require('./db');
const path = require('path');

async function initDB() {
    try {
        console.log('Reading schema.sql...');
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        
        // Split by semicolon to run queries individually
        const queries = schema.split(';').map(q => q.trim()).filter(q => q.length > 0);
        
        for (const query of queries) {
            console.log(`Executing: ${query.substring(0, 50)}...`);
            await db.query(query);
        }
        
        console.log('✅ Schema executed successfully!');
        
        console.log('Seeding projects...');
        const projects = [
            {
                title: "Bank Management System",
                description: "An enterprise-grade banking application built for Ethiopian currency (Birr). Features robust account management, full admin dashboard, and status transitions.",
                long_description: "Developed a comprehensive core banking platform featuring secure transaction processing, real-time account status transitions (Active/Suspended/Frozen/Closed), and an intuitive administrative dashboard. The system incorporates strict validation for Ethiopian banking standards and utilizes a premium dark-mode aesthetic for a modern user experience.",
                technologies: "Java, MySQL, Swing, JDBC",
                link: "https://github.com/Girma-Ashetu",
                image_url: "bank.png"
            },
            {
                title: "Advanced AI Portfolio Platform",
                description: "A breathtaking, trilingual digital portfolio equipped with GAIA—a Gemini-powered AI assistant, 3D tilt interactions, and full glassmorphism UI.",
                long_description: "A world-class digital portfolio engineered to showcase technical excellence. It integrates Google's Gemini AI to power 'GAIA', a responsive virtual assistant. Features include multilingual support (English, Amharic, Afan Oromo), high-performance CSS grid layouts, and cutting-edge 3D micro-animations.",
                technologies: "React, Node.js, Express, AI",
                link: "https://github.com/Girma-Ashetu",
                image_url: "portfolio.png"
            },
            {
                title: "Course Management System (CSMS)",
                description: "A comprehensive academic platform handling student enrollment, grade management, and secure role-based access for Jimma Institute of Technology.",
                long_description: "A tailored academic portal designed to streamline university operations. It includes modules for student course registration, secure grading systems for faculty, and robust role-based access control (RBAC). The platform dramatically improved administrative efficiency at Jimma Institute of Technology.",
                technologies: "PHP, MySQL, Web",
                link: "https://github.com/Girma-Ashetu",
                image_url: "csms.png"
            },
            {
                title: "Cybersecurity Vulnerability Scanner",
                description: "A robust security tool implementing OWASP Top 10 guidelines to scan, detect, and report vulnerabilities in web applications.",
                long_description: "An automated security analysis tool that actively probes web applications for common vulnerabilities such as SQL Injection, XSS, and misconfigured headers. It generates comprehensive HTML reports detailing the risk level and remediation steps, adhering strictly to OWASP guidelines.",
                technologies: "Python, Security, React",
                link: "https://github.com/Girma-Ashetu",
                image_url: "cyber.png"
            },
            {
                title: "Cross-Platform E-Commerce Mobile App",
                description: "A high-performance mobile marketplace built with Flutter and Firebase, featuring real-time state management and seamless UI/UX.",
                long_description: "A dynamic mobile application built for both iOS and Android using a single codebase. It leverages Firebase for real-time data synchronization, secure user authentication, and seamless payment gateway integration. The app delivers a fluid, native-like experience with 60fps animations.",
                technologies: "Flutter, Firebase, Mobile",
                link: "https://github.com/Girma-Ashetu",
                image_url: "ecommerce.png"
            },
            {
                title: "Cloud Infrastructure Automation",
                description: "A DevOps pipeline built on AWS to automate deployments, scaling, and monitoring using Docker and Github Actions.",
                long_description: "Designed and implemented a fully automated CI/CD pipeline. The infrastructure utilizes Docker for containerization and AWS ECS for orchestration. It includes automated testing via GitHub Actions and integrates robust monitoring and alerting mechanisms, ensuring zero-downtime deployments.",
                technologies: "AWS, Docker, Cloud",
                link: "https://github.com/Girma-Ashetu",
                image_url: "cloud.png"
            }
        ];

        // Drop table and recreate to ensure long_description exists
        await db.query('DROP TABLE IF EXISTS projects');
        await db.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                long_description TEXT,
                technologies VARCHAR(255) NOT NULL,
                link VARCHAR(255),
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        for (const p of projects) {
            await db.query(
                'INSERT INTO projects (title, description, long_description, technologies, link, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                [p.title, p.description, p.long_description, p.technologies, p.link, p.image_url]
            );
        }
        
        console.log('✅ Success! 4 premium projects inserted.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Database Initialization Failed:', err.message);
        process.exit(1);
    }
}

initDB();
