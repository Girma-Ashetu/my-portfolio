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
                title: 'Student Registration Management System',
                description: 'User Authentication, Registration Management, Validation, Database Integration.',
                technologies: 'Java, Swing, MySQL, JDBC',
                link: '#',
                image_url: 'academic_verification.png'
            },
            {
                title: 'E-Commerce Web Application',
                description: 'Product Management, Shopping Cart, Payment Integration, Authentication.',
                technologies: 'React, Node.js, MongoDB, Express',
                link: '#',
                image_url: 'project_fintech.png'
            },
            {
                title: 'Cloud File Storage System',
                description: 'Secure Upload, User Authentication, Scalable Cloud Storage.',
                technologies: 'AWS S3, EC2, IAM',
                link: '#',
                image_url: 'background.png'
            },
            {
                title: 'Personal Finance Mobile App',
                description: 'Expense Tracking, Budget Management, Real-time Analytics Dashboard.',
                technologies: 'Flutter, Firebase',
                link: '#',
                image_url: 'project_ai.png'
            },
            {
                title: 'Cybersecurity Vulnerability Scanner',
                description: 'Port Scanning, Service Detection, Security Reporting.',
                technologies: 'Python, Networking, Security Libraries',
                link: '#',
                image_url: 'project_ai.png'
            }
        ];

        // Clear existing projects to avoid duplicates if running multiple times
        await db.query('TRUNCATE TABLE projects');

        for (const p of projects) {
            await db.query(
                'INSERT INTO projects (title, description, technologies, link, image_url) VALUES (?, ?, ?, ?, ?)',
                [p.title, p.description, p.technologies, p.link, p.image_url]
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
