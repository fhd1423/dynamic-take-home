import functions from '../helpers/functions';
import testDb from '../helpers/firebase-init-test';

const { checkWalletExists, createWalletForUser, addDynamicWalletToFirestore } = functions;


async function deleteCollection(db: FirebaseFirestore.Firestore, collectionPath: string) {
  const query = db.collection(collectionPath).orderBy("__name__");
  const querySnapshot = await query.get();

  const batchSize = querySnapshot.size;
  if (batchSize === 0) {
    return;
  }

  const batch = db.batch();
  querySnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

global.alert = jest.fn();

describe("checkWalletExists", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await deleteCollection(testDb, "users");
  });

  test("checks if wallet exists, true", async () => {
    const metamask = "exampleMetamask";
    const publicKey = "examplePublicKey";
    const privateKey = "examplePrivateKey";

    // Create a user wallet in Firestore
    await testDb.collection("users").doc(metamask).set({
      public_key: publicKey,
      private_key: privateKey,
    });

    // Test checkWalletExists function
    const result = await checkWalletExists(metamask);
    expect(result).toEqual({
      exists: true,
      public_key: publicKey,
      private_key: privateKey,
    });
  });

  test("checks if wallet exists, false", async () => {
    const metamask = "exampleMetamask";

    const result = await checkWalletExists(metamask);
    expect(result).toEqual({
      exists: false,
    });
  });

  test("checks if wallet empty string", async () => {
    const metamask = "";

    const result = await checkWalletExists(metamask);
    expect(result).toEqual({
      exists: false,
    });
  });
})

describe("createWalletForUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await deleteCollection(testDb, "users");
  });
  test("creates a wallet for the user, already exists", async () => {
    const metamask = "exampleMetamask";
    const publicKey = "examplePublicKey";
    const privateKey = "examplePrivateKey";
    await testDb.collection("users").doc(metamask).set({
      public_key: publicKey,
      private_key: privateKey,
    });

    await createWalletForUser(metamask)

    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenNthCalledWith(1, "A wallet already exists for this user.");
  });

  test("creates a wallet for the user, doesnt exist", async () => {
    const metamask = "exampleMetamask";

    await createWalletForUser(metamask)

    const alertArgs = (alert as jest.Mock).mock.calls[0];

    expect(alert).toHaveBeenCalledTimes(1);
    expect(alertArgs[0]).toEqual(expect.stringContaining("Your wallet has been created:"));
  });

})

describe("addDynamicWalletToFirestore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await deleteCollection(testDb, "users");
  });

  test('adds a wallet to Firestore', async () => {
    const metamask = "exampleMetamask";
    const publicKey = "examplePublicKey";
    const privateKey = "examplePrivateKey";

    await addDynamicWalletToFirestore(metamask, publicKey, privateKey);

    const walletDocRef = testDb.collection('users').doc(metamask);
    const walletDocSnap = await walletDocRef.get();
    const walletData = walletDocSnap.data();

    expect(walletData).toEqual({
      public_key: publicKey,
      private_key: privateKey,
    });
  });


});



