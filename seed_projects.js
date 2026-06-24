const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function seedProjects() {
    try {
        console.log('Clearing existing projects...');
        await db.query('TRUNCATE TABLE projects');

        const projects = [
            {
                title: 'AI-Ready Academic Certificate Verification Web System',
                description: 'A highly secure, enterprise-grade platform leveraging AI and cryptographic signatures to instantly verify academic credentials. Includes an interactive dashboard to eliminate manual credential fraud.',
                technologies: 'React, Node.js, MySQL, AI',
                link: '#',
                image_url: 'img/academic_verification.png'
            },
            {
                title: 'Ethiopian Graduate AI Job Recommendation Platform',
                description: 'An AI-driven recommendation engine that matches Ethiopian university graduates with ideal job roles based on skillset, market demand, and academic history using natural language processing.',
                technologies: 'Python, TensorFlow, React, FastAPI',
                link: '#',
                image_url: 'img/project_ai.png'
            },
            {
                title: 'Hospital Queue Prediction System',
                description: 'A predictive analytics system designed to optimize patient flow in hospitals. Uses machine learning models to forecast wait times and queue bottlenecks in real-time.',
                technologies: 'Scikit-Learn, Flask, Vue.js, PostgreSQL',
                link: '#',
                image_url: 'img/background.png'
            },
            {
                title: 'SME Marketplace: Ethiopia',
                description: 'A robust web-based B2B commerce platform connecting Small and Medium Enterprises across Ethiopia. Features secure transactions, vendor dashboards, and dynamic product catalogs.',
                technologies: 'Next.js, Node.js, MongoDB, Docker',
                link: '#',
                image_url: 'img/project_fintech.png'
            }
        ];

        console.log('Inserting 4 premium projects...');
        for (const p of projects) {
            await db.query(
                'INSERT INTO projects (title, description, technologies, link, image_url) VALUES (?, ?, ?, ?, ?)',
                [p.title, p.description, p.technologies, p.link, p.image_url]
            );
        }

        console.log('✅ Success! 4 premium projects inserted.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding projects:', error);
        process.exit(1);
    }
}

seedProjects();
