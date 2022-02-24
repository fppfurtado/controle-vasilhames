
function criarDocumento(colecao, documento, id = null) {

    if(!!id) {

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

    } else {

        firebase.firestore().collection(colecao).add(documento)
        .then((docRef) => {
            console.log("documento registrado: "+docRef.id);
        })
        .catch((error) => {
            console.log("erro no registro do documento: "+error);
        })

    }
    
}

function formatarData(data, formato = "br") {

    let epochTimestamp = data.seconds + "000";
    let dataJS = new Date(eval(epochTimestamp));
    //let dia = formatarZeroAEsquerda(dataJS.getDate());
    let dia = String(dataJS.getDate()).padStart(2, "0");
    //let mes = formatarZeroAEsquerda(dataJS.getMonth()+1);
    let mes = String(dataJS.getMonth()+1).padStart(2, "0");
    let ano = dataJS.getFullYear();

    return formato == "br" ? dia  + "/" + mes + "/" + ano : ano + "-" + mes + "-" + dia;    

}

function carregarDocumentos(colecao, id = null) {

    return new Promise((resolve, reject) => {

        let colecaoRef = firebase.firestore().collection(colecao);

        if(!!id) {

            colecaoRef.doc(id).get()
            .then((documentSnapshot) => {
                console.log(documentSnapshot);
                resolve(documentSnapshot);
            })
            .catch((error) => {
                reject(error);
            })

        } else{

            colecaoRef.get()
            .then((querySnapshot) => {
                console.log(querySnapshot);
                resolve(querySnapshot);
            })
            .catch((error) => {
                reject(error);
            })

        }

    });

}

function atualizarDocumento(colecao, documento) {

    console.log("atualizando documento...");
    firebase.firestore().collection(colecao).doc(documento.id).set(documento)
            .then((docRef) => {
                console.log("Document written with ID: ", id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

}

function excluirDocumento(colecao, id) {
    firebase.firestore().collection(colecao).doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
        window.location.assign("lista-romaneios.html");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};