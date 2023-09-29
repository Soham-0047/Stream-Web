import express from "express";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Overlay from "./models/overlay.js";

// mongoose.set('strictQuery', false)

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function connectodb() {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected");
  } catch (error) {
    console.log(error);
  }
}

connectodb();

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/api/overlays", async (req, res) => {
  try {
    const overlay = new Overlay(req.body);

    const savedOverlay = await overlay.save();

    res.status(201).json(savedOverlay);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.get("/api/overlays", async (req, res) => {
  try {
    const overlays = await Overlay.find({});
    res.status(200).json(overlays);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});



// Update an overlay by its ID
app.put('/api/overlays/:id', async (req, res) => {
  const overlayId = req.params.id;
  const updatedOverlay = req.body;

  try {
    const updated = await Overlay.findByIdAndUpdate(overlayId, updatedOverlay, {
      new: true,
    });

    if (!updated) {
      res.status(404).json({ error: 'Overlay not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Delete an overlay by its ID
app.delete('/api/overlays/:id', async (req, res) => {
  const overlayId = req.params.id;

  try {
    const deleted = await Overlay.findByIdAndDelete(overlayId);

    if (!deleted) {
      res.status(404).json({ error: 'Overlay not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening http://localhost:${PORT}`);
});

// async function startserver(){

//     const app = express();
//     const server = new ApolloServer({
//         typeDefs:  `
//         type Auth{
//             id: ID!
//             name: String!
//             email: String !
//         }

//         type Query{
//             getAuth: [Auth]
//         }
//         `,
//         resolvers: {}
//     })

//     app.use(bodyParser.json())

//     app.use(cors())

//     await server.start()

//     app.use("/graphql",expressMiddleware(server))

//     app.listen(8000, () => console.log
//     (`Server start PORT:8000`))
// }
// startserver()
