// export-import.ts

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";

// Initialize source (prod)
const prodApp = initializeApp(
  {
    credential: cert(require("./prod-service-account.json")),
  },
  "prod"
);

const prodDb = getFirestore(prodApp);

// Initialize target (dev)
const devApp = initializeApp(
  {
    credential: cert(require("./dev-service-account.json")),
  },
  "dev"
);

const devDb = getFirestore(devApp);

async function migrate() {
  const snapshot = await prodDb
    .collection("/kitchens/SUaUsWaoyGGPLCt82A6U/schedules")
    .get();

  const batch = devDb.batch();
  snapshot.docs.forEach((doc) => {
    const newDocRef = devDb
      .collection("/kitchens/SUaUsWaoyGGPLCt82A6U/schedules")
      .doc(doc.id);
    batch.set(newDocRef, doc.data());
  });

  // const doc = await prodDb
  //   .doc("/kitchens/SUaUsWaoyGGPLCt82A6U/schedules/Irh6nlORU6IIuTeWLZLF")
  //   .get();

  // const batch = devDb.batch();
  // const newDocRef = devDb
  //   .collection("/kitchens/SUaUsWaoyGGPLCt82A6U/schedules")
  //   .doc(doc.id);
  // batch.set(newDocRef, doc.data());

  await batch.commit();
  console.log("Migration complete.");
}

migrate();
