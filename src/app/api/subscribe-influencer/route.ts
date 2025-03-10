import { NextResponse } from "next/server";
import dbConnect from "src/utils/dbConnect";

const SUBSCRIPTION_COST = 10;

export async function POST(request: Request): Promise<Response> {
  try {
    const { walletAddress, influencerHandle } = await request.json();

    // Remove @ from the handle if it exists
    const cleanHandle = influencerHandle.replace('@', '');

    if (!walletAddress || !cleanHandle) {
      return NextResponse.json(
        { success: false, error: { message: "Missing required fields" } },
        { status: 400 }
      );
    }

    const client = await dbConnect();
    const db = client.db("ctxbt-signal-flow");
    const usersCollection = db.collection("users");
    const influencersCollection = db.collection("influencers");

    // Start a session for transaction
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // 1. Check and update user's credits
        const user = await usersCollection.findOne({ walletAddress });
        
        if (!user) {
          throw new Error("User not found");
        }

        if (user.credits < SUBSCRIPTION_COST) {
          throw new Error("Insufficient credits");
        }

        // Get user's telegram ID and clean it (remove @ if exists)
        const cleanTelegramId = user.telegramId.replace('@', '');

        // Check if user is already subscribed
        if (user.subscribedAccounts?.includes(cleanHandle)) {
          throw new Error("Already subscribed to this influencer");
        }

        // 2. Check if influencer exists
        const existingInfluencer = await influencersCollection.findOne({ 
          twitterHandle: cleanHandle 
        });

        if (existingInfluencer) {
          // Update existing influencer
          await influencersCollection.updateOne(
            { twitterHandle: cleanHandle },
            {
              $set: { updatedAt: new Date() },
              $addToSet: { subscribers: cleanTelegramId }
            },
            { session }
          );
        } else {
          // Create new influencer
          await influencersCollection.insertOne({
            twitterHandle: cleanHandle,
            subscribers: [cleanTelegramId],
            tweets: [],
            processedTweetIds: [],
            updatedAt: new Date()
          }, { session });
        }

        // 3. Update user document
        await usersCollection.updateOne(
          { walletAddress },
          {
            $inc: { credits: -SUBSCRIPTION_COST },
            $addToSet: { subscribedAccounts: cleanHandle },
            $set: { updatedAt: new Date() }
          },
          { session }
        );
      });

      return NextResponse.json({
        success: true,
        message: "Successfully subscribed to influencer",
      });

    } finally {
      await session.endSession();
    }

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
} 