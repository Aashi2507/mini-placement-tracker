import React, { useState } from 'react';
import { ExternalLink, FileText, Video, Globe, Download, Edit3, X, Save } from 'lucide-react';

const DSA_SITES = [
  { name: 'LeetCode', desc: 'The industry standard for platform DSA practice.', url: 'https://leetcode.com/' },
  { name: 'GeeksforGeeks', desc: 'Comprehensive articles and company-wise tracks.', url: 'https://www.geeksforgeeks.org/' },
  { name: 'HackerRank', desc: 'Great for absolute beginners learning language syntax.', url: 'https://www.hackerrank.com/' }
];

const APT_SITES = [
  { name: 'IndiaBix', desc: 'Massive repository of Quantitative and Logical puzzles.', url: 'https://www.indiabix.com/' },
  { name: 'Aptitude-Test.com', desc: 'Timed mock simulations for corporate assessments.', url: 'https://www.aptitude-test.com/' },
  { name: 'PrepInsta', desc: 'Company-specific syllabus (TCS, Infosys, Wipro).', url: 'https://prepinsta.com/' }
];

const YT_DSA = [
  { topic: 'Dynamic Programming Mastery', author: 'Striver (Take U Forward)', url: 'https://youtube.com' },
  { topic: 'Graph Algorithms Full Course', author: 'WilliamFiset', url: 'https://youtube.com' },
  { topic: 'Sliding Window & Two Pointers', author: 'NeetCode', url: 'https://youtube.com' }
];

const YT_APT = [
  { topic: 'Time & Work Shortcuts', author: 'CareerRide', url: 'https://youtube.com' },
  { topic: 'Complete Logical Reasoning Syllabus', author: 'Feel Free to Learn', url: 'https://youtube.com' },
  { topic: 'TCS NQT Preparation Masterclass', author: 'OnlineStudy4U', url: 'https://youtube.com' }
];

const DEFAULT_RESUME = `[First Name] [Last Name]
[City, State] | [Phone Number] | [Email Address] | [LinkedIn URL] | [GitHub/Portfolio URL]

EDUCATION
[University Name] - [City, State]
[Degree] in [Major], GPA: [X.X/4.0] | Expected [Month, Year]
Relevant Coursework: [Data Structures, Algorithms, Operating Systems, Database Systems]

EXPERIENCE
[Company Name] - [City, State]
[Job Title] | [Month, Year] – [Month, Year]
- Bullet point explaining an accomplishment. Start with an action verb (e.g., Developed, Optimized).
- Feature specific metrics: "Reduced load time by 20% by implementing Redis caching."
- Highlight collaboration: "Collaborated with a 5-person agile team to deploy a microservices backend."

PROJECTS
[Project Name] | [Technologies Used: React, Node.js, Python, MongoDB]
[Link to project or GitHub repository]
- Built a full-stack web application that solves [Specific Problem].
- Implemented [Specific Feature] using [Specific Technology] resulting in [Direct Metric/Impact].
- Handled state management and user authentication manually using JWTs.

SKILLS
Programming Languages: Java, Python, JavaScript, TypeScript, C++
Web Technologies / Frameworks: React.js, Node.js, Express, Django, HTML/CSS
Database / Tools: MySQL, MongoDB, Git, Docker, AWS, Postman`;

export default function StudyTools() {
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [resumeText, setResumeText] = useState(DEFAULT_RESUME);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([resumeText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "My_ATS_Resume.txt";
    document.body.appendChild(element); // required for Firefox
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Resource <span className="text-gradient-accent">Hub</span></h1>
        <p className="subtitle">Curated blueprints, platforms, and masterclasses to accelerate your prep.</p>
      </header>

      {/* Resume Section Editor */}
      {!isEditingResume ? (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--primary-glow)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={32} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>ATS-Friendly Resume Template</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>The proven one-page tech template. Edit your details directly in the browser.</p>
            </div>
          </div>
          <button onClick={() => setIsEditingResume(true)} className="btn btn-primary btn-pill">
            <Edit3 size={18} /> Edit Your Resume
          </button>
        </div>
      ) : (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <div>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Interactive Resume Editor</h2>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Modify the template. When you're ready, download the final text version.</p>
             </div>
             <button onClick={() => setIsEditingResume(false)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
               <X size={18}/>
             </button>
          </div>
          <textarea 
            className="input-field"
            style={{ minHeight: '450px', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            spellCheck="false"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
             <button onClick={() => setResumeText(DEFAULT_RESUME)} className="btn btn-secondary">
               Reset to Default
             </button>
             <button onClick={handleDownload} className="btn btn-primary">
               <Download size={18} /> Export & Download
             </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        
        {/* Left Column: Practice Platforms */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Globe size={22} color="var(--primary)"/> DSA Practice Platforms
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {DSA_SITES.map((site, i) => (
                <a key={i} href={site.url} target="_blank" rel="noreferrer" className="glass-panel" style={{ padding: '1.5rem', display: 'block', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                     <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{site.name}</strong>
                     <ExternalLink size={16} color="var(--text-muted)"/>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{site.desc}</p>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Globe size={22} color="var(--secondary)"/> Aptitude Practice Platforms
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {APT_SITES.map((site, i) => (
                <a key={i} href={site.url} target="_blank" rel="noreferrer" className="glass-panel" style={{ padding: '1.5rem', display: 'block', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                     <strong style={{ color: 'var(--secondary)', fontSize: '1rem' }}>{site.name}</strong>
                     <ExternalLink size={16} color="var(--text-muted)"/>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{site.desc}</p>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: YouTube Masterclasses */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Video size={24} color="#ef4444"/> Essential DSA Concepts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {YT_DSA.map((vid, i) => (
                <a key={i} href={vid.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--surface-color)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', borderLeft: '4px solid #ef4444', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-color)'}>
                    <Video size={32} color="#ef4444" style={{ minWidth: '32px' }}/>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{vid.topic}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instructor: {vid.author}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Video size={24} color="#ef4444"/> Core Aptitude Masterclasses
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {YT_APT.map((vid, i) => (
                <a key={i} href={vid.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--surface-color)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', borderLeft: '4px solid #ef4444', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-color)'}>
                    <Video size={32} color="#ef4444" style={{ minWidth: '32px' }}/>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{vid.topic}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instructor: {vid.author}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
