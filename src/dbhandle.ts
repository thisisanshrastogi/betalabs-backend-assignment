import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

interface User {
  username: string;
  email: string;
  password: string;
}

interface writeProps {
  collection: string;
  data: User;
}

interface deleteProps {
  collection: string;
  query: {
    username?: string;
    email?: string;
  };
}
interface editProps {
  collection: string;
  query: {
    username?: string;
    email?: string;
  };
  newData: User;
}
class Handler {
  private URI: string;
  private client: MongoClient;
  private DB_NAME: string;
  constructor() {
    this.URI = process.env.URI as string;
    this.DB_NAME = process.env.DB_NAME as string;
    this.client = new MongoClient(this.URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      tls: true,
    });
  }
  async connect(): Promise<boolean> {
    try {
      await this.client.connect();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    try {
      await this.client.close();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async readData(collection: string) {
    try {
      const db = this.client.db(this.DB_NAME);
      const coll = db.collection(collection);
      const res = coll.find().toArray();
      return res;
    } catch (e) {
      console.log(e);
    }
  }
  async writeData(params: writeProps): Promise<boolean> {
    try {
      const db = this.client.db(this.DB_NAME);
      const coll = db.collection<User>(params.collection);
      await coll.insertOne(params.data);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async deleteEntry(params: deleteProps): Promise<boolean> {
    try {
      const db = this.client.db(this.DB_NAME);
      const coll = db.collection(params.collection);
      await coll.deleteOne(params.query);
      return true;
    } catch (e) {
      // console.log(e);
      return false;
    }
  }

  async UpdateOne(params: editProps): Promise<boolean> {
    try {
      const db = this.client.db(this.DB_NAME);
      const coll = db.collection(params.collection);
      await coll.updateOne(params.query, {
        $set: params.newData,
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
export default Handler;
