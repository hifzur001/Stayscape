<?php
require_once 'config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    sendResponse(false, 'Invalid request');
}

$action = $input['action'];

switch ($action) {
    case 'send_message':
        handleContactMessage($pdo, $input);
        break;
    case 'get_messages':
        getContactMessages($pdo, $input);
        break;
    default:
        sendResponse(false, 'Invalid action');
}

function handleContactMessage($pdo, $data) {
    // Validate required fields
    $requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            sendResponse(false, "Field '$field' is required");
        }
    }
    
    // Sanitize input
    $firstName = sanitizeInput($data['firstName']);
    $lastName = sanitizeInput($data['lastName']);
    $email = sanitizeInput($data['email']);
    $phone = sanitizeInput($data['phone'] ?? '');
    $subject = sanitizeInput($data['subject']);
    $message = sanitizeInput($data['message']);
    
    // Validate email
    if (!isValidEmail($email)) {
        sendResponse(false, 'Invalid email format');
    }
    
    // Validate phone if provided
    if (!empty($phone) && !isValidPhone($phone)) {
        sendResponse(false, 'Invalid phone number format');
    }
    
    // Validate message length
    if (strlen($message) < 10) {
        sendResponse(false, 'Message must be at least 10 characters long');
    }
    
    if (strlen($message) > 1000) {
        sendResponse(false, 'Message must be less than 1000 characters');
    }
    
    try {
        // Insert contact message
        $stmt = $pdo->prepare("
            INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([$firstName, $lastName, $email, $phone, $subject, $message]);
        
        sendResponse(true, 'Message sent successfully! We will get back to you soon.', [
            'message_id' => $pdo->lastInsertId(),
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
    } catch (PDOException $e) {
        logError("Contact message error: " . $e->getMessage());
        sendResponse(false, 'Failed to send message. Please try again.');
    }
}

function getContactMessages($pdo, $data) {
    // This would typically be for admin use
    $page = intval($data['page'] ?? 1);
    $limit = intval($data['limit'] ?? 10);
    $offset = ($page - 1) * $limit;
    
    // Basic security check (in real app, you'd have proper admin authentication)
    $adminKey = $data['admin_key'] ?? '';
    if ($adminKey !== 'admin123') {
        sendResponse(false, 'Unauthorized access');
    }
    
    try {
        // Get total count
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM contact_messages");
        $stmt->execute();
        $total = $stmt->fetch()['total'];
        
        // Get messages
        $stmt = $pdo->prepare("
            SELECT id, first_name, last_name, email, phone, subject, message, 
                   created_at, is_read
            FROM contact_messages 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        ");
        
        $stmt->execute([$limit, $offset]);
        $messages = $stmt->fetchAll();
        
        sendResponse(true, 'Messages retrieved successfully', [
            'messages' => $messages,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($total / $limit)
        ]);
        
    } catch (PDOException $e) {
        logError("Get messages error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve messages');
    }
}
?>