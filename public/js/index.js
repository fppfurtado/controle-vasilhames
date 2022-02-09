document.addEventListener('DOMContentLoaded', function() {
    var docRef = firebase.firestore().collection("teste").doc("cZ494FOwMgDBuwNRFHeg");

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  });

  function teste() {
      console.log("gravando...");
  }