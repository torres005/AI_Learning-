import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.APP_SECRET || "your-secret-key";

function getUser(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET) as { userId: number; role: string };
  } catch { return null; }
}

// Simulated AI tutor responses based on topic detection
function generateTutorResponse(message: string, ageGroup: string): string {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
    return ageGroup === "5-8" 
      ? "Hi there, little explorer! I'm your AI Tutor friend! What would you like to learn about today?"
      : ageGroup === "8-12"
      ? "Hey there! Ready to dive into some awesome AI knowledge? Ask me anything!"
      : "Hello! Welcome back. What AI concept would you like to explore today?";
  }
  
  if (lowerMsg.includes("machine learning") || lowerMsg.includes("ml")) {
    return ageGroup === "5-8"
      ? "Machine learning is like teaching a robot to learn from examples! Just like you learn to recognize animals by seeing many pictures, computers can learn too!"
      : ageGroup === "8-12"
      ? "Machine Learning is a way for computers to learn from data without being explicitly programmed. We show the computer many examples, and it finds patterns to make predictions!"
      : "Machine Learning is a subset of AI where algorithms learn patterns from training data. There are three main types: supervised learning (labeled data), unsupervised learning (finding patterns), and reinforcement learning (learning through rewards). Would you like me to explain any of these in detail?";
  }
  
  if (lowerMsg.includes("python") || lowerMsg.includes("code")) {
    return ageGroup === "5-8"
      ? "Python is a friendly programming language! It's like giving instructions to a computer in a way it understands. Want to learn some fun commands?"
      : ageGroup === "8-12"
      ? "Python is one of the most popular programming languages for AI! Here's a simple example:\n\n```python\nprint('Hello, AI World!')\n```\nThis tells the computer to display a message. Pretty cool, right?"
      : "Python is the go-to language for AI development. With libraries like NumPy for numerical computing, Pandas for data manipulation, and scikit-learn for machine learning, you can build powerful AI systems. Here's a basic ML example:\n\n```python\nfrom sklearn import tree\nclf = tree.DecisionTreeClassifier()\nclf.fit(X_train, y_train)\n```";
  }
  
  if (lowerMsg.includes("robot") || lowerMsg.includes("robotics")) {
    return ageGroup === "5-8"
      ? "Robots are super cool! They're machines that can move and do tasks. Some robots use AI to make smart decisions, like choosing the best path to walk!"
      : ageGroup === "8-12"
      ? "Robotics combines engineering and AI! Robots have sensors (like eyes), processors (like brains), and actuators (like muscles). AI helps robots make decisions based on what they sense."
      : "Robotics is an interdisciplinary field combining mechanical engineering, electrical engineering, and computer science. Modern robots use AI for perception (computer vision), planning (pathfinding algorithms), and control (reinforcement learning).";
  }
  
  if (lowerMsg.includes("ethics") || lowerMsg.includes("fair")) {
    return ageGroup === "5-8"
      ? "AI ethics is about making sure robots are nice and fair to everyone! We want AI to help people, not hurt them."
      : ageGroup === "8-12"
      ? "AI ethics is super important! It means making sure AI treats everyone fairly. Sometimes AI can make mistakes and be unfair to certain groups of people. We need to fix that!"
      : "AI ethics addresses critical issues like algorithmic bias, privacy, transparency, and accountability. For instance, facial recognition systems have shown racial bias due to unrepresentative training data. This field explores frameworks for responsible AI development and deployment.";
  }
  
  if (lowerMsg.includes("neural network") || lowerMsg.includes("brain")) {
    return ageGroup === "5-8"
      ? "A neural network is like a computer brain! It has lots of tiny parts that work together, just like the neurons in your brain!"
      : ageGroup === "8-12"
      ? "Neural networks are computer systems inspired by our brains! They have layers of 'neurons' that process information. When you show a neural network lots of cat pictures, it learns to recognize cats!"
      : "Neural networks are computational models composed of interconnected nodes (neurons) organized in layers: input, hidden, and output. Deep learning uses multiple hidden layers to learn hierarchical representations. Key architectures include CNNs for images, RNNs for sequences, and Transformers for NLP.";
  }
  
  if (lowerMsg.includes("help") || lowerMsg.includes("homework")) {
    return ageGroup === "5-8"
      ? "I'd love to help! What are you working on? I can explain things in a fun way!"
      : ageGroup === "8-12"
      ? "Sure, I can help with your homework! What subject or topic do you need help with?"
      : "Absolutely! I'd be happy to help with your assignments. What specific concept or problem are you working on?";
  }
  
  // Default response
  return ageGroup === "5-8"
    ? "That's a great question! I'm here to help you learn about AI and technology. Can you tell me more about what you'd like to know?"
    : ageGroup === "8-12"
    ? "Great question! I'm your AI learning assistant. I can help you understand AI concepts, coding, robotics, and more. What specifically would you like to explore?"
    : "Excellent question! As your AI tutor, I can help with machine learning concepts, programming, ethics, and more. Could you provide more context so I can give you a more detailed answer?";
}

export const aiTutorRouter = createRouter({
  chat: publicQuery
    .input(z.object({ message: z.string(), childId: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "child") throw new Error("Unauthorized");

      // Get child's age group
      const profile = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, user.userId)).limit(1);
      const ageGroup = profile[0]?.ageGroup || "8-12";

      // Generate response based on message content
      const response = generateTutorResponse(input.message, ageGroup);

      // Save conversation
      await db.insert(schema.aiTutorConversations).values({
        childId: user.userId,
        message: input.message,
        response,
      });

      return { response };
    }),

  getHistory: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const user = getUser(ctx.req);
    if (!user || user.role !== "child") return { messages: [] };

    const messages = await db.select().from(schema.aiTutorConversations)
      .where(eq(schema.aiTutorConversations.childId, user.userId))
      .orderBy(schema.aiTutorConversations.createdAt);

    return { messages };
  }),

  clearHistory: publicQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const user = getUser(ctx.req);
    if (!user || user.role !== "child") throw new Error("Unauthorized");

    await db.delete(schema.aiTutorConversations).where(eq(schema.aiTutorConversations.childId, user.userId));
    return { success: true };
  }),
});
