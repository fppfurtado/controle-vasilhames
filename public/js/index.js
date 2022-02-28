
function criarDocumento(colecao, documento) {

    console.log("[CRIAR DOCUMENTO]");

    if(!!documento.id) {

        firebase.firestore().collection(colecao).doc(documento.id)
            .get()
            .then((documentSnapshot) => {

                if(!documentSnapshot.exist) {
                firebase.firestore().collection(colecao).doc(documento.id).set(documento)
                    .then((docRef) => {
                        console.log("Document written with ID: ", documento.id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });

                } else {
                    alert("Registro já cadastrado: " + documentSnapshot);

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

    console.log("[FORMATAR DATA]");

    let epochTimestamp = data.seconds + "000";
    let dataJS = new Date(eval(epochTimestamp));
    //let dia = formatarZeroAEsquerda(dataJS.getDate());
    let dia = String(dataJS.getDate()).padStart(2, "0");
    //let mes = formatarZeroAEsquerda(dataJS.getMonth()+1);
    let mes = String(dataJS.getMonth()+1).padStart(2, "0");
    let ano = dataJS.getFullYear();

    let dataFormatada = formato == "br" ? dia  + "/" + mes + "/" + ano : ano + "-" + mes + "-" + dia; 

    console.log(dataFormatada);

    return dataFormatada;

}

function carregarDocumentos(colecao, id = null) {

    console.log("[CARREGAR DOCUMENTOS]");

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

function atualizarDocumento(colecao, documento, id) {

    console.log("[ATUALIZAR DOCUMENTO]");

    console.log("atualizando documento: "+ id);
    firebase.firestore().collection(colecao).doc(id).set(documento)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

}

function excluirDocumento(colecao, id) {

    console.log("[EXCLUIR DOCUMENTO]");

    firebase.firestore().collection(colecao).doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
        window.location.assign("lista-romaneios.html");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

function getUrlParameter(sParam) {

    console.log("[GET URL PARAMENTER]");

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