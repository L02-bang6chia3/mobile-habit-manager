using Microsoft.EntityFrameworkCore;
using MobileApi.Enums;
using MobileApi.Models;

namespace MobileApi.Data;

public static class DataSeeder
{
    public static readonly Guid SystemUserId = new("00000000-0000-0000-0000-000000000001");

    public static async Task SeedAsync(ApplicationDbContext db)
    {
        if (await db.HabitTemplates.AnyAsync(h => h.UserId == SystemUserId && !h.IsDeleted))
            return;

        if (!await db.Users.AnyAsync(u => u.Id == SystemUserId))
        {
            db.Users.Add(new User
            {
                Id           = SystemUserId,
                Email        = "system@orbit.internal",
                Username     = "ORBIT Library",
                PasswordHash = "$2a$11$AAAAAAAAAAAAAAAAAAAAAA.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                Role         = "system"
            });
            await db.SaveChangesAsync();
        }

        using var tx = await db.Database.BeginTransactionAsync();
        try
        {
            foreach (var (habit, tasks) in BuildDefinitions())
            {
                db.HabitTemplates.Add(habit);
                await db.SaveChangesAsync();

                if (tasks.Length > 0)
                {
                    for (var i = 0; i < tasks.Length; i++)
                        tasks[i].SequenceOrder = i + 1;
                    db.MissionTasks.AddRange(tasks);
                    await db.SaveChangesAsync();
                }
            }

            await tx.CommitAsync();
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    // ── Seed definitions ────────────────────────────────────────────────────

    private static IEnumerable<(HabitTemplate Habit, MissionTask[] Tasks)> BuildDefinitions()
    {
        // ── CS / AI Track — Missions ─────────────────────────────────────

        yield return Mission(
            "CS Foundations",
            "Master Python, discrete math, and basic data structures — the bedrock of all software engineering.",
            "Education",
            [
                Task("Introduction to Python Programming",
                     "Learn variables, loops, functions, and file I/O in Python. Complete all exercises from OSSU's intro course.",
                     120),
                Task("Discrete Mathematics: Proofs & Sets",
                     "Study proofs by induction, set theory, and combinatorics. Use MIT OCW 6.042J materials.",
                     180),
                Task("Basic Data Structures: Arrays & Linked Lists",
                     "Implement array and linked list operations from scratch in Python without using built-ins.",
                     120),
                Task("Build a Command-Line Todo App",
                     "Create a CLI todo manager with file persistence, supporting add/done/list/delete commands.",
                     180),
                Task("Solve 50 Easy LeetCode Problems",
                     "Focus on arrays and strings. Track your solutions and patterns in a GitHub repo.",
                     300),
            ]);

        yield return Mission(
            "Core Systems & Software Engineering",
            "Go deep on OOP, algorithms, OS fundamentals, and databases. Build your first real API.",
            "Education",
            [
                Task("OOP & Design Patterns",
                     "Study the Gang-of-Four patterns: Singleton, Factory, Observer, Strategy, Decorator. Implement each in code.",
                     240),
                Task("Algorithms: Sorting, Graphs & Dynamic Programming",
                     "Implement merge sort, Dijkstra, BFS/DFS, and classic DP problems (knapsack, LCS).",
                     300),
                Task("Operating Systems & Networking Fundamentals",
                     "Read OSTEP (Operating Systems: Three Easy Pieces). Understand processes, memory, and TCP/IP basics.",
                     180),
                Task("SQL & NoSQL Databases",
                     "Design a relational schema, write complex joins, and compare with a MongoDB/Redis use case.",
                     180),
                Task("Implement a Nand2Tetris CPU Simulator",
                     "Build a computer from logic gates using the Nand2Tetris course (nand2tetris.org). Complete all hardware projects.",
                     480),
                Task("Build a RESTful API with Auth & Database",
                     "Create a Node.js/Express API with JWT authentication, connected to a PostgreSQL database.",
                     360),
            ]);

        yield return Mission(
            "Advanced Software Engineering",
            "Level up with system design, testing discipline, distributed systems, and cloud deployment.",
            "Education",
            [
                Task("Software Architecture Patterns",
                     "Study layered, hexagonal, event-driven, and microservices architectures. Read 'Clean Architecture' by Robert Martin.",
                     180),
                Task("Testing & Debugging Best Practices",
                     "Learn TDD, unit vs integration testing, coverage goals, and debugging techniques with real tools.",
                     120),
                Task("Distributed Systems Fundamentals",
                     "Cover CAP theorem, consensus (Raft/Paxos), eventual consistency, and distributed transactions.",
                     180),
                Task("DevOps: CI/CD, Docker & Kubernetes",
                     "Containerise an app with Docker, set up a GitHub Actions pipeline, and deploy to a Kubernetes cluster.",
                     240),
                Task("Deploy a Microservices App to Cloud with Monitoring",
                     "Split a monolith into 3 services, deploy to AWS/GCP, add Prometheus/Grafana dashboards.",
                     360),
                Task("Capstone: Full Test Suite Project",
                     "Pick an existing project and bring test coverage above 80%. Include unit, integration, and E2E tests.",
                     300),
            ]);

        yield return Mission(
            "AI/ML Fundamentals",
            "Build the mathematical and practical foundations of machine learning with hands-on model training.",
            "Education",
            [
                Task("Linear Algebra & Probability for ML",
                     "Study vectors, matrix operations, eigenvalues, probability distributions, and Bayes theorem. Use 3Blue1Brown + MIT OCW.",
                     240),
                Task("Supervised & Unsupervised Learning",
                     "Understand regression, classification, clustering, and dimensionality reduction. Implement from scratch in NumPy.",
                     180),
                Task("Neural Networks Fundamentals",
                     "Study forward/backpropagation, activation functions, and optimisers. Implement a 2-layer net from scratch.",
                     180),
                Task("PyTorch / TensorFlow Basics",
                     "Build and train a model using a framework. Understand tensors, autograd, and the training loop.",
                     120),
                Task("Train an Image Classifier on MNIST/CIFAR-10",
                     "Build a CNN, experiment with different architectures, and log results to Weights & Biases.",
                     240),
                Task("Build a Sentiment Analyser with Scikit-learn",
                     "Use TF-IDF + logistic regression and SVM on movie review data. Compare models and report metrics.",
                     180),
            ]);

        yield return Mission(
            "Modern AI Specialization",
            "Master LLMs, fine-tuning, RAG pipelines, and cloud AI APIs — the cutting edge of applied AI.",
            "Education",
            [
                Task("Transformers & LLM Architecture",
                     "Study attention, positional encoding, and the Transformer paper. Read Andrej Karpathy's 'Let's build GPT'.",
                     240),
                Task("Fine-tuning with PEFT / LoRA",
                     "Understand parameter-efficient fine-tuning. Apply QLoRA to a 7B model on a consumer GPU.",
                     180),
                Task("RAG with LangChain / LlamaIndex",
                     "Build a retrieval-augmented generation pipeline: chunk documents, embed, store in a vector DB, and query.",
                     180),
                Task("Cloud AI APIs: OpenAI, Vertex AI",
                     "Integrate at least two cloud AI APIs. Build an agent with tool use and function calling.",
                     120),
                Task("Fine-tune Llama-2 for a Custom Q&A Bot",
                     "Prepare a domain-specific dataset, fine-tune with LoRA, evaluate ROUGE/BERTScore, and deploy.",
                     360),
                Task("Implement a RAG Pipeline with Vector DB & Deploy",
                     "Build end-to-end RAG with Pinecone or pgvector, wrap in a FastAPI service, and deploy to the cloud.",
                     300),
            ]);

        // ── CS / AI Track — Daily Routines ───────────────────────────────

        yield return Routine(
            "LeetCode Algorithm Practice",
            "30-minute daily session solving LeetCode problems — easy through hard — to sharpen algorithmic thinking.",
            "Education",
            Daily(30));

        yield return Routine(
            "Research Paper Reading",
            "Read one arXiv CS.AI or Google Scholar paper per day. Focus on the abstract, intro, and key contributions.",
            "Education",
            Daily(20));

        yield return Routine(
            "Open-Source Code Review",
            "Spend 20 minutes reviewing pull requests or reading diffs in open-source repos to internalise good patterns.",
            "Education",
            Weekdays(20));

        yield return Routine(
            "Kaggle / ML Experiments",
            "Work on a Kaggle dataset or notebook for 20 minutes. Log experiment configs and results systematically.",
            "Education",
            Daily(20));

        yield return Routine(
            "Hugging Face Model Exploration",
            "Spend 30 minutes experimenting with Hugging Face models, papers, or datasets. Try something you've never used.",
            "Education",
            Daily(30));

        // ── English Track — Missions ─────────────────────────────────────

        yield return Mission(
            "English A1→A2: Basics",
            "Build your first 300-500 words, master present simple, and hold basic conversations. Validates at Cambridge A2 Key (KET).",
            "Personal",
            [
                Task("Learn 300-500 High-Frequency Vocabulary",
                     "Use Anki flashcards to memorise greetings, family, numbers, colours, and daily activities. 50 words/week.",
                     300),
                Task("Master Present Simple & To-Be",
                     "Study present simple affirmative/negative/question forms and the verb 'to be'. Complete Cambridge A1 grammar exercises.",
                     240),
                Task("Practice Basic Questions & There Is / There Are",
                     "Drill question formation (What, Where, Who, When) and describing rooms/places with 'there is/are'.",
                     180),
                Task("Listening Comprehension: Slow Clear Speech",
                     "Complete 10 British Council A1 listening exercises. Focus on understanding instructions and simple narratives.",
                     180),
                Task("Mock Cambridge A2 Key (KET) Test",
                     "Sit a full Cambridge A2 Key practice test under timed conditions. Review all wrong answers.",
                     120),
            ]);

        yield return Mission(
            "English B1: Foundations",
            "Reach 1,500 words, handle everyday conversations, and write connected paragraphs. Validates at Cambridge B1 Preliminary (PET).",
            "Personal",
            [
                Task("Expand Vocabulary to 1,500 Words",
                     "Add education, health, and travel topic words. Use spaced repetition; aim to recognise and produce each word.",
                     240),
                Task("Present Perfect, Past Simple & Modals",
                     "Learn the difference between present perfect and past simple. Practice can/should/must/might in context.",
                     180),
                Task("First & Second Conditionals",
                     "Study conditional structures with real and hypothetical situations. Write 20 original sentences each.",
                     120),
                Task("Handle Everyday Conversations & Write Simple Emails",
                     "Role-play 10 conversations (shopping, travel, opinions). Write 5 informal and 3 formal emails.",
                     180),
                Task("Reading Comprehension: Main Ideas",
                     "Read 10 graded B1 texts (British Council). Practice identifying topic sentences and supporting details.",
                     120),
                Task("Mock Cambridge B1 Preliminary (PET) Test",
                     "Complete a timed PET practice paper. Target: pass mark across all four skills.",
                     120),
            ]);

        yield return Mission(
            "English B2: Upper-Intermediate",
            "Master complex grammar, debate familiar topics, and write 2,000-word essays. Validates at Cambridge B2 First (FCE) or IELTS 5.5-6.5.",
            "Personal",
            [
                Task("Expand Vocabulary to 3,000+ Words",
                     "Focus on media, environment, and business registers. Study collocations and word families, not just definitions.",
                     300),
                Task("Passives, Reported Speech & Relative Clauses",
                     "Drill all passive tenses, backshift rules in reported speech, and defining/non-defining relative clauses.",
                     240),
                Task("Mixed Conditionals",
                     "Understand third and mixed conditionals. Write 10 real situations requiring each type.",
                     120),
                Task("Debate & Extended Speaking Practice",
                     "Record yourself arguing both sides of 5 familiar topics (environment, technology, education). Review for fluency.",
                     180),
                Task("Write a 2,000-Word Report or Essay",
                     "Plan, draft, and revise a B2-level report using linking words, discourse markers, and academic vocabulary.",
                     240),
                Task("Mock Cambridge B2 First (FCE) Test",
                     "Sit a full FCE practice paper under timed conditions. Review writing feedback against Cambridge mark schemes.",
                     180),
            ]);

        yield return Mission(
            "English C1: Advanced",
            "Achieve academic fluency, command advanced grammar, and score IELTS 7.0-7.5. Validates at Cambridge C1 Advanced (CAE).",
            "Personal",
            [
                Task("Advanced Vocabulary: Idioms, Phrasal Verbs & Collocations (4,000+ words)",
                     "Study academic word lists, idiom dictionaries, and domain-specific lexis. Target: recognise and use 4,000 word families.",
                     300),
                Task("Inversion, Emphasis & Advanced Passives",
                     "Master negative inversion (Not only…), cleft sentences, and complex passive constructions.",
                     180),
                Task("Nuanced Modals & Register Control",
                     "Study hedging language, formal/informal register shifts, and modal perfects in academic writing.",
                     180),
                Task("Critical Reading: Implicit Meaning",
                     "Read 10 complex C1 texts (editorials, academic articles). Practice inferring tone, purpose, and implied meaning.",
                     180),
                Task("Write a 3,000-Word Academic Essay",
                     "Produce a structured argument essay with introduction, developed body paragraphs, and conclusion. Use CAE writing rubric.",
                     240),
                Task("Mock Cambridge C1 Advanced (CAE) Test",
                     "Sit a full CAE practice paper. Target: minimum Band B across all components, equivalent to IELTS 7.0-7.5.",
                     180),
            ]);

        yield return Mission(
            "English C2/IELTS 7.5+: Proficiency",
            "Reach near-native fluency, master academic argumentation, and achieve IELTS 7.5+ or Cambridge C2 Proficiency.",
            "Personal",
            [
                Task("Near-Native Fluency: Stylistic Nuance & Registers",
                     "Study literary devices, irony, understatement, and domain-specific registers (legal, medical, academic).",
                     300),
                Task("Advanced Academic Argumentation & Research Writing",
                     "Learn to synthesise sources, construct multi-perspective arguments, and cite in academic style (APA/MLA).",
                     300),
                Task("Professional Listening: Implicit Meaning & Nuance",
                     "Complete 10 IELTS Academic listening sections at the C2 level. Focus on inference and attitude questions.",
                     180),
                Task("Simulate IELTS 8.0+ Full Practice Tests",
                     "Complete 4 full-length IELTS Academic timed practice papers. Analyse band scores and target weaknesses.",
                     240),
                Task("Write & Present at Conference/Academic Level",
                     "Produce a publishable-quality 2,000-word paper or 10-minute academic presentation on a topic of your choice.",
                     360),
            ]);

        // ── English Track — Daily Routines ───────────────────────────────

        yield return Routine(
            "Spaced Repetition Flashcards",
            "Review 20-50 vocabulary items daily in Anki or Duolingo for 15 minutes. Proven to boost retention 200-400%.",
            "Personal",
            Daily(15));

        yield return Routine(
            "Comprehensible Input",
            "30 minutes of podcasts or graded readers at your current level. Focus on meaning, not translation.",
            "Personal",
            Daily(30));

        yield return Routine(
            "Shadowing Practice",
            "Repeat audio scripts out loud — 12 minutes daily to improve fluency, rhythm, and pronunciation.",
            "Personal",
            Daily(12));

        yield return Routine(
            "Active Recall / Speaking Journal",
            "Describe a photo or today's events in English for 15 minutes — speaking or writing — without notes.",
            "Personal",
            Daily(15));

        yield return Routine(
            "English Immersion",
            "Watch 25 minutes of English media (news, shows, YouTube) without subtitles. Weekly: have one conversation in English.",
            "Personal",
            Daily(25));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private static (HabitTemplate, MissionTask[]) Mission(
        string title, string description, string category, MissionTask[] tasks)
    {
        var id = Guid.NewGuid();
        var habit = new HabitTemplate
        {
            Id          = id,
            UserId      = SystemUserId,
            AuthorId    = SystemUserId,
            Title       = title,
            Description = description,
            Category    = category,
            Type        = HabitType.Mission,
            IsPublic    = true,
            Status      = HabitStatus.Approved,
            CreatedAt   = DateTime.UtcNow
        };
        foreach (var t in tasks) t.HabitTemplateId = id;
        return (habit, tasks);
    }

    private static (HabitTemplate, MissionTask[]) Routine(
        string title, string description, string category, string recurrenceRule)
    {
        var habit = new HabitTemplate
        {
            Id              = Guid.NewGuid(),
            UserId          = SystemUserId,
            AuthorId        = SystemUserId,
            Title           = title,
            Description     = description,
            Category        = category,
            Type            = HabitType.Routine,
            RecurrenceRule  = recurrenceRule,
            IsPublic        = true,
            Status          = HabitStatus.Approved,
            CreatedAt       = DateTime.UtcNow
        };
        return (habit, []);
    }

    private static MissionTask Task(string title, string description, int durationMinutes) =>
        new()
        {
            Id                = Guid.NewGuid(),
            Title             = title,
            Description       = description,
            EstimatedDuration = TimeSpan.FromMinutes(durationMinutes)
            // SequenceOrder and HabitTemplateId set by caller
        };

    private static string Daily(int minutes) =>
        $"{{\"freq\":\"daily\",\"durationMinutes\":{minutes}}}";

    private static string Weekdays(int minutes) =>
        $"{{\"freq\":\"weekly\",\"days\":[1,2,3,4,5],\"durationMinutes\":{minutes}}}";
}
