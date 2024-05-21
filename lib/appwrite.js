import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.bebars.aora.app",
  projectId: "664a77200038b67b7a27",
  databaseId: "664a78a10003c41a0f1e",
  userCollactionId: "664a78c0001f6de486c6",
  videoCollactionId: "664a78e5002eef84cc4d",
  storageId: "664a7a5f0012c462f37e",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollactionId,
  videoCollactionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw Error("Faild to Craete new Account");
    }

    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = databases.createDocument(
      databaseId,
      userCollactionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollactionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollactionId);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollactionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    console.log("Query: ", query);
    const posts = await databases.listDocuments(databaseId, videoCollactionId, [
      Query.search("title", `${query}`),
    ]);
    if (!posts) throw new Error("Something went wrong");
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
