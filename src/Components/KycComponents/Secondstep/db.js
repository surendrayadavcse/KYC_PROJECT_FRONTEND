// Add at the top
import { openDB } from 'idb';

// IndexedDB setup
const getDB = async () => {
  return await openDB('KycDocumentsDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('documents')) {
        db.createObjectStore('documents', { keyPath: 'type' });
      }
    },
  });
};

// Save document to IndexedDB
const saveToIndexedDB = async (type, file, data) => {
  const db = await getDB();
  await db.put('documents', {
    type,
    file,
    ...data,
  });
};

// Get document from IndexedDB
const getFromIndexedDB = async (type) => {
  const db = await getDB();
  return await db.get('documents', type);
};

// Delete document from IndexedDB
const removeFromIndexedDB = async (type) => {
  const db = await getDB();
  await db.delete('documents', type);
};
