// In Next.js dynamic routes are handled/ identified by brackets [] in the file name. Since we are dynamically querying a movie id we have [id].tsx
// This allows us to capture the id dynamically from the url ie; /api/movies/573a1394f29313caabcdfa3e
// Note: The _id property for the sample_mflix database in MongoDB is stored as an ObjectID, so you'll have to convert the query string to an ObjectID. 

import clientPromise from "../../lib/mongodb"
import { ObjectId } from "mongodb"; // Import objectID for ID conversion
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("sample_mflix");

        // extract the id from the query parameters sent in the url
        const { id } = req.query;

        // Combining the type check (to eunser id is not undefined or an array) with ObjectId.isValid ensures that only a valid string id proceeds to new ObjectId(id)
        if (typeof id !== "string" || !ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid movie ID format" });
            return;
        }
        // The 'id' string is convereted to a new ObjectId instance using new ObjectId(id)
        const objectId = new ObjectId(id);
        // query the database for a single movie by _id
        const movie = await db.collection("movies").findOne({ _id: objectId });
        // error handling if no movie found
        if (!movie) {
            res.status(404).json({ error: "Movie not found" });
            return;
        }
        // Otherwise respond with movie
        res.status(200).json(movie);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
    }
};
