<?php
require_once 'config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    sendResponse(false, 'Invalid request');
}

$action = $input['action'];

switch ($action) {
    case 'admin_login':
        handleAdminLogin($pdo, $input);
        break;
    case 'admin_logout':
        handleAdminLogout();
        break;
    default:
        sendResponse(false, 'Invalid action');
}

function handleAdminLogin($pdo, $data) {
    // Validate required fields
    if (!isset($data['email']) || !isset($data['password'])) {
        sendResponse(false, 'Email and password are required');
    }
    
    $email = sanitizeInput($data['email']);
    $password = $data['password'];
    
    // Validate email
    if (!isValidEmail($email)) {
        sendResponse(false, 'Invalid email format');
    }
    
    try {
        // For demo purposes, allow hardcoded admin credentials
        if ($email === 'admin@stayscape.com' && $password === 'admin123') {
            // Create demo admin session
            $adminData = [
                'admin_id' => 'ADM001',
                'name' => 'Super Admin',
                'email' => $email,
                'is_active' => true,
                'last_login' => date('Y-m-d H:i:s')
            ];
            
            sendResponse(true, 'Login successful', [
                'admin' => $adminData
            ]);
            return;
        }
        
        // Check if admin exists in database
        $stmt = $pdo->prepare("
            SELECT admin_id, name, email, password, is_active, last_login
            FROM admins 
            WHERE email = ?
        ");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();
        
        if (!$admin) {
            sendResponse(false, 'Invalid email or password');
        }
        
        // Check if admin is active
        if (!$admin['is_active']) {
            sendResponse(false, 'Admin account is deactivated');
        }
        
        // Verify password
        if (!verifyPassword($password, $admin['password'])) {
            sendResponse(false, 'Invalid email or password');
        }
        
        // Update last login
        $stmt = $pdo->prepare("UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE admin_id = ?");
        $stmt->execute([$admin['admin_id']]);
        
        // Remove password from response
        unset($admin['password']);
        
        sendResponse(true, 'Login successful', [
            'admin' => $admin
        ]);
        
    } catch (PDOException $e) {
        logError("Admin login error: " . $e->getMessage());
        sendResponse(false, 'Login failed. Please try again.');
    }
}

function handleAdminLogout() {
    sendResponse(true, 'Logout successful');
}

// Create admins table if it doesn't exist
function createAdminsTable($pdo) {
    try {
        $sql = "
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('super_admin', 'admin') DEFAULT 'admin',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                last_login TIMESTAMP NULL,
                INDEX idx_email (email),
                INDEX idx_admin_id (admin_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
        
        $pdo->exec($sql);
        
        // Insert default admin if not exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE email = ?");
        $stmt->execute(['admin@stayscape.com']);
        
        if ($stmt->fetchColumn() == 0) {
            $stmt = $pdo->prepare("
                INSERT INTO admins (admin_id, name, email, password, role) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                'ADM001',
                'Super Admin',
                'admin@stayscape.com',
                hashPassword('admin123'),
                'super_admin'
            ]);
        }
        
    } catch (PDOException $e) {
        logError("Failed to create admins table: " . $e->getMessage());
    }
}

// Create admins table
createAdminsTable($pdo);
?>