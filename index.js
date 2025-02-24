const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN; 

app.use(bodyParser.json());

// Root route to test if server is running
app.get("/", (req, res) => {
    res.send("WhatsApp Webhook Server is Running!");
});

// Webhook verification
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
    } else {
        res.status(403).send("Verification failed");
    }
});

// Handle incoming messages
app.post("/webhook", (req, res) => {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
        body.entry.forEach(entry => {
            const changes = entry.changes;
            changes.forEach(change => {
                if (change.value && change.value.messages) {
                    change.value.messages.forEach(message => {
                        console.log("Received message:", message);
                    });
                }
            });
        });

        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
