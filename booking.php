<?php
require_once 'config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    sendResponse(false, 'Invalid request');
}

$action = $input['action'];

switch ($action) {
    case 'book':
        handleBooking($pdo, $input);
        break;
    case 'get_bookings':
        getBookings($pdo, $input);
        break;
    case 'cancel_booking':
        cancelBooking($pdo, $input);
        break;
    default:
        sendResponse(false, 'Invalid action');
}

function handleBooking($pdo, $data) {
    // Validate required fields
    $requiredFields = [
        'property_id', 'checkin_date', 'checkout_date', 'guests',
        'guest_name', 'guest_email', 'guest_phone', 'guest_cnic',
        'guest_address', 'payment_method', 'total_amount'
    ];
    
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            sendResponse(false, "Field '$field' is required");
        }
    }
    
    // Sanitize input
    $propertyId = intval($data['property_id']);
    $checkinDate = $data['checkin_date'];
    $checkoutDate = $data['checkout_date'];
    $guests = intval($data['guests']);
    $specialRequests = sanitizeInput($data['special_requests'] ?? '');
    $notes = sanitizeInput($data['notes'] ?? '');
    $guestName = sanitizeInput($data['guest_name']);
    $guestEmail = sanitizeInput($data['guest_email']);
    $guestPhone = sanitizeInput($data['guest_phone']);
    $guestCnic = sanitizeInput($data['guest_cnic']);
    $guestAddress = sanitizeInput($data['guest_address']);
    $paymentMethod = sanitizeInput($data['payment_method']);
    $totalAmount = floatval(str_replace(',', '', $data['total_amount']));
    
    // Validate dates
    $checkin = new DateTime($checkinDate);
    $checkout = new DateTime($checkoutDate);
    $today = new DateTime();
    
    if ($checkin < $today) {
        sendResponse(false, 'Check-in date cannot be in the past');
    }
    
    if ($checkout <= $checkin) {
        sendResponse(false, 'Check-out date must be after check-in date');
    }
    
    // Validate email
    if (!isValidEmail($guestEmail)) {
        sendResponse(false, 'Invalid email format');
    }
    
    // Validate phone
    if (!isValidPhone($guestPhone)) {
        sendResponse(false, 'Invalid phone number format');
    }
    
    // Validate CNIC
    if (!preg_match('/^\d{5}-\d{7}-\d{1}$/', $guestCnic)) {
        sendResponse(false, 'Invalid CNIC format (00000-0000000-0)');
    }
    
    // Validate guests
    if ($guests < 1 || $guests > 20) {
        sendResponse(false, 'Invalid number of guests');
    }
    
    // Validate total amount
    if ($totalAmount <= 0) {
        sendResponse(false, 'Invalid total amount');
    }
    
    try {
        // Sample property data (in real app, this would come from properties table)
        $properties = [
            1 => ['title' => 'Luxury Apartment in Clifton', 'location' => 'Clifton, Karachi', 'city' => 'karachi'],
            2 => ['title' => 'Modern House in DHA', 'location' => 'DHA Phase 5, Karachi', 'city' => 'karachi'],
            3 => ['title' => 'Luxury Villa in Bahria Town', 'location' => 'Bahria Town, Karachi', 'city' => 'karachi'],
            4 => ['title' => 'Cozy Apartment in Gulberg', 'location' => 'Gulberg, Lahore', 'city' => 'lahore'],
            5 => ['title' => 'Family House in Model Town', 'location' => 'Model Town, Lahore', 'city' => 'lahore'],
            6 => ['title' => 'Premium Apartment in F-7', 'location' => 'F-7, Islamabad', 'city' => 'islamabad'],
            7 => ['title' => 'Executive Villa in E-7', 'location' => 'E-7, Islamabad', 'city' => 'islamabad'],
            8 => ['title' => 'Modern House in G-10', 'location' => 'G-10, Islamabad', 'city' => 'islamabad'],
            9 => ['title' => 'Studio Apartment in Johar Town', 'location' => 'Johar Town, Lahore', 'city' => 'lahore'],
            10 => ['title' => 'Beachfront Villa in Hawksbay', 'location' => 'Hawksbay, Karachi', 'city' => 'karachi'],
            11 => ['title' => 'Business Apartment in I.I. Chundrigar', 'location' => 'I.I. Chundrigar Road, Karachi', 'city' => 'karachi'],
            12 => ['title' => 'Traditional House in Anarkali', 'location' => 'Anarkali, Lahore', 'city' => 'lahore'],
            13 => ['title' => 'Luxury Villa in DHA Lahore', 'location' => 'DHA Phase 6, Lahore', 'city' => 'lahore'],
            14 => ['title' => 'Diplomatic Enclave Apartment', 'location' => 'Diplomatic Enclave, Islamabad', 'city' => 'islamabad'],
            15 => ['title' => 'Hill View House in Margalla', 'location' => 'Margalla Hills, Islamabad', 'city' => 'islamabad']
        ];
        
        $property = $properties[$propertyId] ?? ['title' => 'Unknown Property', 'location' => 'Unknown Location', 'city' => 'unknown'];
        
        // Generate booking ID
        $bookingId = generateUniqueId('BK');
        
        // Try to get user_id from the booking data or create a temporary one
        $userId = $data['user_id'] ?? null;
        
        // If no user_id provided, try to find user by email
        if (!$userId) {
            $stmt = $pdo->prepare("SELECT user_id FROM users WHERE email = ? LIMIT 1");
            $stmt->execute([$guestEmail]);
            $user = $stmt->fetch();
            $userId = $user ? $user['user_id'] : ('GUEST' . time());
        }
        
        // Insert booking
        $stmt = $pdo->prepare("
            INSERT INTO bookings (
                booking_id, user_id, property_id, property_title, property_location,
                checkin_date, checkout_date, guests, special_requests, notes,
                guest_name, guest_email, guest_phone, guest_cnic, guest_address,
                payment_method, total_amount, booking_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
        ");
        
        $stmt->execute([
            $bookingId, $userId, $propertyId, $property['title'], $property['location'],
            $checkinDate, $checkoutDate, $guests, $specialRequests, $notes,
            $guestName, $guestEmail, $guestPhone, $guestCnic, $guestAddress,
            $paymentMethod, $totalAmount
        ]);
        
        sendResponse(true, 'Booking confirmed successfully', [
            'booking_id' => $bookingId,
            'property_title' => $property['title'],
            'property_location' => $property['location'],
            'checkin_date' => $checkinDate,
            'checkout_date' => $checkoutDate,
            'guests' => $guests,
            'total_amount' => $totalAmount,
            'booking_status' => 'confirmed'
        ]);
        
    } catch (PDOException $e) {
        logError("Booking error: " . $e->getMessage());
        sendResponse(false, 'Booking failed. Please try again.');
    }
}

function getBookings($pdo, $data) {
    // Get user ID from the request
    $userId = sanitizeInput($data['user_id'] ?? '');
    
    if (empty($userId)) {
        sendResponse(false, 'User ID is required');
    }
    
    try {
        // First try to get bookings by user_id directly
        $stmt = $pdo->prepare("
            SELECT booking_id, property_id, property_title, property_location, 
                   checkin_date, checkout_date, guests, total_amount, 
                   booking_status, created_at, guest_name, guest_email, 
                   guest_phone, payment_method, special_requests, notes
            FROM bookings 
            WHERE user_id = ?
            ORDER BY created_at DESC
        ");
        
        $stmt->execute([$userId]);
        $bookings = $stmt->fetchAll();
        
        // If no bookings found by user_id, try by email
        if (empty($bookings)) {
            // Get user email from users table
            $userStmt = $pdo->prepare("SELECT email FROM users WHERE user_id = ?");
            $userStmt->execute([$userId]);
            $user = $userStmt->fetch();
            
            if ($user) {
                $stmt = $pdo->prepare("
                    SELECT booking_id, property_id, property_title, property_location, 
                           checkin_date, checkout_date, guests, total_amount, 
                           booking_status, created_at, guest_name, guest_email, 
                           guest_phone, payment_method, special_requests, notes
                    FROM bookings 
                    WHERE guest_email = ?
                    ORDER BY created_at DESC
                ");
                
                $stmt->execute([$user['email']]);
                $bookings = $stmt->fetchAll();
            }
        }
        
        sendResponse(true, 'Bookings retrieved successfully', [
            'bookings' => $bookings
        ]);
        
    } catch (PDOException $e) {
        logError("Get bookings error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve bookings');
    }
}

function cancelBooking($pdo, $data) {
    $bookingId = sanitizeInput($data['booking_id'] ?? '');
    $userId = sanitizeInput($data['user_id'] ?? '');
    
    if (empty($bookingId) || empty($userId)) {
        sendResponse(false, 'Booking ID and User ID are required');
    }
    
    try {
        // Check if booking exists and belongs to user
        $stmt = $pdo->prepare("
            SELECT id, checkin_date, booking_status 
            FROM bookings 
            WHERE booking_id = ? AND user_id = ?
        ");
        
        $stmt->execute([$bookingId, $userId]);
        $booking = $stmt->fetch();
        
        if (!$booking) {
            sendResponse(false, 'Booking not found');
        }
        
        if ($booking['booking_status'] === 'cancelled') {
            sendResponse(false, 'Booking is already cancelled');
        }
        
        // Check if cancellation is allowed (24 hours before check-in)
        $checkinDate = new DateTime($booking['checkin_date']);
        $now = new DateTime();
        $timeDiff = $checkinDate->getTimestamp() - $now->getTimestamp();
        
        if ($timeDiff < 24 * 60 * 60) { // Less than 24 hours
            sendResponse(false, 'Cancellation not allowed within 24 hours of check-in');
        }
        
        // Update booking status
        $stmt = $pdo->prepare("
            UPDATE bookings 
            SET booking_status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
            WHERE booking_id = ? AND user_id = ?
        ");
        
        $stmt->execute([$bookingId, $userId]);
        
        sendResponse(true, 'Booking cancelled successfully');
        
    } catch (PDOException $e) {
        logError("Cancel booking error: " . $e->getMessage());
        sendResponse(false, 'Failed to cancel booking');
    }
}
?>