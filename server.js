import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles, isValidURL } from './util/util.js';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
app.get("/filteredimage", async (req, res) => {
  // Get the image_url from the query parameters
  const image_url = req.query.image_url;

  // Check if image_url is provided
  if (!image_url) {
    return res.status(400).send("Image URL is missing in the query parameters.");
  }

  try {
    // Call filterImageFromURL to process the image
    const filteredImagePath = await filterImageFromURL(image_url);

    // Send the resulting image as a response
    res.sendFile(filteredImagePath, (err) => {
      if (err) {
        return res.status(500).send("Error sending the filtered image.");
      }

      // Delete the local temporary file after sending it
      deleteLocalFiles([filteredImagePath]);
    });
  } catch (error) {
    // Handle errors, e.g., if the image URL is invalid or the image processing fails
    // Access and log the precise error message
    console.error("Error Object:", error);
    res.status(500).send("cfx");
  }
});

  //! END @TODO1


  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });

})();
