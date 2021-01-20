const {firebase, firestore} = require ('./firebaseConfig');

// const firestore = firebase.firestore();

const uploadImageIntoStore = async (image) => {
    const file = image.buffer;
    const storageRef = firebase.storage().ref();
    const fileName = Date() + '_' + file.name;
    let downloadURL = null;

    var uploadTask = storageRef.child(`book_image/${fileName}`).put(file);

    const status = {
      imageUrl: null,
      error: null,
      progress: 0,
      status: 0
    }

    // const bookRef = firestore.collection('books');
    // const snapShot = await bookRef.get();

    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      status.progress = progress;
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
        default: break;
      }
    }, function(error) {
        status.error = error;
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downURL) {
        console.log('File available at', downURL);
        console.log(book)
        downloadURL = downURL;
        
        
        // if (!book) return;
        // if (!snapShot.exists) {
        //   try {
        //      bookRef.add({
        //       title,
        //       author,
        //       imageurl: downloadURL,
        //       language, 
        //       rating
        //     });
            
        //   } catch (error) {
        //     console.log('error creating book', error.message);
        //   }
        // }
      });
    });
    return downloadURL;
  };

module.exports = {
    uploadImageIntoStore: uploadImageIntoStore
}