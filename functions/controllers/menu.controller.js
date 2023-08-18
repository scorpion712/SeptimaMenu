const admin = require("firebase-admin");

const serviceAccount = require("../firebase.key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const storage = admin.storage();

/**
 *
 * Notes:
 *
 *
 *  Create and deploy your first functions:
        https://firebase.google.com/docs/functions/get-started
 *
 *  Menu type:
        {
            id: string;
            data: {
                name: string;
                products: [
                    {
                        name: string;
                        description: string;
                        price: double | string;
                        imageSrc: string;
                    }
                ];
            }
        }
 *
 *   Firebase collection notes:
          If document doesn"t exists, it will be created.
          If doucument already exists,
          it"s content will be replaced by provided data,
          unless you specify that data should be merged (using {merge: true})
 *
 */

// Get all menues
module.exports.getMenues = async (req, res) => {
  (async () => {
    try {
      const query = db.collection("menu");
      const snapshot = await query.get();
      const menuesList = snapshot.docs.map((doc) => (
        {
          id: doc.id,
          name: doc.data().name,
          products: doc.data().products,
          imageSrc: doc.data().imageSrc,
        }))
          .filter((menu) => menu.products.length > 0);
      res.status(200).send({status: 200, menuesList: menuesList});
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Something went wrong");
    }
  })();
};

// Create new menu and save it image on storage
module.exports.createMenu = async (req, res) => {
  (async () => {
    try {
      const menu = req.body;
      const base64Data = menu.data.base64image;
      // Convert Base64 to binary data
      const imageData = Buffer.from(base64Data, "base64");
      const imageName = menu.id + ".jpg";
      const bucket = storage.bucket("septima-esquina.appspot.com/");
      const imageByteArray = new Uint8Array(imageData);
      const file = bucket.file(`assets/${imageName}`);
      const options = {resumable: false, metadata: {contentType: "image/jpg"}};
      // options may not be necessary
      const imageURL = await file.save(imageByteArray, options)
          .then((stuff) => {
            return file.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
          })
          .then((urls) => {
            const url = urls[0];
            return url;
          })
          .catch((err) => {
            console.log(`Unable to upload image ${err}`);
          });
      menu.data = {
        name: menu.data.name,
        products: menu.data.products,
        imageSrc: imageURL,
      };
      await db.collection("menu").doc(menu.id).create(menu.data);
      res.status(200).send({status: 200, data: menu, error: ""});
    } catch (error) {
      console.log(error.message);
      res.status(500).send({status: 500, error: "Something went wrong"});
    }
  })();
};

// Delete existing menu
module.exports.deleteMenu = async (req, res) => {
  (async () => {
    try {
      const doc = db.collection("menu").doc(req.params.id);
      await doc.delete();

      res.status(200).send({status: 200, error: ""});
    } catch (error) {
      console.log(error.message);
      res.status(500).send({status: 500, error: "Something went wrong"});
    }
  })();
};
