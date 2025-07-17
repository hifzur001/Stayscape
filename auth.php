<?php
require_once 'config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    sendResponse(false, 'Invalid request');
}

$action = $input['action'];

switch ($action) {
    case 'signup':
        handleSignup($pdo, $input);
        break;
    case 'login':
        handleLogin($pdo, $input);
        break;
    default:
        sendResponse(false, 'Invalid action');
}

function handleSignup($pdo, $data) {
    // Validate required fields
    $requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            sendResponse(false, "Field '$field' is required");
        }
    }
    
    // Sanitize input
    $firstName = sanitizeInput($data['firstName']);
    $lastName = sanitizeInput($data['lastName']);
    $email = sanitizeInput($data['email']);
    $phone = sanitizeInput($data['phone']);
    $password = $data['password'];
    
    // Validate email
    if (!isValidEmail($email)) {
        sendResponse(false, 'Invalid email format');
    }
    
    // Validate phone
    if (!isValidPhone($phone)) {
        sendResponse(false, 'Invalid phone number format. Use Pakistani format (+92XXXXXXXXXX)');
    }
    
    // Validate password strength
    if (strlen($password) < 6) {
        sendResponse(false, 'Password must be at least 6 characters long');
    }
    
    try {
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            sendResponse(false, 'Email already exists');
        }
        
        // Generate unique user ID
        $userId = generateUniqueId('USR');
        
        // Hash password
        $hashedPassword = hashPassword($password);
        
        // Insert user
        $stmt = $pdo->prepare("
            INSERT INTO users (user_id, first_name, last_name, email, phone, password) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([$userId, $firstName, $lastName, $email, $phone, $hashedPassword]);
        
        sendResponse(true, 'Account created successfully', [
            'user_id' => $userId,
            'email' => $email,
            'name' => $firstName . ' ' . $lastName
        ]);
        
    } catch (PDOException $e) {
        logError("Signup error: " . $e->getMessage());
        sendResponse(false, 'Registration failed. Please try again.');
    }
}

function handleLogin($pdo, $data) {
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
        // Get user
        $stmt = $pdo->prepare("
            SELECT user_id, first_name, last_name, email, phone, password, is_active 
            FROM users 
            WHERE email = ?
        ");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendResponse(false, 'Invalid email or password');
        }
        
        // Check if user is active
        if (!$user['is_active']) {
            sendResponse(false, 'Account is deactivated');
        }
        
        // Verify password
        if (!verifyPassword($password, $user['password'])) {
            sendResponse(false, 'Invalid email or password');
        }
        
        // Remove password from response
        unset($user['password']);
        
        // Add full name
        $user['name'] = $user['first_name'] . ' ' . $user['last_name'];
        
        sendResponse(true, 'Login successful', [
            'user' => $user
        ]);
        
    } catch (PDOException $e) {
        logError("Login error: " . $e->getMessage());
        sendResponse(false, 'Login failed. Please try again.');
    }
}
?>