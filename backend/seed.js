/* Run with: npm run seed
   Populates the database with a handful of sample articles so the
   frontend has real data to fetch from /api/articles */
require("dotenv").config();
const connectDB = require("./config/db");
const Article = require("./models/Article");

const sampleArticles = [
  {
    title: "ក្រុមហ៊ុនកសិកម្មចុះកិច្ចសន្យាទិញលក់ស្រូវទំហំធំជាមួយសហគមន៍មូលដ្ឋាន",
    excerpt: "កិច្ចព្រមព្រៀងនេះរំពឹងជួយបង្កើនប្រាក់ចំណូលកសិករនៅតំបន់ជនបទ។",
    category: "សេដ្ឋកិច្ច",
    isFeatured: true,
    views: 320,
  },
  {
    title: "ការិយាល័យឌីជីថលថ្មីជួយសហគ្រាសខ្នាតតូចគ្រប់គ្រងគណនេយ្យតាមអនឡាញ",
    excerpt: "កម្មវិធីនេះផ្តល់ជូនដោយឥតគិតថ្លៃសម្រាប់សហគ្រិនចាប់ផ្តើមអាជីវកម្ម។",
    category: "បច្ចេកវិទ្យា",
    views: 210,
  },
  {
    title: "ធនាគារជាតិណែនាំវិធានការថ្មីគាំទ្រការផ្តល់កម្ចីដល់សហគ្រាសខ្នាតតូច",
    excerpt: "វិធានការនេះមានគោលដៅកាត់បន្ថយការប្រថុយប្រថានសម្រាប់ធនាគារពាណិជ្ជ។",
    category: "ធនាគារ-ហិរញ្ញវត្ថុ",
    isPopular: true,
    views: 540,
  },
  {
    title: "ពិព័រណ៍ពាណិជ្ជកម្មតំបន់ទាក់ទាញអ្នកចូលរួមជាង ៣០០សហគ្រាស",
    excerpt: "ព្រឹត្តិការណ៍នេះជាឱកាសសម្រាប់សហគ្រិនក្នុងស្រុកបង្ហាញផលិតផលរបស់ខ្លួន។",
    category: "ពាណិជ្ជកម្ម",
    isPopular: true,
    views: 480,
  },
  {
    title: "គំនិតអាជីវកម្មខ្នាតតូចដែលកំពុងពេញនិយមក្នុងចំណោមយុវជនកម្ពុជា",
    excerpt: "ការស្ទង់មតិថ្មីបង្ហាញពីនិន្នាការជ្រើសរើសអាជីវកម្មរបស់យុវជន។",
    category: "គំនិតអាជីវកម្ម",
    views: 175,
  },
  {
    title: "កម្មវិធីបណ្តុះបណ្តាលជំនាញវិជ្ជាជីវៈពង្រីកទៅដល់ខេត្តជាច្រើនទៀត",
    excerpt: "គោលដៅគឺបង្កើនលទ្ធភាពការងារសម្រាប់យុវជនតាមបណ្តាខេត្ត។",
    category: "សង្គមជាតិ-សេដ្ឋកិច្ច",
    isPopular: true,
    views: 390,
  },
];

(async () => {
  await connectDB();
  await Article.deleteMany({});
  await Article.insertMany(sampleArticles);
  console.log(`Seeded ${sampleArticles.length} articles.`);
  process.exit(0);
})();
