CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO short_link (id, short_code, original_url, created_at, expires_at) VALUES
(uuid_generate_v4(), 'abc123', 'https://ingsistemas.uis.edu.co/eisi/eisi.jsp?IdServicio=S719', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '6 hours'),
(uuid_generate_v4(), 'def456', 'https://www.uis.edu.co/estudiantesWebJ8/autenticacion.jsf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '6 hours'),
(uuid_generate_v4(), 'ghi789', 'https://www.youtube.com/watch?v=Ma5hTmmmTbI', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '6 hours');


