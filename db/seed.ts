import { getDb } from "../api/queries/connection";
import * as schema from "./schema";

async function seed() {
  const db = getDb();
  console.log("Clearing existing tables for a clean seed...");
  await db.delete(schema.lessons);
  await db.delete(schema.courses);
  await db.delete(schema.badges);
  await db.delete(schema.notifications);
  await db.delete(schema.aiTutorConversations);
  await db.delete(schema.streakLogs);
  await db.delete(schema.homeworkSubmissions);
  await db.delete(schema.homework);
  await db.delete(schema.tasks);
  await db.delete(schema.childBadges);
  await db.delete(schema.lessonProgress);
  await db.delete(schema.courseProgress);
  await db.delete(schema.classroomStudents);
  await db.delete(schema.classrooms);
  await db.delete(schema.parentChildLinks);
  await db.delete(schema.teacherProfiles);
  await db.delete(schema.parentProfiles);
  await db.delete(schema.childrenProfiles);
  await db.delete(schema.users);

  console.log("Seeding badges...");
  await db.insert(schema.badges).values([
    { name: "First Steps", description: "Complete your first lesson", category: "learning", icon: "BookOpen", color: "#3B82F6", xpThreshold: 50 },
    { name: "Course Champion", description: "Complete your first course", category: "learning", icon: "Trophy", color: "#8B5CF6", xpThreshold: 500 },
    { name: "Speed Learner", description: "Complete 5 lessons in one day", category: "learning", icon: "Zap", color: "#3B82F6" },
    { name: "7-Day Streak", description: "Maintain a 7-day learning streak", category: "streak", icon: "Flame", color: "#F59E0B", xpThreshold: 140 },
    { name: "30-Day Warrior", description: "Maintain a 30-day streak", category: "streak", icon: "Flame", color: "#F43F5E", xpThreshold: 600 },
    { name: "Quiz Master", description: "Score 100% on 5 quizzes", category: "achievement", icon: "Target", color: "#10B981", xpThreshold: 500 },
    { name: "Explorer", description: "Try a course from every category", category: "achievement", icon: "Compass", color: "#8B5CF6" },
    { name: "Helper", description: "Use the AI Tutor 10 times", category: "social", icon: "Bot", color: "#3B82F6", xpThreshold: 100 },
    { name: "Coder", description: "Complete your first coding lesson", category: "challenge", icon: "Code", color: "#10B981", xpThreshold: 100 },
    { name: "AI Whiz", description: "Complete 3 AI courses", category: "challenge", icon: "Sparkles", color: "#8B5CF6", xpThreshold: 1000 },
    { name: "Night Owl", description: "Learn after 8 PM", category: "challenge", icon: "Moon", color: "#64748B" },
    { name: "Early Bird", description: "Learn before 8 AM", category: "challenge", icon: "Sun", color: "#F59E0B" },
  ]);

  console.log("Seeding 36 courses (12 per age group)...");
  
  const courseList = [
    // --- AGE 5-8 (12 Courses) ---
    {
      title: "What is AI?",
      description: "Meet friendly robots and learn what artificial intelligence means in a fun, simple way! You'll discover how computers can learn just like we do.",
      ageGroup: "5-8" as const,
      category: "ai_basics" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=400",
      duration: 60,
      xpReward: 150,
    },
    {
      title: "Fun with Patterns",
      description: "Play with shapes, colors, and patterns to understand how AI recognizes things. Match, sort, and have fun!",
      ageGroup: "5-8" as const,
      category: "ai_basics" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400",
      duration: 45,
      xpReward: 100,
    },
    {
      title: "Talking to Robots",
      description: "Learn how robots understand our words and commands. Build your own voice assistant friend!",
      ageGroup: "5-8" as const,
      category: "robotics" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=400",
      duration: 90,
      xpReward: 200,
    },
    {
      title: "Robot Friends",
      description: "Explore how robots can help us in our daily lives, from cleaning up toys to helping doctors. Learn to code their emotions!",
      ageGroup: "5-8" as const,
      category: "robotics" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400",
      duration: 60,
      xpReward: 120,
    },
    {
      title: "AI Drawing Fun",
      description: "Discover how AI helper tools can draw animals and paint beautiful landscapes. Create digital artwork alongside a friendly bot!",
      ageGroup: "5-8" as const,
      category: "science" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400",
      duration: 50,
      xpReward: 110,
    },
    {
      title: "Smart Math Games",
      description: "Solve logic puzzle cards and count alongside an AI math companion. Make learning math numbers a playful adventure!",
      ageGroup: "5-8" as const,
      category: "math" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400",
      duration: 60,
      xpReward: 130,
    },
    {
      title: "Logic and Mazes",
      description: "Learn step-by-step thinking by guiding a cute digital pup through mazes. The starting line of your coding journey!",
      ageGroup: "5-8" as const,
      category: "coding" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=400",
      duration: 75,
      xpReward: 160,
    },
    {
      title: "Machine Learning Pets",
      description: "Teach a virtual cat or dog mascot to recognize voice instructions. Discover how computer brains learn from examples!",
      ageGroup: "5-8" as const,
      category: "machine_learning" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400",
      duration: 80,
      xpReward: 180,
    },
    {
      title: "Smart Toys",
      description: "Look at the technology inside smart teddy bears, robotic cars, and electronic games. Learn how chips think!",
      ageGroup: "5-8" as const,
      category: "robotics" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=400",
      duration: 50,
      xpReward: 110,
    },
    {
      title: "AI Tells Stories",
      description: "Play with smart books that help you create magical fairy tales. Discover how machines compose fun sentences!",
      ageGroup: "5-8" as const,
      category: "ai_basics" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400",
      duration: 55,
      xpReward: 125,
    },
    {
      title: "Be Safe Online",
      description: "A simple introduction to keeping your information safe and being kind when interacting with digital assistants.",
      ageGroup: "5-8" as const,
      category: "ethics" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400",
      duration: 40,
      xpReward: 95,
    },
    {
      title: "Counting with AI",
      description: "Practice your counting and basic additions with interactive games managed by a smart robot teacher.",
      ageGroup: "5-8" as const,
      category: "math" as const,
      difficulty: "easy" as const,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400",
      duration: 45,
      xpReward: 100,
    },

    // --- AGE 8-12 (12 Courses) ---
    {
      title: "How AI Learns",
      description: "Discover the magic behind machine learning! Teach a computer to recognize animals, fruits, and more using examples.",
      ageGroup: "8-12" as const,
      category: "ai_basics" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=400",
      duration: 120,
      xpReward: 250,
    },
    {
      title: "Build a Chatbot",
      description: "Create your own chatbot from scratch! Learn coding basics and make a robot friend that can have real conversations.",
      ageGroup: "8-12" as const,
      category: "coding" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=400",
      duration: 150,
      xpReward: 300,
    },
    {
      title: "AI & Ethics",
      description: "Explore important questions: Should robots always obey? How do we make sure AI is fair for everyone? Think like a philosopher!",
      ageGroup: "8-12" as const,
      category: "ethics" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=400",
      duration: 90,
      xpReward: 200,
    },
    {
      title: "Scratch Coding for AI",
      description: "Connect block scripts in Scratch to make games that listen to your voice or respond to your webcam moves!",
      ageGroup: "8-12" as const,
      category: "coding" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=400",
      duration: 130,
      xpReward: 260,
    },
    {
      title: "AI Image Creators",
      description: "How do tools like DALL-E draw? Learn about pixels, descriptors, and prompt engineering to guide AI artists.",
      ageGroup: "8-12" as const,
      category: "science" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?q=80&w=400",
      duration: 100,
      xpReward: 220,
    },
    {
      title: "Train a Smart Mascot",
      description: "Set up data tables of characteristics (color, size, weight) to train your mascot classifier model to find special gems.",
      ageGroup: "8-12" as const,
      category: "machine_learning" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=400",
      duration: 110,
      xpReward: 240,
    },
    {
      title: "Robotic Arms & Logic",
      description: "Write simple algorithms to command mechanical limbs to stack blocks, sort recycling, and avoid dangerous objects.",
      ageGroup: "8-12" as const,
      category: "robotics" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400",
      duration: 140,
      xpReward: 280,
    },
    {
      title: "Math in Neural Nets",
      description: "Find out how simple adding and multiplying help computer minds make decisions. It's math, but with a tech twist!",
      ageGroup: "8-12" as const,
      category: "math" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400",
      duration: 95,
      xpReward: 210,
    },
    {
      title: "Detecting Deepfakes",
      description: "Become a digital detective. Learn how to tell the difference between real photos and AI-made images or voice swaps.",
      ageGroup: "8-12" as const,
      category: "ethics" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=400",
      duration: 100,
      xpReward: 230,
    },
    {
      title: "What is a Prompt?",
      description: "Learn what a prompt is, how computers understand our words, and how we talk to AI models using natural language!",
      ageGroup: "8-12" as const,
      category: "ai_basics" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=400",
      duration: 105,
      xpReward: 225,
    },
    {
      title: "How to Write a Good Prompt?",
      description: "Master prompt engineering! Learn specific tips, context templates, and tricks to get the best possible answers from AI.",
      ageGroup: "8-12" as const,
      category: "coding" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400",
      duration: 160,
      xpReward: 320,
    },
    {
      title: "Why We Need AI?",
      description: "Explore how AI solves massive real-world challenges, from predicting global weather patterns to helping doctors cure diseases.",
      ageGroup: "8-12" as const,
      category: "machine_learning" as const,
      difficulty: "medium" as const,
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400",
      duration: 115,
      xpReward: 235,
    },

    // --- AGE 12-16 (12 Courses) ---
    {
      title: "Machine Learning Basics",
      description: "Dive deep into supervised and unsupervised learning. Build your first ML model using real datasets and Python!",
      ageGroup: "12-16" as const,
      category: "machine_learning" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=400",
      duration: 180,
      xpReward: 400,
    },
    {
      title: "Python for AI",
      description: "Master Python programming with NumPy, Pandas, and scikit-learn. Write real code that powers AI applications.",
      ageGroup: "12-16" as const,
      category: "coding" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400",
      duration: 240,
      xpReward: 500,
    },
    {
      title: "AI Ethics & Society",
      description: "Analyze bias in AI systems, explore privacy concerns, and debate the future of AI governance. Critical thinking at its best.",
      ageGroup: "12-16" as const,
      category: "ethics" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=400",
      duration: 120,
      xpReward: 350,
    },
    {
      title: "Intro to Neural Networks",
      description: "Understand input layers, hidden weights, and outputs. Build a visual simulation of a network learning to classify digits.",
      ageGroup: "12-16" as const,
      category: "machine_learning" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=400",
      duration: 200,
      xpReward: 420,
    },
    {
      title: "Natural Language Processing",
      description: "Explore how Large Language Models analyze tokens, predict sentences, and generate responses. Code an basic text parser.",
      ageGroup: "12-16" as const,
      category: "coding" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=400",
      duration: 190,
      xpReward: 390,
    },
    {
      title: "Computer Vision Explorers",
      description: "Examine edge detection, convolutional kernels, and image tensors. Train a model to recognize facial gestures via camera.",
      ageGroup: "12-16" as const,
      category: "science" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=400",
      duration: 210,
      xpReward: 450,
    },
    {
      title: "Autonomous Robotics",
      description: "Program sensor feedback loops for robotic navigation. Avoid obstacles using proximity sensors and grid maps.",
      ageGroup: "12-16" as const,
      category: "robotics" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1535378917042?q=80&w=400",
      duration: 220,
      xpReward: 460,
    },
    {
      title: "Linear Algebra for ML",
      description: "Demystify matrices, vectors, and dot products. See how these mathematical elements drive modern computer learning tools.",
      ageGroup: "12-16" as const,
      category: "math" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1639762681485?q=80&w=400",
      duration: 160,
      xpReward: 380,
    },
    {
      title: "AI Bias and Fairness",
      description: "Study how datasets inherit human biases. Code fairness check scripts to balance model outcomes across demographic groups.",
      ageGroup: "12-16" as const,
      category: "ethics" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=400",
      duration: 130,
      xpReward: 330,
    },
    {
      title: "Reinforcement Learning & Games",
      description: "Implement Q-learning tables to train an agent to master classic arcade mazes, learning only from scores and penalties.",
      ageGroup: "12-16" as const,
      category: "machine_learning" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1538481199705?q=80&w=400",
      duration: 250,
      xpReward: 520,
    },
    {
      title: "Web Development with AI",
      description: "Integrate standard API connections to query AI models directly from your React/Node.js web pages. Build a complete project.",
      ageGroup: "12-16" as const,
      category: "coding" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=400",
      duration: 230,
      xpReward: 480,
    },
    {
      title: "Data Analytics & Predictions",
      description: "Clean complex CSV data, write Pandas queries, represent predictions in graphs, and compute linear regressions.",
      ageGroup: "12-16" as const,
      category: "science" as const,
      difficulty: "hard" as const,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400",
      duration: 175,
      xpReward: 370,
    },
  ];

  await db.insert(schema.courses).values(courseList);
  console.log("36 Courses seeded.");

  // Seed lessons for each course
  const allCourses = await db.select().from(schema.courses);
  
  for (const course of allCourses) {
    const lessons = [];
    // We will generate 3 lessons for each course:
    // Lesson 1: Video Lesson (with embedded YouTube)
    // Lesson 2: Interactive Practical activity
    // Lesson 3: Quiz Lesson (to test their knowledge)
    
    // 1. Video Lesson
    lessons.push({
      courseId: course.id,
      title: "Introduction Video",
      description: `Watch the introductory video to understand the core elements of ${course.title}.`,
      type: "video" as const,
      content: JSON.stringify({
        videoUrl: getRandomVideo(course.ageGroup, course.id),
      }),
      duration: 15,
      order: 1,
      xpReward: 40,
    });

    // 2. Interactive Activity
    lessons.push({
      courseId: course.id,
      title: "Interactive Concept Challenge",
      description: `Complete hands-on sorting and ordering activities regarding the concepts of ${course.title}.`,
      type: "interactive" as const,
      content: JSON.stringify({
        interactiveSteps: [
          { step: "Understand the core concepts of this lesson.", type: "read" },
          { step: "Organize the logic blocks to match the training data flow.", type: "drag_drop" },
          { step: "Submit your solution for verification.", type: "submit" },
        ],
      }),
      duration: 20,
      order: 2,
      xpReward: 50,
    });

    // 3. Quiz (Test Knowledge)
    lessons.push({
      courseId: course.id,
      title: "Final Knowledge Quiz",
      description: "Answer these questions to demonstrate your mastery and complete this section!",
      type: "quiz" as const,
      content: JSON.stringify({
        quizQuestions: getQuizQuestions(course.title, course.ageGroup),
      }),
      duration: 15,
      order: 3,
      xpReward: 60,
    });

    await db.insert(schema.lessons).values(lessons);
  }
  
  console.log("Lessons with videos and randomized quizzes successfully seeded.");
  console.log("Done seeding successfully.");
  process.exit(0);
}

function getRandomVideo(ageGroup: string, index: number): string {
  const videos5_8 = [
    "https://www.youtube.com/embed/mJeNghnyt0Y", // What is AI
    "https://www.youtube.com/embed/2eH3w6A1JFE", // How AI works
    "https://www.youtube.com/embed/qGdC519tDbg", // ML for kids
    "https://www.youtube.com/embed/Rk552Fh34aI", // What is a Robot
  ];
  const videos8_12 = [
    "https://www.youtube.com/embed/31O0aZaYg4w", // How AI works
    "https://www.youtube.com/embed/f_srHg1aNhE", // ML for Kids
    "https://www.youtube.com/embed/1Lw5e8JzG2A", // Generative AI
    "https://www.youtube.com/embed/q_29Zt_X_2o", // AI Ethics
  ];
  const videos12_16 = [
    "https://www.youtube.com/embed/aircAruvnKk", // Neural Networks
    "https://www.youtube.com/embed/x7X9w_GIm1s", // Python in 100s
    "https://www.youtube.com/embed/HcqpanDadyQ", // How ML works
    "https://www.youtube.com/embed/50_vALFIt4c", // AI Ethics Explained
  ];
  const list = ageGroup === "5-8" ? videos5_8 : ageGroup === "8-12" ? videos8_12 : videos12_16;
  return list[index % list.length];
}

function getQuizQuestions(courseTitle: string, ageGroup: string) {
  const pool5_8 = [
    {
      question: "Can computers learn from patterns and examples?",
      options: ["Yes, this is how AI learns!", "No, computers only do math.", "Only if we give them food."],
      correct: 0
    },
    {
      question: "Which of these is a friendly AI helper in our home?",
      options: ["A voice assistant speaker", "A wooden chair", "A glass of water"],
      correct: 0
    },
    {
      question: "Do robots think exactly like humans?",
      options: ["No, they follow instructions and patterns.", "Yes, they have human brains.", "They don't think at all."],
      correct: 0
    },
    {
      question: "What does AI stand for?",
      options: ["Artificial Intelligence", "Apple Ice-cream", "Angry Instruments"],
      correct: 0
    },
    {
      question: "Can an AI helper recognize your face in a photo?",
      options: ["Yes, using a camera and smart vision.", "No, photos are too small.", "Only if you type your name."],
      correct: 0
    },
    {
      question: "Does AI feel happy when you do a good job?",
      options: ["No, AI is a machine and does not have real feelings.", "Yes, it smiles.", "It gets very excited."],
      correct: 0
    },
    {
      question: "Is a robotic puppy alive like a real dog?",
      options: ["No, it's a smart toy made of metal and chips.", "Yes, it eats real food.", "Yes, it has a heartbeat."],
      correct: 0
    },
    {
      question: "How does a self-driving car know where to stop?",
      options: ["Using cameras and smart sensors.", "It guesses randomly.", "By honking the horn."],
      correct: 0
    },
    {
      question: "Can AI help us find our favorite cartoons or songs?",
      options: ["Yes, it recommends things we might like.", "No, it only plays math games.", "Only on Saturdays."],
      correct: 0
    },
    {
      question: "What does an AI need to learn new things?",
      options: ["Lots of examples and data.", "A good night's sleep.", "A sandwich."],
      correct: 0
    }
  ];

  const pool8_12 = [
    {
      question: "What is 'training data' in machine learning?",
      options: ["Examples we give to a computer to help it learn.", "A train engine carrying computers.", "A coding language used by scientists."],
      correct: 0
    },
    {
      question: "What is a major rule of AI Ethics?",
      options: ["AI should be fair, safe, and helpful to everyone.", "Robots must always win video games.", "AI should change its own password daily."],
      correct: 0
    },
    {
      question: "What does a chatbot use to understand our prompts?",
      options: ["Natural Language Processing (NLP)", "A solar calculator chip", "Webcam gesture detection."],
      correct: 0
    },
    {
      question: "What is a prompt in AI?",
      options: ["A text description or instruction given to an AI model.", "A type of computer mouse.", "A secret programming code."],
      correct: 0
    },
    {
      question: "If you train an AI with pictures of only red apples, can it recognize a green apple?",
      options: ["Probably not, because its training data was biased to red apples.", "Yes, it knows all apples.", "Only if the green apple is large."],
      correct: 0
    },
    {
      question: "What is a classifier in machine learning?",
      options: ["An AI model that sorts data into different categories.", "A folder for keeping homework.", "A person who cleans the classroom."],
      correct: 0
    },
    {
      question: "Why should we check AI answers for accuracy?",
      options: ["AI can make mistakes or hallucinate incorrect facts.", "AI likes to play jokes.", "AI is always 100% correct."],
      correct: 0
    },
    {
      question: "What is a 'deepfake'?",
      options: ["An AI-generated realistic photo, video, or audio that is actually fake.", "A very deep hole in the ground.", "A computer that does not turn on."],
      correct: 0
    },
    {
      question: "How does a robot sense its surroundings?",
      options: ["Using hardware sensors like cameras, lidar, and ultrasonic sensors.", "By reading books.", "It feels emotions."],
      correct: 0
    },
    {
      question: "What is the goal of Prompt Engineering?",
      options: ["To design and refine prompts to get the best responses from AI.", "To build a computer motherboard.", "To program a search engine."],
      correct: 0
    }
  ];

  const pool12_16 = [
    {
      question: "What is the primary role of an activation function in a neural network?",
      options: ["To introduce non-linearity into the network output.", "To calculate the average input size.", "To download training data faster."],
      correct: 0
    },
    {
      question: "In Python, which libraries are commonly used for data analysis and machine learning respectively?",
      options: ["Pandas and scikit-learn", "HTML and CSS", "Django and Flask"],
      correct: 0
    },
    {
      question: "Which of the following describes 'Supervised Learning'?",
      options: ["Training a model on labeled data with known outcomes.", "Training a model without any human supervision.", "Allowing children to code while monitored by teachers."],
      correct: 0
    },
    {
      question: "What is 'overfitting' in machine learning?",
      options: ["When a model learns training data too well but fails to generalize to new data.", "When a laptop becomes too hot.", "When the neural network has too many input variables."],
      correct: 0
    },
    {
      question: "What does 'NLP' stand for in computer science?",
      options: ["Natural Language Processing", "Node Logic Programming", "Network Link Protocol"],
      correct: 0
    },
    {
      question: "What is a neuron in an artificial neural network?",
      options: ["A mathematical node that processes inputs, applies weights, and produces an output.", "A biological cell inside a computer chip.", "A wire that connects the graphics card."],
      correct: 0
    },
    {
      question: "What is Reinforcement Learning?",
      options: ["A learning method where an agent learns behavior by receiving rewards and penalties.", "A way to force computers to compile faster.", "Coding with multiple debuggers active."],
      correct: 0
    },
    {
      question: "What is the main purpose of a validation dataset?",
      options: ["To evaluate model performance during training and tune hyperparameters.", "To store user logins securely.", "To double-check spelling in code comments."],
      correct: 0
    },
    {
      question: "Which algorithm is commonly used for unsupervised clustering of data?",
      options: ["K-Means Clustering", "Bubble Sort", "Linear Regression"],
      correct: 0
    },
    {
      question: "What is algorithmic bias in machine learning?",
      options: ["When a model produces systematically prejudiced results due to biased training data.", "When the compiler skips lines of code.", "When the database order is reversed."],
      correct: 0
    }
  ];

  // Specific course customizations to keep it relevant if needed
  if (courseTitle === "What is a Prompt?") {
    return [
      {
        question: "What is a prompt in AI?",
        options: ["A text description or instruction given to an AI model.", "A type of computer mouse.", "A secret programming code."],
        correct: 0
      },
      {
        question: "What happens when you give an AI a prompt?",
        options: ["It processes the words and generates a response.", "It shuts down immediately.", "It sends an email to your teacher."],
        correct: 0
      },
      {
        question: "Which of these is a prompt?",
        options: ["'Write a poem about a friendly robot.'", "Unplugging the power cord.", "Pressing the spacebar."],
        correct: 0
      }
    ];
  }
  if (courseTitle === "How to Write a Good Prompt?") {
    return [
      {
        question: "Which of these makes a prompt better?",
        options: ["Being clear, specific, and giving context.", "Writing in all capital letters.", "Using very short one-word prompts."],
        correct: 0
      },
      {
        question: "What is 'Prompt Engineering'?",
        options: ["The practice of designing and refining prompts to get better results from AI.", "Building computer hardware.", "Repairing internet cables."],
        correct: 0
      },
      {
        question: "What should you include in a prompt to get a formatted answer?",
        options: ["Specify the format you want (e.g. bullet points, a table, or simple words).", "Type your password.", "A picture of your dog."],
        correct: 0
      }
    ];
  }
  if (courseTitle === "Why We Need AI?") {
    return [
      {
        question: "How can AI help doctors?",
        options: ["By analyzing medical scans to detect diseases early.", "By cleaning the hospital floors.", "By prescribing candy to patients."],
        correct: 0
      },
      {
        question: "Which of these is a way AI helps the environment?",
        options: ["By predicting weather patterns and tracking animal migration.", "By creating plastic bags.", "By increasing electricity use."],
        correct: 0
      },
      {
        question: "Why do we need AI to process big datasets?",
        options: ["It can find patterns in millions of rows faster than any human.", "It deletes the data to save space.", "It renames files automatically."],
        correct: 0
      }
    ];
  }

  // Select 3 random questions from the appropriate pool
  const pool = ageGroup === "5-8" ? pool5_8 : ageGroup === "8-12" ? pool8_12 : pool12_16;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

seed().catch(console.error);
