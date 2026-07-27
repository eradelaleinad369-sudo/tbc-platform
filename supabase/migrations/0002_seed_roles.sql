-- Seeds the roles table from "Why Our Leadership Roles Exist"
-- Founder is intentionally excluded — it's not an assignable role.

insert into roles (title, slug, why_it_exists, responsibilities, sort_order) values
('Operations Lead', 'operations',
 'Ideas are cheap. What closes the gap between "let''s do this" and "this is done" is someone whose job is execution.',
 array['Coordinate everything so nothing falls through the cracks','Track ongoing projects and their status','Monitor deadlines and follow up before they''re missed','Hold teams accountable in a way that feels supportive, not policing','Organize and structure meetings','Make sure decisions made in meetings actually get implemented','Spot issues before they slow everyone down','Support team leads with execution, not just planning'],
 1),

('Programs & Learning Lead', 'programs-learning',
 'Sessions should be built with intention so members leave knowing something they didn''t know walking in — not just attendance for its own sake.',
 array['Plan and structure the Engineering Insights Series','Design workshops with clear learning outcomes','Coordinate technical sessions across disciplines','Develop learning roadmaps for members','Organize Builder Labs','Invite and coordinate facilitators','Continuously improve the learning experience based on feedback'],
 2),

('Partnerships & External Relations Lead', 'partnerships-external',
 'The biggest opportunities come from relationships outside our meetings, and those relationships need consistency to survive past the first "yes."',
 array['Research organizations worth connecting with','Reach out professionally and represent us well','Build and maintain external partnerships','Coordinate engineering and research lab visits','Invite guest speakers','Schedule and manage meetings with external contacts','Maintain long-term relationships, not just one-off engagements','Follow up properly after every engagement'],
 3),

('Research & Insights Lead', 'research-insights',
 'Decisions should be grounded in real information, not guesswork — someone needs to treat finding the right information as seriously as building the right project.',
 array['Research emerging engineering technologies worth talking about','Find relevant competitions for members','Find grants and funding opportunities','Find fellowships worth applying to','Research companies for potential engagement','Prepare briefs ahead of lab or company visits','Research guest speakers before they''re invited','Produce periodic trend reports for the community','Support every other team with the research they need'],
 4),

('Projects & Innovation Lead', 'projects-innovation',
 'The Builders Circle is about building, consistently, even when it''s small or messy — not talking about building.',
 array['Coordinate weekly mini-projects','Coordinate bi-monthly collaborative projects','Support project teams through technical and logistical challenges','Organize Demo Day','Encourage collaboration across disciplines','Help members work through technical roadblocks','Build and protect a culture of experimentation'],
 5),

('Academic Development Lead', 'academic-development',
 'The Builders Circle should make members stronger students, not distracted ones, by closing the gap between class and real engineering practice.',
 array['Organize study groups','Coordinate revision sessions ahead of exams','Share academic resources across the community','Connect what''s taught in class to real engineering practice','Help members prepare for exams','Encourage collaborative, peer-driven learning'],
 6),

('Media & Communications Lead', 'media-communications',
 'What we do means nothing if nobody outside the room hears about it — our story should be told with intention.',
 array['Manage our LinkedIn presence','Design graphics for events and announcements','Capture photos and videos during activities','Write recaps after events','Maintain consistent branding','Promote opportunities to members and beyond','Celebrate member achievements publicly'],
 7),

('Documentation & Knowledge Lead', 'documentation-knowledge',
 'What we learn disappears the moment it only lives in someone''s memory — this role keeps the community''s institutional knowledge alive.',
 array['Record meeting minutes','Maintain our Notion workspace','Organize resources so they''re easy to find','Create reusable templates','Document processes as they''re built','Archive completed projects','Preserve our institutional memory for future members'],
 8),

('Technology & Digital Systems Lead', 'tech-digital-systems',
 'Our own tools should reflect the same quality we expect from ourselves as builders — the tools we build for ourselves matter as much as the projects we build for others.',
 array['Manage our website','Build internal tools for the community','Create automations that reduce manual work','Maintain our digital platforms','Improve how we collaborate digitally','Recommend useful technologies as we grow'],
 9),

('Finance & Resource Lead', 'finance-resource',
 'What we do quietly costs something — resources should be treated with intention, not scrambling.',
 array['Track spending across activities and projects','Plan and manage budgets for events and visits','Keep clear, simple records anyone can understand','Research potential sponsors, grants, or small funding opportunities','Advise other leads on what''s realistic given our resources','Flag when a plan is financially unrealistic before it becomes a problem'],
 10);
