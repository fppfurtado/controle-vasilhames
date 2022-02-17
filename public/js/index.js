// document.addEventListener('DOMContentLoaded', function() {
//     var docRef = firebase.firestore().collection("teste").doc("cZ494FOwMgDBuwNRFHeg");

//     docRef.get().then((doc) => {
//         if (doc.exists) {
//             console.log("Document data:", doc.data());
//         } else {
//             // doc.data() will be undefined in this case
//             console.log("No such document!");
//         }
//     }).catch((error) => {
//         console.log("Error getting document:", error);
//     });

//   });

//const db = firebase.firestore();

function salvarDocumento(colecao, documento, id) {

    // firebase.firestore().collection(colecao).doc(id).set(documento)
    // .then((docRef) => {
    //     console.log("Document written with ID: ", id);
    // })
    // .catch((error) => {
    //     console.error("Error adding document: ", error);
    // });
    
    firebase.firestore().collection(colecao).doc(id)
    .get()
    .then((documentSnapshot) => {
        console.log(documentSnapshot);
        if(!documentSnapshot.exists) {
            firebase.firestore().collection(colecao).doc(id).set(documento)
            .then((docRef) => {
                console.log("Document written with ID: ", id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });  
        }
        else {
            alert("Registro já cadastrado");
        }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    
}

function verificarDuplicidadeRomaneio(documento, id) {
    
    firebase.firestore().collection("romaneios").doc(id)
    .get()
    .then((documentSnapshot) => {
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log(doc.id, " => ", doc.data());
        // });
        console.log(documentSnapshot);
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


}