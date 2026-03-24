-- Insert Demo Users (passwords are BCrypt hashed for 'password')
-- admin/password
INSERT IGNORE INTO users (id, username, password, email, role) VALUES 
(1, 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', 'ADMIN');

-- user/password
INSERT IGNORE INTO users (id, username, password, email, role) VALUES 
(2, 'user', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user@example.com', 'USER');

-- Insert Sample Products
INSERT IGNORE INTO products (id, name, description, price) VALUES 
(1, 'Laptop Pro 15"', 'High-performance laptop with Intel i7 processor, 16GB RAM, 512GB SSD.', 1299.99),
(2, 'Wireless Mouse', 'Ergonomic wireless mouse with precision tracking.', 29.99),
(3, 'Mechanical Keyboard', 'RGB mechanical keyboard with blue switches.', 89.99),
(4, '4K Monitor 27"', 'Ultra HD 4K monitor with HDR support.', 449.99),
(5, 'USB-C Hub', 'Multi-port USB-C hub with HDMI and USB 3.0.', 39.99),
(6, 'Webcam HD 1080p', 'Full HD webcam with auto-focus.', 59.99),
(7, 'Desk Lamp LED', 'Adjustable LED desk lamp with multiple brightness levels.', 34.99),
(8, 'External SSD 1TB', 'Portable external SSD with 1TB capacity.', 149.99);
