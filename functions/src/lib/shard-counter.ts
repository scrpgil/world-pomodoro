import * as admin from "firebase-admin";

export const createCounter = async (
  db: any,
  ref: any,
  num_shards: number
) => {
  var batch = db.batch();

  // Initialize the counter document
  batch.update(ref, { num_shards: num_shards });

  // Initialize each shard with count=0
  for (let i = 0; i < num_shards; i++) {
    let shardRef = ref.collection("shards").doc(i.toString());
    batch.set(shardRef, { count: 0 });
  }

  // Commit the write batch
  return batch.commit();
};

export const incrementCounter = async (ref: any, num_shards: number) => {
  // Select a shard of the counter at random
  const shard_id = Math.floor(Math.random() * num_shards).toString();
  const shard_ref = ref.collection("shards").doc(shard_id);

  // Update count
  return shard_ref.update("count", admin.firestore.FieldValue.increment(1));
};

export const getCount = (ref: any) => {
  // Sum the count of each shard in the subcollection
  return ref
    .collection("shards")
    .get()
    .then((snapshot: any) => {
      let total_count = 0;
      snapshot.forEach((doc: any) => {
        total_count += doc.data().count;
      });

      return total_count;
    });
};
