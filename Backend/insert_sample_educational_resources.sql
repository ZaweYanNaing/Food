-- Insert sample educational resources for testing
INSERT INTO educational_resources (title, description, type, category, file_path, file_size, file_type, difficulty_level, tags, is_featured, created_by) VALUES
('Solar Energy Basics Guide', 'A comprehensive guide covering the fundamentals of solar energy, including how solar panels work, installation basics, and maintenance tips.', 'guide', 'Solar Energy', '/uploads/guides/solar-basics.pdf', 2048576, 'application/pdf', 'beginner', '["solar", "basics", "renewable energy"]', true, 1),

('Wind Power Infographic', 'Visual representation of wind energy generation, showing turbine components, energy conversion process, and environmental benefits.', 'infographic', 'Wind Energy', '/uploads/infographics/wind-power.png', 1024000, 'image/png', 'beginner', '["wind", "infographic", "visual"]', true, 1),

('Hydroelectric Power Video', 'Educational video explaining how hydroelectric power plants work, including dam construction, water flow, and electricity generation.', 'video', 'Hydroelectric', '/uploads/videos/hydroelectric.mp4', 52428800, 'video/mp4', 'intermediate', '["hydroelectric", "video", "power generation"]', false, 1),

('Renewable Energy Presentation', 'PowerPoint presentation covering all major renewable energy sources, their advantages, disadvantages, and future prospects.', 'presentation', 'General', '/uploads/presentations/renewable-energy.pptx', 8192000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'intermediate', '["renewable", "presentation", "overview"]', true, 1),

('Geothermal Energy Document', 'Detailed technical document about geothermal energy systems, including ground-source heat pumps and power plant operations.', 'document', 'Geothermal', '/uploads/documents/geothermal-energy.pdf', 4096000, 'application/pdf', 'advanced', '["geothermal", "technical", "heat pumps"]', false, 1),

('Biomass Energy Guide', 'Step-by-step guide to understanding biomass energy, including feedstock types, conversion processes, and environmental considerations.', 'guide', 'Biomass', '/uploads/guides/biomass-energy.pdf', 1536000, 'application/pdf', 'beginner', '["biomass", "bioenergy", "sustainable"]', false, 1),

('Energy Storage Solutions Video', 'Comprehensive video covering various energy storage technologies including batteries, pumped hydro, and compressed air storage.', 'video', 'Energy Storage', '/uploads/videos/energy-storage.mp4', 67108864, 'video/mp4', 'advanced', '["storage", "batteries", "grid stability"]', true, 1),

('Smart Grid Infographic', 'Visual guide to smart grid technology, showing how modern electrical grids integrate renewable energy and improve efficiency.', 'infographic', 'Smart Grid', '/uploads/infographics/smart-grid.png', 1536000, 'image/png', 'intermediate', '["smart grid", "technology", "efficiency"]', false, 1),

('Carbon Footprint Calculator Guide', 'Interactive guide to calculating and reducing your carbon footprint with practical tips and tools.', 'guide', 'Sustainability', '/uploads/guides/carbon-footprint.pdf', 1024000, 'application/pdf', 'beginner', '["carbon", "sustainability", "calculator"]', true, 1),

('Off-Grid Living Document', 'Comprehensive document about living off-grid with renewable energy systems, including system sizing and maintenance.', 'document', 'Off-Grid Systems', '/uploads/documents/off-grid-living.pdf', 6144000, 'application/pdf', 'advanced', '["off-grid", "independence", "self-sufficient"]', false, 1);
