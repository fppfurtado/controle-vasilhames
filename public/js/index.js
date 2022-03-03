const inventario = {
    data: new Date(),
    qtdVasilhamesCheiosDiaAnterior: 0,
    qtdVasilhamesVaziosDiaAnterior: 0,
    qtdVasilhamesQuebradosDiaAnterior: 0,
    qtdVasilhamesCheiosDiaAtual: 0,
    qtdVasilhamesVaziosDiaAtual: 0,
    qtdVasilhamesQuebradosDiaAtual: 0
};

document.addEventListener("DOMContentLoaded", function() {

    console.log("[DOMContentLoaded]");

    // consulta se já existe o inventário do dia
    firebase.firestore().collection("inventarios")
    .where("data", "==", new Date())
    .get()
    .then((querySnapshot) => {
        
        // se não existir...
        if(querySnapshot.empty) {

            // carrega o inventario do dia anterior...
            carregarDocumentos("inventarios")
            .then((querySnapshot) => {

                querySnapshot.query.where("data", "==", getYesterdayDate())
                .get()
                .then((querySnapshot) => {

                    querySnapshot.forEach((doc) => {

                        let invent = doc.data();

                        // copia os quantitativos do dia anterior para o inventario atual

                        inventario.qtdVasilhamesCheiosDiaAnterior = 
                            invent.qtdVasilhamesCheiosDiaAnterior + invent.qtdVasilhamesCheiosDiaAtual;
                        
                        inventario.qtdVasilhamesVaziosDiaAnterior = 
                            invent.qtdVasilhamesVaziosDiaAnterior + invent.qtdVasilhamesVaziosDiaAtual;

                        inventario.qtdVasilhamesQuebradosDiaAnterior = 
                            invent.qtdVasilhamesQuebradosDiaAnterior + invent.qtdVasilhamesQuebradosDiaAnterior;

                    })

                })
            })
            .catch((error) => {
                console.log("Error on getting inventarios: " + error);
            })

            criarDocumento("inventarios", inventario);

        } else {

            querySnapshot.forEach((doc) => {

                let invent = doc.data();

                inventario.data = invent.data;
                inventario.qtdVasilhamesCheiosDiaAnterior = invent.qtdVasilhamesCheiosDiaAnterior;
                inventario.qtdVasilhamesCheiosDiaAtual = invent.qtdVasilhamesCheiosDiaAtual;
                inventario.qtdVasilhamesVaziosDiaAnterior = invent.qtdVasilhamesVaziosDiaAnterior;
                inventario.qtdVasilhamesVaziosDiaAtual = invent.qtdVasilhamesVaziosDiaAtual;
                inventario.qtdVasilhamesQuebradosDiaAnterior = invent.qtdVasilhamesQuebradosDiaAnterior;
                inventario.qtdVasilhamesQuebradosDiaAtual = invent.qtdVasilhamesQuebradosDiaAtual;

            })

            console.log("inventario: " + inventario);

        }

    })
    .catch((error) => {
        console.log("Error on getting inventarios: "+error);
    })

  })

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
    let ano = dataJS.getFullYear();
    let mes = String(dataJS.getMonth()+1).padStart(2, "0");
    let dia = String(dataJS.getDate()).padStart(2, "0");
    let horas = dataJS.getHours();
    let minutos = dataJS.getMinutes();
    //let mes = formatarZeroAEsquerda(dataJS.getMonth()+1);
    
    let dataFormatada = formato == "br" ? 
    dia  + "/" + mes + "/" + ano : 
    ano + "-" + mes + "-" + dia + "T" + horas + ":" + minutos; 

    return dataFormatada;

}

function getYesterdayDate() {
    return new Date(new Date().getTime() - 24*60*60*1000);
}

function carregarDocumentos(colecao, id = null) {

    console.log("[CARREGAR DOCUMENTOS]");

    return new Promise((resolve, reject) => {

        let colecaoRef = firebase.firestore().collection(colecao);

        if(!!id) {

            colecaoRef.doc(id).get()
            .then((documentSnapshot) => {
                //console.log(documentSnapshot);
                resolve(documentSnapshot);
            })
            .catch((error) => {
                reject(error);
            })

        } else{

            colecaoRef.get()
            .then((querySnapshot) => {
                //console.log(querySnapshot);
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