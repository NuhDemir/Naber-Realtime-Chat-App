import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Kadın Kullanıcılar
  {
    email: "zeynep.yilmaz@ornek.com",
    fullName: "Zeynep Yılmaz",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "elif.kaya@ornek.com",
    fullName: "Elif Kaya",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "ayse.demir@ornek.com",
    fullName: "Ayşe Demir",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "selin.ozturk@ornek.com",
    fullName: "Selin Öztürk",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "esra.celik@ornek.com",
    fullName: "Esra Çelik",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "defne.arslan@ornek.com",
    fullName: "Defne Arslan",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "busra.sahin@ornek.com",
    fullName: "Büşra Şahin",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "ece.yildiz@ornek.com",
    fullName: "Ece Yıldız",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Erkek Kullanıcılar
  {
    email: "mehmet.yilmaz@ornek.com",
    fullName: "Mehmet Yılmaz",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "ahmet.kara@ornek.com",
    fullName: "Ahmet Kara",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "mustafa.demir@ornek.com",
    fullName: "Mustafa Demir",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "emre.ozturk@ornek.com",
    fullName: "Emre Öztürk",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "burak.celik@ornek.com",
    fullName: "Burak Çelik",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "cem.arslan@ornek.com",
    fullName: "Cem Arslan",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "kerem.sahin@ornek.com",
    fullName: "Kerem Şahin",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
