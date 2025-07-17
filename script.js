// Global Variables
let currentUser = null;
let properties = [];
let filteredProperties = [];
let currentView = 'grid';

// Sample Data - 15 properties across 3 cities
const sampleProperties = [
    {
        id: 1,
        type: 'apartment',
        title: 'Luxury Apartment in Clifton',
        price: 15000,
        location: 'Clifton, Karachi',
        city: 'karachi',
        rating: 4.8,
        pictures: [
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 1,
        broker_name: 'Ahmed Hassan',
        broker_phone: '+92 300 1234567',
        broker_email: 'ahmed@realestate.com',
        description:
            'Beautiful luxury apartment with sea view in the heart of Clifton. Perfect for business travelers and families.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Parking', 'Security'],
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: 2,
        type: 'house',
        title: 'Modern House in DHA',
        price: 25000,
        location: 'DHA Phase 5, Karachi',
        city: 'karachi',
        rating: 4.9,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 2,
        broker_name: 'Sara Khan',
        broker_phone: '+92 300 2345678',
        broker_email: 'sara@realestate.com',
        description:
            'Spacious modern house in prestigious DHA area. Ideal for families and long-term stays.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Garden', 'Parking'],
        max_guests: 6,
        bedrooms: 3,
        bathrooms: 3,
    },
    {
        id: 3,
        type: 'villa',
        title: 'Luxury Villa in Bahria Town',
        price: 35000,
        location: 'Bahria Town, Karachi',
        city: 'karachi',
        rating: 5.0,
        pictures: [
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 3,
        broker_name: 'Hassan Ali',
        broker_phone: '+92 300 3456789',
        broker_email: 'hassan@realestate.com',
        description:
            'Premium villa with private pool and garden. Perfect for luxury stays and events.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Pool', 'Garden', 'Parking'],
        max_guests: 8,
        bedrooms: 4,
        bathrooms: 4,
    },
    {
        id: 4,
        type: 'apartment',
        title: 'Cozy Apartment in Gulberg',
        price: 12000,
        location: 'Gulberg, Lahore',
        city: 'lahore',
        rating: 4.5,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 4,
        broker_name: 'Fatima Sheikh',
        broker_phone: '+92 300 4567890',
        broker_email: 'fatima@realestate.com',
        description:
            'Comfortable apartment in the heart of Lahore. Great for business and leisure travelers.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Balcony'],
        max_guests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        id: 5,
        type: 'house',
        title: 'Family House in Model Town',
        price: 20000,
        location: 'Model Town, Lahore',
        city: 'lahore',
        rating: 4.7,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 5,
        broker_name: 'Omar Malik',
        broker_phone: '+92 300 5678901',
        broker_email: 'omar@realestate.com',
        description:
            'Spacious family house in quiet neighborhood. Perfect for families and groups.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Garden', 'Parking'],
        max_guests: 5,
        bedrooms: 3,
        bathrooms: 2,
    },
    {
        id: 6,
        type: 'apartment',
        title: 'Premium Apartment in F-7',
        price: 18000,
        location: 'F-7, Islamabad',
        city: 'islamabad',
        rating: 4.8,
        pictures: [
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 6,
        broker_name: 'Aisha Tariq',
        broker_phone: '+92 300 6789012',
        broker_email: 'aisha@realestate.com',
        description:
            'Premium apartment in the diplomatic area. Ideal for business travelers and diplomats.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Gym', 'Security'],
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: 7,
        type: 'villa',
        title: 'Executive Villa in E-7',
        price: 30000,
        location: 'E-7, Islamabad',
        city: 'islamabad',
        rating: 4.9,
        pictures: [
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 7,
        broker_name: 'Bilal Ahmed',
        broker_phone: '+92 300 7890123',
        broker_email: 'bilal@realestate.com',
        description:
            'Luxury executive villa with modern amenities. Perfect for corporate stays and events.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Pool', 'Garden', 'Security'],
        max_guests: 6,
        bedrooms: 3,
        bathrooms: 3,
    },
    {
        id: 8,
        type: 'house',
        title: 'Modern House in G-10',
        price: 22000,
        location: 'G-10, Islamabad',
        city: 'islamabad',
        rating: 4.6,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 8,
        broker_name: 'Zara Hussain',
        broker_phone: '+92 300 8901234',
        broker_email: 'zara@realestate.com',
        description:
            'Modern house with contemporary design. Great for families and professionals.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Parking', 'Garden'],
        max_guests: 5,
        bedrooms: 3,
        bathrooms: 2,
    },
    {
        id: 9,
        type: 'apartment',
        title: 'Studio Apartment in Johar Town',
        price: 8000,
        location: 'Johar Town, Lahore',
        city: 'lahore',
        rating: 4.2,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 9,
        broker_name: 'Kamran Ali',
        broker_phone: '+92 300 9012345',
        broker_email: 'kamran@realestate.com',
        description:
            'Compact studio apartment perfect for solo travelers and students.',
        amenities: ['WiFi', 'AC', 'Kitchenette'],
        max_guests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        id: 10,
        type: 'villa',
        title: 'Beachfront Villa in Hawksbay',
        price: 40000,
        location: 'Hawksbay, Karachi',
        city: 'karachi',
        rating: 5.0,
        pictures: [
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 10,
        broker_name: 'Samina Iqbal',
        broker_phone: '+92 300 0123456',
        broker_email: 'samina@realestate.com',
        description:
            'Exclusive beachfront villa with direct beach access. Perfect for luxury getaways.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Beach Access', 'Pool', 'BBQ'],
        max_guests: 10,
        bedrooms: 5,
        bathrooms: 4,
    },
    {
        id: 11,
        type: 'apartment',
        title: 'Business Apartment in I.I. Chundrigar',
        price: 16000,
        location: 'I.I. Chundrigar Road, Karachi',
        city: 'karachi',
        rating: 4.6,
        pictures: [
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 11,
        broker_name: 'Tariq Mahmood',
        broker_phone: '+92 300 1111111',
        broker_email: 'tariq@realestate.com',
        description:
            'Modern business apartment in the financial district. Perfect for corporate travelers.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Business Center', 'Security'],
        max_guests: 3,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        id: 12,
        type: 'house',
        title: 'Traditional House in Anarkali',
        price: 14000,
        location: 'Anarkali, Lahore',
        city: 'lahore',
        rating: 4.3,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 12,
        broker_name: 'Nadia Butt',
        broker_phone: '+92 300 2222222',
        broker_email: 'nadia@realestate.com',
        description:
            'Traditional Lahori house with cultural charm. Close to historical sites and markets.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Courtyard', 'Traditional Decor'],
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: 13,
        type: 'villa',
        title: 'Luxury Villa in DHA Lahore',
        price: 32000,
        location: 'DHA Phase 6, Lahore',
        city: 'lahore',
        rating: 4.8,
        pictures: [
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 13,
        broker_name: 'Shahid Malik',
        broker_phone: '+92 300 3333333',
        broker_email: 'shahid@realestate.com',
        description:
            'Luxurious villa in premium DHA location with all modern amenities.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Pool', 'Garden', 'Gym'],
        max_guests: 8,
        bedrooms: 4,
        bathrooms: 4,
    },
    {
        id: 14,
        type: 'apartment',
        title: 'Diplomatic Enclave Apartment',
        price: 24000,
        location: 'Diplomatic Enclave, Islamabad',
        city: 'islamabad',
        rating: 4.9,
        pictures: [
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 14,
        broker_name: 'Farah Khan',
        broker_phone: '+92 300 4444444',
        broker_email: 'farah@realestate.com',
        description:
            'High-security apartment in diplomatic area. Perfect for international visitors.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'High Security', 'Concierge'],
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: 15,
        type: 'house',
        title: 'Hill View House in Margalla',
        price: 28000,
        location: 'Margalla Hills, Islamabad',
        city: 'islamabad',
        rating: 4.7,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 15,
        broker_name: 'Ali Raza',
        broker_phone: '+92 300 5555555',
        broker_email: 'ali@realestate.com',
        description:
            'Beautiful house with stunning hill views. Perfect for nature lovers and peaceful stays.',
        amenities: [
            'WiFi',
            'AC',
            'Kitchen',
            'Hill View',
            'Garden',
            'Fireplace',
        ],
        max_guests: 6,
        bedrooms: 3,
        bathrooms: 3,
    },
    // New entries for Multan
    {
        id: 16,
        type: 'apartment',
        title: 'Modern Apartment in DHA Multan',
        price: 13000,
        location: 'DHA Multan',
        city: 'multan',
        rating: 4.7,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 16,
        broker_name: 'Usman Ghani',
        broker_phone: '+92 300 6666666',
        broker_email: 'usman@realestate.com',
        description:
            'Contemporary apartment in the rapidly developing DHA Multan. Ideal for small families and professionals.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Parking', 'Security'],
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: 17,
        type: 'house',
        title: 'Spacious House near Multan Cantt',
        price: 21000,
        location: 'Multan Cantt',
        city: 'multan',
        rating: 4.5,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 17,
        broker_name: 'Asma Qureshi',
        broker_phone: '+92 300 7777777',
        broker_email: 'asma@realestate.com',
        description:
            'Large family house in a well-established area near Multan Cantt. Good for long-term stays.',
        amenities: [
            'WiFi',
            'AC',
            'Kitchen',
            'Garden',
            'Parking',
            'Pets Allowed',
        ],
        max_guests: 6,
        bedrooms: 3,
        bathrooms: 3,
    },
    {
        id: 18,
        type: 'villa',
        title: 'Executive Villa in Royal Orchard Multan',
        price: 30000,
        location: 'Royal Orchard Multan',
        city: 'multan',
        rating: 4.9,
        pictures: [
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 18,
        broker_name: 'Imran Shah',
        broker_phone: '+92 300 8888888',
        broker_email: 'imran@realestate.com',
        description:
            'Luxurious villa with modern design and amenities in Royal Orchard. Ideal for discerning guests.',
        amenities: [
            'WiFi',
            'AC',
            'Kitchen',
            'Pool',
            'Garden',
            'Security',
            'Gym',
        ],
        max_guests: 8,
        bedrooms: 4,
        bathrooms: 4,
    },
    {
        id: 19,
        type: 'apartment',
        title: 'Budget Studio near Bahauddin Zakariya University',
        price: 9000,
        location: 'Near BZU, Multan',
        city: 'multan',
        rating: 4.0,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 19,
        broker_name: 'Sana Javed',
        broker_phone: '+92 300 9999999',
        broker_email: 'sana@realestate.com',
        description:
            'Compact and affordable studio apartment, perfect for students or short stays. Close to university.',
        amenities: ['WiFi', 'Kitchenette', 'Basic Furnishings'],
        max_guests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        id: 20,
        type: 'house',
        title: 'Traditional House in Old Multan',
        price: 15000,
        location: 'Old Multan',
        city: 'multan',
        rating: 4.3,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 20,
        broker_name: 'Adnan Ali',
        broker_phone: '+92 300 1010101',
        broker_email: 'adnan@realestate.com',
        description:
            'Charming traditional house in the historic heart of Multan. Experience local culture.',
        amenities: ['WiFi', 'Courtyard', 'Traditional Decor', 'AC'],
        max_guests: 5,
        bedrooms: 3,
        bathrooms: 2,
    },
    // New entries for Quetta
    {
        id: 21,
        type: 'apartment',
        title: 'Cozy Apartment in Chaman Housing Scheme',
        price: 10000,
        location: 'Chaman Housing Scheme, Quetta',
        city: 'quetta',
        rating: 4.1,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 21,
        broker_name: 'Zahid Khan',
        broker_phone: '+92 300 1212121',
        broker_email: 'zahid@realestate.com',
        description:
            'Comfortable apartment in a developing housing scheme. Suitable for small families.',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Heating'],
        max_guests: 3,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        id: 22,
        type: 'house',
        title: 'Family House in Zarghoon Road',
        price: 18000,
        location: 'Zarghoon Road, Quetta',
        city: 'quetta',
        rating: 4.4,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 22,
        broker_name: 'Nighat Pervez',
        broker_phone: '+92 300 3434343',
        broker_email: 'nighat@realestate.com',
        description:
            'Well-maintained family house on the main Zarghoon Road. Convenient access to city amenities.',
        amenities: ['WiFi', 'Kitchen', 'Garden', 'Parking', 'Heating'],
        max_guests: 5,
        bedrooms: 3,
        bathrooms: 2,
    },
    {
        id: 23,
        type: 'villa',
        title: 'Spacious Villa in Askari Housing',
        price: 28000,
        location: 'Askari Housing Scheme, Quetta',
        city: 'quetta',
        rating: 4.8,
        pictures: [
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 23,
        broker_name: 'Faisal Baloch',
        broker_phone: '+92 300 5656565',
        broker_email: 'faisal@realestate.com',
        description:
            'Large and modern villa in a secure housing scheme. Excellent for families seeking comfort and security.',
        amenities: [
            'WiFi',
            'AC',
            'Kitchen',
            'Garden',
            'Security',
            'Parking',
            'Heating',
        ],
        max_guests: 7,
        bedrooms: 4,
        bathrooms: 3,
    },
    {
        id: 24,
        type: 'apartment',
        title: 'City Center Apartment Quetta',
        price: 14000,
        location: 'Jinnah Road, Quetta',
        city: 'quetta',
        rating: 4.5,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 24,
        broker_name: 'Maria Batool',
        broker_phone: '+92 300 7878787',
        broker_email: 'maria@realestate.com',
        description:
            'Centrally located apartment, perfect for exploring Quetta. Close to markets and attractions.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Elevator', 'Security'],
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: 25,
        type: 'house',
        title: 'Quiet House near Hanna Lake',
        price: 20000,
        location: 'Near Hanna Lake, Quetta',
        city: 'quetta',
        rating: 4.6,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 25,
        broker_name: 'Kamran Baloch',
        broker_phone: '+92 300 9090909',
        broker_email: 'kamranb@realestate.com',
        description:
            'Peaceful house with scenic views, ideal for a relaxing getaway. Close to Hanna Lake.',
        amenities: [
            'WiFi',
            'Kitchen',
            'Garden',
            'Parking',
            'Scenic View',
            'BBQ',
        ],
        max_guests: 6,
        bedrooms: 3,
        bathrooms: 2,
    },
    // New entries for Bahawalpur
    {
        id: 26,
        type: 'house',
        title: 'Modern House in DHA Bahawalpur',
        price: 19000,
        location: 'DHA Bahawalpur',
        city: 'bahawalpur',
        rating: 4.7,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 26,
        broker_name: 'Sohail Abbasi',
        broker_phone: '+92 300 1313131',
        broker_email: 'sohail@realestate.com',
        description:
            'Brand new house in the premium DHA Bahawalpur. Perfect for modern living.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Garden', 'Parking', 'Security'],
        max_guests: 6,
        bedrooms: 3,
        bathrooms: 3,
    },
    {
        id: 27,
        type: 'apartment',
        title: 'Comfortable Apartment near Bahawalpur University',
        price: 11000,
        location: 'Near Islamia University, Bahawalpur',
        city: 'bahawalpur',
        rating: 4.2,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 27,
        broker_name: 'Ayesha Siddiqui',
        broker_phone: '+92 300 2424242',
        broker_email: 'ayesha@realestate.com',
        description:
            'Cozy apartment ideal for students or small families. Close to educational institutions.',
        amenities: ['WiFi', 'Kitchenette', 'AC', 'Parking'],
        max_guests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        id: 28,
        type: 'villa',
        title: 'Grand Villa in Model Town B',
        price: 33000,
        location: 'Model Town B, Bahawalpur',
        city: 'bahawalpur',
        rating: 4.9,
        pictures: [
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 28,
        broker_name: 'Zafar Iqbal',
        broker_phone: '+92 300 3535353',
        broker_email: 'zafar@realestate.com',
        description:
            'Luxurious and spacious villa with grand living spaces. Ideal for large families or events.',
        amenities: [
            'WiFi',
            'AC',
            'Kitchen',
            'Pool',
            'Garden',
            'BBQ',
            'Parking',
        ],
        max_guests: 9,
        bedrooms: 5,
        bathrooms: 4,
    },
    {
        id: 29,
        type: 'house',
        title: 'Charming House near Farid Gate',
        price: 17000,
        location: 'Near Farid Gate, Bahawalpur',
        city: 'bahawalpur',
        rating: 4.3,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 29,
        broker_name: 'Hina Latif',
        broker_phone: '+92 300 4646464',
        broker_email: 'hina@realestate.com',
        description:
            'Traditional house with a lovely ambiance, close to historical Farid Gate.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Courtyard', 'Traditional Decor'],
        max_guests: 5,
        bedrooms: 3,
        bathrooms: 2,
    },
    {
        id: 30,
        type: 'apartment',
        title: 'Executive Apartment in Satellite Town',
        price: 15000,
        location: 'Satellite Town, Bahawalpur',
        city: 'bahawalpur',
        rating: 4.5,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 30,
        broker_name: 'Imtiaz Khan',
        broker_phone: '+92 300 5757575',
        broker_email: 'imtiaz@realestate.com',
        description:
            'Well-appointed apartment in a prime residential area of Satellite Town.',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Parking', 'Security', 'Gym'],
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    // New entries for Rawalpindi
    {
        id: 31,
        type: 'apartment',
        title: 'Spacious Apartment in Bahria Town Rawalpindi',
        price: 19000,
        location: 'Bahria Town, Rawalpindi',
        city: 'rawalpindi',
        rating: 4.8,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 31,
        broker_name: 'Zeeshan Malik',
        broker_phone: '+92 300 6868686',
        broker_email: 'zeeshan@realestate.com',
        description:
            'Modern apartment in the well-known Bahria Town, Rawalpindi. Offers a luxurious lifestyle.',
        amenities: [
            'WiFi',
            'AC',
            'Kitchen',
            'Parking',
            'Security',
            'Community Pool',
        ],
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: 32,
        type: 'house',
        title: 'Family House in DHA Rawalpindi',
        price: 27000,
        location: 'DHA Phase 1, Rawalpindi',
        city: 'rawalpindi',
        rating: 4.9,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 32,
        broker_name: 'Rabia Siddiqui',
        broker_phone: '+92 300 7979797',
        broker_email: 'rabia@realestate.com',
        description:
            'Elegant family house in the prestigious DHA Rawalpindi. High-end living experience.',
        amenities: [
            'WiFi',
            'AC',
            'Kitchen',
            'Garden',
            'Parking',
            'Security',
            'Gym',
        ],
        max_guests: 7,
        bedrooms: 4,
        bathrooms: 4,
    },
    {
        id: 33,
        type: 'villa',
        title: 'Executive Villa in Gulraiz Housing Scheme',
        price: 36000,
        location: 'Gulraiz Housing Scheme, Rawalpindi',
        city: 'rawalpindi',
        rating: 4.7,
        pictures: [
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 33,
        broker_name: 'Saad Rashid',
        broker_phone: '+92 300 8080808',
        broker_email: 'saad@realestate.com',
        description:
            'Large and well-appointed villa, great for corporate or extended family stays.',
        amenities: [
            'WiFi',
            'AC',
            'Kitchen',
            'Pool',
            'Garden',
            'Security',
            'BBQ',
        ],
        max_guests: 9,
        bedrooms: 5,
        bathrooms: 4,
    },
    {
        id: 34,
        type: 'apartment',
        title: 'Studio Apartment near Saddar',
        price: 9500,
        location: 'Saddar, Rawalpindi',
        city: 'rawalpindi',
        rating: 4.0,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 34,
        broker_name: 'Fahad Mehmood',
        broker_phone: '+92 300 9191919',
        broker_email: 'fahad@realestate.com',
        description:
            'Compact studio in the bustling Saddar area. Convenient for single travelers or short trips.',
        amenities: ['WiFi', 'Kitchenette', 'AC'],
        max_guests: 2,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        id: 35,
        type: 'house',
        title: 'Traditional House in Raja Bazaar',
        price: 16000,
        location: 'Raja Bazaar, Rawalpindi',
        city: 'rawalpindi',
        rating: 4.1,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 35,
        broker_name: 'Uzma Rizwan',
        broker_phone: '+92 300 0202020',
        broker_email: 'uzma@realestate.com',
        description:
            'Authentic traditional house in the historic Raja Bazaar. Immerse yourself in local life.',
        amenities: ['WiFi', 'Courtyard', 'Traditional Decor', 'Market Access'],
        max_guests: 5,
        bedrooms: 3,
        bathrooms: 2,
    },
    // New entries for Murree
    {
        id: 36,
        type: 'villa',
        title: 'Hilltop Villa with Scenic Views',
        price: 28000,
        location: 'Near Mall Road, Murree',
        city: 'murree',
        rating: 4.9,
        pictures: [
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 36,
        broker_name: 'Jawad Khan',
        broker_phone: '+92 300 1313131',
        broker_email: 'jawad@realestate.com',
        description:
            'Beautiful villa offering breathtaking views of the Murree hills. Perfect for a peaceful retreat.',
        amenities: [
            'WiFi',
            'Heating',
            'Kitchen',
            'Scenic View',
            'Fireplace',
            'Parking',
        ],
        max_guests: 7,
        bedrooms: 3,
        bathrooms: 3,
    },
    {
        id: 37,
        type: 'house',
        title: 'Charming Cottage in Patriata',
        price: 22000,
        location: 'Patriata, Murree',
        city: 'murree',
        rating: 4.7,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 37,
        broker_name: 'Saima Bano',
        broker_phone: '+92 300 2424242',
        broker_email: 'saima@realestate.com',
        description:
            'Quaint cottage nestled in the serene Patriata hills. Ideal for a cozy family vacation.',
        amenities: [
            'WiFi',
            'Heating',
            'Kitchen',
            'Garden',
            'Fireplace',
            'Parking',
        ],
        max_guests: 5,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: 38,
        type: 'apartment',
        title: 'Modern Apartment near Bhurban',
        price: 17000,
        location: 'Bhurban, Murree',
        city: 'murree',
        rating: 4.6,
        pictures: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 38,
        broker_name: 'Usman Ali',
        broker_phone: '+92 300 3535353',
        broker_email: 'usman@realestate.com',
        description:
            'Well-equipped apartment in the scenic Bhurban area. Close to popular resorts and activities.',
        amenities: ['WiFi', 'Heating', 'Kitchen', 'Balcony', 'Parking'],
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: 39,
        type: 'villa',
        title: 'Luxury Retreat in Ayubia',
        price: 38000,
        location: 'Ayubia, Murree',
        city: 'murree',
        rating: 5.0,
        pictures: [
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 39,
        broker_name: 'Zara Bilal',
        broker_phone: '+92 300 4646464',
        broker_email: 'zara@realestate.com',
        description:
            'Exclusive luxury villa offering unparalleled views and amenities. Ideal for a high-end mountain escape.',
        amenities: [
            'WiFi',
            'Heating',
            'Kitchen',
            'Jacuzzi',
            'Scenic View',
            'BBQ',
            'Parking',
        ],
        max_guests: 8,
        bedrooms: 4,
        bathrooms: 4,
    },
    {
        id: 40,
        type: 'house',
        title: 'Family House on Kashmir Point',
        price: 25000,
        location: 'Kashmir Point, Murree',
        city: 'murree',
        rating: 4.8,
        pictures: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        ],
        broker_id: 40,
        broker_name: 'Haris Khan',
        broker_phone: '+92 300 5757575',
        broker_email: 'haris@realestate.com',
        description:
            'Comfortable house with a prime location near Kashmir Point, offering easy access to attractions.',
        amenities: [
            'WiFi',
            'Heating',
            'Kitchen',
            'Garden',
            'Fireplace',
            'Parking',
        ],
        max_guests: 6,
        bedrooms: 3,
        bathrooms: 2,
    },
];

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeAOS();
    checkAuthStatus();
    loadProperties();
    setupEventListeners();
    setupBackToTop();
    setMinDates();
});

// Initialize AOS
function initializeAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
    });
}

// Set minimum dates for date inputs
function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    const checkinInputs = document.querySelectorAll('input[type="date"]');

    checkinInputs.forEach(input => {
        if (input.id.includes('checkin') || input.id === 'checkin') {
            input.min = today;
            input.addEventListener('change', function () {
                const checkoutInput =
                    document.getElementById(
                        input.id.replace('checkin', 'checkout')
                    ) || document.getElementById('checkout');
                if (checkoutInput) {
                    checkoutInput.min = this.value;
                    if (
                        checkoutInput.value &&
                        checkoutInput.value <= this.value
                    ) {
                        checkoutInput.value = '';
                    }
                }
            });
        }
    });
}

// Check Authentication Status
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateAuthUI();
    }
}

// Update Authentication UI
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    if (currentUser && authButtons) {
        authButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user me-2"></i>${
                        currentUser.name ||
                        currentUser.first_name + ' ' + currentUser.last_name
                    }
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" onclick="viewProfile()">
                        <i class="fas fa-user me-2"></i>Profile
                    </a></li>
                    <li><a class="dropdown-item" href="#" onclick="viewBookings()">
                        <i class="fas fa-calendar me-2"></i>My Bookings
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt me-2"></i>Logout
                    </a></li>
                </ul>
            </div>
        `;
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('bookingData');
    localStorage.removeItem('bookingConfirmation');
    currentUser = null;
    alert('Logged out successfully!');
    location.reload();
}

// Load Properties
function loadProperties() {
    properties = sampleProperties;
    filteredProperties = [...properties];
    displayProperties();
}

// Display Properties
function displayProperties() {
    const container = document.getElementById('propertiesContainer');
    if (!container) return;

    if (filteredProperties.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search text-muted display-1"></i>
                <h4 class="text-muted mt-3">No properties found</h4>
                <p class="text-muted">Try adjusting your filters</p>
                <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProperties
        .map(
            property => `
        <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
            <div class="card property-card h-100">
                <div class="position-relative">
                    <img src="${
                        property.pictures[0]
                    }" class="card-img-top" alt="${
                property.title
            }" style="height: 250px; object-fit: cover;">
                    <div class="property-rating">
                        <i class="fas fa-star text-warning"></i>
                        ${property.rating}
                    </div>
                    <div class="property-type-badge position-absolute top-0 start-0 m-2">
                        <span class="badge bg-primary">${property.type}</span>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${property.title}</h5>
                    <p class="card-text text-muted">
                        <i class="fas fa-map-marker-alt me-2"></i>${
                            property.location
                        }
                    </p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="property-price">PKR ${property.price.toLocaleString()}/night</span>
                        <span class="text-muted small">${
                            property.city.charAt(0).toUpperCase() +
                            property.city.slice(1)
                        }</span>
                    </div>
                    <div class="property-amenities mb-3">
                        <small class="text-muted">
                            <i class="fas fa-users me-1"></i>${
                                property.max_guests
                            } guests
                            <i class="fas fa-bed ms-2 me-1"></i>${
                                property.bedrooms
                            } beds
                            <i class="fas fa-bath ms-2 me-1"></i>${
                                property.bathrooms
                            } baths
                        </small>
                    </div>
                    <div class="amenities-preview mb-3">
                        ${property.amenities
                            .slice(0, 3)
                            .map(
                                amenity => `
                            <span class="badge bg-light text-dark me-1">${amenity}</span>
                        `
                            )
                            .join('')}
                        ${
                            property.amenities.length > 3
                                ? `<span class="text-muted small">+${
                                      property.amenities.length - 3
                                  } more</span>`
                                : ''
                        }
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary flex-fill" onclick="viewProperty(${
                            property.id
                        })">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                        <button class="btn btn-primary flex-fill" onclick="bookProperty(${
                            property.id
                        })">
                            <i class="fas fa-calendar-check me-1"></i>Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
        )
        .join('');
}

// View Property Details
function viewProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="property-gallery mb-4">
            <div class="row g-2">
                ${property.pictures
                    .map(
                        (pic, index) => `
                    <div class="col-md-4">
                        <img src="${pic}" alt="${property.title}" class="img-fluid rounded" style="height: 200px; width: 100%; object-fit: cover;">
                    </div>
                `
                    )
                    .join('')}
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-12">
                <h3>${property.title}</h3>
                <p class="text-muted mb-3">
                    <i class="fas fa-map-marker-alt me-2"></i>${
                        property.location
                    }
                    <span class="badge bg-primary ms-2">${
                        property.city.charAt(0).toUpperCase() +
                        property.city.slice(1)
                    }</span>
                </p>
                
                <div class="property-info mb-4">
                    <div class="row g-3">
                        <div class="col-6 col-md-3">
                            <div class="info-item text-center">
                                <i class="fas fa-users text-primary fs-4"></i>
                                <h6 class="mt-2">Max Guests</h6>
                                <p class="mb-0">${property.max_guests}</p>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="info-item text-center">
                                <i class="fas fa-bed text-primary fs-4"></i>
                                <h6 class="mt-2">Bedrooms</h6>
                                <p class="mb-0">${property.bedrooms}</p>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="info-item text-center">
                                <i class="fas fa-bath text-primary fs-4"></i>
                                <h6 class="mt-2">Bathrooms</h6>
                                <p class="mb-0">${property.bathrooms}</p>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="info-item text-center">
                                <i class="fas fa-star text-warning fs-4"></i>
                                <h6 class="mt-2">Rating</h6>
                                <p class="mb-0">${property.rating}/5</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h5>Description</h5>
                <p class="mb-4">${property.description}</p>

                <h5>Amenities</h5>
                <div class="amenities-grid mb-4">
                    <div class="row g-2">
                        ${property.amenities
                            .map(
                                amenity => `
                            <div class="col-auto">
                                <span class="badge bg-primary">${amenity}</span>
                            </div>
                        `
                            )
                            .join('')}
                    </div>
                </div>
            </div>
            
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="text-primary">PKR ${property.price.toLocaleString()}/night</h4>
                        <hr>
                        <div class="broker-info">
                            <h6>Contact Broker</h6>
                            <p class="mb-1"><strong>${
                                property.broker_name
                            }</strong></p>
                            <p class="mb-1"><i class="fas fa-phone me-2"></i>${
                                property.broker_phone
                            }</p>
                            <p class="mb-0"><i class="fas fa-envelope me-2"></i>${
                                property.broker_email
                            }</p>
                        </div>
                        <button class="btn btn-primary w-100 mt-3" onclick="bookProperty(${
                            property.id
                        })">
                            <i class="fas fa-calendar-check me-2"></i>Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('propertyModal'));
    modal.show();
}

// Book Property
function bookProperty(propertyId) {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    // Store booking data in localStorage for booking page
    localStorage.setItem(
        'bookingData',
        JSON.stringify({
            property: property,
            user: currentUser,
        })
    );

    window.location.href = 'booking.html';
}

// Search Properties
function searchProperties() {
    const city = document.getElementById('cityFilter').value;
    const type = document.getElementById('typeFilter').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;

    let filtered = properties;

    if (city) {
        filtered = filtered.filter(p => p.city === city);
    }

    if (type) {
        filtered = filtered.filter(p => p.type === type);
    }

    // Validate dates
    if (checkin && checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);

        if (checkoutDate <= checkinDate) {
            alert('Check-out date must be after check-in date');
            return;
        }
    }

    filteredProperties = filtered;
    displayProperties();

    // Scroll to services section
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

// Apply Filters
function applyFilters() {
    const city = document.getElementById('filterCity').value;
    const type = document.getElementById('filterType').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice =
        parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const rating =
        parseFloat(document.getElementById('filterRating').value) || 0;

    filteredProperties = properties.filter(property => {
        return (
            (!city || property.city === city) &&
            (!type || property.type === type) &&
            property.price >= minPrice &&
            property.price <= maxPrice &&
            property.rating >= rating
        );
    });

    displayProperties();

    // Close offcanvas
    const offcanvas = bootstrap.Offcanvas.getInstance(
        document.getElementById('filterOffcanvas')
    );
    offcanvas?.hide();
}

// Clear Filters
function clearFilters() {
    // Clear filter inputs
    document.getElementById('filterCity').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('filterRating').value = '';

    // Clear search inputs
    document.getElementById('cityFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('checkin').value = '';
    document.getElementById('checkout').value = '';

    // Reset to all properties
    filteredProperties = [...properties];
    displayProperties();
}

// Toggle View
function toggleView(view) {
    currentView = view;
    const container = document.getElementById('propertiesContainer');
    const buttons = document.querySelectorAll('[onclick^="toggleView"]');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (view === 'list') {
        container.classList.add('list-view');
    } else {
        container.classList.remove('list-view');
    }
}

// Sort Properties
function sortProperties() {
    const sortBy = document.getElementById('sortBy').value;

    switch (sortBy) {
        case 'price_low':
            filteredProperties.sort((a, b) => a.price - b.price);
            break;
        case 'price_high':
            filteredProperties.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProperties.sort((a, b) => b.rating - a.rating);
            break;
    }

    displayProperties();
}

// Setup Event Listeners
function setupEventListeners() {
    // Sort change event
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', sortProperties);
    }

    // Filter change events
    const filters = ['cityFilter', 'typeFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', searchProperties);
        }
    });
}

// Newsletter Subscription
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    if (email && isValidEmail(email)) {
        alert('Thank you for subscribing to our newsletter!');
        document.getElementById('newsletterEmail').value = '';
    } else {
        alert('Please enter a valid email address');
    }
}

// Utility Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Profile and Bookings Functions
function viewProfile() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const modalContent = document.createElement('div');
    modalContent.innerHTML = `
        <div class="modal fade" id="profileModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-user me-2"></i>My Profile
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <h6 class="fw-bold text-primary mb-3">Personal Information</h6>
                                <div class="bg-light p-3 rounded">
                                    <div class="mb-2">
                                        <strong>Name:</strong> ${
                                            currentUser.name ||
                                            currentUser.first_name +
                                                ' ' +
                                                currentUser.last_name
                                        }
                                    </div>
                                    <div class="mb-2">
                                        <strong>Email:</strong> ${
                                            currentUser.email
                                        }
                                    </div>
                                    <div class="mb-2">
                                        <strong>Phone:</strong> ${
                                            currentUser.phone || 'Not provided'
                                        }
                                    </div>
                                    <div class="mb-2">
                                        <strong>User ID:</strong> ${
                                            currentUser.user_id
                                        }
                                    </div>
                                    <div class="mb-0">
                                        <strong>Member Since:</strong> ${new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h6 class="fw-bold text-primary mb-3">Account Status</h6>
                                <div class="bg-light p-3 rounded">
                                    <div class="mb-2">
                                        <strong>Status:</strong> 
                                        <span class="badge bg-success">Active</span>
                                    </div>
                                    <div class="mb-2">
                                        <strong>Account Type:</strong> Standard
                                    </div>
                                    <div class="mb-0">
                                        <strong>Verified:</strong> 
                                        <span class="badge bg-info">Email Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <hr class="my-4">
                        
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="card border-0 bg-primary text-white text-center">
                                    <div class="card-body">
                                        <i class="fas fa-calendar-check display-6"></i>
                                        <h6 class="mt-2">Total Bookings</h6>
                                        <h4 id="totalBookings">0</h4>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card border-0 bg-success text-white text-center">
                                    <div class="card-body">
                                        <i class="fas fa-star display-6"></i>
                                        <h6 class="mt-2">Avg Rating</h6>
                                        <h4>4.8</h4>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card border-0 bg-warning text-white text-center">
                                    <div class="card-body">
                                        <i class="fas fa-heart display-6"></i>
                                        <h6 class="mt-2">Favorites</h6>
                                        <h4>5</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary" onclick="editProfile()">
                            <i class="fas fa-edit me-2"></i>Edit Profile
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalContent);
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();

    // Load user's booking count
    loadUserBookingCount();

    // Clean up modal when closed
    document
        .getElementById('profileModal')
        .addEventListener('hidden.bs.modal', function () {
            document.body.removeChild(modalContent);
        });
}

function viewBookings() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const modalContent = document.createElement('div');
    modalContent.innerHTML = `
        <div class="modal fade" id="bookingsModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-calendar-check me-2"></i>My Bookings
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="bookingsContent">
                            <div class="text-center py-4">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <p class="mt-2">Loading your bookings...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalContent);
    const modal = new bootstrap.Modal(document.getElementById('bookingsModal'));
    modal.show();

    // Load user bookings
    loadUserBookings();

    // Clean up modal when closed
    document
        .getElementById('bookingsModal')
        .addEventListener('hidden.bs.modal', function () {
            document.body.removeChild(modalContent);
        });
}

// Load user booking count for profile
async function loadUserBookingCount() {
    try {
        const response = await fetch('booking.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_bookings',
                user_id: currentUser.user_id,
            }),
        });

        const result = await response.json();

        if (result.success && result.data.bookings) {
            document.getElementById('totalBookings').textContent =
                result.data.bookings.length;
        }
    } catch (error) {
        console.error('Error loading booking count:', error);
    }
}

// Load user bookings
async function loadUserBookings() {
    try {
        const response = await fetch('booking.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_bookings',
                user_id: currentUser.user_id,
            }),
        });

        const result = await response.json();
        const bookingsContent = document.getElementById('bookingsContent');

        if (result.success && result.data.bookings) {
            const bookings = result.data.bookings;

            if (bookings.length === 0) {
                bookingsContent.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-calendar-times text-muted display-1"></i>
                        <h4 class="text-muted mt-3">No Bookings Found</h4>
                        <p class="text-muted">You haven't made any bookings yet.</p>
                        <a href="index.html" class="btn btn-primary">Browse Properties</a>
                    </div>
                `;
            } else {
                bookingsContent.innerHTML = `
                    <div class="row g-4">
                        ${bookings
                            .map(
                                booking => `
                            <div class="col-md-6">
                                <div class="card border-0 shadow">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start mb-3">
                                            <h6 class="fw-bold">${
                                                booking.property_title
                                            }</h6>
                                            <span class="badge bg-${getStatusColor(
                                                booking.booking_status
                                            )}">${booking.booking_status}</span>
                                        </div>
                                        <p class="text-muted mb-2">
                                            <i class="fas fa-map-marker-alt me-2"></i>${
                                                booking.property_location
                                            }
                                        </p>
                                        <div class="row g-2 mb-3">
                                            <div class="col-6">
                                                <small class="text-muted">Check-in</small>
                                                <div class="fw-bold">${new Date(
                                                    booking.checkin_date
                                                ).toLocaleDateString()}</div>
                                            </div>
                                            <div class="col-6">
                                                <small class="text-muted">Check-out</small>
                                                <div class="fw-bold">${new Date(
                                                    booking.checkout_date
                                                ).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <small class="text-muted">Total Amount</small>
                                                <div class="fw-bold text-primary">PKR ${parseFloat(
                                                    booking.total_amount
                                                ).toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <small class="text-muted">Guests</small>
                                                <div class="fw-bold">${
                                                    booking.guests
                                                }</div>
                                            </div>
                                        </div>
                                        <div class="mt-3">
                                            <small class="text-muted">Booking ID: ${
                                                booking.booking_id
                                            }</small>
                                        </div>
                                        <div class="mt-3">
                                            <small class="text-muted">Booked on: ${new Date(
                                                booking.created_at
                                            ).toLocaleDateString()}</small>
                                        </div>
                                        ${
                                            booking.booking_status ===
                                                'confirmed' &&
                                            new Date(booking.checkin_date) >
                                                new Date()
                                                ? `
                                            <div class="mt-3">
                                                <button class="btn btn-outline-danger btn-sm" onclick="cancelBooking('${booking.booking_id}')">
                                                    <i class="fas fa-times me-1"></i>Cancel Booking
                                                </button>
                                            </div>
                                        `
                                                : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        `
                            )
                            .join('')}
                    </div>
                `;
            }
        } else {
            bookingsContent.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle text-warning display-1"></i>
                    <h4 class="text-muted mt-3">Error Loading Bookings</h4>
                    <p class="text-muted">${
                        result.message ||
                        'Unable to load your bookings at this time.'
                    }</p>
                    <button class="btn btn-primary" onclick="loadUserBookings()">Try Again</button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        const bookingsContent = document.getElementById('bookingsContent');
        bookingsContent.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle text-danger display-1"></i>
                <h4 class="text-muted mt-3">Connection Error</h4>
                <p class="text-muted">Unable to connect to the server. Please check your internet connection.</p>
                <button class="btn btn-primary" onclick="loadUserBookings()">Try Again</button>
            </div>
        `;
    }
}

// Get status color for booking status badge
function getStatusColor(status) {
    switch (status) {
        case 'confirmed':
            return 'success';
        case 'pending':
            return 'warning';
        case 'cancelled':
            return 'danger';
        case 'completed':
            return 'info';
        default:
            return 'secondary';
    }
}

// Cancel booking function
async function cancelBooking(bookingId) {
    if (
        !confirm(
            'Are you sure you want to cancel this booking? This action cannot be undone.'
        )
    ) {
        return;
    }

    try {
        const response = await fetch('booking.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'cancel_booking',
                booking_id: bookingId,
                user_id: currentUser.user_id,
            }),
        });

        const result = await response.json();

        if (result.success) {
            alert('Booking cancelled successfully!');
            loadUserBookings(); // Reload bookings
        } else {
            alert(
                result.message || 'Failed to cancel booking. Please try again.'
            );
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert(
            'An error occurred while cancelling the booking. Please try again.'
        );
    }
}

// Edit profile function
function editProfile() {
    alert('Profile editing feature will be available soon!');
}

// City Selection for Homepage
function selectCity(city) {
    const cityFilter = document.getElementById('cityFilter');
    if (cityFilter) {
        cityFilter.value = city === 'all' ? '' : city;
        searchProperties();
    }
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});
const testimonialsSwiper = new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
    effect: 'slide',
    speed: 800,
});
// Error Handling
window.addEventListener('error', function (e) {
    console.error('Global error:', e.error);
});

// Offline Detection
window.addEventListener('online', function () {
    console.log('Back online');
});

window.addEventListener('offline', function () {
    console.log('Gone offline');
    alert('You are offline. Some features may not work properly.');
});
