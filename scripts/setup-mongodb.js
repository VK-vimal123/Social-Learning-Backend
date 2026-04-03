# MongoDB Shell Commands for Social Learning Notes Exchange

# Connect to MongoDB
# Open MongoDB Compass or use mongosh in terminal

# Create database and collections
use social-learning-notes

# Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ school: 1 })
db.users.createIndex({ branch: 1 })

db.notes.createIndex({ title: "text", description: "text", tags: "text" })
db.notes.createIndex({ subject: 1, createdAt: -1 })
db.notes.createIndex({ uploadedBy: 1, createdAt: -1 })
db.notes.createIndex({ "stats.averageRating": -1 })
db.notes.createIndex({ "stats.downloads": -1 })

db.subjects.createIndex({ code: 1 }, { unique: true })
db.subjects.createIndex({ department: 1, semester: 1 })

db.ratings.createIndex({ note: 1, user: 1 }, { unique: true })

db.comments.createIndex({ note: 1, createdAt: -1 })
db.comments.createIndex({ user: 1, createdAt: -1 })
db.comments.createIndex({ parentComment: 1 })

db.follows.createIndex({ follower: 1, following: 1 }, { unique: true })

# Insert sample subjects
db.subjects.insertMany([
  {
    name: "Computer Programming",
    code: "CS101",
    department: "Computer Science",
    description: "Introduction to programming fundamentals",
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
    description: "Database design and SQL",
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
    description: "Calculus and linear algebra",
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
    description: "Fundamentals of physics",
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
    description: "Digital logic and circuits",
    credits: 4,
    semester: 2,
    isActive: true,
    totalNotes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

# Create a sample admin user (you'll need to hash the password in your application)
# This is just for reference - the actual user creation should be done through the API

# Verify collections
show collections

# Show sample data
db.subjects.find().pretty()

# Database statistics
db.stats()

# Collection statistics
db.users.stats()
db.notes.stats()
db.subjects.stats()
db.ratings.stats()
db.comments.stats()
db.follows.stats()

print("MongoDB setup completed!")
print("Database: social-learning-notes")
print("Collections created: users, notes, subjects, ratings, comments, follows")
print("Indexes created for optimal performance")
print("Sample subjects inserted")
