import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";

export async function getUsers() {
  await connectDB();
  return User.find().sort({ createdAt: -1 }).lean();
}

export async function getUserById(id: string) {
  await connectDB();
  return User.findById(id).lean();
}

export async function getUserByEmail(email: string) {
  await connectDB();
  return User.findOne({ email: email.toLowerCase() }).lean();
}
