USE busybrains_assignment;

-- Insert Demo Users (passwords are BCrypt hashed for 'password')
-- admin/password (BCrypt hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', 'ADMIN');

-- user/password (BCrypt hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
INSERT INTO users (username, password, email, role) VALUES 
('user', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user@example.com', 'USER');

-- Insert Sample Products
INSERT INTO products (name, description, price) VALUES 
('Laptop Pro 15"', 'High-performance laptop with Intel i7 processor, 16GB RAM, 512GB SSD. Perfect for professionals and developers.', 1299.99),
('Wireless Mouse', 'Ergonomic wireless mouse with precision tracking and long battery life. Compatible with all operating systems.', 29.99),
('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches, programmable keys, and premium aluminum frame.', 89.99),
('4K Monitor 27"', 'Ultra HD 4K monitor with HDR support, 1ms response time, and adjustable stand. Ideal for gaming and design work.', 449.99),
('USB-C Hub', 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery. Compact and portable.', 39.99),
('Webcam HD 1080p', 'Full HD webcam with auto-focus, noise cancellation, and wide-angle lens. Great for video calls and streaming.', 59.99),
('Desk Lamp LED', 'Adjustable LED desk lamp with multiple brightness levels, USB charging port, and modern design.', 34.99),
('External SSD 1TB', 'Portable external SSD with 1TB capacity, USB 3.1 interface, and shock-resistant design.', 149.99);

-- Display inserted data
SELECT 'Users:' as table_name;
SELECT id, username, email, role FROM users;

SELECT 'Products:' as table_name;
SELECT id, name, price FROM products;
