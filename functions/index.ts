import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import md5 from 'crypto-js/md5';

admin.initializeApp();

const SECURE_HASH = functions.config().cpx?.secure_hash || 'giPTmdFjOauZKOwkAFAmrMCGXm276sMu';

export const handlePostback = functions.https.onRequest(async (req, res) => {
  const { ext_user_id, status, reward_value, hash } = req.query as any;

  if (!ext_user_id || !status || !hash) {
    res.status(400).send('Missing required parameters');
    return;
  }

  const expected = md5(`${ext_user_id}-${SECURE_HASH}`).toString();
  if (hash !== expected) {
    res.status(403).send('Invalid hash');
    return;
  }

  const value = parseFloat(reward_value || '0');

  try {
    await admin
      .firestore()
      .collection('users')
      .doc(ext_user_id)
      .set(
        {
          earnings: admin.firestore.FieldValue.increment(value),
          postbackStatus: status,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    res.status(200).send('Postback received');
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    res.status(500).send('Internal error');
  }
});
