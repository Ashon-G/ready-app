import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import md5 from "crypto-js/md5";

initializeApp();
const db = getFirestore();

const SECURE_HASH =
  process.env.CPX_SECURE_HASH || "giPTmdFjOauZKOwkAFAmrMCGXm276sMu";

export const handlePostback = onRequest(
  { region: "us-central1", memory: "256MiB" },
  async (req, res) => {
    const { ext_user_id, status, reward_value, hash } = req.query as Record<
      string,
      string
    >;

    if (!ext_user_id || !status || !hash) {
      res.status(400).send("Missing required parameters");
      return;
    }

    const expectedHash = md5(`${ext_user_id}-${SECURE_HASH}`).toString();
    if (hash !== expectedHash) {
      res.status(403).send("Invalid hash");
      return;
    }

    const value = parseFloat(reward_value || "0");

    try {
      const userRef = db.collection("users").doc(ext_user_id);

      // 1. Update earnings and postback status
      await userRef.set(
        {
          earnings: FieldValue.increment(value),
          postbackStatus: status,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // 2. Add notification
      const notifRef = userRef.collection("notifications").doc();
      await notifRef.set({
        title: "You just earned a reward!",
        message: `You've earned ${value} for completing a survey!`,
        amount: value,
        status: status,
        createdAt: new Date(),
        read: false,
      });

      res.status(200).send("Postback and notification logged");
    } catch (error) {
      logger.error("Postback error:", error);
      res.status(500).send("Internal error");
    }
  }
);
