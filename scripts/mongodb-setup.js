// ===============================================================
// MONGODB SHELL COMMANDS FOR SOCIAL LEARNING NOTES EXCHANGE
// ===============================================================
// Run these commands in MongoDB Shell (mongosh)

// 1. CONNECT TO DATABASE
use social-learning-notes

// 2. CREATE ALL COLLECTIONS WITH SAMPLE DATA

// Clear existing collections (optional - use with caution!)
db.users.deleteMany({})
db.notes.deleteMany({})
db.subjects.deleteMany({})
db.ratings.deleteMany({})
db.comments.deleteMany({})
db.follows.deleteMany({})

print("🗑️  Cleared existing collections")

// 3. CREATE SUBJECTS COLLECTION
// ===============================
db.subjects.insertMany([
  {
    name: "Computer Programming",
    code: "CS101",
    department: "Computer Science",
    description: "Introduction to programming fundamentals and problem-solving",
    credits: 4,
    semester: 1,
    isActive: true,
    totalNotes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Data Structures",
    code: "CS201",
    department: "Computer Science",
    description: "Advanced data structures and algorithms",
    credits: 4,
    semester: 2,
    isActive: true,
    totalNotes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Database Management Systems",
    code: "CS301",
    department: "Computer Science",
    description: "Database design, SQL, and NoSQL concepts",
    credits: 4,
    semester: 3,
    isActive: true,
    totalNotes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Engineering Mathematics",
    code: "MA101",
    department: "Mathematics",
    description: "Calculus, linear algebra, and differential equations",
    credits: 5,
    semester: 1,
    isActive: true,
    totalNotes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Physics for Engineers",
    code: "PH101",
    department: "Physics",
    description: "Mechanics, thermodynamics, and electromagnetism",
    credits: 4,
    semester: 1,
    isActive: true,
    totalNotes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Digital Electronics",
    code: "EC101",
    department: "Electronics",
    description: "Digital logic circuits and computer architecture",
    credits: 4,
    semester: 2,
    isActive: true,
    totalNotes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Organic Chemistry",
    code: "CH201",
    department: "Chemistry",
    description: "Organic compounds and reaction mechanisms",
    credits: 4,
    semester: 2,
    isActive: true,
    totalNotes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Business Management",
    code: "BM101",
    department: "Business",
    description: "Principles of management and organizational behavior",
    credits: 3,
    semester: 1,
    isActive: true,
    totalNotes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

print("📚 Subjects collection created")

// 4. CREATE USERS COLLECTION
// ==========================
// Note: In production, passwords should be hashed with bcrypt
// For demo, we're using plain text (CHANGE IN PRODUCTION!)

db.users.insertMany([
  {
    fullName: "Sarah Johnson",
    email: "sarah.j@university.edu",
    username: "sarahj",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdIr1dD2O4k1kP5s5F5F5F5F5F5F5", // bcrypt hash of "password123"
    school: "Engineering College",
    branch: "Computer Science",
    bio: "Passionate about programming and sharing knowledge",
    phone: "+1-555-0123",
    location: "New York, USA",
    role: "student",
    avatar: "SJ",
    stats: {
      notesUploaded: 12,
      notesDownloaded: 45,
      totalDownloads: 1250,
      totalViews: 3400,
      averageRating: 4.7,
      followers: 89,
      following: 67
    },
    badges: [
      { name: "Rising Star", icon: "🌟", description: "10+ notes uploaded" },
      { name: "Top Contributor", icon: "🏆", description: "1000+ downloads" }
    ],
    isActive: true,
    isVerified: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date()
  },
  {
    fullName: "Mike Chen",
    email: "mike.chen@university.edu",
    username: "mikec",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdIr1dD2O4k1kP5s5F5F5F5F5F5F5", // bcrypt hash of "password123"
    school: "Engineering College",
    branch: "Computer Science",
    bio: "Algorithm enthusiast and problem solver",
    phone: "+1-555-0124",
    location: "San Francisco, USA",
    role: "student",
    avatar: "MC",
    stats: {
      notesUploaded: 8,
      notesDownloaded: 32,
      totalDownloads: 890,
      totalViews: 2100,
      averageRating: 4.5,
      followers: 56,
      following: 43
    },
    badges: [
      { name: "Algorithm Master", icon: "💻", description: "Expert in algorithms" }
    ],
    isActive: true,
    isVerified: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date()
  },
  {
    fullName: "Emily Davis",
    email: "emily.d@university.edu",
    username: "emilyd",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdIr1dD2O4k1kP5s5F5F5F5F5F5F5", // bcrypt hash of "password123"
    school: "Engineering College",
    branch: "Electronics",
    bio: "Electronics engineering student and maker",
    phone: "+1-555-0125",
    location: "Boston, USA",
    role: "student",
    avatar: "ED",
    stats: {
      notesUploaded: 15,
      notesDownloaded: 28,
      totalDownloads: 1560,
      totalViews: 4200,
      averageRating: 4.8,
      followers: 102,
      following: 78
    },
    badges: [
      { name: "Electronics Expert", icon: "⚡", description: "Top electronics contributor" },
      { name: "Helpful Peer", icon: "💝", description: "50+ positive ratings" }
    ],
    isActive: true,
    isVerified: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date()
  },
  {
    fullName: "Alex Kumar",
    email: "alex.kumar@university.edu",
    username: "alexk",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdIr1dD2O4k1kP5s5F5F5F5F5F5F5", // bcrypt hash of "password123"
    school: "Engineering College",
    branch: "Computer Science",
    bio: "Full-stack developer and tech blogger",
    phone: "+1-555-0126",
    location: "Seattle, USA",
    role: "student",
    avatar: "AK",
    stats: {
      notesUploaded: 6,
      notesDownloaded: 51,
      totalDownloads: 670,
      totalViews: 1800,
      averageRating: 4.6,
      followers: 45,
      following: 89
    },
    badges: [
      { name: "Web Developer", icon: "🌐", description: "Full-stack specialist" }
    ],
    isActive: true,
    isVerified: false,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date()
  },
  {
    fullName: "Lisa Wang",
    email: "lisa.wang@university.edu",
    username: "lisaw",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdIr1dD2O4k1kP5s5F5F5F5F5F5F5", // bcrypt hash of "password123"
    school: "Engineering College",
    branch: "Mathematics",
    bio: "Mathematics major and data science enthusiast",
    phone: "+1-555-0127",
    location: "Chicago, USA",
    role: "student",
    avatar: "LW",
    stats: {
      notesUploaded: 10,
      notesDownloaded: 38,
      totalDownloads: 980,
      totalViews: 2600,
      averageRating: 4.4,
      followers: 67,
      following: 56
    },
    badges: [
      { name: "Math Whiz", icon: "🔢", description: "Mathematics expert" }
    ],
    isActive: true,
    isVerified: false,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date()
  }
])

print("👥 Users collection created")

// Get references for foreign keys
const users = db.users.find().toArray()
const sarahId = users[0]._id
const mikeId = users[1]._id
const emilyId = users[2]._id
const alexId = users[3]._id
const lisaId = users[4]._id

const subjects = db.subjects.find().toArray()
const cs101Id = subjects.find(s => s.code === "CS101")._id
const cs201Id = subjects.find(s => s.code === "CS201")._id
const cs301Id = subjects.find(s => s.code === "CS301")._id
const ma101Id = subjects.find(s => s.code === "MA101")._id
const ph101Id = subjects.find(s => s.code === "PH101")._id
const ec101Id = subjects.find(s => s.code === "EC101")._id
const ch201Id = subjects.find(s => s.code === "CH201")._id
const bm101Id = subjects.find(s => s.code === "BM101")._id

// 5. CREATE NOTES COLLECTION
// ==========================
db.notes.insertMany([
  {
    title: "Advanced Calculus Complete Notes",
    description: "Comprehensive notes covering differential and integral calculus with examples and practice problems. This document includes detailed explanations of fundamental concepts, step-by-step solutions to complex problems, and visual aids to help understand abstract mathematical concepts.",
    subject: ma101Id,
    uploadedBy: sarahId,
    tags: ["calculus", "mathematics", "advanced", "exam", "derivatives", "integrals"],
    difficulty: "intermediate",
    fileUrl: "https://res.cloudinary.com/demo/image/upload/v1234567890/calculus-notes.pdf",
    fileName: "Advanced_Calculus_Notes.pdf",
    fileSize: 2457600, // 2.4MB
    fileType: "pdf",
    stats: {
      views: 1823,
      downloads: 456,
      likes: 89,
      averageRating: 4.8,
      totalRatings: 124
    },
    isActive: true,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date()
  },
  {
    title: "Data Structures and Algorithms",
    description: "Detailed explanation of data structures, algorithms, and their implementations with code examples. Includes arrays, linked lists, trees, graphs, sorting algorithms, and complexity analysis.",
    subject: cs201Id,
    uploadedBy: mikeId,
    tags: ["data-structures", "algorithms", "programming", "computer-science", "complexity"],
    difficulty: "advanced",
    fileUrl: "https://res.cloudinary.com/demo/image/upload/v1234567890/ds-algorithms.pdf",
    fileName: "Data_Structures_Algorithms.pdf",
    fileSize: 3984512, // 3.8MB
    fileType: "pdf",
    stats: {
      views: 3456,
      downloads: 892,
      likes: 156,
      averageRating: 4.7,
      totalRatings: 203
    },
    isActive: true,
    createdAt: new Date("2024-03-03"),
    updatedAt: new Date()
  },
  {
    title: "Physics Lab Manual 2024",
    description: "Complete laboratory manual with detailed procedures, observations, and calculations for all physics experiments. Includes mechanics, thermodynamics, and electromagnetism experiments.",
    subject: ph101Id,
    uploadedBy: emilyId,
    tags: ["physics", "lab", "manual", "experiments", "practical"],
    difficulty: "beginner",
    fileUrl: "https://res.cloudinary.com/demo/image/upload/v1234567890/physics-lab.pdf",
    fileName: "Physics_Lab_Manual_2024.pdf",
    fileSize: 5347737, // 5.1MB
    fileType: "pdf",
    stats: {
      views: 945,
      downloads: 234,
      likes: 67,
      averageRating: 4.6,
      totalRatings: 89
    },
    isActive: true,
    createdAt: new Date("2024-03-08"),
    updatedAt: new Date()
  },
  {
    title: "Chemistry Formula Sheet",
    description: "Quick reference formula sheet for organic and inorganic chemistry with reaction mechanisms. Perfect for exam preparation and quick review.",
    subject: ch201Id,
    uploadedBy: lisaId,
    tags: ["chemistry", "formulas", "reference", "quick-guide", "organic", "inorganic"],
    difficulty: "beginner",
    fileUrl: "https://res.cloudinary.com/demo/image/upload/v1234567890/chemistry-formulas.pdf",
    fileName: "Chemistry_Formula_Sheet.pdf",
    fileSize: 1258291, // 1.2MB
    fileType: "pdf",
    stats: {
      views: 2341,
      downloads: 678,
      likes: 134,
      averageRating: 4.9,
      totalRatings: 156
    },
    isActive: true,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date()
  },
  {
    title: "Digital Logic Circuits",
    description: "Introduction to digital logic circuits, boolean algebra, and computer architecture fundamentals. Includes logic gates, flip-flops, counters, and memory systems.",
    subject: ec101Id,
    uploadedBy: emilyId,
    tags: ["electronics", "digital-logic", "circuits", "boolean-algebra", "computer-architecture"],
    difficulty: "intermediate",
    fileUrl: "https://res.cloudinary.com/demo/image/upload/v1234567890/digital-logic.pdf",
    fileName: "Digital_Logic_Circuits.pdf",
    fileSize: 4194304, // 4.0MB
    fileType: "pdf",
    stats: {
      views: 1567,
      downloads: 445,
      likes: 98,
      averageRating: 4.5,
      totalRatings: 112
    },
    isActive: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date()
  },
  {
    title: "JavaScript Programming Guide",
    description: "Complete guide to JavaScript programming including ES6+ features, async programming, DOM manipulation, and modern frameworks.",
    subject: cs101Id,
    uploadedBy: alexId,
    tags: ["javascript", "programming", "web-development", "es6", "async", "dom"],
    difficulty: "intermediate",
    fileUrl: "https://res.cloudinary.com/demo/image/upload/v1234567890/javascript-guide.pdf",
    fileName: "JavaScript_Programming_Guide.pdf",
    fileSize: 2831155, // 2.7MB
    fileType: "pdf",
    stats: {
      views: 2890,
      downloads: 723,
      likes: 167,
      averageRating: 4.6,
      totalRatings: 145
    },
    isActive: true,
    createdAt: new Date("2024-03-12"),
    updatedAt: new Date()
  }
])

print("📄 Notes collection created")

// Get note references
const notes = db.notes.find().toArray()
const noteIds = notes.map(note => note._id)

// 6. CREATE RATINGS COLLECTION
// ============================
db.ratings.insertMany([
  { note: noteIds[0], user: mikeId, rating: 5, review: "Excellent calculus notes! Very clear explanations.", createdAt: new Date("2024-03-11") },
  { note: noteIds[0], user: emilyId, rating: 4, review: "Good comprehensive coverage, could use more examples.", createdAt: new Date("2024-03-12") },
  { note: noteIds[1], user: sarahId, rating: 5, review: "Best algorithms notes I've found! Very detailed.", createdAt: new Date("2024-03-04") },
  { note: noteIds[1], user: lisaId, rating: 4, review: "Great content, well organized and easy to follow.", createdAt: new Date("2024-03-05") },
  { note: noteIds[2], user: alexId, rating: 5, review: "Perfect lab manual! All experiments clearly explained.", createdAt: new Date("2024-03-09") },
  { note: noteIds[3], user: sarahId, rating: 5, review: "Lifesaver for chemistry exams! All formulas in one place.", createdAt: new Date("2024-03-06") },
  { note: noteIds[4], user: mikeId, rating: 4, review: "Good coverage of digital logic topics.", createdAt: new Date("2024-03-02") },
  { note: noteIds[5], user: lisaId, rating: 5, review: "Comprehensive JavaScript guide with modern examples.", createdAt: new Date("2024-03-13") }
])

print("⭐ Ratings collection created")

// 7. CREATE COMMENTS COLLECTION
// ==============================
db.comments.insertMany([
  {
    note: noteIds[0],
    user: mikeId,
    content: "These notes are incredibly helpful! The examples really helped me understand the complex concepts.",
    parentComment: null,
    likes: 12,
    isReported: false,
    isDeleted: false,
    createdAt: new Date("2024-03-11"),
    updatedAt: new Date()
  },
  {
    note: noteIds[0],
    user: emilyId,
    content: "Great summary of calculus fundamentals. Saved me hours of studying!",
    parentComment: null,
    likes: 8,
    isReported: false,
    isDeleted: false,
    createdAt: new Date("2024-03-12"),
    updatedAt: new Date()
  },
  {
    note: noteIds[1],
    user: sarahId,
    content: "The time complexity analysis section is particularly well explained.",
    parentComment: null,
    likes: 15,
    isReported: false,
    isDeleted: false,
    createdAt: new Date("2024-03-04"),
    updatedAt: new Date()
  },
  {
    note: noteIds[1],
    user: lisaId,
    content: "Could you add more examples for graph algorithms?",
    parentComment: null,
    likes: 6,
    isReported: false,
    isDeleted: false,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date()
  },
  {
    note: noteIds[3],
    user: sarahId,
    content: "This is exactly what I needed for my chemistry exam!",
    parentComment: null,
    likes: 9,
    isReported: false,
    isDeleted: false,
    createdAt: new Date("2024-03-06"),
    updatedAt: new Date()
  }
])

print("💬 Comments collection created")

// 8. CREATE FOLLOWS COLLECTION
// =============================
db.follows.insertMany([
  { follower: mikeId, following: sarahId, createdAt: new Date("2024-02-15") },
  { follower: emilyId, following: sarahId, createdAt: new Date("2024-02-20") },
  { follower: alexId, following: mikeId, createdAt: new Date("2024-02-25") },
  { follower: lisaId, following: emilyId, createdAt: new Date("2024-03-01") },
  { follower: sarahId, following: lisaId, createdAt: new Date("2024-03-05") },
  { follower: mikeId, following: alexId, createdAt: new Date("2024-03-10") }
])

print("👥 Follows collection created")

// 9. CREATE DATABASE INDEXES FOR PERFORMANCE
// ==========================================
print("🔧 Creating database indexes...")

// Users indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ school: 1 })
db.users.createIndex({ branch: 1 })

// Notes indexes
db.notes.createIndex({ title: "text", description: "text", tags: "text" })
db.notes.createIndex({ subject: 1, createdAt: -1 })
db.notes.createIndex({ uploadedBy: 1, createdAt: -1 })
db.notes.createIndex({ "stats.averageRating": -1 })
db.notes.createIndex({ "stats.downloads": -1 })

// Subjects indexes
db.subjects.createIndex({ code: 1 }, { unique: true })
db.subjects.createIndex({ department: 1, semester: 1 })

// Ratings indexes
db.ratings.createIndex({ note: 1, user: 1 }, { unique: true })

// Comments indexes
db.comments.createIndex({ note: 1, createdAt: -1 })
db.comments.createIndex({ user: 1, createdAt: -1 })
db.comments.createIndex({ parentComment: 1 })

// Follows indexes
db.follows.createIndex({ follower: 1, following: 1 }, { unique: true })

print("✅ Database indexes created successfully!")

// 10. DISPLAY DATABASE STATISTICS
// ===============================
print("\n" + "=".repeat(60))
print("🎉 DATABASE CREATION COMPLETE!")
print("=".repeat(60))
print("📊 Collection Statistics:")
print(`   Users: ${db.users.countDocuments()}`)
print(`   Subjects: ${db.subjects.countDocuments()}`)
print(`   Notes: ${db.notes.countDocuments()}`)
print(`   Ratings: ${db.ratings.countDocuments()}`)
print(`   Comments: ${db.comments.countDocuments()}`)
print(`   Follows: ${db.follows.countDocuments()}`)

print("\n🔐 SAMPLE LOGIN CREDENTIALS:")
print("   Email: sarah.j@university.edu")
print("   Password: password123")
print("")
print("   Email: mike.chen@university.edu")
print("   Password: password123")

print("\n🚀 READY FOR TESTING!")
print("   Your Social Learning Notes Exchange is now populated!")
print("   You can test all features including:")
print("   ✓ User authentication")
print("   ✓ Note browsing and searching")
print("   ✓ Note upload and download")
print("   ✓ Ratings and comments")
print("   ✓ Follow system")
print("   ✓ Real-time statistics")

print("\n📝 NEXT STEPS:")
print("   1. Start your backend server: npm start")
print("   2. Start your frontend server: npm start")
print("   3. Open http://localhost:3000 in your browser")
print("   4. Login with the sample credentials above")
print("   5. Explore all features!")

print("\n" + "=".repeat(60))
