const seedApplications = () => {
  const now = new Date();
  const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  const applications = [
    {
      id: 'APP_2025_001',
      fullName: 'John Doe',
      email: 'customer@udevs.com',
      cnic: '12345-6789012-3',
      cellNumber: '+92-300-1234567',
      address: '123 Main Street, Gulberg III',
      city: 'Lahore',
      selectedCar: '2025 Toyota Corolla Grande',
      selectedCarId: 'CAR_TOYOTA001',
      selectedColor: 'White',
      status: 'pending',
      notes: 'Interested in priority delivery and registration assistance.',
      statusHistory: [
        {
          status: 'pending',
          timestamp: daysAgo(2),
          notes: 'Application received online via customer portal'
        }
      ],
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2)
    },
    {
      id: 'APP_2025_002',
      fullName: 'John Doe',
      email: 'customer@udevs.com',
      cnic: '12345-6789012-3',
      cellNumber: '+92-300-1234567',
      address: '123 Main Street, Gulberg III',
      city: 'Lahore',
      selectedCar: '2025 Honda Civic Turbo',
      selectedCarId: 'CAR_HONDA001',
      selectedColor: 'Black',
      status: 'approved',
      notes: 'Customer verified. Payment invoice generated.',
      statusHistory: [
        {
          status: 'pending',
          timestamp: daysAgo(5),
          notes: 'Application submitted'
        },
        {
          status: 'approved',
          timestamp: daysAgo(3),
          notes: 'Credit and identity documents verified by Sales Manager'
        }
      ],
      createdAt: daysAgo(5),
      updatedAt: daysAgo(3)
    },
    {
      id: 'APP_2025_003',
      fullName: 'Sarah Ahmed',
      email: 'sarah.ahmed@email.com',
      cnic: '23456-7890123-4',
      cellNumber: '+92-301-2345678',
      address: '456 Garden Road, F-7/2',
      city: 'Islamabad',
      selectedCar: '2025 Hyundai Tucson FWD',
      selectedCarId: 'CAR_HYUNDAI002',
      selectedColor: 'Gray',
      status: 'reserved',
      notes: 'Initial booking deposit received. Vehicle kept in holding bay.',
      statusHistory: [
        {
          status: 'pending',
          timestamp: daysAgo(8),
          notes: 'Application received'
        },
        {
          status: 'approved',
          timestamp: daysAgo(7),
          notes: 'Approved for booking'
        },
        {
          status: 'reserved',
          timestamp: daysAgo(4),
          notes: '20% token deposit received, car reserved'
        }
      ],
      createdAt: daysAgo(8),
      updatedAt: daysAgo(4)
    },
    {
      id: 'APP_2025_004',
      fullName: 'Ali Khan',
      email: 'ali.khan@email.com',
      cnic: '34567-8901234-5',
      cellNumber: '+92-302-3456789',
      address: '789 Mall Road, Clifton',
      city: 'Karachi',
      selectedCar: '2025 Toyota Corolla VTi',
      selectedCarId: 'CAR_TOYOTA002',
      selectedColor: 'Silver',
      status: 'completed',
      notes: 'Vehicle delivered with complete documentation and warranty booklet.',
      statusHistory: [
        {
          status: 'pending',
          timestamp: daysAgo(15),
          notes: 'Application submitted'
        },
        {
          status: 'approved',
          timestamp: daysAgo(13),
          notes: 'Approved'
        },
        {
          status: 'reserved',
          timestamp: daysAgo(10),
          notes: 'Downpayment paid'
        },
        {
          status: 'completed',
          timestamp: daysAgo(6),
          notes: 'Full payment cleared and vehicle keys handed over'
        }
      ],
      createdAt: daysAgo(15),
      updatedAt: daysAgo(6)
    },
    {
      id: 'APP_2025_005',
      fullName: 'Hamza Tariq',
      email: 'hamza.tariq@email.com',
      cnic: '35201-9876543-1',
      cellNumber: '+92-333-4567890',
      address: 'House 42, Sector Y, DHA Phase 3',
      city: 'Lahore',
      selectedCar: '2025 Suzuki Cultus VXR',
      selectedCarId: 'CAR_SUZUKI001',
      selectedColor: 'Red',
      status: 'rejected',
      notes: 'Applicant requested cancellation due to personal relocation.',
      statusHistory: [
        {
          status: 'pending',
          timestamp: daysAgo(12),
          notes: 'Application submitted'
        },
        {
          status: 'rejected',
          timestamp: daysAgo(11),
          notes: 'Application cancelled upon customer request'
        }
      ],
      createdAt: daysAgo(12),
      updatedAt: daysAgo(11)
    }
  ];

  return applications;
};

export default seedApplications;
