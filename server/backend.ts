import { GenezioDeploy } from "@genezio/types";
import { Collection, MongoClient } from "mongodb";
import {Server, Socket} from "socket.io";
import http from 'http';
import { QuestionValidator } from "./questionValidator";

type Question = {
  text: string;
  votes?: number;
  answered?: boolean;
};

@GenezioDeploy()
export class BackendService {
  private collection: Collection<Question> | undefined;
  private socketListener: Server;
  private connectedSockets: Socket[] = [];
  private qv:QuestionValidator;

  constructor(server: http.Server) {
    this.qv = new QuestionValidator();
    this.initMongo();
    // Call the asynchronous init method from the constructor
    this.socketListener =new Server(server, {cors: {origin: ["http://localhost:5173", "https://apricot-devoted-cephalopod.app.genez.io"]}})
    this.socketListener.on("connection",(socket: Socket) => {
      console.log("A user connected");
      this.connectedSockets.push(socket);

      socket.on("disconnect", () => {
        console.log("User disconnected");
        // Remove the disconnected socket from the array of connected sockets
        this.connectedSockets = this.connectedSockets.filter(s => s !== socket);
        this.emit("user count", this.connectedSockets.length);
      });

      this.emit("user count", this.connectedSockets.length);

    });
    console.log("Constructor done");
  }

  private initMongo() {
      try {
          const uri:string|undefined = process.env.DATABASE_URL;
          if (!uri)
            throw(new Error("process.env.DATABASE_URL not defined"));
          const client = new MongoClient(uri);

          client.connect().then(() => {
            const database = client.db("Demo");
            this.collection = database.collection<Question>("questions");
          })
          .catch((error) => {
            console.error("Error connecting to the database:", error.message);
            throw error; // Propagate the error to the caller
          })
      } catch (error) {
          console.error("Error connecting to the database:", error.message);
          throw error; // Propagate the error to the caller
      }
  }

  private emit(channel: string, payload:any) {
    this.connectedSockets.forEach((socket:Socket) => {
      socket.emit(channel, payload);
    });
  }

  async newQuestion(q: Question): Promise<void> {
    if (!this.collection) return;
    q.answered = false;
    q.votes = 1;
    if (q.text.trim().length<6)
    	throw new Error("Please enter a question");

    try {
        if ((await this.qv.isOffensive(q.text)) === true) {
          console.log("Inappropriate question identified: ", q.text);
          throw new Error("There was an error adding your question");
        } else {
          // Insert the new question into the MongoDB collection
          await this.collection.insertOne(q);
          console.log("New question added:", q.text);
          
          this.emit('new question', q);
        }
    } catch (error) {
        console.error("Error adding new question:", error.message);
        throw error; // Propagate the error to the caller
    }
  }

  async getQuestions(filter: boolean): Promise<Question[]> {
    if (!this.collection) return [];
    const queryFilter = filter ? { answered: false } : {};

    // Find questions and sort by number of votes in descending order
    const questions = await this.collection.find(queryFilter).sort({ votes: -1 }).toArray();

    return questions;
  }

  async vote(q: Question): Promise<void> {
    if (!this.collection) return;
    try {
      await this.collection.updateOne({ text: q.text }, { $inc: { votes: 1 } });
      if (q.votes)
        q.votes++;
      this.emit('update question', q);
      
      console.log("Vote counted for question:", q.text);
    } catch (error) {
      console.error("Error counting vote for question:", q.text, error.message);
      throw error; // Propagate the error to the caller
    }
  }

  async answer(q: Question, secret: string): Promise<void> {
    if (!this.collection) return;
    if (secret != process.env.SPEAKER_SECRET) throw new Error("Wrong secret: " + secret);
    try {
      // Find the question by its ID and increment the votes
      await this.collection.updateMany({ text: q.text }, { $set: { answered: true } });
      q.answered = true;
      this.emit('update question', q);

      console.log("Answered question:", q.text);
    } catch (error) {
        console.error("Error answering question:", q.text, error.message);
        throw error; // Propagate the error to the caller
    }
  }

  getSecketURL(): string {
    if (process.env.SOCKET_URL)
      return process.env.SOCKET_URL;
    else 
      return "UNDEFINED";
  }
}
