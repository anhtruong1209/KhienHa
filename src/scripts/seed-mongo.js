const { MongoClient } = require('mongodb');
const { siteContent } = require('../data/site-content');
const { newsData } = require('../data/news');

const uri = "mongodb+srv://sdtla0911114819_db_user:l7xYcYTaFThpLHhZ@cluster0.hit1k6g.mongodb.net/khienha?retryWrites=true&w=majority&appName=Cluster0";

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("khienha");
    
    // Seed Site Content
    await db.collection("settings").updateOne(
      { key: "site_content" },
      { $set: { data: siteContent, updatedAt: new Date() } },
      { upsert: true }
    );
    
    // Seed News
    await db.collection("news").deleteMany({}); // Clear old news
    await db.collection("news").insertMany(newsData);
    
    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

seed();
