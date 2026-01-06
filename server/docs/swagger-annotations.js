/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization
 *   - name: Users
 *     description: User management
 *   - name: Staff
 *     description: Staff management
 *   - name: Units
 *     description: Unit/Apartment management
 *   - name: Tickets
 *     description: Maintenance ticket management
 *   - name: Bills
 *     description: Billing and payment management
 *   - name: Visitors
 *     description: Visitor check-in/out management
 *   - name: Facilities
 *     description: Facility and booking management
 *   - name: Notices
 *     description: Notice and announcement management
 *   - name: Polls
 *     description: Poll and voting management
 *   - name: Vendors
 *     description: Vendor management
 *   - name: Documents
 *     description: Document management
 *   - name: Parking
 *     description: Parking slot management
 *   - name: Emergency
 *     description: Emergency contact information
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@apt.com
 *               password:
 *                 type: string
 *                 example: pass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *               - unitNumber
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@apt.com
 *               password:
 *                 type: string
 *                 example: pass123
 *               role:
 *                 type: string
 *                 enum: [resident, management, security, maintenance]
 *                 example: security
 *               unitNumber:
 *                 type: string
 *                 example: Gate-1
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: User already exists

 */
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [resident, management, security, maintenance]
 *               unitNumber:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User removed
 *       404:
 *         description: User not found

 */
/**
 * @swagger
 * /api/users/staff/all:
 *   get:
 *     summary: Get all staff members
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of staff
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object

 */
/**
 * @swagger
 * /api/users/staff:
 *   post:
 *     summary: Add new staff member (Admin only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *               - phone
 *               - shift
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rajesh Kumar
 *               role:
 *                 type: string
 *                 example: Security Guard
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               shift:
 *                 type: string
 *                 example: Day (6AM-6PM)
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Staff created

 */
/**
 * @swagger
 * /api/users/staff/{id}:
 *   put:
 *     summary: Update staff member (Admin only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *               shift:
 *                 type: string
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Staff updated
 *       404:
 *         description: Staff not found
 *   delete:
 *     summary: Delete staff member (Admin only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff removed
 *       404:
 *         description: Staff not found
 */

/**
 * @swagger
 * /api/units:
 *   get:
 *     summary: Get all units
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of units
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Unit'
 *   post:
 *     summary: Create new unit (Admin only)
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - block
 *               - floor
 *               - type
 *             properties:
 *               number:
 *                 type: string
 *                 example: A-101
 *               block:
 *                 type: string
 *                 example: A
 *               floor:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 example: 3BHK
 *               ownerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Unit created

 */
/**
 * @swagger
 * /api/units/{id}:
 *   get:
 *     summary: Get unit by ID
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unit details
 *       404:
 *         description: Unit not found
 *   put:
 *     summary: Update unit (Admin only)
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *               block:
 *                 type: string
 *               floor:
 *                 type: integer
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unit updated
 *   delete:
 *     summary: Delete unit (Admin only)
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unit removed

 */
/**
 * @swagger
 * /api/units/{id}/family:
 *   post:
 *     summary: Add family member to unit
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - relation
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mary Smith
 *               relation:
 *                 type: string
 *                 example: Spouse
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *     responses:
 *       200:
 *         description: Family member added

 */
/**
 * @swagger
 * /api/units/{id}/family/{index}:
 *   put:
 *     summary: Update family member
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               relation:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Family member updated
 *   delete:
 *     summary: Delete family member
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Family member removed

 */
/**
 * @swagger
 * /api/units/{id}/vehicles:
 *   post:
 *     summary: Add vehicle to unit
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - make
 *               - model
 *               - number
 *             properties:
 *               type:
 *                 type: string
 *                 example: car
 *               make:
 *                 type: string
 *                 example: Toyota
 *               model:
 *                 type: string
 *                 example: Camry
 *               number:
 *                 type: string
 *                 example: ABC-1234
 *               parkingSlot:
 *                 type: string
 *                 example: P-A101
 *     responses:
 *       200:
 *         description: Vehicle added

 */
/**
 * @swagger
 * /api/units/{id}/vehicles/{index}:
 *   put:
 *     summary: Update vehicle
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               number:
 *                 type: string
 *               parkingSlot:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle updated
 *   delete:
 *     summary: Delete vehicle
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle removed

 */
/**
 * @swagger
 * /api/units/{id}/pets:
 *   post:
 *     summary: Add pet to unit
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Max
 *               type:
 *                 type: string
 *                 example: Dog
 *               breed:
 *                 type: string
 *                 example: Golden Retriever
 *     responses:
 *       200:
 *         description: Pet added

 */
/**
 * @swagger
 * /api/units/{id}/pets/{index}:
 *   delete:
 *     summary: Delete pet
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet removed
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *   post:
 *     summary: Create new ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - subject
 *               - description
 *               - priority
 *               - unitId
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [plumbing, electrical, cleaning, elevator, security, other]
 *                 example: plumbing
 *               subject:
 *                 type: string
 *                 example: Leaking faucet
 *               description:
 *                 type: string
 *                 example: Kitchen faucet is leaking continuously
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 example: medium
 *               unitId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created

 */
/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Update ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in-progress, resolved]
 *                 example: in-progress
 *               assignedToId:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket updated
 *       404:
 *         description: Ticket not found
 */

/**
 * @swagger
 * /api/bills:
 *   get:
 *     summary: Get all bills
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *   post:
 *     summary: Create new bill (Admin only)
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unitId
 *               - type
 *               - amount
 *               - dueDate
 *             properties:
 *               unitId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [maintenance, water, gas, common]
 *               amount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *               month:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bill created

 */
/**
 * @swagger
 * /api/bills/{id}:
 *   put:
 *     summary: Update bill (Admin only)
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [paid, pending, overdue]
 *     responses:
 *       200:
 *         description: Bill updated
 *   delete:
 *     summary: Delete bill (Admin only)
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bill removed

 */
/**
 * @swagger
 * /api/bills/{id}/pay:
 *   put:
 *     summary: Pay a bill
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bill paid successfully
 *       404:
 *         description: Bill not found
 */

/**
 * @swagger
 * /api/visitors:
 *   get:
 *     summary: Get all visitors
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of visitors
 */

/**
 * @swagger
 * /api/visitors/checkin:
 *   post:
 *     summary: Check-in a visitor
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - unitId
 *               - purpose
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               unitId:
 *                 type: string
 *               purpose:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [visitor, delivery, service]
 *               vehicleNumber:
 *                 type: string
 *               preApproved:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Visitor checked in

 */
/**
 * @swagger
 * /api/visitors/{id}:
 *   put:
 *     summary: Update visitor
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               purpose:
 *                 type: string
 *     responses:
 *       200:
 *         description: Visitor updated
 *   delete:
 *     summary: Delete visitor
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitor removed

 */
/**
 * @swagger
 * /api/visitors/{id}/checkout:
 *   put:
 *     summary: Check-out a visitor
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitor checked out
 */

/**
 * @swagger
 * /api/facilities:
 *   get:
 *     summary: Get all facilities
 *     tags: [Facilities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of facilities
 *   post:
 *     summary: Create facility (Admin only)
 *     tags: [Facilities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               timings:
 *                 type: string
 *               isPaid:
 *                 type: boolean
 *               pricePerHour:
 *                 type: number
 *     responses:
 *       201:
 *         description: Facility created

 */
/**
 * @swagger
 * /api/facilities/{id}:
 *   put:
 *     summary: Update facility (Admin only)
 *     tags: [Facilities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               timings:
 *                 type: string
 *     responses:
 *       200:
 *         description: Facility updated
 *   delete:
 *     summary: Delete facility (Admin only)
 *     tags: [Facilities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Facility removed

 */
/**
 * @swagger
 * /api/facilities/bookings:
 *   get:
 *     summary: Get all facility bookings
 *     tags: [Facilities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *   post:
 *     summary: Create facility booking
 *     tags: [Facilities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - facilityId
 *               - unitId
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               facilityId:
 *                 type: string
 *               unitId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               purpose:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created

 */
/**
 * @swagger
 * /api/facilities/bookings/{id}:
 *   put:
 *     summary: Update facility booking (Admin only)
 *     tags: [Facilities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated
 *   delete:
 *     summary: Delete facility booking (Admin only)
 *     tags: [Facilities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking removed
 */

/**
 * @swagger
 * /api/notices:
 *   get:
 *     summary: Get all notices
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notices
 *   post:
 *     summary: Create notice (Admin only)
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [notice, event, alert]
 *               important:
 *                 type: boolean
 *               eventDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Notice created

/**
 * @swagger
 * /api/notices/{id}:
 *   put:
 *     summary: Update notice (Admin only)
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               important:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notice updated
 *   delete:
 *     summary: Delete notice (Admin only)
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notice removed
 */

/**
 * @swagger
 * /api/polls:
 *   get:
 *     summary: Get all polls
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of polls
 *   post:
 *     summary: Create poll (Admin only)
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - options
 *               - endsAt
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     votes:
 *                       type: integer
 *               endsAt:
 *                 type: string
 *                 format: date
 *               isAnonymous:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Poll created

/**
 * @swagger
 * /api/polls/{id}:
 *   put:
 *     summary: Update poll (Admin only)
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               endsAt:
 *                 type: string
 *     responses:
 *       200:
 *         description: Poll updated
 *   delete:
 *     summary: Delete poll (Admin only)
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Poll removed

/**
 * @swagger
 * /api/polls/{id}/vote:
 *   post:
 *     summary: Vote on a poll
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - optionIndex
 *             properties:
 *               optionIndex:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vote recorded
 *       400:
 *         description: Already voted or invalid option
 */

/**
 * @swagger
 * /api/vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendors
 *   post:
 *     summary: Create vendor (Admin only)
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Vendor created

/**
 * @swagger
 * /api/vendors/{id}:
 *   put:
 *     summary: Update vendor (Admin only)
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Vendor updated
 *   delete:
 *     summary: Delete vendor (Admin only)
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor removed
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents
 *   post:
 *     summary: Upload document (Admin only)
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - fileType
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [rules, minutes, budget, other]
 *               fileType:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document created
 */

/**
 * @swagger
 * /api/parking:
 *   get:
 *     summary: Get all parking slots
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of parking slots
 *   post:
 *     summary: Create parking slot (Admin only)
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slotNumber
 *               - type
 *             properties:
 *               slotNumber:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [resident, visitor]
 *               assignedTo:
 *                 type: string
 *               vehicleNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Parking slot created

/**
 * @swagger
 * /api/parking/{id}:
 *   put:
 *     summary: Update parking slot (Admin only)
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedTo:
 *                 type: string
 *               vehicleNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parking slot updated
 */

/**
 * @swagger
 * /api/emergency:
 *   get:
 *     summary: Get emergency contacts
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of emergency contacts
 */

module.exports = {};
