<?php
require_once 'config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    sendResponse(false, 'Invalid request');
}

$action = $input['action'];

switch ($action) {
    case 'vendor_login':
        handleVendorLogin($pdo, $input);
        break;
    case 'vendor_logout':
        handleVendorLogout();
        break;
    default:
        sendResponse(false, 'Invalid action');
}

function handleVendorLogin($pdo, $data) {
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
        // For demo purposes, allow hardcoded vendor credentials
        if ($email === 'vendor@stayscape.com' && $password === 'vendor123') {
            // Create demo vendor session
            $vendorData = [
                'vendor_id' => 'VND001',
                'name' => 'Demo Vendor',
                'email' => $email,
                'phone' => '+92 300 1234567',
                'company_name' => 'Stayscape Properties',
                'is_active' => true,
                'last_login' => date('Y-m-d H:i:s')
            ];
            
            sendResponse(true, 'Login successful', [
                'vendor' => $vendorData
            ]);
            return;
        }
        
        // Check if vendor exists in database
        $stmt = $pdo->prepare("
            SELECT vendor_id, name, email, password, phone, company_name, is_active, last_login
            FROM vendors 
            WHERE email = ?
        ");
        $stmt->execute([$email]);
        $vendor = $stmt->fetch();
        
        if (!$vendor) {
            sendResponse(false, 'Invalid email or password');
        }
        
        // Check if vendor is active
        if (!$vendor['is_active']) {
            sendResponse(false, 'Vendor account is deactivated');
        }
        
        // Verify password
        if (!verifyPassword($password, $vendor['password'])) {
            sendResponse(false, 'Invalid email or password');
        }
        
        // Update last login
        $stmt = $pdo->prepare("UPDATE vendors SET last_login = CURRENT_TIMESTAMP WHERE vendor_id = ?");
        $stmt->execute([$vendor['vendor_id']]);
        
        // Remove password from response
        unset($vendor['password']);
        
        sendResponse(true, 'Login successful', [
            'vendor' => $vendor
        ]);
        
    } catch (PDOException $e) {
        logError("Vendor login error: " . $e->getMessage());
        sendResponse(false, 'Login failed. Please try again.');
    }
}

function handleVendorLogout() {
    sendResponse(true, 'Logout successful');
}

// Create vendors table if it doesn't exist
function createVendorsTable($pdo) {
    try {
        $sql = "
            CREATE TABLE IF NOT EXISTS vendors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                vendor_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                company_name VARCHAR(255) NOT NULL,
                address TEXT,
                city VARCHAR(100),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                last_login TIMESTAMP NULL,
                INDEX idx_email (email),
                INDEX idx_vendor_id (vendor_id),
                INDEX idx_city (city)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
        
        $pdo->exec($sql);
        
        // Insert default vendor if not exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM vendors WHERE email = ?");
        $stmt->execute(['vendor@stayscape.com']);
        
        if ($stmt->fetchColumn() == 0) {
            $stmt = $pdo->prepare("
                INSERT INTO vendors (vendor_id, name, email, password, phone, company_name, city) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                'VND001',
                'Demo Vendor',
                'vendor@stayscape.com',
                hashPassword('vendor123'),
                '+92 300 1234567',
                'Stayscape Properties',
                'karachi'
            ]);
        }
        
    } catch (PDOException $e) {
        logError("Failed to create vendors table: " . $e->getMessage());
    }
}

// Create vendors table
createVendorsTable($pdo);
?>