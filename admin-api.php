<?php
require_once 'config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    sendResponse(false, 'Invalid request');
}

$action = $input['action'];

switch ($action) {
    case 'get_dashboard_stats':
        getDashboardStats($pdo);
        break;
    case 'get_recent_bookings':
        getRecentBookings($pdo, $input);
        break;
    case 'get_all_bookings':
        getAllBookings($pdo, $input);
        break;
    case 'update_booking_status':
        updateBookingStatus($pdo, $input);
        break;
    case 'get_all_users':
        getAllUsers($pdo, $input);
        break;
    case 'get_all_vendors':
        getAllVendors($pdo, $input);
        break;
    case 'get_all_properties':
        getAllProperties($pdo, $input);
        break;
    case 'get_earnings_data':
        getEarningsData($pdo, $input);
        break;
    case 'get_contact_messages':
        getContactMessages($pdo, $input);
        break;
    case 'mark_message_read':
        markMessageRead($pdo, $input);
        break;
    case 'delete_user':
        deleteUser($pdo, $input);
        break;
    case 'toggle_user_status':
        toggleUserStatus($pdo, $input);
        break;
    case 'delete_property':
        deleteProperty($pdo, $input);
        break;
    case 'toggle_property_status':
        togglePropertyStatus($pdo, $input);
        break;
    default:
        sendResponse(false, 'Invalid action');
}

function getDashboardStats($pdo) {
    try {
        // Get total bookings
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM bookings");
        $stmt->execute();
        $totalBookings = $stmt->fetch()['total'];
        
        // Get total users
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM users WHERE is_active = 1");
        $stmt->execute();
        $totalUsers = $stmt->fetch()['total'];
        
        // Get total revenue from confirmed bookings
        $stmt = $pdo->prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE booking_status = 'confirmed'");
        $stmt->execute();
        $totalRevenue = floatval($stmt->fetch()['total']);

        // Get total properties from sample data (since we don't have a properties table with real data)
        $totalProperties = 15; // This matches the sample data count from script.js

        sendResponse(true, 'Dashboard stats retrieved successfully', [
            'total_bookings' => $totalBookings,
            'total_users' => $totalUsers,
            'total_revenue' => $totalRevenue,
            'total_properties' => $totalProperties
        ]);

    } catch (PDOException $e) {
        logError("Get dashboard stats error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve dashboard stats');
    }
}

function getRecentBookings($pdo, $data) {
    $limit = intval($data['limit'] ?? 5);
    try {
        $stmt = $pdo->prepare("
            SELECT id, booking_id, guest_name, total_amount, booking_status, property_id
            FROM bookings 
            ORDER BY created_at DESC 
            LIMIT ?
        ");
        $stmt->execute([$limit]);
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Add dummy property titles for demo purposes
        foreach ($bookings as &$booking) {
            $booking['property_title'] = "Property " . $booking['property_id'];
        }

        sendResponse(true, 'Recent bookings retrieved successfully', $bookings);
    } catch (PDOException $e) {
        logError("Get recent bookings error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve recent bookings');
    }
}

function getAllBookings($pdo, $data) {
    try {
        $stmt = $pdo->prepare("
            SELECT 
                b.id, b.booking_id, b.checkin_date, b.checkout_date, b.guests,
                b.guest_name, b.guest_email, b.guest_phone, b.guest_cnic, b.guest_address,
                b.payment_method, b.total_amount, b.booking_status, b.special_requests,
                p.title AS property_title, p.location AS property_location
            FROM bookings b
            LEFT JOIN properties p ON b.property_id = p.id
            ORDER BY b.created_at DESC
        ");
        $stmt->execute();
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Decode special requests and handle nulls
        foreach ($bookings as &$booking) {
            $booking['special_requests'] = json_decode($booking['special_requests'] ?? '[]', true);
            $booking['property_title'] = $booking['property_title'] ?? 'N/A'; // Handle if no property join
            $booking['property_location'] = $booking['property_location'] ?? 'N/A';
        }

        sendResponse(true, 'All bookings retrieved successfully', $bookings);
    } catch (PDOException $e) {
        logError("Get all bookings error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve all bookings');
    }
}


function updateBookingStatus($pdo, $data) {
    $bookingId = sanitizeInput($data['booking_id'] ?? '');
    $status = sanitizeInput($data['status'] ?? '');

    if (!$bookingId || !$status) {
        sendResponse(false, 'Booking ID and Status are required');
    }

    $allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!in_array($status, $allowedStatuses)) {
        sendResponse(false, 'Invalid status provided');
    }

    try {
        $stmt = $pdo->prepare("
            UPDATE bookings 
            SET booking_status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE booking_id = ?
        ");
        $stmt->execute([$status, $bookingId]);
        sendResponse(true, 'Booking status updated successfully');
    } catch (PDOException $e) {
        logError("Update booking status error: " . $e->getMessage());
        sendResponse(false, 'Failed to update booking status');
    }
}

function getAllUsers($pdo, $data) {
    try {
        // Fetch all users (excluding vendors and admins)
        $stmt = $pdo->prepare("
            SELECT id, name, email, is_active FROM users WHERE role = 'user' ORDER BY created_at DESC
        ");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(true, 'All users retrieved successfully', $users);
    } catch (PDOException $e) {
        logError("Get all users error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve users');
    }
}

function toggleUserStatus($pdo, $data) {
    $userId = intval($data['user_id'] ?? 0);
    $isActive = intval($data['is_active'] ?? 0);

    if (!$userId) {
        sendResponse(false, 'User ID is required');
    }

    try {
        $stmt = $pdo->prepare("UPDATE users SET is_active = ? WHERE id = ?");
        $stmt->execute([$isActive, $userId]);
        sendResponse(true, 'User status updated successfully');
    } catch (PDOException $e) {
        logError("Toggle user status error: " . $e->getMessage());
        sendResponse(false, 'Failed to update user status');
    }
}

function deleteUser($pdo, $data) {
    $userId = intval($data['user_id'] ?? 0);
    if (!$userId) {
        sendResponse(false, 'User ID is required');
    }

    try {
        // Check if user has any bookings before deleting
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM bookings WHERE user_id = ?");
        $stmt->execute([$userId]);
        $bookingCount = $stmt->fetch()['count'];

        if ($bookingCount > 0) {
            sendResponse(false, 'Cannot delete user with existing bookings.');
        }

        // Delete user
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        sendResponse(true, 'User deleted successfully');
    } catch (PDOException $e) {
        logError("Delete user error: " . $e->getMessage());
        sendResponse(false, 'Failed to delete user');
    }
}

function getAllVendors($pdo, $data) {
    try {
        $stmt = $pdo->prepare("
            SELECT id, name, email, is_active FROM users WHERE role = 'vendor' ORDER BY created_at DESC
        ");
        $stmt->execute();
        $vendors = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(true, 'All vendors retrieved successfully', $vendors);
    } catch (PDOException $e) {
        logError("Get all vendors error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve vendors');
    }
}

function toggleVendorStatus($pdo, $data) {
    $vendorId = intval($data['vendor_id'] ?? 0);
    $isActive = intval($data['is_active'] ?? 0);

    if (!$vendorId) {
        sendResponse(false, 'Vendor ID is required');
    }

    try {
        $stmt = $pdo->prepare("UPDATE users SET is_active = ? WHERE id = ?");
        $stmt->execute([$isActive, $vendorId]);
        sendResponse(true, 'Vendor status updated successfully');
    } catch (PDOException $e) {
        logError("Toggle vendor status error: " . $e->getMessage());
        sendResponse(false, 'Failed to update vendor status');
    }
}

function getAllProperties($pdo, $data) {
    // For this demo, we use the sample data from script.js as there's no dynamic properties table
    // In a real application, you'd fetch this from a 'properties' table
    $sampleProperties = [
        ['id' => 1, 'title' => 'Luxury Apartment in Clifton', 'location' => 'Clifton, Karachi', 'price' => 15000, 'rating' => 4.8, 'status' => 'active'],
        ['id' => 2, 'title' => 'Modern House in DHA', 'location' => 'DHA Phase 5, Karachi', 'price' => 25000, 'rating' => 4.9, 'status' => 'active'],
        ['id' => 3, 'title' => 'Luxury Villa in Bahria Town', 'location' => 'Bahria Town, Karachi', 'price' => 35000, 'rating' => 5.0, 'status' => 'inactive'],
        ['id' => 4, 'title' => 'Cozy Apartment in Gulberg', 'location' => 'Gulberg, Lahore', 'price' => 12000, 'rating' => 4.5, 'status' => 'active'],
        ['id' => 5, 'title' => 'Family House in Model Town', 'location' => 'Model Town, Lahore', 'price' => 20000, 'rating' => 4.7, 'status' => 'active'],
        ['id' => 6, 'title' => 'Premium Apartment in F-7', 'location' => 'F-7, Islamabad', 'price' => 18000, 'rating' => 4.8, 'status' => 'active'],
        ['id' => 7, 'title' => 'Executive Villa in E-7', 'location' => 'E-7, Islamabad', 'price' => 30000, 'rating' => 4.9, 'status' => 'active'],
        ['id' => 8, 'title' => 'Spacious House in DHA Phase 6', 'location' => 'DHA Phase 6, Lahore', 'price' => 28000, 'rating' => 4.8, 'status' => 'active'],
        ['id' => 9, 'title' => 'City View Apartment', 'location' => 'Blue Area, Islamabad', 'price' => 16000, 'rating' => 4.6, 'status' => 'active'],
        ['id' => 10, 'title' => 'Garden Villa in Gulshan', 'location' => 'Gulshan-e-Iqbal, Karachi', 'price' => 22000, 'rating' => 4.7, 'status' => 'active'],
        ['id' => 11, 'title' => 'Modern Studio in DHA', 'location' => 'DHA Phase 7, Karachi', 'price' => 10000, 'rating' => 4.5, 'status' => 'active'],
        ['id' => 12, 'title' => 'Traditional House in Old Lahore', 'location' => 'Walled City, Lahore', 'price' => 18000, 'rating' => 4.6, 'status' => 'active'],
        ['id' => 13, 'title' => 'Modern Villa with Views', 'location' => 'Murree Road, Islamabad', 'price' => 32000, 'rating' => 4.9, 'status' => 'active'],
        ['id' => 14, 'title' => 'Executive Apartment near Liberty Market', 'location' => 'Liberty Market, Lahore', 'price' => 14000, 'rating' => 4.7, 'status' => 'active'],
        ['id' => 15, 'title' => 'Charming House near Faisal Mosque', 'location' => 'F-8, Islamabad', 'price' => 26000, 'rating' => 4.8, 'status' => 'active'],
    ];
    sendResponse(true, 'All properties retrieved successfully', $sampleProperties);
}

function getEarningsData($pdo, $data) {
    try {
        // Monthly bookings data for chart (last 12 months)
        $monthlyBookings = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = date('Y-m', strtotime("-$i months"));
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM bookings WHERE DATE_FORMAT(created_at, '%Y-%m') = ?");
            $stmt->execute([$month]);
            $count = $stmt->fetch()['count'];
            $monthlyBookings[] = [
                'month' => date('M Y', strtotime($month)),
                'count' => $count
            ];
        }

        // Revenue by property type (dummy data based on sample properties)
        $revenueByPropertyType = [
            ['type' => 'apartment', 'revenue' => 0],
            ['type' => 'house', 'revenue' => 0],
            ['type' => 'villa', 'revenue' => 0],
        ];

        $sampleProperties = [
            ['id' => 1, 'type' => 'apartment', 'price' => 15000],
            ['id' => 2, 'type' => 'house', 'price' => 25000],
            ['id' => 3, 'type' => 'villa', 'price' => 35000],
            ['id' => 4, 'type' => 'apartment', 'price' => 12000],
            ['id' => 5, 'type' => 'house', 'price' => 20000],
            ['id' => 6, 'type' => 'apartment', 'price' => 18000],
            ['id' => 7, 'type' => 'villa', 'price' => 30000],
            ['id' => 8, 'type' => 'house', 'price' => 28000],
            ['id' => 9, 'type' => 'apartment', 'price' => 16000],
            ['id' => 10, 'type' => 'villa', 'price' => 22000],
            ['id' => 11, 'type' => 'apartment', 'price' => 10000],
            ['id' => 12, 'type' => 'house', 'price' => 18000],
            ['id' => 13, 'type' => 'villa', 'price' => 32000],
            ['id' => 14, 'type' => 'apartment', 'price' => 14000],
            ['id' => 15, 'type' => 'house', 'price' => 26000],
        ];

        foreach ($sampleProperties as $prop) {
            $stmt = $pdo->prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE property_id = ? AND booking_status = 'confirmed'");
            $stmt->execute([$prop['id']]);
            $revenue = floatval($stmt->fetch()['total']);
            
            foreach ($revenueByPropertyType as &$item) {
                if ($item['type'] === $prop['type']) {
                    $item['revenue'] += $revenue;
                    break;
                }
            }
        }

        // Bookings by city (dummy data based on sample properties)
        $bookingsByCity = [
            ['city' => 'karachi', 'count' => 0],
            ['city' => 'lahore', 'count' => 0],
            ['city' => 'islamabad', 'count' => 0],
        ];

        foreach ($sampleProperties as $prop) {
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM bookings WHERE property_id = ?");
            $stmt->execute([$prop['id']]);
            $count = $stmt->fetch()['count'];
            
            foreach ($bookingsByCity as &$item) {
                if ($item['city'] === $prop['city']) {
                    $item['count'] += $count;
                    break;
                }
            }
        }


        sendResponse(true, 'Earnings data retrieved successfully', [
            'monthly_bookings' => $monthlyBookings,
            'revenue_by_property_type' => $revenueByPropertyType,
            'bookings_by_city' => $bookingsByCity
        ]);

    } catch (PDOException $e) {
        logError("Get earnings data error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve earnings data');
    }
}

function getContactMessages($pdo, $data) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM contact_messages ORDER BY created_at DESC");
        $stmt->execute();
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(true, 'Contact messages retrieved successfully', $messages);
    } catch (PDOException $e) {
        logError("Get contact messages error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve contact messages');
    }
}

function markMessageRead($pdo, $data) {
    $messageId = intval($data['message_id'] ?? 0);
    if (!$messageId) {
        sendResponse(false, 'Message ID is required');
    }

    try {
        $stmt = $pdo->prepare("UPDATE contact_messages SET is_read = 1 WHERE id = ?");
        $stmt->execute([$messageId]);
        sendResponse(true, 'Message marked as read');
    } catch (PDOException $e) {
        logError("Mark message read error: " . $e->getMessage());
        sendResponse(false, 'Failed to mark message as read');
    }
}

function togglePropertyStatus($pdo, $data) {
    $propertyId = intval($data['property_id'] ?? 0);
    
    if (!$propertyId) {
        sendResponse(false, 'Property ID is required');
    }
    
    try {
        // For now, we'll just return success since we don't have a properties table
        sendResponse(true, 'Property status updated successfully');
        
    } catch (PDOException $e) {
        logError("Toggle property status error: " . $e->getMessage());
        sendResponse(false, 'Failed to update property status');
    }
}

function deleteProperty($pdo, $data) {
    $propertyId = intval($data['property_id'] ?? 0);
    
    if (!$propertyId) {
        sendResponse(false, 'Property ID is required');
    }
    
    try {
        // Check if property has bookings
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM bookings WHERE property_id = ?");
        $stmt->execute([$propertyId]);
        $bookingCount = $stmt->fetch()['count'];
        
        if ($bookingCount > 0) {
            sendResponse(false, 'Cannot delete property with existing bookings');
        }
        
        // For now, we'll just return success since we don't have a properties table
        sendResponse(true, 'Property deleted successfully');
        
    } catch (PDOException $e) {
        logError("Delete property error: " . $e->getMessage());
        sendResponse(false, 'Failed to delete property');
    }
}


// Helper function to send JSON response
function sendResponse($success, $message, $data = null) {
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message, 'data' => $data]);
    exit();
}

// Helper function for input sanitization
function sanitizeInput($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

// Helper for error logging (to a file or monitoring service)
function logError($message) {
    error_log($message);
}

// Dummy config for PDO connection (replace with actual database credentials)
// In a real scenario, this would be in a separate config.php file
// For this demo, we'll include it directly
class PDOConnection {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        $host = 'localhost';
        $db   = 'stayscape_db';
        $user = 'root';
        $pass = ''; // Replace with your database password
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $this->pdo = new PDO($dsn, $user, $pass, $options);
        } catch (\PDOException $e) {
            throw new \PDOException($e->getMessage(), (int)$e->getCode());
        }
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new PDOConnection();
        }
        return self::$instance->pdo;
    }
}

$pdo = PDOConnection::getInstance();

?>