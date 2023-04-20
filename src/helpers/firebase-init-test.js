import * as admin from "firebase-admin";
import serviceAccount from "../../../dynamic-7dd8f-firebase-adminsdk-u9l12-84cff53f64.json";

const projectId = "dynamic-7dd8f";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: projectId,
});

const testDb = admin.firestore();

export default testDb;
