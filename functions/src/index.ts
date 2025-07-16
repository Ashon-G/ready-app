import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import * as md5 from "crypto-js/md5"; // ✅ FIXED IMPORT

initializeApp();
const db = getFirestore();

const SECURE_HASH =
  process.env.CPX_SECURE_HASH || "giPTmdFjOauZKOwkAFAmrMCGXm276sMu";

export const handlePostback = onRequest(
  { region: "us-central1", memory: "256MiB" },
  async (req, res) => {
    const { ext_user_id, status, reward_value, hash, trans_id } =
      req.query as Record<string, string>;

    logger.info("Incoming postback:", {
      ext_user_id,
      status,
      reward_value,
      hash,
      trans_id,
    });

    if (!ext_user_id || !status || !hash || !trans_id) {
      logger.warn("Missing required parameters");
      res.status(400).send("Missing required parameters");
      return;
    }

    const expectedHash = md5(`${trans_id}-${SECURE_HASH}`).toString(); // ✅ FIXED USAGE
    logger.info("Calculated hash:", expectedHash);
    logger.info("Secure hash present?", !!SECURE_HASH);

    if (hash !== expectedHash) {
      logger.warn("Invalid hash");
      res.status(403).send("Invalid hash");
      return;
    }

    const value = parseFloat(reward_value || "0");
    logger.info("Parsed reward value:", value);

    try {
      const userRef = db.collection("users").doc(ext_user_id);
      logger.info("Writing earnings to user:", ext_user_id);

      await userRef.set(
        {
          earnings: FieldValue.increment(value),
          postbackStatus: status,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      logger.info("Logging notification...");

      await userRef.collection("notifications").add({
        title: "You just earned a reward!",
        message: `You've earned ${value} for completing a survey!`,
        amount: value,
        status,
        trans_id,
        createdAt: new Date(),
        read: false,
      });

      logger.info("Postback complete");
      res.status(200).send("Postback and notification logged");
    } catch (error: any) {
      logger.error("Postback error:", error);
      res.status(500).send("Error: " + (error?.message || "Unknown"));
    }
  }
);
