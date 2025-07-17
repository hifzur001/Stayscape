<?php
require_once 'config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    sendResponse(false, 'Invalid request');
}

$action = $input['action'];

switch ($action) {
    case 'get_vendor_dashboard':
        getVendorDashboard($pdo, $input);
        break;
    case 'get_vendor_properties':
        getVendorProperties($pdo, $input);
        break;
    case 'add_property':
        addProperty($pdo, $input);
        break;
    case 'update_property':
        updateProperty($pdo, $input);
        break;
    case 'delete_property':
        deleteVendorProperty($pdo, $input);
        break;
    case 'get_property_bookings':
        getPropertyBookings($pdo, $input);
        break;
    case 'get_vendor_earnings':
        getVendorEarnings($pdo, $input);
        break;
    case 'update_vendor_profile':
        updateVendorProfile($pdo, $input);
        break;
    default:
        sendResponse(false, 'Invalid action');
}

function getVendorDashboard($pdo, $data) {
    $vendorId = sanitizeInput($data['vendor_id'] ?? '');
    
    if (!$vendorId) {
        sendResponse(false, 'Vendor ID is required');
    }
    
    try {
        // For demo vendor, get bookings for properties 1, 2, 3 (demo properties)
        $demoPropertyIds = [1, 2, 3];
        
        // Get total bookings for vendor's properties
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as total 
            FROM bookings 
            WHERE property_id IN (" . implode(',', $demoPropertyIds) . ")
        ");
        $stmt->execute();
        $totalBookings = $stmt->fetch()['total'];

        // Get total earnings for vendor's properties
        $stmt = $pdo->prepare("
            SELECT COALESCE(SUM(total_amount), 0) as total 
            FROM bookings 
            WHERE property_id IN (" . implode(',', $demoPropertyIds) . ") AND booking_status = 'confirmed'
        ");
        $stmt->execute();
        $totalEarnings = floatval($stmt->fetch()['total']);

        // Get recent bookings for vendor's properties (last 5)
        $stmt = $pdo->prepare("
            SELECT booking_id, guest_name, total_amount, booking_status, created_at 
            FROM bookings 
            WHERE property_id IN (" . implode(',', $demoPropertyIds) . ")
            ORDER BY created_at DESC 
            LIMIT 5
        ");
        $stmt->execute();
        $recentBookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Monthly earnings (dummy data for last 6 months)
        $monthlyEarnings = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = date('Y-m', strtotime("-$i months"));
            $monthlyEarnings[] = [
                'month' => date('M Y', strtotime($month)),
                'earnings' => round($totalEarnings * (0.15 + (rand(0, 10)/100)), 2) // Dummy fluctuation
            ];
        }

        sendResponse(true, 'Vendor dashboard data retrieved successfully', [
            'total_bookings' => $totalBookings,
            'total_earnings' => $totalEarnings,
            'recent_bookings' => $recentBookings,
            'monthly_earnings' => $monthlyEarnings
        ]);

    } catch (PDOException $e) {
        logError("Get vendor dashboard error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve vendor dashboard data');
    }
}

function getVendorProperties($pdo, $data) {
    $vendorId = sanitizeInput($data['vendor_id'] ?? '');
    
    if (!$vendorId) {
        sendResponse(false, 'Vendor ID is required');
    }
    
    try {
        // For demo, return sample properties associated with demo vendor ID (101)
        // In a real app, these would be fetched from a 'properties' table
        $sampleProperties = [
            [
                'id' => 1,
                'title' => 'Luxury Apartment in Clifton',
                'location' => 'Clifton, Karachi',
                'price' => 15000,
                'rating' => 4.8,
                'status' => 'active',
                'image' => 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            [
                'id' => 2,
                'title' => 'Modern House in DHA',
                'location' => 'DHA Phase 5, Karachi',
                'price' => 25000,
                'rating' => 4.9,
                'status' => 'active',
                'image' => 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            [
                'id' => 3,
                'title' => 'Luxury Villa in Bahria Town',
                'location' => 'Bahria Town, Karachi',
                'price' => 35000,
                'rating' => 5.0,
                'status' => 'inactive',
                'image' => 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800'
            ]
        ];
        
        sendResponse(true, 'Vendor properties retrieved successfully', $sampleProperties);

    } catch (PDOException $e) {
        logError("Get vendor properties error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve vendor properties');
    }
}

function addProperty($pdo, $data) {
    // In a real application, you'd insert the new property into the database
    sendResponse(true, 'Property added successfully', ['id' => rand(100, 999), 'title' => $data['title'] ?? 'New Property']);
}

function updateProperty($pdo, $data) {
    // In a real application, you'd update the property in the database
    sendResponse(true, 'Property updated successfully', ['id' => $data['property_id'] ?? 'N/A']);
}

function deleteVendorProperty($pdo, $data) {
    $propertyId = intval($data['property_id'] ?? 0);
    if (!$propertyId) {
        sendResponse(false, 'Property ID is required');
    }

    try {
        // Check if property has any existing bookings before deleting
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM bookings WHERE property_id = ?");
        $stmt->execute([$propertyId]);
        $bookingCount = $stmt->fetch()['count'];

        if ($bookingCount > 0) {
            sendResponse(false, 'Cannot delete property with existing bookings.');
        }

        // For demo, just return success if no bookings
        sendResponse(true, 'Property deleted successfully');
    } catch (PDOException $e) {
        logError("Delete property error: " . $e->getMessage());
        sendResponse(false, 'Failed to delete property');
    }
}


function getPropertyBookings($pdo, $data) {
    $propertyId = intval($data['property_id'] ?? 0);
    $vendorId = sanitizeInput($data['vendor_id'] ?? '');

    if (!$propertyId || !$vendorId) {
        sendResponse(false, 'Property ID and Vendor ID are required');
    }

    try {
        // For demo, fetch bookings for property_id 1, 2, or 3
        // In a real app, verify property belongs to vendor
        $stmt = $pdo->prepare("
            SELECT booking_id, guest_name, checkin_date, checkout_date, total_amount, booking_status 
            FROM bookings 
            WHERE property_id = ? 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$propertyId]);
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendResponse(true, 'Property bookings retrieved successfully', $bookings);

    } catch (PDOException $e) {
        logError("Get property bookings error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve property bookings');
    }
}

function getVendorEarnings($pdo, $data) {
    $vendorId = sanitizeInput($data['vendor_id'] ?? '');
    
    if (!$vendorId) {
        sendResponse(false, 'Vendor ID is required');
    }

    try {
        // Dummy data based on properties 1, 2, 3 for demo vendor
        $propertyIds = [1, 2, 3];
        $propertyTitles = [
            1 => 'Luxury Apartment in Clifton',
            2 => 'Modern House in DHA',
            3 => 'Luxury Villa in Bahria Town'
        ];
        $propertyLocations = [
            1 => 'Karachi',
            2 => 'Karachi',
            3 => 'Karachi'
        ];

        // Monthly earnings (dummy data for last 6 months)
        $monthlyEarnings = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = date('Y-m', strtotime("-$i months"));
            $stmt = $pdo->prepare("
                SELECT COALESCE(SUM(total_amount), 0) as total 
                FROM bookings 
                WHERE property_id IN (" . implode(',', $propertyIds) . ") 
                AND booking_status = 'confirmed' 
                AND DATE_FORMAT(created_at, '%Y-%m') = ?
            ");
            $stmt->execute([$month]);
            $total = floatval($stmt->fetch()['total']);
            $monthlyEarnings[] = [
                'month' => date('M Y', strtotime($month)),
                'earnings' => $total
            ];
        }

        // Earnings per property
        $propertyEarnings = [];
        foreach ($propertyIds as $propId) {
            $stmt = $pdo->prepare("
                SELECT 
                    COALESCE(SUM(total_amount), 0) as total_earnings,
                    COUNT(*) as total_bookings
                FROM bookings 
                WHERE property_id = ? AND booking_status = 'confirmed'
            ");
            $stmt->execute([$propId]);
            $result = $stmt->fetch();
            
            $propertyEarnings[] = [
                'title' => $propertyTitles[$propId],
                'location' => $propertyLocations[$propId],
                'total_earnings' => floatval($result['total_earnings']),
                'total_bookings' => intval($result['total_bookings'])
            ];
        }
        
        sendResponse(true, 'Vendor earnings retrieved successfully', [
            'monthly_earnings' => $monthlyEarnings,
            'property_earnings' => $propertyEarnings
        ]);
        
    } catch (PDOException $e) {
        logError("Get vendor earnings error: " . $e->getMessage());
        sendResponse(false, 'Failed to retrieve vendor earnings');
    }
}

function updateVendorProfile($pdo, $data) {
    $vendorId = sanitizeInput($data['vendor_id'] ?? '');
    
    if (!$vendorId) {
        sendResponse(false, 'Vendor ID is required');
    }
    
    try {
        // For demo, just return success
        sendResponse(true, 'Profile updated successfully');
        
    } catch (PDOException $e) {
        logError("Update vendor profile error: " . $e->getMessage());
        sendResponse(false, 'Failed to update profile');
    }
}
?>